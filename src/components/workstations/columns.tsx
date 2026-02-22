"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import type { Workstation } from "@/types/workstation";
import { useWorkstations } from "@/hooks/useWorkstations";
import { createColumn, createIdColumn, createSelectColumn } from "../data-table/common-columns";

export const columns: ColumnDef<Workstation>[] = [
  createSelectColumn<Workstation>(),
  createIdColumn<Workstation>(),
  createColumn<Workstation>("name", "Name"),
  createColumn<Workstation>("qrCode", "QR Code"),
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteMutation = useWorkstations.delete();

      const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
                <Trash className="text-red-500" />
                <p className="text-red-500">Delete</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
