"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputCell } from "@/components/data-table/input-cell";
import { SwitchCell } from "@/components/data-table/switch-cell";
import type { Device, DevicePatch } from "@/api/generated/models";

interface DeviceColumnsProps {
  handlePatch: (id: number, data: DevicePatch) => void;
  handleDelete: (id: number) => void;
  onEditDialogOpenClick: (data: Device) => void;
}

export const getDeviceColumns = ({ handlePatch, handleDelete, onEditDialogOpenClick }: DeviceColumnsProps): ColumnDef<Device>[] => [
  createSelectColumn<Device>(),
  createIdColumn<Device>(),
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
    cell: ({ row }) => (
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
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => <SortableHeader column={column} field={"Місткість"} />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <InputCell
          className="w-fit"
          type="number"
          defaultValue={String(row.original.capacity ?? "")}
          onBlur={(e) => {
            e.preventDefault();
            const newValue = Number(e.target.value);
            if (!Number.isNaN(newValue) && newValue !== row.original.capacity) {
              handlePatch(row.original.id, { capacity: newValue });
            }
          }}
        />
      </div>
    ),
  },
  {
    id: "department",
    accessorFn: (row) => row.department?.label ?? "",
    header: ({ column }) => <SortableHeader column={column} field={"Відділ"} />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline">{row.original.department.id}</Badge>
      </div>
    ),
  },
  // {
  //   id: "isActive",
  //   accessorFn: (row) => String(row.isActive),
  //   header: ({ column }) => <SortableHeader column={column} field="Активний" />,
  //   cell: ({ row }) => (
  //     <div className="w-full flex justify-center">
  //       <SwitchCell
  //         pressed={row.original.isActive}
  //         onPressed={(pressed) => handlePatch(row.original.id, { isActive: pressed })}
  //       />
  //     </div>
  //   ),
  //   filterFn: (row, columnId, selectedValues: string[]) => selectedValues.includes(row.getValue(columnId)),
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 text-end">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
          onClick={() => handleDelete(row.original.id)}
        >
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
              <SquarePen />
              <p>Редагувати</p>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
              <Trash className="text-red-500" />
              <p className="text-red-500">Видалити</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
