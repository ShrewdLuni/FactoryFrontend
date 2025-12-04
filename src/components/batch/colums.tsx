"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import type { Batch } from "@/types/batches";

export const columns: ColumnDef<Batch>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
          <SortableHeader column={column} field={"ID"}/>
      )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Status"}/>
      )
    }
  },
  {
    accessorKey: "productId",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Product"}/>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Category"}/>
      )
    }
  },
]
