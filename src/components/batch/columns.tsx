"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import type { Batch } from "@/types/batches";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDateTime } from "@/helpers/formatTime";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

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
    accessorKey: "productId",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Product"}/>
      )
    }
  },
  {
    accessorKey: "masters",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Master name"}/>
      )
    },
    cell: ({ row }) => {
      return (
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="link">Hover here</Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-64 flex-col gap-0.5">
            <div className="font-semibold">Masters</div>
            <div>Knitting: {row.original.masters.knitting}</div>
            <div>Sewing: {row.original.masters.sewing}</div>
            <div>Molding: {row.original.masters.molding}</div>
            <div>Labeling: {row.original.masters.labeling}</div>
            <div>Packaging: {row.original.masters.packaging}</div>
          </HoverCardContent>
        </HoverCard>
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu {row.original.name}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
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

