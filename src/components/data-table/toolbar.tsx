"use client";

import type { Table } from "@tanstack/react-table";
import type { JSX, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, CirclePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { DataTableFacetedFilter } from "./filter";

export interface TableFilterConfig {
  column: string;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon | ReactNode;
  }[];
}

interface TableToolbarProps<TData> {
  table: Table<TData>;
  searchBarValue?: string | null;
  filters?: TableFilterConfig[];
  onAddRecord: () => void;
  toolbarExtras?: JSX.Element;
  isAddSection?: boolean;
}

export function TableToolbar<TData>({
  table,
  searchBarValue,
  onAddRecord,
  filters,
  toolbarExtras,
  isAddSection,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center py-4 gap-2">
      {searchBarValue != null && (
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchBarValue)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn(searchBarValue)?.setFilterValue(event.target.value);
          }}
          className="max-w-sm h-8"
        />
      )}

      {filters?.map((filter) => {
        const column = table.getColumn(filter.column);
        return column && <DataTableFacetedFilter key={filter.column} column={column} title={filter.title} options={filter.options} />;
      })}

      {toolbarExtras}

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="h-8">
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAddSection && (
        <Button className="h-8" variant="outline" onClick={onAddRecord}>
          Add section <CirclePlus />
        </Button>
      )}
    </div>
  );
}
