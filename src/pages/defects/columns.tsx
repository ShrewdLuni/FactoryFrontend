import type { DefectsByProductDefectsItem, DefectsByProductProduct } from "@/api/generated/models"
import { SortableHeader } from "@/components/data-table/sortable-header"
import type { ColumnDef } from "@tanstack/react-table"

export interface FlatDefectRow {
  id: string;
  product: DefectsByProductProduct;
  defect: DefectsByProductDefectsItem;
}

export const getColumns = () => {
  const columns: ColumnDef<FlatDefectRow>[] = [
    {
      accessorKey: "id",
      accessorFn: (row) => row.product.id,
      header: ({ column }) => <SortableHeader column={column} field={"ID"} />,
      cell: ({ row }) => (
        <div className="text-center">{`${row.original.product.id || 0}`.padStart(5, "0")}</div>
      ),
    },
    {
      accessorKey: "name",
      accessorFn: (row) => row.product.name,
      header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
      cell: ({ row }) => <div className="text-left">{row.original.product.name}</div>,
    },
    {
      id: "defectType",
      accessorFn: (row) => row.defect.type.label,
      header: ({ column }) => <SortableHeader column={column} field={"Назва дефекту"} />,
      cell: ({ row }) => <div className="text-left">{row.original.defect.type.label}</div>,
      filterFn: (row, columnId, selectedValues: string[]) =>
        selectedValues.includes(row.getValue(columnId)),
    },
    {
      accessorKey: "quantity",
      accessorFn: (row) => row.defect.quantity,
      header: ({ column }) => <SortableHeader column={column} field={"Кількість"} />,
      cell: ({ row }) => <div className="text-center">{row.original.defect.quantity}</div>,
    },
  ]
  return columns
}
