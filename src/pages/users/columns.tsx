import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/data-table/sortable-header";
import type { User } from "@/types/users";
import { SelectCell } from "@/components/data-table/select-cell";
import { formatDate } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { MultipleSelectCell } from "@/components/data-table/multiple-select-cell";

type SelectCellOptions = {
  label: string;
  value: string;
  icon?: any;
}[];

interface UserColumnsProps {
  roleSelect: SelectCellOptions;
  genderSelect: SelectCellOptions;
  departmentsSelect: SelectCellOptions;
  onCellUpdate: (field: string, value: any, row: any) => void;
}

export const getUserColumns = ({ roleSelect, genderSelect, departmentsSelect, onCellUpdate }: UserColumnsProps) => {
  const columns: ColumnDef<User>[] = [
    createSelectColumn<User>(),
    createIdColumn<User>(),
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Name"} />;
      },
      cell: ({ row }) => {
        return <div className="text-left">{row.original.fullName}</div>;
      },
    },
    {
      id: "role",
      accessorFn: (row) => row.role?.label ?? "",
      header: ({ column }) => <SortableHeader column={column} field="Role" />,
      cell: ({ row }) => (
        <SelectCell
          row={row}
          defaultValue={row.original.role?.label || ""}
          data={roleSelect}
          placeholder="Assign role"
          onChange={(value) => onCellUpdate("role", value, row)}
        />
      ),
    },
    {
      id: "departments",
      accessorFn: (row) => row.departments?.map((d) => d.label) ?? [],
      filterFn: (row, columnId, selectedValues: string[]) => {
        const rowDepts = row.getValue<string[]>(columnId);
        return selectedValues.some((v) => rowDepts.includes(v));
      },
      header: ({ column }) => <SortableHeader column={column} field="Departments" />,
      cell: ({ row }) => (
        <MultipleSelectCell
          row={row}
          defaultValue={row.original.departments?.map((d) => d.label) ?? []}
          data={departmentsSelect}
          onChange={(value) => onCellUpdate("departments", value, row)}
        />
      ),
    },    
    createColumn<User>("email", "Email"),
    createColumn<User>("phone", "Phone"),
    {
      accessorKey: "gender",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Gender"} />;
      },
      cell: ({ row }) => (
        <SelectCell
          row={row}
          defaultValue={row.original.gender || ""}
          data={genderSelect}
          placeholder="Assign gender"
          onChange={(value) => onCellUpdate("gender", value, row)}
        />
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Date Of Birth"} />;
      },
      cell: ({ row }) => {
        return <div className="text-center">{formatDate(row.original.dateOfBirth || 0, "dd/MM/yyyy")}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">{row.original.id}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled={true}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
