"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CopyPlus, Edit, MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import type { Workstation, WorkstationPatch } from "@/api/generated/models";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { InputCell } from "@/components/data-table/input-cell";

interface WorkstationColumnsProps {
  handlePatch: (id: number, data: WorkstationPatch) => void;
  handleDelete: (id: number) => void;
  onEditDialogOpenClick: (data: Workstation) => void;
}

export const getWorkstationColumns = ({ handlePatch, handleDelete, onEditDialogOpenClick }: WorkstationColumnsProps) => {
  const columns: ColumnDef<Workstation>[] = [
    createSelectColumn<Workstation>(),
    createIdColumn<Workstation>(),
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
      cell: ({ row }) => {
        const isChangable = true
        return isChangable ? (
          <div className="flex justify-center"><InputCell
            className="w-fit"
            defaultValue={row.original.name || undefined}
            onBlur={(e) => {
              e.preventDefault();
              const newValue = e.target.value.trim();
              const originalValue = (row.original.name ?? "").trim();

              if (newValue !== originalValue) handlePatch(row.original.id, { name: newValue });
            }}
          /></div>
        ) : (
          <div className="text-center">{`${row.original.name}`}</div>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2 text-end">
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
              onClick={() => handleDelete(row.original.id)}>
              <span className="sr-only">Видалити</span>
              <Trash />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEditDialogOpenClick(row.original)}>
                  <SquarePen />
                  <p className="">Редагувати</p>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
                  <Trash className="text-red-500"/>
                  <p className="text-red-500">Видалити</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
