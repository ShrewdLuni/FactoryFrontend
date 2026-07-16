import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/data-table/sortable-header";
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
import type { SelectOption } from "@/hooks/types";
import type { User, UserPatch } from "@/api/generated/models";

interface UserColumnsProps {
  roleSelect: SelectOption[];
  genderSelect: SelectOption[];
  departmentsSelect: SelectOption[];
  handlePatch: (id: number, data: UserPatch) => void;
  handleDelete: (id: number) => void;
  openEditDialog: (data: User) => void;
}

export const getUserColumns = ({ roleSelect, genderSelect, departmentsSelect, handlePatch, handleDelete, openEditDialog }: UserColumnsProps) => {
  const columns: ColumnDef<User>[] = [
    createSelectColumn<User>(),
    createIdColumn<User>(),
    {
      accessorKey: "fullName",
      header: ({ column }) => { return <SortableHeader column={column} field={"ПІБ"} />},
      cell: ({ row }) => { return <div className="text-left">{row.original.fullName}</div>},
    },
    {
      id: "role",
      accessorFn: (row) => String(row.role?.id) ?? "",
      header: ({ column }) => <SortableHeader column={column} field="Роль" />,
      cell: ({ row }) => (
        <SelectCell
          defaultValue={String(row.original.role?.id)}
          data={roleSelect}
          placeholder="Призначити роль"
          onChange={(data) =>  { handlePatch(row.original.id, { role: { id: Number(data) }}) }}
        />
      ),
    },
    {
      id: "departments",
      accessorFn: (row) => row.departments?.map((d) => String(d.id)) ?? [],
      filterFn: (row, columnId, selectedValues: string[]) => {
        const rowDepts = row.getValue<string[]>(columnId);
        return selectedValues.some((v) => rowDepts.includes(v));
      },
      header: ({ column }) => <SortableHeader column={column} field="Відділи" />,
      cell: ({ row }) => (
        <MultipleSelectCell
          row={row}
          defaultValue={row.original.departments?.map((d) => String(d.id)) ?? []}
          data={departmentsSelect}
          onChange={(value) => handlePatch(row.original.id, { departmentIds: value.map(Number) })}
        />
      ),
    },
    createColumn<User>("email", "Електронна пошта"),
    createColumn<User>("phone", "Телефон"),
    {
      accessorKey: "gender",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Стать"} />;
      },
      cell: ({ row }) => (
        <SelectCell
          // row={row}
          defaultValue={row.original.gender || ""}
          data={genderSelect}
          placeholder="Призначити стать"
          onChange={(data) =>  { console.log(data); handlePatch(row.original.id, { gender: data }) }}
        />
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Дата народження"} />;
      },
      cell: ({ row }) => {
        return <div className="text-center">{formatDate(row.original.dateOfBirth || 0, "dd/MM/yyyy")}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2 text-end">
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
              onClick={() => handleDelete(row.original.id)}>
              <span className="sr-only">Видалити</span>
              <Trash />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Дії</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
                  <SquarePen />
                  <p className="">Редагувати</p>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
                  <Trash className="text-red-500"/>
                  <p className="text-red-500">Видалити</p>
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
