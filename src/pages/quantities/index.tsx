"use client";

import { useMemo, useState } from "react";
import { useGetProductQuantities } from "@/api/generated/product/product";
import { Input } from "@/components/ui/input";
import { TableContent } from "@/components/data-table/content";
import { TablePagination } from "@/components/data-table/pagination";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getQuantityColumns, type ProductQuantityRow } from "./columns";

function StatusTable({
  label,
  rows,
  globalFilter,
}: {
  label: string;
  rows: ProductQuantityRow[];
  globalFilter: string;
}) {
  const columns = useMemo(() => getQuantityColumns(), []);

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 50 } },
  });

  const visibleRows = table.getFilteredRowModel().rows;
  if (visibleRows.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {visibleRows.length}
        </span>
      </div>
      <TableContent table={table} columns={columns} />
      <TablePagination table={table} />
    </div>
  );
}

export const QuantityPage = () => {
  const { data: quantities = [], isLoading } = useGetProductQuantities();
  const [globalFilter, setGlobalFilter] = useState("");

  if (isLoading) return <div>Loading...</div>;

  const hasAnyData = quantities.some((group) => group.products.length > 0);

  return (
    <div className="flex flex-col gap-6 p-4">
      <Input
        placeholder="Пошук..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm h-8"
      />
      {!hasAnyData && (
        <p className="text-sm text-muted-foreground">No products at any status.</p>
      )}
      {quantities.map((group) => (
        <StatusTable
          key={group.status.id}
          label={group.status.label}
          rows={group.products}
          globalFilter={globalFilter}
        />
      ))}
    </div>
  );
};
