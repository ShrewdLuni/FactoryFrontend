"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import type { QRCode } from "@/types/qrcode";
import { IconCircleFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";

export const getColumns = (openActivateDialog: (qr: QRCode) => void): ColumnDef<QRCode>[] => [
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
    accessorKey: "isTaken",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Is Activated"}/>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.isTaken === true
          ? (<IconCircleFilled className="fill-green-400 dark:fill-green-500" />) 
          : (<IconCircleFilled className="fill-pink-600 dark:fill-pink-500" />)
          }
        {row.original.isTaken ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "resource",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Resource"}/>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
            <DropdownMenuItem onClick={() => {openActivateDialog(row.original)}}>
              Activate QR-Code
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


