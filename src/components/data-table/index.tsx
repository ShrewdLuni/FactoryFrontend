"use client"

import { getCoreRowModel, useReactTable, getSortedRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, getPaginationRowModel } from "@tanstack/react-table"
import { useState } from "react"

import { TablePagination } from "./pagination"
import { TableToolbar } from "./toolbar"
import { TableContent } from "./content"
import { AddRecordDialog } from "./add-record-dialog"
import { type JSX } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
  contentForm: JSX.Element,
  filters?: {
    column: string;
    title?: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];

}

export function DataTable<TData, TValues>({ columns, data, contentForm, filters } : DataTableProps<TData, TValues>){
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

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
      <TableToolbar table={table} onAddRecord={() => setIsAddFormOpen(true)} filters={filters}/>
      <TableContent table={table} columns={columns}/>
      <TablePagination table={table}/>
      <AddRecordDialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen} contentForm={contentForm}/>
    </div>
  )
}
