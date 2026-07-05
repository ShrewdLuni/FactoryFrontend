"use client"

import { getCoreRowModel, useReactTable, getSortedRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, getPaginationRowModel, type TableState, type PaginationState, getFacetedRowModel, getFacetedUniqueValues, type Table, type OnChangeFn, type RowSelectionState } from "@tanstack/react-table"
import { useState, useImperativeHandle, type ReactNode, type Ref, useEffect, useRef } from "react"

import { TablePagination } from "./pagination"
import { TableToolbar } from "./toolbar"
import { TableContent } from "./content"
import { AddRecordDialog } from "./add-record-dialog"
import type { LucideIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
  contentForm?: (props: { onClose: () => void }) => ReactNode,
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
  toolbarExtras?: ReactNode;
  isAddSection?: boolean;
  tableRef?: Ref<Table<TData>>;
  onRowSelectionChange?: (ids: string[]) => void;
}

export function DataTable<TData, TValues>({ columns, searchValues, data, contentForm, filters, initialState, toolbarExtras, isAddSection = false, tableRef, onRowSelectionChange } : DataTableProps<TData, TValues>){
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility || {})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 50 })

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelection((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  useEffect(() => {
    setRowSelection((prev) => {
      const keys = Object.keys(prev);
      if (keys.length === 0) return prev;

      const validIds = new Set(data.map((row: any) => String(row.id)));
      const next: RowSelectionState = {};
      let changed = false;

      for (const key of keys) {
        if (validIds.has(key)) {
          next[key] = prev[key];
        } else {
          changed = true;
        }
      }

      return changed ? next : prev;    
    });
  }, [data, onRowSelectionChange]);

  const onRowSelectionChangeRef = useRef(onRowSelectionChange);
  onRowSelectionChangeRef.current = onRowSelectionChange;

  useEffect(() => {
    onRowSelectionChangeRef.current?.(Object.keys(rowSelection));
  }, [rowSelection]);

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
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: setPagination,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: (table, columnId) => {
      const defaultFaceted = getFacetedUniqueValues()(table, columnId);

      return () => {
        const rows = table.getPreFilteredRowModel().rows;

        if (rows.length === 0) return defaultFaceted();

        const firstValue = rows[0]?.getValue(columnId);

        if (Array.isArray(firstValue)) {
          const map = new Map<string, number>();
          rows.forEach((row) => {
            const values = row.getValue<string[]>(columnId);
            values?.forEach((v) => { map.set(v, (map.get(v) ?? 0) + 1); });
          });
          return map;
        }

        return defaultFaceted();
      };
    },
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  useImperativeHandle(tableRef, () => table);

  return (
    <div className="flex flex-col w-full">
      <TableToolbar table={table} searchBarValue={searchValues} onAddRecord={() => setIsAddFormOpen(true)} filters={filters} toolbarExtras={toolbarExtras} isAddSection={isAddSection}/>
      <TableContent table={table} columns={columns}/>
      <TablePagination table={table}/>
      <AddRecordDialog
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        contentForm={contentForm?.({ onClose: () => setIsAddFormOpen(false) })}
      />
    </div>
  )
}
