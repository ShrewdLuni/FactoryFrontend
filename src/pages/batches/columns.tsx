"use client";

import { SortableHeader } from "@/components/data-table/sortable-header";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { InputCell } from "@/components/data-table/input-cell";
import { SelectCell } from "@/components/data-table/select-cell";
import type { Batch, BatchInsert, BatchStatus, Department, Product, User, Workstation } from "@/api/generated/models";

// export type UpdateFunction = (field: keyof BatchInsert, value: any, row: Row<Batch>) => void;
export type UpdateFunction = any;


function createNameColumn(handleCellUpdate: UpdateFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.name || undefined}
          onBlur={(e) => {
            e.preventDefault();
            // handleCellUpdate("name", e.target.value, row);
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  };
}

function createWorkstationColumn(handleCellUpdate: UpdateFunction, isChangable: boolean, workstations: Workstation[]): ColumnDef<Batch> {
  return {
    accessorKey: "workstationId",
    header: ({ column }) => <SortableHeader column={column} field={"Машина"} />,
    cell: ({ row }) => {
      const selectedWorkstation = workstations?.find((w) => w.id === row.original.workstation.id);
      const workstationData = workstations.map((workstation) => {
        return {
          label: workstation.name,
          value: String(workstation.id),
        };
      });

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={selectedWorkstation !== undefined ? String(selectedWorkstation.id) : "Select product"}
          data={workstationData ? workstationData : []}
          placeholder="Select workstation"
          onChange={(value) => {
            // handleCellUpdate("workstationId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${row.original.workstation.name}`}</div>
      );
    },
  };
}

function createProductColumn(handleCellUpdate: UpdateFunction, isChangable: boolean, products: Product[]): ColumnDef<Batch> {
  return {
    accessorKey: "productId",
    header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
    cell: ({ row }) => {
      const selectedProduct = products?.find((p) => p.id === row.original.product.id);
      const productsData = products
        ?.filter((product) => product.isActive)
        .map((product) => {
          return {
            label: product.name,
            value: String(product.id),
          };
        });

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={selectedProduct !== undefined ? String(selectedProduct.id) : "Select product"}
          data={productsData ? productsData : []}
          placeholder="Select product"
          onChange={(value) => {
            // handleCellUpdate("productId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${selectedProduct?.name}`}</div>
      );
    },
  };
}

function createWorkerColumn(handleCellUpdate: UpdateFunction, users: User[], department: Department): ColumnDef<Batch> {
  return {
    accessorKey: `${department.label}`,
    header: ({ column }) => <SortableHeader column={column} field={department.label} />,
    cell: ({ row }) => {
      const entry = row.original.workers?.find((w) => w.department.id === department.id);

      const usersData = users
        .filter((u) => u.role?.label === "Admin" || u.departments?.some((d) => d.id === department.id))
        .map((u) => ({ label: u.fullName ?? "", value: String(u.id) }));

      return (
        <SelectCell
          row={row}
          defaultValue={entry ? String(entry.worker.id) : ""}
          data={usersData}
          placeholder="Select worker"
          // onChange={(value) => handleCellUpdate("workers", { departmentId: department.id, workerId: Number(value) }, row)}
        />
      );
    },
  };
}

function createActualSizeColumn(handleCellUpdate: UpdateFunction): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Розмір партії"} />,
    cell: ({ row }) => (
      <InputCell
        defaultValue={String(row.original.size)}
        onBlur={(e) => {
          e.preventDefault();
          // handleCellUpdate("size", Number(e.target.value), row);
        }}
      />
    ),
  };
}

function createStatusColumn(handleCellUpdate: UpdateFunction, statuses: BatchStatus[]): ColumnDef<Batch> {
  return {
    id: "status",
    accessorFn: (row) => row.status?.label ?? "",
    header: ({ column }) => <SortableHeader column={column} field="Статус" />,
    cell: ({ row }) => {
      const statusData = statuses.map((s) => ({
        label: s.label,
        value: String(s.id),
      }));

      return (
        <SelectCell
          row={row}
          defaultValue={String(row.original.status?.id ?? "")}
          data={statusData}
          placeholder="Select status"
          onChange={(value) => {
            // handleCellUpdate("statusId", Number(value), row);
          }}
        />
      );
    },
  };
}

export const getBatchColumns = (
  onChange: UpdateFunction,
  products: Product[],
  users: User[],
  workstations: Workstation[],
  departments: Department[],
  statuses: BatchStatus[],
): ColumnDef<Batch>[] => {
  const columns: ColumnDef<Batch>[] = [
    createSelectColumn<Batch>(),
    createIdColumn<Batch>(),
    createStatusColumn(onChange, statuses),
    createActualSizeColumn(onChange),
    createNameColumn(onChange, true),
    createWorkstationColumn(onChange, true, workstations),
    createProductColumn(onChange, true, products),
    ...departments.map((dept) => createWorkerColumn(onChange, users, dept)),
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>Link to QR</DropdownMenuItem>
              <DropdownMenuItem disabled>See QR</DropdownMenuItem>
              <DropdownMenuItem disabled>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => console.log("deleteBatch(row.original.id)")}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return columns;
};
