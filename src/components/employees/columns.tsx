import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "../data-table/sortable-header";
import { Checkbox } from "../ui/checkbox";
import type { User } from "@/types/users";
import { SelectCell } from "../data-table/select-cell";

type SelectCellOptions = {
    label: string;
    value: string;
    icon?: any;
}[]

interface UserColumnsProps {
  roleSelect: SelectCellOptions;
  genderSelect: SelectCellOptions;
  departmentsSelect: SelectCellOptions;
  onCellUpdate: (field: string, value: string, row: any) => void;
}

export const getUserColumns = ({ roleSelect, genderSelect, departmentsSelect, onCellUpdate }: UserColumnsProps) => {

  const columns: ColumnDef<User>[] = [
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
      cell: ({ row }) => {
        return (
          <SelectCell row={row} defaultValue={row.original.role || ""} data={roleSelect} placeholder="Assign role" onChange={(value) => onCellUpdate("role", value, row)}/>
        )
      },
    },
    {
      accessorKey: "department",
      header: ({ column }) => {
        return (
          <SortableHeader column={column} field={"Department"}/>
        )
      },
      cell: ({ row }) => {
        return (
          <SelectCell row={row} defaultValue={row.original.department || ""} data={departmentsSelect} placeholder="Assign department" onChange={(value) => onCellUpdate("department", value, row)}/>
        )
      },
    },

    {
      accessorKey: "fullName",
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
          <SelectCell row={row} defaultValue={row.original.gender || ""} data={genderSelect} placeholder="Assign gender" onChange={(value) => onCellUpdate("gender", value, row)}/>
        // <Badge variant="outline" className="text-muted-foreground px-1.5">
        //   {row.original.gender === "Male" ? (
        //     <IconCircleFilled className="fill-blue-700 dark:fill-blue-600" />
        //   ) : (row.original.gender === "Female" ? (
        //     <IconCircleFilled className="fill-pink-600 dark:fill-pink-500" />
        //   ) : 
        //    <IconCircleFilled className="fill-yellow-400 dark:fill-yellow-400" />
        //     )}
        //   {row.original.gender}
        // </Badge>
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
  return columns;
}
