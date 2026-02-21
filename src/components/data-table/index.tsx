"use client"

import { getCoreRowModel, useReactTable, getSortedRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, getPaginationRowModel, type TableState, type PaginationState } from "@tanstack/react-table"
import { useState, type ReactNode } from "react"

import { TablePagination } from "./pagination"
import { TableToolbar } from "./toolbar"
import { TableContent } from "./content"
import { AddRecordDialog } from "./add-record-dialog"
import { type JSX } from "react"
import type { LucideIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
  contentForm?: JSX.Element,
  searchValues?: string,
  filters?: {
    column: string;
    title?: string;
    options: {
      label: string;
      value: string;
      icon?: LucideIcon | ReactNode;
    }[];
  }[];
  initialState?: Partial<TableState>; 
  toolbarExtras?: JSX.Element;
  isAddSection?: boolean;
}

export function DataTable<TData, TValues>({ columns, searchValues, data, contentForm, filters, initialState, toolbarExtras, isAddSection = true } : DataTableProps<TData, TValues>){
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility || {})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 10 })

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const table = useReactTable({
    data, 
    columns, 
    getRowId: (row: any) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <div className="flex flex-col w-full">
      <TableToolbar table={table} searchBarValue={searchValues} onAddRecord={() => setIsAddFormOpen(true)} filters={filters} toolbarExtras={toolbarExtras} isAddSection={isAddSection}/>
      <TableContent table={table} columns={columns}/>
      <TablePagination table={table}/>
      <AddRecordDialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen} contentForm={contentForm}/>
    </div>
  )
}
