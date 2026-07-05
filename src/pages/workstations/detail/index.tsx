import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useGetWorkstation } from "@/api/generated/workstation/workstation";
import { toast } from "sonner";

export const WorkstationPreviewPage = () => {

  const { id } = useParams();
  const { data: workstation, isLoading  } = useGetWorkstation(id ?? "0")

  useEffect(() => {
    if (workstation) {
      localStorage.setItem('workstationId', workstation.id.toString());
      localStorage.setItem('workstationName', workstation.name);
      console.log('Saved workstation:', workstation);
    }
  }, [workstation]);

  if (id === undefined || isNaN(parseInt(id))) {
    toast.error("Щось пішло не так", { position: "top-right" });
    return <div>Щось пішло не так</div>
  }

  return (
   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{`Сканування робочого місця`}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Дані машини завантажуються</p>}
                {workstation && (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg"><strong>Ви успішно відсканували своє робоче місце:</strong></p>
                    <div className="border p-4 rounded-md shadow-sm space-y-2">
                      <p><strong>ID:</strong> {workstation.id}</p>
                      <p><strong>Назва:</strong> {workstation.name}</p>
                    </div>
                    <p className="mt-4 text-lg"><strong>Будь ласка, відскануйте порожній QR-код, щоб продовжити.</strong></p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
