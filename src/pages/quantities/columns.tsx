"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { QuantitiesByStatus } from "@/api/generated/models";
import { SortableHeader } from "@/components/data-table/sortable-header";

export type ProductQuantityRow = QuantitiesByStatus["products"][number];

export const getQuantityColumns = (): ColumnDef<ProductQuantityRow>[] => {
  const columns: ColumnDef<ProductQuantityRow>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground">
          {`${row.original.id}`.padStart(4, "0")}
        </div>
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <SortableHeader column={column} field={"Кількість"} />,
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-sm font-semibold">
            {row.original.quantity}
          </span>
        </div>
      ),
    },
  ];
  return columns;
};
