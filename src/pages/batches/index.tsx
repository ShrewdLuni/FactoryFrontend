import { getBatchColumns } from "./columns";
import { DataTable } from "../../components/data-table";
// import { BatchForm } from "../forms/batch";
import { CircleX, CircleCheck, Spool, Scissors, Layers, Tag, ArchiveIcon, Cone } from "lucide-react";
import { useBatches, useCreateBatch, useUpdateBatch } from "@/hooks/useBatch";
import { useGetAllProducts } from "@/hooks/useProducts";
import { useGetAllUsers } from "@/hooks/useUsers";
import type { Batch, InsertBatch } from "@/types/batches";
import type { Row } from "@tanstack/react-table";
import { useGetAllWorkstations } from "@/hooks/useWorkstations";
import { Button } from "../../components/ui/button";
import type { Department } from "@/types/departments";

export const BatchPage = () => {
  const { data: batches } = useBatches.getAll();
  const { data: products } = useGetAllProducts()
  const { data: users } = useGetAllUsers()
  const { data: workstations } = useGetAllWorkstations()
  const { mutate: updateBatch } = useUpdateBatch();
  const { mutate: createBatch } = useCreateBatch();

  const status = [
    {
      label: "Inactive",
      value: "Inactive",
      icon: CircleX,
    },
    {
      label: "Knitting Workshop",
      value: "Knitting Workshop",
      icon: Scissors,
    },
    {
      label: "Sewing Workshop",
      value: "Sewing Workshop",
      icon: Spool,
    },
    {
      label: "Turning Workshop",
      value: "Turning Workshop",
      icon: Cone,
    },
    {
      label: "Molding Workshop",
      value: "Molding Workshop",
      icon: Layers,
    },

    {
      label: "Labeling Workshop",
      value: "Labeling Workshop",
      icon: Tag,
    },

    {
      label: "Packaging Workshop",
      value: "Packaging Workshop",
      icon: ArchiveIcon,
    },
    {
      label: "Completed",
      value: "Completed",
      icon: CircleCheck,
    },
  ];

  const filters = [{ column: "progressStatus", title: "Status", options: status }];


const toInsertBatch = (batch: Batch): InsertBatch => ({
    name:          batch.name,
    size:          batch.size,
    actualSize:    batch.actualSize,
    productId:     batch.product.id,
    workstationId: batch.workstation.id,
    statusId:      batch.status.id,
    plannedFor:    batch.plannedFor,
    isActive:      batch.isActive,
    workers:       batch.workers,
  });

  type UpdateFunction = (field: keyof InsertBatch, value: any, row: Row<Batch>) => void;

  const handleCellUpdate: UpdateFunction = (field, value, row) => {
    const current = toInsertBatch(row.original);

    if (field === "workers") {
      const { departmentId, workerId } = value as { departmentId: number; workerId: number };
      const existing = current.workers ?? [];
      const updated = existing.some((w) => w.department.id === departmentId)
        ? existing.map((w) =>
            w.department.id === departmentId ? { ...w, worker: { id: workerId } } : w,
          )
        : [...existing, { department: { id: departmentId }, worker: { id: workerId } }];

      updateBatch({ id: row.original.id, data: { ...current, workers: updated } });
      return;
    }

    updateBatch({ id: row.original.id, data: { ...current, [field]: value } });
  };

  const handleRowClick = () => {
    createBatch({
      name:          null,
      size:          100,
      actualSize:    100,
      productId:     undefined,
      workstationId: undefined,
      statusId:      null,
      plannedFor:    new Date(),
      workers:       [],
      isActive:      true,
    });
  };

  const departments: Department[] = [
    { id: 1, label: "Knitting", isActive: true },
    { id: 2, label: "Sewing", isActive: true },
    { id: 3, label: "Turning", isActive: true },
    { id: 4, label: "Molding", isActive: true },
    { id: 5, label: "Labeling", isActive: true },
    { id: 6, label: "Packaging", isActive: true },
  ]

  const columns = getBatchColumns(handleCellUpdate, products ?? [], users ?? [], workstations ?? [], departments ?? []);

  return (
    <DataTable
      columns={columns}
      data={batches ?? []}
      // contentForm={<BatchForm onSuccess={refetch} />}
      isAddSection={false}
      toolbarExtras={
        <div className="flex justify-end w-full">
          <Button className="h-8" variant="outline" onClick={handleRowClick}>Add row</Button>
        </div>
      }
      filters={filters}
      searchValues={"name"}
      initialState={{ columnVisibility: { plannedFor: false, updatedAt: false } }}
    />
  );
};
