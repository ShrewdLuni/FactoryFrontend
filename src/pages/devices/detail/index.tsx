import { useGetDevice } from "@/api/generated/device/device";
import { useEndShift, useGetCurrentShift, useStartShift } from "@/api/generated/shift/shift";
import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const DeviceDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth()
  const { data: device, isLoading } = useGetDevice(id ?? "0")
  const { data: shift } = useGetCurrentShift(user?.id ?? 0);
  const { mutateAsync : startShift } = useStartShift()
  const { mutateAsync : endShift } = useEndShift()

  const handleCancel = () => {
    navigate("/");
    toast.info("Скасовано", { position: "top-right"});
  }

  const handleStart = async () => {
    if (!user) return 
    if (!device) return
    try {
      await startShift({ data: { worker: { id: user.id }, device: { id: device.id }} })
      navigate("/")
      toast.success("Ви почали зміну", { position: "top-right"});
    } catch {
      toast.error("Не вдалося почати зміну", { position: "top-right" });
    }
  }

  const handleEnd = async () => {
    if (!user) return 
    if (!device) return
    try {
      await endShift({ data: { worker: { id: user.id }} })
      navigate("/")
      toast.success("Ви закінчили зміну", { position: "top-right"});
    } catch {
      toast.error("Не вдалося закінчити зміну", { position: "top-right" });
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{`Сканування пристрою`}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Дані пристрою завантажуються</p>}
              {device && (
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-medium">Ви успішно відсканували пристрій:</p>
                  <div className="border p-4 rounded-md shadow-sm space-y-2">
                    <p className="font-medium">ID: {device.id}</p>
                    <p className="font-medium">Название: {device.name}</p>
                  </div>
                  <div className="flex flex-row gap-2 justify-center">
                    <Button variant={"destructive"} className="w-[50%]" onClick={handleCancel}>Скасувати</Button>
                    {!shift 
                      ? 
                      (<Button className="w-[50%]" onClick={handleStart}>Розпочати зміну</Button>)
                      :
                      (<Button className="w-[50%]" onClick={handleEnd}>Закінчити зміну</Button>)
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
