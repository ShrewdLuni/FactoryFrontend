import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, CirclePlus, type LucideIcon } from "lucide-react"
import { DataTableFacetedFilter } from "./filter"
import type { JSX, ReactNode } from "react"

interface TableToolbarProps<TData> {
  table: Table<TData>,
  searchBarValue?: string | null,
  filters?: {
    column: string;
    title?: string;
    options: {
      label: string;
      value: string;
      icon?: LucideIcon | ReactNode
    }[];
  }[];
  onAddRecord: () => void,
  toolbarExtras?: JSX.Element,
  isAddSection?: boolean,
}

export function TableToolbar<TData>({ table, searchBarValue, onAddRecord, filters, toolbarExtras, isAddSection }: TableToolbarProps<TData>) {

  return (
    <div className="flex items-center py-4 gap-2">
      {searchBarValue != null && (<Input 
        placeholder="Search..."
        value={(table.getColumn(searchBarValue)?.getFilterValue() as string) ?? ""} 
        onChange={(event) => {
          table.getColumn(searchBarValue)?.setFilterValue(event.target.value)
        }}
        className="max-w-sm h-8"
      />)}
      {filters && filters.map((filter) => {
        return table.getColumn(filter.column) && (
          <DataTableFacetedFilter
            key={filter.title}
            column={table.getColumn(filter.column)}
            title={filter.title}
            options={filter.options}
          />
        )
      })}
      {toolbarExtras}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="h-8">
          <Button variant={"outline"} className="ml-auto">
            Columns <ChevronDown/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.id} 
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {isAddSection && <Button className="h-8" variant={"outline"} onClick={onAddRecord}>Add section <CirclePlus/> </Button>}
    </div>
  )
}
