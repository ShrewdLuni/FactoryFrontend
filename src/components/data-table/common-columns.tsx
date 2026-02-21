import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "./sortable-header";

export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function createIdColumn<T extends { id: number }>(): ColumnDef<T> {
  return {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"ID"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{`${row.original.id || 0}`.padStart(4, "0")}</div>;
    },
  };
}

export function createColumn<T>(accessorKey: keyof T, field: string): ColumnDef<T> {
  return {
    accessorKey: accessorKey,
    header: ({ column }) => {
      return <SortableHeader column={column} field={field} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{`${row.original[accessorKey] || 0}`}</div>;
    },

  }
}
