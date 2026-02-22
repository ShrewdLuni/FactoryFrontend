"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "../data-table/sortable-header";
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
      const { data: product, isLoading } = useGetProduct(row.original.productId)

      return <div>{isLoading ? "Loading" : product ? product.name : "Not found"}</div>
    },
  },
  {
    accessorKey: "masters.knitting",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Knitting"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.knitting ?? 0)

      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>
    },
  },
  {
    accessorKey: "masters.sewing",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Sewing"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.sewing ?? 0)
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>
    },
  },
  {
    accessorKey: "masters.molding",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Molding"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.molding ?? 0)
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>
    },
  },
  {
    accessorKey: "masters.labeling",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Labeling"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.labeling ?? 0)
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>
    },
  },
  {
    accessorKey: "masters.packaging",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Packaging"} />;
    },
    cell: ({ row }) => {
      const { data: user, isLoading } = useGetUser(row.original.masters.packaging ?? 0)
      return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>
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
              <DropdownMenuItem disabled={true} variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
