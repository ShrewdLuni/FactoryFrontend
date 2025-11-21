import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, CirclePlus, CircleSmall, HardHat, Mars, UserCog, UserStar, Venus, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleEllipsis, CircleX } from "lucide-react"
import { DataTableFacetedFilter } from "./filter"
import type { JSX } from "react"

interface TableToolbarProps<TData> {
  table: Table<TData>,
  onAddRecord: () => void,
  filters: JSX.Element,
}

export function TableToolbar<TData>({ table, onAddRecord }: TableToolbarProps<TData>) {

  const roles = [
    {
      label: "Worker",
      value: "worker",
      icon: HardHat,
    },
    {
      label: "Manager",
      value: "manager",
      icon: UserStar,
    },
    {
      label: "Master",
      value: "master",
      icon: UserCog,
    },
  ]

  const status = [
    {
      label: "Inactive",
      value: "Inactive",
      icon: CircleX,
    },
    {
      label: "In-Progress",
      value: "In-Progress",
      icon: CircleEllipsis,
    },
    {
      label: "Completed",
      value: "Completed",
      icon: CircleCheck,
    },
  ]

  const gender = [
    {
      label: "Male",
      value: "Male",
      icon: Mars,
    },
    {
      label: "Female",
      value: "Female",
      icon: Venus,
    },
    {
      label: "Other",
      value: "Other",
      icon: CircleSmall,
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
      <Button variant={"outline"} onClick={onAddRecord}>Add section <CirclePlus/> </Button>
    </div>
  )
}
