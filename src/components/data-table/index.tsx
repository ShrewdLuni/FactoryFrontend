"use client"

import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, getPaginationRowModel } from "@tanstack/react-table"
import { useState } from "react"

import { TablePagination } from "./pagination"
import { TableToolbar } from "./toolbar"
import { TableContent } from "./content"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
}

export function DataTable<TData, TValues>({ columns, data } : DataTableProps<TData, TValues>){
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data, 
    columns, 
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  })

  return (
    <div className="flex flex-col w-full">
      <TableToolbar table={table}/>
      <TableContent table={table} columns={columns}/>
      <TablePagination table={table}/>
    </div>
  )
}
