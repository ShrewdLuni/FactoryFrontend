import type { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, CirclePlus } from "lucide-react"
import { DataTableFacetedFilter } from "./filter"

import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"

interface TableToolbarProps<TData> {
  table: Table<TData>
}

export function TableToolbar<TData>({ table }: TableToolbarProps<TData>) {

  const roles = [
    {
      label: "Worker",
      value: "worker",
      icon: ArrowDown,
    },
    {
      label: "Manager",
      value: "manager",
      icon: ArrowRight,
    },
    {
      label: "Master",
      value: "master",
      icon: ArrowUp,
    },
  ]

  const status = [
    {
      label: "Inactive",
      value: "Inactive",
      icon: ArrowDown,
    },
    {
      label: "Manager",
      value: "manager",
      icon: ArrowRight,
    },
    {
      label: "Master",
      value: "master",
      icon: ArrowUp,
    },
  ]

  const gender = [
    {
      label: "Male",
      value: "Male",
      icon: ArrowDown,
    },
    {
      label: "Female",
      value: "Female",
      icon: ArrowRight,
    },
    {
      label: "Other",
      value: "Other",
      icon: ArrowUp,
    },
  ]

  return (
    <div className="flex items-center py-4 gap-4">
      <Input 
        placeholder="Search..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""} 
        onChange={(event) => {
          table.getColumn("email")?.setFilterValue(event.target.value)
        }}
        className="max-w-sm"
      />
      {table.getColumn("role") && (
        <DataTableFacetedFilter
          column={table.getColumn("role")}
          title="Role"
          options={roles}
        />
      )}
      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={status}
        />
      )}
      {table.getColumn("gender") && (
        <DataTableFacetedFilter
          column={table.getColumn("gender")}
          title="Gender"
          options={gender}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
      <Button variant={"outline"}>Add section <CirclePlus/> </Button>
    </div>
  )
}
