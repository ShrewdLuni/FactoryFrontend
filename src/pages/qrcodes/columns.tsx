"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/data-table/sortable-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Image, Link, MoreHorizontal, Printer, SquarePen, Trash } from "lucide-react";
import { IconCircleFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { createColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { printQRCode } from "./utils";
import { InputCell } from "@/components/data-table/input-cell";
import type { QRCode, QRCodePatch } from "@/api/generated/models";

interface QRCodeColumnsProps {
  openLinkDialog: (qr: QRCode) => void;
  openSeeDialog: (qr: QRCode) => void;
  openEditDialog: (data: QRCode) => void;
  handlePatch: (id: number, data: QRCodePatch) => void;
  handleDelete: (id: number) => void;
}

export const getColumns = ({ openLinkDialog, openSeeDialog, openEditDialog, handlePatch, handleDelete }: QRCodeColumnsProps): ColumnDef<QRCode>[] => [
  createSelectColumn<QRCode>(),
  {
    accessorKey: "id",
    accessorFn: (row) => (row.id),
    header: ({ column }) => {
      return <SortableHeader column={column} field={"ID"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{`${row.original.id || 0}`.padStart(5, "0")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
    cell: ({ row }) => {
      const isChangable = true;
      return isChangable ? (
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
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  },
  {
    accessorKey: "isTaken",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Активовано"} />;
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.isTaken ? (
            <IconCircleFilled className="fill-green-400 dark:fill-green-500" />
          ) : (
            <IconCircleFilled className="fill-pink-600 dark:fill-pink-500" />
          )}
          {row.original.isTaken ? "Так" : "Ні"}
        </Badge>
      </div>
    ),
  },
  createColumn<QRCode>("resource", "Адреса ресурсу"),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
              onClick={() => handleDelete(row.original.id)}
            >
              <span className="sr-only">Видалити</span>
              <Trash />
            </Button>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Дії</DropdownMenuLabel>
              <DropdownMenuItem disabled={row.original.isTaken} onClick={() => openLinkDialog(row.original)}>
                <Link />
                Прив’язати QR-код
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSeeDialog(row.original)}>
                <Image />
                Показати QR-код
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => printQRCode(row.original)}>
                <Printer />
                Друкувати QR-код
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
                <SquarePen />
                <p className="">Редагувати</p>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
                <Trash className="text-red-500" />
                <p className="text-red-500">Видалити</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
