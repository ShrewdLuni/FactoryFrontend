import { getBatchColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import type { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useCreateBatch, useCreateBatches, useGetAllBatches, usePatchBatch, useUpdateBatch } from "@/api/generated/batch/batch";
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
  const { mutate: patchBatch } = usePatchBatch();
  const { mutateAsync: createBatch, isPending: isCreateBatchPending } = useCreateBatch();
  const { mutateAsync: createBatches, isPending: isCreateBatchesPending } = useCreateBatches();
  const { data: statuses = [], options } = useBatchStatusFilters()
  const { data: departments } = useGetAllDepartments()

  const filters = [{ column: "status", title: "Статус", options: options }];

  const handleRowClick = () => {
    createBatch({data: {}})
  };

  const handleAdd36 = async () => {
    const workstationIds = Array.from({ length: 36 }, (_, index) => index + 1);
    createBatches({ data: workstationIds.map((id) => ({ workstation: { id }}))})
  };

  // const columns = getBatchColumns("", products ?? [], users ?? [], workstations ?? [], departments ?? [], statuses, patchBatch);
  const columns = useMemo(
    () => getBatchColumns("", products ?? [], users ?? [], workstations ?? [], departments ?? [], statuses, patchBatch),
    [products, users, workstations, departments, statuses, patchBatch]
  );

  const [showArchive, setShowArchive] = useState(false);

  const resultBatches = !showArchive ? batches.filter((b) => !b.status.isTerminal) : batches.filter((b) => b.status.isTerminal);

  return (
    <DataTable
      columns={columns}
      data={resultBatches ?? []}
      isAddSection={false}
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
      initialState={{
        columnVisibility: { plannedFor: false, updatedAt: false },
      }}
    />
  );
};
