import { getBatchColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateBatch, useGetAllBatches, useUpdateBatch } from "@/api/generated/batch/batch";
import { useGetAllProducts } from "@/api/generated/product/product";
import { useGetAllUsers } from "@/api/generated/user/user";
import { useGetAllWorkstations } from "@/api/generated/workstation/workstation";
import { useBatchStatusFilters } from "@/hooks/useBatchStatusOptions";
import { useGetAllDepartments } from "@/api/generated/department/department";

export const BatchPage = () => {
  const { data: batches = [] } = useGetAllBatches();
  const { data: products } = useGetAllProducts();
  const { data: users } = useGetAllUsers();
  const { data: workstations } = useGetAllWorkstations();
  const { mutate: updateBatch } = useUpdateBatch();
  const { mutateAsync: createBatch } = useCreateBatch();
  const { data: statuses = [], options } = useBatchStatusFilters()
  const { data: departments } = useGetAllDepartments()
  console.log(batches)

  const filters = [{ column: "status", title: "Статус", options: options }];

  // type UpdateFunction = (field: keyof InsertBatch, value: any, row: Row<Batch>) => void;
  //
  // const handleCellUpdate: UpdateFunction = (field, value, row) => {
  //   const current = toInsertBatch(row.original);
  //
  //   if (field === "workers") {
  //     const { departmentId, workerId } = value as { departmentId: number; workerId: number };
  //     const existing = current.workers ?? [];
  //     const updated = existing.some((w) => w.department.id === departmentId)
  //       ? existing.map((w) => (w.department.id === departmentId ? { ...w, worker: { id: workerId } } : w))
  //       : [...existing, { department: { id: departmentId }, worker: { id: workerId } }];
  //
  //     updateBatch({ id: row.original.id, data: { ...current, workers: updated } });
  //     return;
  //   }
  //
  //   updateBatch({ id: row.original.id, data: { ...current, [field]: value } });
  // };
  //
  // const handleRowClick = () => {
  //   createBatch({
  //     name: null,
  //     size: 200,
  //     actualSize: 200,
  //     productId: undefined,
  //     workstationId: undefined,
  //     statusId: null,
  //     plannedFor: new Date(),
  //     workers: [],
  //     isActive: true,
  //   });
  // };
  //
  // const [isAdding, setIsAdding] = useState(false);
  //
  // const handleAdd36 = async () => {
  //   setIsAdding(true);
  //   for (let i = 0; i < 36; i++) {
  //     await createBatch({
  //       name: null,
  //       size: 200,
  //       actualSize: 200,
  //       productId: undefined,
  //       workstationId: i + 1,
  //       statusId: null,
  //       plannedFor: new Date(),
  //       workers: [],
  //       isActive: true,
  //     });
  //   }
  //   setIsAdding(false);
  // };
  //
  const columns = getBatchColumns("", products ?? [], users ?? [], workstations ?? [], departments ?? [], statuses);

  const [showArchive, setShowArchive] = useState(false);

  const resultBatches = !showArchive ? batches.filter((b) => b.status.isTerminal) : batches.filter((b) => !b.status.isTerminal);

  return (
    <DataTable
      columns={columns}
      data={resultBatches ?? []}
      isAddSection={false}
      toolbarExtras={
        <div className="flex justify-between w-full">
          <Button className="h-8" variant="outline" onClick={() => setShowArchive(!showArchive)}>
            {!showArchive ? "Показать архив" : "Скрыть архив"}
          </Button>
          <div className="flex flex-row gap-2">
            <Button className="h-8" variant="outline" onClick={() => console.log("handleRowClick")}>
              Add row
            </Button>
            <Button className="h-8" variant="outline" onClick={() => console.log("handleAdd36")}>
              {/* {false ? "Adding..." : "Add 36"} */}
              Add 36
            </Button>
          </div>
        </div>
      }
      filters={filters}
      searchValues={"name"}
      initialState={{
        columnVisibility: { plannedFor: false, updatedAt: false },
      }}
    />
  );
};
