import { createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SquareMinus } from "lucide-react";
import type { GroupedStorageEntry } from "./group";


interface StorageColumnProps {
  isGrouped: boolean;
  showWrittenOff: boolean;
  handleWriteOff: (id: number) => void;
}

export const getStorageColumns = ({ isGrouped, showWrittenOff, handleWriteOff }: StorageColumnProps) => {
  const columns: ColumnDef<GroupedStorageEntry>[] = [
    createSelectColumn<GroupedStorageEntry>(),
    createIdColumn<GroupedStorageEntry>(),
    {
      accessorKey: "product",
      accessorFn: (row) => row.product.name || "",
      header: ({ column }) => (
        <SortableHeader column={column} field="Продукт" />
      ),
      cell: ({ row }) => (
        <div className="w-full">{row.original.product.name}</div>
      ),
    },
    {
      accessorKey: "boxSize",
      header: ({ column }) => (
        <SortableHeader column={column} field="Розмір коробки" />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.original.boxSize}</div>
      ),
    },
  ];
  if (isGrouped) {
    columns.push(
      {
        id: "entriesCount",
        accessorFn: (row) => row.entriesCount,
        header: ({ column }) => <SortableHeader column={column} field="К-сть коробок" />,
        cell: ({ row }) => <div className="text-center">{row.original.entriesCount}</div>,
      },
      {
        id: "totalBoxSize",
        accessorFn: (row) => row.totalBoxSize,
        header: ({ column }) => <SortableHeader column={column} field="Загальний розмір" />,
        cell: ({ row }) => <div className="text-center">{row.original.totalBoxSize}</div>,
      }
    );
  }  
  if (showWrittenOff) {
    columns.push({
      accessorKey: "someField",
      header: ({ column }) => (
        <SortableHeader column={column} field="Some field" />
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.writtenOffAt}
        </div>
      ),
    });
  }
  if (!showWrittenOff && !isGrouped) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-end">
          <Button
            variant="ghost"
            className="text-yellow-400 hover:text-yellow-400 h-8 w-8 p-0 font-bold"
            onClick={() => {console.log(row.original.id); handleWriteOff(row.original.id)}}
          >
            <span className="sr-only">Видалити</span>
            <SquareMinus />
          </Button>
        </div>
      ),
    });
  }

  return columns;
};
