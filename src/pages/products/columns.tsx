"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { PackedStock, Product, ProductInsert, ProductPatch } from "@/api/generated/models";
import { InputCell } from "@/components/data-table/input-cell";
import { ToggleCell } from "@/components/data-table/toggle-cell";
import { SwitchCell } from "@/components/data-table/switch-cell";

interface ProductColumnsProps {
  handlePatch: (id: number, data: ProductPatch) => void;
  handleDelete: (id: number) => void;
  onEditDialogOpenClick: (data: Product) => void;
  packedStock: PackedStock[] | undefined;
}

export const getProductColumns = ({ handlePatch, handleDelete, onEditDialogOpenClick, packedStock }: ProductColumnsProps) => {
  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    createIdColumn<Product>(),
    {
      accessorKey: "image",
      header: ({ column }) => <SortableHeader column={column} field={"Зображення"} />,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center h-16 hover:h-28 transition-all duration-300 delay-0 hover:delay-200 rounded-sm">          
            <img 
              className="rounded-sm"
              src="https://static.vecteezy.com/system/resources/previews/004/240/295/non_2x/warm-socks-linear-icon-sox-wardrobe-element-contour-symbol-socks-pair-thin-line-illustration-isolated-outline-drawing-vector.jpg" 
              alt="sock"/>          
          </div>
        )
      },
    },
    createColumn<Product>("code", "Code"),
    {
      accessorKey: "name",
      accessorFn: (row) => {
        return row.name
      },
      header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">          
            <InputCell
              className="w-fit" 
              defaultValue={row.original.name || undefined}
              onBlur={(e) => {
                e.preventDefault();
                const newValue = e.target.value.trim();
                const originalValue = (row.original.name ?? "").trim();
                if (newValue !== originalValue) handlePatch(row.original.id, { name: newValue });
              }}
            />
          </div>
        )
      },
    },
    {
      id: "Packed",
      accessorFn: (row) => {
        const stock = packedStock?.find((s) => s.product.id === row.id);
        return stock?.quantity ?? 0;
      },
      header: ({ column }) => { return <SortableHeader column={column} field={"Упакований товар"} />; },
      cell: ({ row }) => {
        const stock = (packedStock ?? []).find((s) => s.product.id === row.original.id);
        return <div className="text-center text-nowrap">{stock?.quantity ?? 0}</div>;
      },
    },
    {
      id: "isActive",
      accessorFn: (row) => String(row.isActive),
      header: ({ column }) => <SortableHeader column={column} field="Актуальні" />,
      cell: ({ row }) => (
        <div className="w-full flex justify-center">
          <SwitchCell
            pressed={row.original.isActive}
            onPressed={(pressed) => {
              handlePatch(row.original.id, { isActive: pressed })
            }}
            />
        </div>
      ),
      filterFn: (row, columnId, selectedValues: string[]) =>
        selectedValues.includes(row.getValue(columnId)),
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
                <DropdownMenuLabel>Дії</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEditDialogOpenClick(row.original)}>
                  <SquarePen/>
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
