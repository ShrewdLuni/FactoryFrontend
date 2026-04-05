"use client";

import { SortableHeader } from "@/components/data-table/sortable-header";
import { type ColumnDef } from "@tanstack/react-table";
import type { ProductQuantity } from "@/types/products";
import { createSelectColumn } from "@/components/data-table/common-columns";

type QuantityStatus = ProductQuantity["quantity"][number]["status"];

function createStatusColumn(status: QuantityStatus): ColumnDef<ProductQuantity> {
  return {
    accessorKey: `${status.label}`,
    header: ({ column }) => (
      <SortableHeader column={column} field={status.label} />
    ),
    cell: ({ row }) => {
      const entry = row.original.quantity?.find(
        (q) => q.status.id === status.id
      );

      if (!entry || entry.quantity === 0) {
        return (
          <div className="text-center text-muted-foreground">—</div>
        );
      }

      return (
        <div className="text-center">
          <span className="font-medium">{entry.quantity}</span>
          {entry.batchCount > 1 && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({entry.batchCount})
            </span>
          )}
        </div>
      );
    },
  };
}

export const getStorageColumns = (
  statuses: QuantityStatus[]
): ColumnDef<ProductQuantity>[] => {

  const completed = statuses.find((s) => s.label === "Completed");
  const rest = statuses.filter((s) => s.label !== "Completed");
  return [
    createSelectColumn<ProductQuantity>(),
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"ID"} />;
      },
      cell: ({ row }) => {
        return <div className="text-center">{`${row.original.product_id || 0}`.padStart(4, "0")}</div>;
      },
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <SortableHeader column={column} field="Product" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.product_name}
        </div>
      ),
    },
    {
      id: "total",
      header: ({ column }) => (
        <SortableHeader column={column} field="Total" />
      ),
      cell: ({ row }) => {
        const total = (row.original.quantity ?? []).reduce(
          (sum, q) => sum + q.quantity,
          0
        );

        return (
          <div className="text-center font-semibold">
            {total}
          </div>
        );
      },
    },
    ...[...(completed ? [completed] : []), ...rest].map((status) => createStatusColumn(status)),
  ];
};
