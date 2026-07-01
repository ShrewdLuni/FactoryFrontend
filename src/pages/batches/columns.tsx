"use client";

import { SortableHeader } from "@/components/data-table/sortable-header";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { InputCell } from "@/components/data-table/input-cell";
import { SelectCell } from "@/components/data-table/select-cell";
import type { Batch, BatchPatch, BatchStatus, Department, Product, User, Workstation } from "@/api/generated/models";
import { SelectCellSearch } from "@/components/data-table/select-cell-search";

type patchFunction = (id: number, data: BatchPatch) => void;

function createNameColumn(patch: patchFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Назва"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.name || undefined}
          onBlur={(e) => {
            e.preventDefault();
            patch(row.original.id, { name: String(e.target.value) });
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  };
}

function createWorkstationColumn(patch: patchFunction, workstations: Workstation[], isChangable: boolean ): ColumnDef<Batch> {
  const workstationData = workstations.map((workstation) => {
    return {
      label: workstation.name,
      value: String(workstation.id),
    };
  });

  return {
    accessorKey: "workstation",
    accessorFn: (row) => (row.workstation.id || 0),
    header: ({ column }) => <SortableHeader column={column} field={"Машина"} />,
    cell: ({ row }) => {
      const selectedWorkstation = workstations?.find((w) => w.id === row.original.workstation.id);

      return isChangable ? (
        <div className="flex">
          <SelectCellSearch 
            data={workstationData} 
            defaultValue={selectedWorkstation && String(selectedWorkstation.id)}
            inputPlaceholder="Виберіть машину"
            onChange={(e) => {
              if (e == null) return
              patch(row.original.id, { workstation: { id: Number(e.value) }});
            }}/>
        </div>
      ) : (
          <div>{`${row.original.workstation.id}`}</div>
      )
    },
  };
}

function createProductColumn(patch: patchFunction, products: Product[], isChangable: boolean): ColumnDef<Batch> {
  const productsData = products
  ?.filter((product) => product.isActive)
  .map((product) => {
    return {
      label: product.name,
      value: String(product.id),
    };
  });

  return {
    accessorKey: "productId",
    header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
    cell: ({ row }) => {
      const selectedProduct = products?.find((p) => p.id === row.original.product.id);
      return isChangable ? (
        <div className="w-full flex min-w-20">
          <SelectCellSearch 
            data={productsData} 
            defaultValue={selectedProduct && String(selectedProduct.id)}
            inputPlaceholder="Виберіть продукт"
            onChange={(e) => {
              if (e == null) return
              patch(row.original.id, { product: { id: Number(e.value) } });
            }}/>
        </div>
      ) : (
          <div>{`${row.original.product.id}`}</div>
      )
    },
  };
}

function createWorkerColumn(handleCellUpdate: patchFunction, users: User[], department: Department, isChangable: boolean): ColumnDef<Batch> {
  const usersData = users
  .filter((u) => u.role?.label === "Admin" || u.departments?.some((d) => d.id === department.id))
  .map((u) => ({ label: u.fullName ?? "", value: String(u.id) }));

  return {
    accessorKey: `${department.label}`,
    header: ({ column }) => <SortableHeader column={column} field={department.label} />,
    cell: ({ row }) => {
      const entry = row.original.workers?.find((w) => w.department.id === department.id);


      return isChangable ? (
        // <div className="flex flex-col justify-center gap-2">
        //   <p className="font-semibold">Кобля Альона Станіславівна</p>
        //   <p className="font-semibold">Фактичний розмір: 120</p>
        //   <p className="font-semibold">Час: 03:12</p>
        //   <p className="font-semibold">Дата: 22.08.2027</p>
        // </div>
        <SelectCell
          row={row}
          defaultValue={entry ? String(entry.worker.id) : ""}
          data={usersData}
          placeholder="Select worker"
          // onChange={(value) => handleCellUpdate("workers", { departmentId: department.id, workerId: Number(value) }, row)}
        />
      ) : (
        <div>{`${entry?.worker.fullName}`}</div>
      );
    },
  };
}

function createActualSizeColumn(patch: patchFunction, isChangable: boolean = false): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Розмір партії"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={String(row.original.size)}
          onBlur={(e) => {
            e.preventDefault();
            patch(row.original.id, { size: Number(e.target.value)});
          }}/>
      ) : (
          <div className="text-center">
            {row.original.size}
          </div>
        )
    },
  };
}

function createStatusColumn(patch: patchFunction, statuses: BatchStatus[], isChangable: boolean): ColumnDef<Batch> {
  const statusData = statuses.map((s) => ({ label: s.label, value: String(s.id) }));

  return {
    id: "status",
    accessorFn: (row) => row.status.label || row.name || row.id,
    header: ({ column }) => <SortableHeader column={column} field="Статус" />,
    cell: ({ row }) => {
      return (<div>{row.original.status.label}</div>)
      // return false? (
      //   <SelectCell
      //     row={row}
      //     defaultValue={String(row.original.status?.id ?? "")}
      //     data={statusData}
      //     placeholder="Виберіть статус"
      //     onChange={(value) => {
      //       patch(row.original.id, { status: { id: Number(value) }});
      //     }}
      //   />
      // ) : (
      //     <div>
      //       {row.original.status.label ?? statuses.find(s => s.id === row.original.status.id)?.label ?? row.original.status.id}
      //     </div>
      //   )
    },
  };
}

export const getBatchColumns = (
  products: Product[],
  users: User[],
  workstations: Workstation[],
  departments: Department[],
  statuses: BatchStatus[],
  handlePatch: patchFunction,
): ColumnDef<Batch>[] => {

  const isChangable: boolean = false;

  const columns: ColumnDef<Batch>[] = [
    createSelectColumn<Batch>(),
    {
      accessorKey: "id",
      accessorFn: (data) => data.id,
      header: ({ column }) => { return <SortableHeader column={column} field={"ID"} />; },
      cell: ({ row }) => { return <div className="text-center">{`${row.original.id || 0}`.padStart(5, "0")}</div>; },
    },
    createStatusColumn(handlePatch, statuses, isChangable),
    createActualSizeColumn(handlePatch, true),
    createNameColumn(handlePatch, true),
    createWorkstationColumn(handlePatch, workstations, true),
    createProductColumn(handlePatch, products, true),
    // ...departments.map((dept) => createWorkerColumn(console.log, users, dept, false)),
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
                onClick={() => handleDelete(row.original.id)}
              >
                <span className="sr-only">Видалити</span>
                <Trash />
              </Button>
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
                  <Trash className="text-red-500" />
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
