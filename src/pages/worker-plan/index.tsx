import { useAuth } from "@/AuthProvider"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBatches } from "@/hooks/useBatch";
import type { Batch } from "@/types/batches";

const BatchCard = ({ batch }: { batch: Batch }) => {
  return (
    <Card key={batch.id} className="h-full max-h-[90vh] my-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{batch.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div>ID: {batch.id}</div>
          <div>Продукт: {batch.product.name}</div>
          <div>Кол-во: {batch.size}</div>
          <div>Машина: {batch.workstation.name}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkerPlanPage = () => {
  const { data: batches, isLoading } = useBatches.getAll();
  const { user, loading } = useAuth();

  if (isLoading || loading) {
    return <div>Loading</div>;
  }

  const filteredBatches = (
    user?.role?.label === "Worker"
      ? batches!.filter(batch =>
        batch.workers?.some(w => w.worker.id === user?.id)
      )
      : batches ?? []
  ).filter(batch => batch.status.label !== "Completed");

  return (
    <div className="flex max-h-[90vh] h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col w-full max-w-sm h-full">
        <div className="text-xl font-bold py-4">{`План для ${user?.fullName}`}</div>
        <ScrollArea className="h-[90%]">
          {filteredBatches.map(batch => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};
