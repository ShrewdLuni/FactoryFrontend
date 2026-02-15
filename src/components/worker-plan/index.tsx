import { useAuth } from "@/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useBatches } from "@/hooks/useBatch";

export const WorkerPlanPage = () => {

  const { data: batches, isLoading } = useBatches.getAll()
  const { user, loading } = useAuth()

  if (isLoading || loading) {
    return <div>Loading</div>
  }

  const filteredBatches = batches!.filter(batch => 
    Object.values(batch.masters).some(masterId => masterId === user?.id)
  );

  console.log(filteredBatches)

  return (
    <div className="flex max-h-[90vh] h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col w-full max-w-sm h-full">
        <div className="text-xl font-bold py-4">{`План для ${user?.fullName}`}</div>
        <ScrollArea className="h-[90%]">
          {batches?.map((batch) => {
            return (
              <Card className="h-full max-h-[90vh] my-4">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{batch.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <div>ID: {batch.id}</div>
                    <div>Продукт: {batch.productId}</div>
                    <div>Кол-во: {batch.size}</div>
                    <div>Машина: {batch.workstationId}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </ScrollArea>
      </div>
    </div>
  )
}
