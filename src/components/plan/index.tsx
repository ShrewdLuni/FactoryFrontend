import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { DataTable } from "../data-table";
import { getStageColumns, type updateFunction } from "./columns";
import type { UserDepartment } from "@/types/users";
import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useBatches } from "@/hooks/useBatch";
import type { Batch } from "@/types/batches";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";
import { useWorkstations } from "@/hooks/useWorkstations";

export const PlanPage = () => {

  const { data: rawPlannedBatches } = useBatches.getAll()
  const { data: products } = useProducts.getAll();
  const { data: users } = useUsers.getAll();
  const { data: workstations } = useWorkstations.getAll()

  const { mutate: initialize } = useBatches.initialize()
  const { mutate: execute } = useBatches.execute()
  const { mutate: updatePlannedBatches } = useBatches.update()

  const activeProducts = products?.filter(product => product.isActive);
  const plannedBatches = rawPlannedBatches?.filter(batch => batch.isPlanned)

  const handleCellUpdate: updateFunction = (field: keyof Batch | keyof Batch["masters"], value: any, row: Row<Batch>) => {
    console.log(field, value, row)
    if (field in row.original.masters) {
      updatePlannedBatches({
        id: row.original.id,
        data: {
          ...row.original,
          masters: {
            ...row.original.masters,
            [field]: value,
          },
        },
      })
      return
    }

    updatePlannedBatches({
      id: row.original.id,
      data: {
        ...row.original,
        [field]: value,
      },
    })
  }  

  const tabs: UserDepartment[] = ["Knitting", "Sewing", "Molding", "Labeling", "Packaging"]

  return (
    <div className="py-4">
      <Tabs defaultValue="Knitting">
        <TabsList>
          {tabs.map((tab) => <TabsTrigger key={`${tab}-trigger`} value={tab}>{tab}</TabsTrigger>)}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent value={tab} key={tab}>
            <DataTable columns={getStageColumns(tab, handleCellUpdate, activeProducts ?? [], users ?? [], workstations ?? [])} data={plannedBatches || []} searchValues="id" toolbarExtras={
              <div className="w-full flex justify-end">{
                (plannedBatches && plannedBatches.length > 0)
                ?<Button variant="outline" onClick={() => {console.log("execute batch");execute()}}>Execute plan</Button>
                :<Button variant="outline" onClick={() => {console.log("init batch");initialize()}}>Create plan</Button>
              }</div>
            }/>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
