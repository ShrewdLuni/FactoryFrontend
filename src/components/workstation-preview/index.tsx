import { useWorkstations } from "@/hooks/useWorkstations";
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useEffect } from "react";

export const WorkstationPreviewPage = () => {

  const { id } = useParams();

  if (id == undefined || isNaN(parseInt(id))) {
    return <div>Something went wrong</div>
  }

  const { data: workstation, isLoading  } = useWorkstations.get(parseInt(id))


  useEffect(() => {
    if (workstation) {
      localStorage.setItem('workstationId', workstation.id.toString());
      localStorage.setItem('workstationName', workstation.name);
      console.log('Saved workstation:', workstation);
    }
  }, [workstation]);

  return (
   <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{`Сканирование рабочего места`}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Loading workstation...</p>}
                {workstation && (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg"><strong>Вы успешно отсканировали свое рабочее место:</strong></p>
                    <div className="border p-4 rounded-md shadow-sm space-y-2">
                      <p><strong>ID:</strong> {workstation.id}</p>
                      <p><strong>Название:</strong> {workstation.name}</p>
                    </div>
                    <p className="mt-4 text-lg"><strong>Пожалуйста отсканируйте пyстой QR-Код что бы продолжить</strong></p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
