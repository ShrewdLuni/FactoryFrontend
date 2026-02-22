import { useNavigate, useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useState } from "react";
import { Button } from "../ui/button";
import { useBatches } from "@/hooks/useBatch";
import { useAuth } from "@/AuthProvider";
import { BASE_URL } from "@/config";
import { useQR } from "@/hooks/useQR";

export const QRCodePreviewPage = () => {

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate()
  const [activeBatchId, setActiveBatch] = useState<string | undefined>(undefined);

  if (id == undefined || isNaN(parseInt(id)) || !user) {
    return <div>Something went wrong</div>
  }

  const { data: batches, isLoading: isBatchLoading } = useBatches.getAll()
  const { data: qrcode, isLoading  } = useQR.get(parseInt(id))
  const { mutate: scan } = useBatches.scan();
  const { mutate: activateQRCode } = useQR.activate()

  if (isLoading || isBatchLoading) {
    return <div>Loading</div>
  }

  const filteredBatches = user.role === "Master" ? batches : batches!.filter(batch => 
    Object.values(batch.masters).some(masterId => masterId === user?.id)
  );

  const savedWorkstationId = localStorage.getItem('workstationId');

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (!activeBatchId) return;
    scan(Number(activeBatchId));
    activateQRCode({id: Number(id), resource: `${BASE_URL}/batch/${activeBatchId}`})
    localStorage.removeItem("workstationId");                                           
    navigate("/");
  }


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{`Привязывание QR-Кода к партии`}</CardTitle>
            </CardHeader>
            <CardContent>
              {!savedWorkstationId 
                ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg"><strong>Рабочая станция не найдена</strong></p>
                    <p className="mt-4 text-lg"><strong>Пожалуйста отсканируете свое рабочее место что бы продолжить</strong></p>
                  </div>
                ) 
                : (qrcode && (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg"><strong>QR-Код:</strong></p>
                    <div className="border p-4 rounded-md shadow-sm space-y-2">
                      <p><strong>ID:</strong> {qrcode.id}</p>
                      <p><strong>Название:</strong> {qrcode.name}</p>
                    </div>
                    <p className="mt-4 text-md"><strong>Пожалуйста выберите партию что бы продолжить</strong></p>
                    <Select value={activeBatchId} onValueChange={setActiveBatch}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите партию" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBatches && filteredBatches.map((batch) => {
                          return <SelectItem key={batch.id} value={String(batch.id)}>{batch.name}</SelectItem>
                        })}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleClick}>Подтвердить</Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

