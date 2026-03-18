import { getBatchColumns } from "./columns";
import { DataTable } from "../data-table";
import { BatchForm } from "../forms/batch";
import { CircleX, CircleCheck, Spool, Scissors, Layers, Tag, ArchiveIcon, Cone } from "lucide-react";
import { useBatches, useCreateBatch, useUpdateBatch } from "@/hooks/useBatch";
import { useGetAllProducts } from "@/hooks/useProducts";
import { useGetAllUsers } from "@/hooks/useUsers";
import type { Batch, InsertBatch } from "@/types/batches";
import type { Row } from "@tanstack/react-table";
import { useGetAllWorkstations } from "@/hooks/useWorkstations";
import { Button } from "../ui/button";

export const BatchPage = () => {
  const { data: batches, refetch } = useBatches.getAll();
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


  type updateFunction = (field: keyof Batch | keyof Batch["masters"], value: any, row: Row<Batch>) => void;

  const handleCellUpdate: updateFunction = (field: keyof Batch | keyof Batch["masters"], value: any, row: Row<Batch>) => {
    if (field in row.original.masters) {
      updateBatch({
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

    updateBatch({
      id: row.original.id,
      data: {
        ...row.original,
        [field]: value,
      },
    })
  }  

  const handleRowClick = () => {
    const defaultBatch: InsertBatch = {
      name: "No name",
      size: 100,
      actualSize: 100,
      productId: undefined,
      workstationId: undefined,
      statusId: undefined,
      plannedFor: new Date(),
      workers: [],
      isActive: true,
    }
    createBatch(defaultBatch)
  }

  const columns = getBatchColumns(handleCellUpdate, products || [], users || [], workstations || [])

  return (
    <DataTable
      columns={columns}
      data={batches ?? []}
      contentForm={<BatchForm onSuccess={refetch} />}
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
