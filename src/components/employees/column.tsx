import type { EmployeeGender, EmployeeRole } from "@/types/employee";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IconCircleFilled } from "@tabler/icons-react"
import { SortableHeader } from "../data-table/sortable-header";
import { Checkbox } from "../ui/checkbox";

export type EmployeeData = {
  id: string,
  role: EmployeeRole,
  name: string,
  email: string,
  phone: string,
  gender: EmployeeGender,
  dateOfBirth: string,
}

export const columns: ColumnDef<EmployeeData>[] = [
{
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"ID"}/>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Role"}/>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Name"}/>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Email"}/>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Phone"}/>
      )
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Gender"}/>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.gender === "Male" ? (
          <IconCircleFilled className="fill-blue-700 dark:fill-blue-600" />
        ) : (row.original.gender === "Female" ? (
          <IconCircleFilled className="fill-pink-600 dark:fill-pink-500" />
        ) : 
         <IconCircleFilled className="fill-yellow-400 dark:fill-yellow-400" />
          )}
        {row.original.gender}
      </Badge>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} field={"Date Of Birth"}/>
      )
    },
  },
]
