"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import type { Batch } from "@/types/batches";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDateTime } from "@/helpers/formatTime";

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Name"}/>
      )
    }
  },
  {
    accessorKey: "progressStatus",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Status"}/>
      )
    }
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Batch size"}/>
      )
    }
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Product"}/>
      )
    }
  },
  {
    accessorKey: "assignedMasterName",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Name"}/>
      )
    }
  },
  {
    accessorKey: "plannedFor",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Planned for"}/>
      )
    },
    cell: ({ row }) => {
      const plannedFor = row.getValue("plannedFor") as string;
      return <span>{formatDateTime(plannedFor)}</span>;
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Last updated"}/>
      )
    },
    cell: ({ row }) => {
      const plannedFor = row.getValue("plannedFor") as string;
      return <span>{formatDateTime(plannedFor)}</span>;
    }

  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Generate QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

