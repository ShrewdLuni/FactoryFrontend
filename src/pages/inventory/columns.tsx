"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { createSelectColumn } from "@/components/data-table/common-columns";
import type { ProductQuantitiesByMilestone } from "@/api/generated/models";
import { SortableHeader } from "@/components/data-table/sortable-header";

type Milestone = ProductQuantitiesByMilestone["milestones"][number];

function formatQuantity(value: number): string {
  return value.toLocaleString("uk-UA");
}

function createMilestoneColumn(milestone: Pick<Milestone, "id" | "label">): ColumnDef<ProductQuantitiesByMilestone> {
  return {
    id: `milestone-${milestone.id}`,
    accessorFn: (row) => row.milestones.find((m) => m.id === milestone.id)?.quantity ?? 0,
    header: ({ column }) => <SortableHeader column={column} field={milestone.label} />,
    cell: ({ getValue }) => (
      <div className="text-center tabular-nums">{formatQuantity(getValue<number>())}</div>
    ),
  };
}

interface InventoryColumnsProps {
  milestones: Pick<Milestone, "id" | "label">[];
}

export const getInventoryColumns = ({ milestones }: InventoryColumnsProps) => {
  const columns: ColumnDef<ProductQuantitiesByMilestone>[] = [
    // createSelectColumn<ProductQuantitiesByMilestone>(),
    {
      accessorKey: "id",
      accessorFn: (row) => {
        return row.product.id
      },
      header: ({ column }) => {
        return <SortableHeader column={column} field={"ID"} />;
      },
      cell: ({ row }) => {
        return <div className="text-center">{`${row.original.product.id || 0}`.padStart(5, "0")}</div>;
      },
    },
    {
      accessorKey: "name",
      accessorFn: (row) => {
        return row.product.name
      },
      header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
      cell: ({ row }) => <div className="font-medium">{row.original.product.name}</div>,
    },
    ...milestones.map((milestone) => createMilestoneColumn(milestone)),
    {
      accessorKey: "readyQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"Готово"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-medium">
          {formatQuantity(row.original.readyQuantity)}
        </div>
      ),
    },
    {
      accessorKey: "storageQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"На складі"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-medium">
          {formatQuantity(row.original.storageQuantity)}
        </div>
      ),
    },
    {
      accessorKey: "totalQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"Всього"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-semibold">
          {formatQuantity(row.original.totalQuantity)}
        </div>
      ),
    },
  ];
  return columns;
};
