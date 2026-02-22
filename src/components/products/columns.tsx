"use client";

import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "../data-table/sortable-header";
import type { Product } from "@/types/products";
import { CheckBoxCell } from "../data-table/checkbox-cell";
import { createColumn, createIdColumn, createSelectColumn } from "../data-table/common-columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";


interface ProductColumnsProps {
  onCellUpdate: (field: string, value: string | boolean, row: any) => void;
}

export const getProductColumns = ({ onCellUpdate }: ProductColumnsProps) => {
  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    createIdColumn<Product>(),
    createColumn<Product>("code", "Code"),
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Name"} />;
      },
      cell: ({ row }) => {
        return <div className="text-left max-w-fit!">{row.original.name}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Is Active"} />;
      },
      cell: ({ row }) => {
        return <div className="w-full flex justify-center"><CheckBoxCell row={row} field="isActive" defaultValue={row.original.isActive} onChange={onCellUpdate} /></div>;
      },
      filterFn: (row, id, value) => {
        const cellValue = String(row.getValue(id));
        return value.includes(cellValue);
      },
    },
    createColumn<Product>("category", "Category"),
    createColumn<Product>("measureUnit", "Unit"),
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span>{row.original.id}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled={true}>
                  Delete
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
