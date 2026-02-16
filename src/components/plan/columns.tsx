"use client"

import { type ColumnDef, type Row } from "@tanstack/react-table"
import { SortableHeader } from "../data-table/sortable-header"
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { InputCell } from "../data-table/input-cell";
import { SelectCell } from "../data-table/select-cell";
import type { User, UserDepartment } from "@/types/users";
import type { Batch } from "@/types/batches";
import type { Product } from "@/types/products";
import type { Workstation } from "@/types/workstation";

export type updateFunction = (field: keyof Batch | keyof Batch["masters"], value: any, row: Row<Batch>) => void

function createSelectColumn<T>(): ColumnDef<T> {
  return {
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
  };
}

function createIdColumn<T extends { id: number }>(): ColumnDef<T> {
  return {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column} field={"ID"} />
  };
}

function createSizeColumn(handleCellUpdate: updateFunction): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Batch size"} />,
    cell: ({ row }) => <InputCell defaultValue={row.original.size} onBlur={(e) => {e.preventDefault(); handleCellUpdate("size", Number(e.target.value), row)}}/>
  };
}

function createProductColumn(handleCellUpdate: updateFunction, products: Product[]): ColumnDef<Batch> {
  return {
    accessorKey: "productId",
    header: ({ column }) => <SortableHeader column={column} field={"Product"} />,
    cell: ({ row }) => {
      const productsData = products?.map((product) => {
        return {
          label: product.name,
          value: String(product.id),
        }
      })

      const selectedProduct = products?.find(p => p.id == row.original.productId)

      return (<SelectCell 
        row={row} 
        defaultValue={selectedProduct !== undefined ? String(selectedProduct.id) :  "Select product"} 
        data={productsData ? productsData : []}
        placeholder="Select product"
        onChange={(value) => {handleCellUpdate("productId", Number(value), row)}}
      />)
    }
  };
}

function createMasterColumn(department: UserDepartment, handleCellUpdate: updateFunction, users: User[]): ColumnDef<Batch> {
  return {
    accessorKey: "masterId",
    header: ({ column }) => (<SortableHeader column={column} field="Master name"/>),
    cell: ({ row }) => {
      const usersData = users?.filter(user => user.department === department).map(user => ({
        label: user.fullName,
        value: String(user.id),
      })) ?? []

      const departmentKey = department.toLowerCase() as keyof Batch["masters"]

      const selectedMasterId = row.original.masters?.[departmentKey]

      return (
        <SelectCell
          row={row}
          defaultValue={selectedMasterId ? String(selectedMasterId) : "Select master"}
          data={usersData}
          placeholder="Select master"
          onChange={(value) => handleCellUpdate(departmentKey, Number(value), row)}
        />
      )
    }
  }
}

function createActionsColumn<T extends { id: number }>(): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id.toString())}>
              Generate QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

export const getStageColumns = (department: UserDepartment, handleCellUpdate: updateFunction, products: Product[], users: User[], workstations: Workstation[]) => {
  const columns: ColumnDef<Batch>[] = [];
  columns.push(createSelectColumn<Batch>());
  columns.push(createIdColumn<Batch>());
  if(department == "Knitting") {
    columns.push({
      accessorKey: "workstationId",
      header: ({ column }) => <SortableHeader column={column} field={"Workstation"} />,
      cell: ({ row }) => {
        const selectedWorkstation = workstations?.find(p => p.id == row.original.workstationId)
        return (<div>{selectedWorkstation ? selectedWorkstation.name : row.original.workstationId}</div>)
      }
    })
  }
  columns.push(createSizeColumn(handleCellUpdate))
  if (department === "Knitting") {
    columns.push(createProductColumn(handleCellUpdate, products))
  } else {
    columns.push({
      accessorKey: "productId",
      header: ({ column }) => <SortableHeader column={column} field={"Product"} />,
      cell: ({ row }) => {

        const selectedProduct = products?.find(p => p.id == row.original.productId)

        return (<div>{selectedProduct ? selectedProduct.name : row.original.productId}</div>)
      }
  })}
  columns.push(createMasterColumn(department, handleCellUpdate, users))
  columns.push(createActionsColumn<Batch>())
  return columns;
}
