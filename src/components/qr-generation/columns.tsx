"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "../data-table/sortable-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import type { QRCode } from "@/types/qrcode";
import { IconCircleFilled } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { createColumn, createIdColumn, createSelectColumn } from "../data-table/common-columns";
import QRCodeLib from "qrcode";

const printQRCode = async (qr: QRCode) => {
  if (!qr.resource) return;

  const dataUrl = await QRCodeLib.toDataURL(qr.resource, {
    width: 240,
    margin: 2,
  });

  const printWindow = window.open("", "_blank", "width=400,height=500");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${qr.name ?? qr.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: sans-serif;
            gap: 12px;
            padding: 24px;
          }
          h2 { font-size: 16px; font-weight: 600; color: #111; }
          img { width: 240px; height: 240px; object-fit: contain; }
          p {
            font-size: 12px;
            color: #666;
            word-break: break-all;
            text-align: center;
            max-width: 280px;
          }
          @media print {
            body { justify-content: flex-start; padding-top: 48px; }
          }
        </style>
      </head>
      <body>
        <h2>${qr.name ?? `QR #${qr.id}`}</h2>
        <img src="${dataUrl}" alt="QR Code" />
        <p>${qr.resource}</p>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

export const getColumns = (openActivateDialog: (qr: QRCode) => void, openSeeDialog: (qr: QRCode) => void): ColumnDef<QRCode>[] => [
  createSelectColumn<QRCode>(),
  createIdColumn<QRCode>(),
  createColumn<QRCode>("name", "Name"),
  {
    accessorKey: "isTaken",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Is Activated"} />;
    },
    cell: ({ row }) => (
      <div className="justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.isTaken ? (
            <IconCircleFilled className="fill-green-400 dark:fill-green-500" />
          ) : (
            <IconCircleFilled className="fill-pink-600 dark:fill-pink-500" />
          )}
          {row.original.isTaken ? "Yes" : "No"}
        </Badge>
      </div>
    ),
  },
  createColumn<QRCode>("resource", "Resource"),
  {
    id: "actions",
    cell: ({ row }) => {
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
              <DropdownMenuItem onClick={() => openActivateDialog(row.original)}>
                Activate QR-Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openSeeDialog(row.original)}>
                See QR-Code
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!row.original.resource}
                onClick={() => printQRCode(row.original)}
              >
                Print QR-Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
