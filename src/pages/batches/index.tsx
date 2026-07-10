import { getBatchColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { getGetAllBatchesWithAllQueryKey, useCreateBatch, useCreateBatches, useDeleteBatch, useDeleteBatches, useGetAllBatchesWithAll, usePatchBatch, usePatchBatches } from "@/api/generated/batch/batch";
import { useGetAllProducts } from "@/api/generated/product/product";
import { useGetAllWorkstations } from "@/api/generated/workstation/workstation";
import { useBatchStatusFilters } from "@/hooks/useBatchStatusOptions";
import { useGetAllDepartments } from "@/api/generated/department/department";
import { useQueryClient } from "@tanstack/react-query";
import type { Table } from "@tanstack/react-table"
import type { Batch, BatchBulkPatch, BatchPatch } from "@/api/generated/models";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog";
import { LayoutTemplate } from "lucide-react";
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog";
import { useGetAllUsers } from "@/api/generated/user/user";
import type { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/data-table/date-picker-range";

export const BatchPage = () => {

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showArchive, setShowArchive] = useState(false);

  const [editOpen, setEditOpen] = useState<boolean>(false);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<BatchPatch | null>();

  const [showAllTransitions, setShowAllTransitions] = useState(false);

  const { data: batches = [] } = useGetAllBatchesWithAll()
  console.log(batches)

  const { data: products = [] } = useGetAllProducts();
  // const { data: users = [] } = useGetAllUsers();
  const { data: workstations = [] } = useGetAllWorkstations();
  const { data: users = [] } = useGetAllUsers()

  const { options } = useBatchStatusFilters()
  const { data: departments = [] } = useGetAllDepartments()

  const queryClient = useQueryClient();
  const queryKey = getGetAllBatchesWithAllQueryKey();

  const optimistic = createOptimisticCrudHandlers<Batch, BatchPatch, Batch, BatchBulkPatch>(queryClient, queryKey, "Batch");
  const invalidated = createInvalidateCrudHandlers(queryClient, queryKey, "Batch");

  const { mutate: patchBatch, isPending: isPatchBatchPending } = usePatchBatch({ mutation: optimistic.patch });  
  const { mutate: patchBatches, isPending: isPatchBatchesPending } = usePatchBatches({ mutation: optimistic.patchMany });
  const { mutate: deleteBatch } = useDeleteBatch({ mutation: invalidated.delete });
  const { mutate: deleteBatches, isPending: isDeletBatchesPending } = useDeleteBatches({ mutation: invalidated.deleteMany });
  const { mutateAsync: createBatch, isPending: isCreateBatchPending } = useCreateBatch({ mutation: invalidated.create });
  const { mutateAsync: createBatches, isPending: isCreateBatchesPending } = useCreateBatches({ mutation: invalidated.createMany });
  console.log(editOpen, isPatchBatchPending)

  const presentProductIds = new Set(batches.map((b) => b.product.id));

  const productOptions = products
  .filter((p) => presentProductIds.has(p.id))
  .map((p) => ({ label: p.name, value: String(p.id) }));

  const actorOptions = users
  .filter((u) => u.fullName != null)
  .map((u) => ({ label: u.fullName as string, value: String(u.id) }));

  const filters = [
    { column: "status", title: "Статус", options: options },
    { column: "product", title: "Продукт", options: productOptions },
    { column: "actor", title: "Виконавці", options: actorOptions },
  ];

  const handleRowClick = () => {
    createBatch({ data: {} })
  };

  const handleAdd36 = async () => {
    const workstationIds = Array.from({ length: 36 }, (_, index) => index + 1);
    createBatches({ data: workstationIds.map((id) => ({ workstation: { id }}))})
  };

  const handlePatch = (id: number, data: BatchPatch) => {
    if (selectedIds.length < 2) {
      patchBatch({ id: String(id), data})
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setEditData(data);
    }
  }

  const handlePatchMany = () => {
    if (editData == null) return;
    patchBatches(
      { data: { ids: selectedIds.map(Number), data: editData } },
      {
        onSuccess: () => {
          setIsEditRequested(false);
          setEditData(null);
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteBatch({ id: String(id) },
      {
        onSuccess: () => {
          setSelectedIds([]);
          setSelectedIds((prev) => prev.filter((sid) => sid !== String(id)));
        },
      },
    );
  }

  const handleDeleteMany = () => {
    const idsToDelete = selectedIds;
    deleteBatches(
      { data: { ids: idsToDelete.map(Number) } },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => !idsToDelete.includes(sid)));
        },
      },
    );
  }

  const tableRef = useRef<Table<Batch>>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    tableRef.current?.getColumn("date")?.setFilterValue(dateRange?.from ? dateRange : undefined);
  }, [dateRange]);

  const columns = getBatchColumns(
    products, 
    // users, 
    workstations, 
    departments, 
    // statuses, 
    handlePatch, 
    handleDelete,
    showAllTransitions
  )

  const resultBatches = !showArchive ? batches.filter((b) => !b.status.isTerminal) : batches.filter((b) => b.status.isTerminal);

  const toolbarExtras = (
    <div className="flex justify-between w-full max-h-8 min-h-8">
      <div className="flex flex-row gap-2 max-h-8 min-h-8">
        <div className="flex flex-row gap-2 max-h-8 min-h-8">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange}/> 
          <Button
            className="h-8"
            variant="outline"
            onClick={() => setShowAllTransitions((v) => !v)}
          >
            {showAllTransitions ? "Тільки етапи" : "Всі переходи"}
          </Button>
        </div>
        <div className="w-full flex gap-2">      
          {selectedIds.length <= 1 && (
            <Button className="h-8" variant="outline" onClick={() => setShowArchive(!showArchive)}>
              {!showArchive ? "Показати архів" : "Приховати архів"}
            </Button>)}
          {selectedIds.length > 1 && (
            <div className="flex align-bottom h-8 gap-2">
              <Button className="h-8" variant="outline" onClick={() => setShowArchive(!showArchive)}>
                <LayoutTemplate/>
                {"Створити шаблон"}
              </Button>            
              <ConfirmDeleteManyDialog isPending={isDeletBatchesPending} selectedIds={selectedIds} handleDeleteMany={handleDeleteMany} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Button className="h-8" variant="outline" onClick={() => handleRowClick()} disabled={isCreateBatchPending}>
          {isCreateBatchPending ? "Додавання..." : "Додати рядок"}
        </Button>
        <Button className="h-8" variant="outline" onClick={() => handleAdd36()} disabled={isCreateBatchesPending}>
          {isCreateBatchesPending ? "Додавання..." : "Додати 36"}
        </Button>
      </div>
    </div>
  )

  return (
    <div>    
      <DataTable
        columns={columns}
        data={resultBatches}
        toolbarExtras={toolbarExtras}
        filters={filters}
        searchValues={"search"}
        onRowSelectionChange={setSelectedIds}
        initialState={{columnVisibility: {search : true, actor: true, date: true}}}
        tableRef={tableRef}
      />
      <ConfirmEditManyDialog isPending={isPatchBatchesPending} open={isEditRequested} onOpenChange={setIsEditRequested} selectedIds={selectedIds} handlePatchMany={handlePatchMany}/>
    </div>
  );
};
