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
import { Eye, Image, Link, MoreHorizontal, Printer, SquarePen, Trash } from "lucide-react";
import type { QRCode } from "@/types/qrcode";
import { IconCircleFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { useQR } from "@/hooks/useQR";
import { printQRCode } from "./utils";

export const getColumns = (openActivateDialog: (qr: QRCode) => void, openSeeDialog: (qr: QRCode) => void): ColumnDef<QRCode>[] => [
  createSelectColumn<QRCode>(),
  createIdColumn<QRCode>(),
  createColumn<QRCode>("name", "Назва"),
  {
    accessorKey: "isTaken",
    header: ({ column }) => { return <SortableHeader column={column} field={"Активовано"} />; },
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

      const deleteMutation = useQR.delete();

      const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
              onClick={() => handleDelete(row.original.id)}>
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
              <DropdownMenuItem onClick={() => openActivateDialog(row.original)}>
                <Link/>
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
