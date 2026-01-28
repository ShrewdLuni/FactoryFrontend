"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/types/products";
import { CheckBoxCell } from "../data-table/checkbox-cell";

interface ProductColumnsProps {
  onCellUpdate: (field: string, value: string | boolean, row: any) => void;
}

export const getProductColumns = ({ onCellUpdate }: ProductColumnsProps) => {
  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Code"}/>
        )
      }
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Name"}/>
        )
      }
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Is Active"}/>
        )
      },
      cell: ({ row }) => {
        return <CheckBoxCell row={row} field="isActive" defaultValue={row.original.isActive} onChange={onCellUpdate}/>
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id));
        return value.includes(cellValue);
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Category"}/>
        )
      }
    },
    {
      accessorKey: "measureUnit",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Unit"}/>
        )
      }
    },
  ]

  return columns;
}
