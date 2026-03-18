"use client";

import { SortableHeader } from "../data-table/sortable-header";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import type { Batch } from "@/types/batches";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { createColumn, createIdColumn, createSelectColumn } from "../data-table/common-columns";
import { formatDate } from "date-fns";
import { useGetUser } from "@/hooks/useUsers";
import { useGetProduct } from "@/hooks/useProducts";
import { InputCell } from "../data-table/input-cell";
import { SelectCell } from "../data-table/select-cell";
import type { Product } from "@/types/products";
import type { User, UserDepartment } from "@/types/users";
import type { Workstation } from "@/types/workstation";
import { useDeleteBatch } from "@/hooks/useBatch";

export const columns: ColumnDef<Batch>[] = [
  createSelectColumn<Batch>(),
  createIdColumn<Batch>(),
  createColumn<Batch>("name", "Name"),
  createColumn<Batch>("progressStatus", "Status"),
  createColumn<Batch>("size", "Batch size"),
  {
    accessorKey: "productId",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Product"} />;
    },
    cell: ({ row }) => {
      const { data: product, isLoading } = useGetProduct(row.original.productId || 0);

      return <div>{isLoading ? "Loading" : product ? product.name : "Not found"}</div>;
    },
  },
  {
    accessorKey: "masters.knitting",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Knitting"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.knitting ?? 0);

      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
    },
  },
  {
    accessorKey: "masters.sewing",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Sewing"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.sewing ?? 0);
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
    },
  },
  {
    accessorKey: "masters.molding",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Molding"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.molding ?? 0);
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
    },
  },
  {
    accessorKey: "masters.labeling",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Labeling"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.labeling ?? 0);
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
    },
  },
  {
    accessorKey: "masters.packaging",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Packaging"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.packaging ?? 0);
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
    },
  },
  {
    accessorKey: "plannedFor",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Planned for"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Last updated"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
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
                <span className="sr-only">Open menu {row.original.name}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled={true}>Link to QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>See QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
              <DropdownMenuItem disabled={true} variant="destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export type updateFunction = (field: keyof Batch | keyof Batch["masters"], value: any, row: Row<Batch>) => void;

function createSizeColumn(handleCellUpdate: updateFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Batch size"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.size}
          onBlur={(e) => {
            e.preventDefault();
            handleCellUpdate("size", Number(e.target.value), row);
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.size}`}</div>
      );
    },
  };
}

function createNameColumn(handleCellUpdate: updateFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Name"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.name}
          onBlur={(e) => {
            e.preventDefault();
            handleCellUpdate("name", e.target.value, row);
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  };
}

function createWorkstationColumn(handleCellUpdate: updateFunction, isChangable: boolean, workstations: Workstation[]): ColumnDef<Batch> {
  return {
    accessorKey: "workstationId",
    header: ({ column }) => <SortableHeader column={column} field={"workstations"} />,
    cell: ({ row }) => {
      const selectedWorkstation = workstations?.find((w) => w.id === row.original.workstationId);
      const workstationData = workstations.map((product) => {
        return {
          label: product.name,
          value: String(product.id),
        };
      });

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={selectedWorkstation !== undefined ? String(selectedWorkstation.id) : "Select product"}
          data={workstationData ? workstationData : []}
          placeholder="Select workstation"
          onChange={(value) => {
            handleCellUpdate("workstationId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${selectedWorkstation?.name}`}</div>
      );
    },
  };
}



function createProductColumn(handleCellUpdate: updateFunction, isChangable: boolean, products: Product[]): ColumnDef<Batch> {
  return {
    accessorKey: "productId",
    header: ({ column }) => <SortableHeader column={column} field={"Product"} />,
    cell: ({ row }) => {
      const selectedProduct = products?.find((p) => p.id === row.original.productId);
      const productsData = products?.filter((product) => product.isActive).map((product) => {
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
            handleCellUpdate("productId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${selectedProduct?.name}`}</div>
      );
    },
  };
}

function createMasterColumn(
  handleCellUpdate: updateFunction,
  isChangable: boolean,
  users: User[],
  department: UserDepartment,
): ColumnDef<Batch> {
  return {
    accessorKey: `masters.${department}`,
    header: ({ column }) => <SortableHeader column={column} field={department} />,
    cell: ({ row }) => {
      const usersData =
        users
          ?.filter((user) => user.departments?.includes(department))
          .map((user) => ({
            label: user.fullName,
            value: String(user.id),
          })) ?? [];

      const departmentKey = department.toLowerCase() as keyof Batch["masters"];

      const selectedMasterId = row.original.masters?.[departmentKey];

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={String(selectedMasterId)}
          data={usersData}
          placeholder="Select master"
          onChange={(value) => handleCellUpdate(departmentKey, Number(value), row)}
        />
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  };
}

export const getBatchColumns = (onChange: updateFunction, products: Product[], users: User[], workstations: Workstation[]) => {
  const { mutate: delteBatch } = useDeleteBatch()
  const departments: UserDepartment[] = ["Knitting", "Sewing", "Turning", "Molding", "Labeling", "Packaging"];

  const columns: ColumnDef<Batch>[] = [];


  columns.push(createSelectColumn<Batch>());
  columns.push(createIdColumn<Batch>());
  columns.push(createColumn<Batch>("progressStatus", "Status"));
  columns.push(createSizeColumn(onChange, true));
  columns.push(createColumn<Batch>("actualSize", "Actual size"));
  columns.push(createNameColumn(onChange, true));
  columns.push(createWorkstationColumn(onChange, true, workstations));
  columns.push(createProductColumn(onChange, true, products));
  for (const department of departments) columns.push(createMasterColumn(onChange, true, users, department));
  columns.push({
    accessorKey: "plannedFor",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Planned for"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
    },
  });
  columns.push({
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Last updated"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
    },
  });
  columns.push({
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu {row.original.name}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled={true}>Link to QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>See QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
              <DropdownMenuItem disabled={false} onClick={() => delteBatch(row.original.id)} variant="destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  });

  return columns;
};
