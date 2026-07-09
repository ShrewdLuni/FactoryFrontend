import type { StorageEntry } from "@/api/generated/models";
import { createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { SortableHeader } from "@/components/data-table/sortable-header";
import type { ColumnDef } from "@tanstack/react-table";

export const getStorageColumns = () => {
  const columns: ColumnDef<StorageEntry>[] = [
    createSelectColumn<StorageEntry>(),
    createIdColumn<StorageEntry>(),
    {
      accessorKey: "product",
      accessorFn: (row) => (row.product.name || ""),
      header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
      cell: ({ row }) => {
        return (<div className="w-full">{`${row.original.product.name}`}</div>)
      },
    },
    {
      accessorKey: "boxSize",
      header: ({ column }) => <SortableHeader column={column} field={"Розмір коробки"} />,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.boxSize}</div>
        )
      },
    },
  ]
  return columns;
}
