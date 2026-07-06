import type { ColumnDef, Table as TableType} from "@tanstack/react-table"

import { flexRender }  from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableContentProps<TData, TValue> {
  table: TableType<TData>
  columns: ColumnDef<TData, TValue>[],
}

export function TableContent<TData, TValue>({ table, columns }: TableContentProps<TData, TValue>) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id + cell.column.id} className="max-h-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>))) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  У цій таблиці немає даних.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )
}
