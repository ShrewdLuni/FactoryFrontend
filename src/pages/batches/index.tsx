import { getBatchColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getGetAllBatchesQueryKey, useCreateBatch, useCreateBatches, useDeleteBatch, useGetAllBatchesWithAll, usePatchBatch, usePatchBatches } from "@/api/generated/batch/batch";
import { useGetAllProducts } from "@/api/generated/product/product";
import { useGetAllUsers } from "@/api/generated/user/user";
import { useGetAllWorkstations } from "@/api/generated/workstation/workstation";
import { useBatchStatusFilters } from "@/hooks/useBatchStatusOptions";
import { useGetAllDepartments } from "@/api/generated/department/department";
import { useQueryClient } from "@tanstack/react-query";
import type { Batch, BatchBulkPatch, BatchPatch } from "@/api/generated/models";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";

export const BatchPage = () => {

  const [showArchive, setShowArchive] = useState(false);

  const { data: batches = [] } = useGetAllBatchesWithAll()

  const { data: products = [] } = useGetAllProducts();
  const { data: users = [] } = useGetAllUsers();
  const { data: workstations = [] } = useGetAllWorkstations();

  const { data: statuses = [], options } = useBatchStatusFilters()
  const { data: departments = [] } = useGetAllDepartments()

  const queryClient = useQueryClient();
  const queryKey = getGetAllBatchesQueryKey();

  const optimistic = createOptimisticCrudHandlers<Batch, BatchPatch, Batch, BatchBulkPatch>(queryClient, queryKey, "Batch");
  const invalidated = createInvalidateCrudHandlers<Batch>(queryClient, queryKey, "Batch");

  const { mutate: patchBatch, isPending: isPatchBatchPending } = usePatchBatch({ mutation: optimistic.patch });  
  const { mutate: patchBatches, isPending: isPatchBatchesPending } = usePatchBatches({ mutation: optimistic.patchMany });
  const { mutate: deleteBatch } = useDeleteBatch({ mutation: invalidated.delete });
  const { mutate: deleteBatches, isPending: isDeletBatchesPending } = useDeleteBatch({ mutation: invalidated.deleteMany });
  const { mutateAsync: createBatch, isPending: isCreateBatchPending } = useCreateBatch({ mutation: invalidated.create });
  const { mutateAsync: createBatches, isPending: isCreateBatchesPending } = useCreateBatches({ mutation: invalidated.createMany });

  const filters = [{ column: "status", title: "Статус", options: options }];

  const handleRowClick = () => {
    createBatch({data: {}})
  };

  const handleAdd36 = async () => {
    const workstationIds = Array.from({ length: 36 }, (_, index) => index + 1);
    createBatches({ data: workstationIds.map((id) => ({ workstation: { id }}))})
  };

  const handlePatch = (id: number, data: BatchPatch) => {
    patchBatch({ id: String(id), data})
  }

  const columns = getBatchColumns(products, users, workstations, departments, statuses, handlePatch)

  const resultBatches = !showArchive ? batches.filter((b) => !b.status.isTerminal) : batches.filter((b) => b.status.isTerminal);

  return (
    <DataTable
      columns={columns}
      data={resultBatches}
      toolbarExtras={
        <div className="flex justify-between w-full">
          <Button className="h-8" variant="outline" onClick={() => setShowArchive(!showArchive)}>
            {!showArchive ? "Показати архів" : "Приховати архів"}
          </Button>
          <div className="flex flex-row gap-2">
            <Button className="h-8" variant="outline" onClick={() => handleRowClick()} disabled={isCreateBatchPending}>
              {isCreateBatchPending ? "Додавання..." : "Додати рядок"}
            </Button>
            <Button className="h-8" variant="outline" onClick={() => handleAdd36()} disabled={isCreateBatchesPending}>
              {isCreateBatchesPending ? "Додавання..." : "Додати 36"}
            </Button>
          </div>
        </div>
      }
      filters={filters}
      searchValues={"name"}
    />
  );
};
