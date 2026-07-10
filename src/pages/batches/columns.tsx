"use client";

import { SortableHeader } from "@/components/data-table/sortable-header";
import { type ColumnDef, type FilterFn } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { createSelectColumn } from "@/components/data-table/common-columns";
import { InputCell } from "@/components/data-table/input-cell";
import type { Batch, BatchPatch, Department, Product, Workstation } from "@/api/generated/models";
import { SelectCellSearch } from "@/components/data-table/select-cell-search";
import { rankItem } from "@tanstack/match-sorter-utils";
import type { DateRange } from "react-day-picker";

type patchFunction = (id: number, data: BatchPatch) => void;
type deleteFunction = (id: number) => void;

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

      isChangable = row.original.status.id === 1;
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
          <div>{`${row.original.workstation.name ?? row.original.workstation.id}`}</div>
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
    accessorKey: "product",
    accessorFn: (row) => String(row.product.id),
    header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
    cell: ({ row }) => {
      const selectedProduct = products?.find((p) => p.id === row.original.product.id);
      isChangable = row.original.status.id === 1;
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
          <div>{`${row.original.product.name ?? row.original.product.id}`}</div>
      )
    },
    filterFn: (row, columnId, selectedValues: string[]) => selectedValues.includes(row.getValue(columnId)),
  };
}


const fuzzyFilter: FilterFn<Batch> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

function createSearchColumn(): ColumnDef<Batch> {
  return {
    id: "search",
    accessorFn: (row) => {
      // const actorNames = row.transitions.map((t) => t.actor.fullName).join(" ");
      return [String(row.id), row.name ?? "", row.product.name ?? ""].join(" ");
    },
    header: () => null,
    cell: () => (<div></div>),
    enableHiding: false,
    filterFn: fuzzyFilter,
  };
}

// function createWorkerColumn(handleCellUpdate: patchFunction, users: User[], department: Department, isChangable: boolean): ColumnDef<Batch> {
//   const usersData = users
//   .filter((u) => u.role?.label === "Admin" || u.departments?.some((d) => d.id === department.id))
//   .map((u) => ({ label: u.fullName ?? "", value: String(u.id) }));
//
//   return {
//     accessorKey: `${department.label}`,
//     header: ({ column }) => <SortableHeader column={column} field={department.label} />,
//     cell: ({ row }) => {
//       const entry = row.original.workers?.find((w) => w.department.id === department.id);
//
//
//       return isChangable ? (
//         // <div className="flex flex-col justify-center gap-2">
//         //   <p className="font-semibold">Кобля Альона Станіславівна</p>
//         //   <p className="font-semibold">Фактичний розмір: 120</p>
//         //   <p className="font-semibold">Час: 03:12</p>
//         //   <p className="font-semibold">Дата: 22.08.2027</p>
//         // </div>
//         <SelectCell
//           row={row}
//           defaultValue={entry ? String(entry.worker.id) : ""}batcol
//           data={usersData}
//           placeholder="Select worker"
//           // onChange={(value) => handleCellUpdate("workers", { departmentId: department.id, workerId: Number(value) }, row)}
//         />
//       ) : (
//         <div>{`${entry?.worker.fullName}`}</div>
//       );
//     },
//   };
// }

function createActualSizeColumn(patch: patchFunction, isChangable: boolean = false): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Розмір партії"} />,
    cell: ({ row }) => {
      isChangable = row.original.status.id === 1;
      return isChangable ? (
        <InputCell
          defaultValue={(row.original.size != null) ? String(row.original.size) : "Не встановлено"}
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

function createDateColumn(): ColumnDef<Batch> {
  return {
    id: "date",
    accessorFn: (row) => row.transitions.map((t) => t.occuredAt),
    header: () => null,
    cell: () => null,
    enableHiding: true,
    filterFn: (row, columnId, range: DateRange | undefined) => {
      const dates = row.getValue(columnId) as string[];
      return dates.some((d) => inRange(d, range));
    },
  };
}

// function createStatusColumn(patch: patchFunction, statuses: BatchStatus[], isChangable: boolean): ColumnDef<Batch> {
function createStatusColumn(): ColumnDef<Batch> {
  // const statusData = statuses.map((s) => ({ label: s.label, value: String(s.id) }));

  return {
    id: "status",
    accessorFn: (row) => String(row.status.id),
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
    filterFn: (row, columnId, selectedValues: string[]) => selectedValues.includes(row.getValue(columnId))
  };
}

function createActorColumn(): ColumnDef<Batch> {
  return {
    id: "actor",
    accessorFn: (row) => row.transitions.map((t) => String(t.actor.id)),
    header: () => null,
    cell: () => null,
    enableHiding: true,
    filterFn: (row, columnId, selectedValues: string[]) => {
      const actorIds = row.getValue(columnId) as string[];
      return actorIds.some((id) => selectedValues.includes(id));
    },
  };
}

function inRange(occuredAt: string, range: DateRange | undefined): boolean {
  if (!range?.from) return true;
  const from = new Date(range.from).setHours(0, 0, 0, 0);
  const to = range.to
    ? new Date(range.to).setHours(23, 59, 59, 999)
    : from + 86_399_999;
  const t = new Date(occuredAt).getTime();
  return t >= from && t <= to;
}

function statusBelongsToDepartment(status: { label: string; department: { id?: number | null } | null }, department: Department): boolean {
  return status.department?.id === department.id || status.label.startsWith(department.label);
}

function createMilestoneColumn(department: Department, showAll: boolean): ColumnDef<Batch> {
  return {
    id: `milestone-${department.id}`,
    accessorFn: (row) => {
      const transition = row.transitions.find(
        (t) => t.toStatus.isMilestone && t.toStatus.department?.id === department.id
      );
      return transition?.occuredAt ?? "";
    },
    header: ({ column }) => <SortableHeader column={column} field={department.label} />,
    cell: ({ row, table }) => {
      const actorFilter = table.getColumn("actor")?.getFilterValue() as string[] | undefined;
      const dateFilter = table.getColumn("date")?.getFilterValue() as DateRange | undefined;

      const candidates = row.original.transitions.filter((t) =>
        showAll
          ? statusBelongsToDepartment(
            t.toStatus as { label: string; department: { id?: number | null } | null },
            department
          )
          : t.toStatus.isMilestone &&
            t.toStatus.department?.id === department.id
      );

      const visible = candidates.filter(
        (t) =>
          (!actorFilter?.length || actorFilter.includes(String(t.actor.id))) &&
          inRange(t.occuredAt, dateFilter)
      );

      if (visible.length === 0) {
        return <div className="text-center text-muted-foreground">—</div>;
      }

      return (
        <>
          {visible.map((transition) => (
            <div key={transition.id} className="flex flex-col items-center text-sm border-b last:border-b-0 py-1">
              <span className="font-medium">{transition.actor.fullName}</span>
              <span className="text-xs text-muted-foreground">{transition.toStatus.label}</span>
              <span className="font-medium">Кількість: {transition.batch.size}</span>
              {transition.defects.map((d) => (
                <span key={d.id} className="font-medium">Defect {d.defectType.id}{d.quantity}</span>
              ))}
              {transition.defects.length === 0 && <span className="font-medium">No def</span>}
              <span className="text-muted-foreground">
                {/* {new Date(transition.occuredAt).toLocaleDateString("uk-UA")} */}
                {new Date(transition.occuredAt).toLocaleString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </>
      );
    },
  };
}
export const getBatchColumns = (
  products: Product[],
  // users: User[],
  workstations: Workstation[],
  departments: Department[],
  // statuses: BatchStatus[],
  handlePatch: patchFunction,
  handleDelete: deleteFunction,
  showAllTransitions: boolean,
): ColumnDef<Batch>[] => {

  // const isChangable: boolean = false;

  const columns: ColumnDef<Batch>[] = [
    createSelectColumn<Batch>(),
    {
      accessorKey: "id",
      accessorFn: (data) => data.id,
      header: ({ column }) => { return <SortableHeader column={column} field={"ID"} />; },
      cell: ({ row }) => { return <div className="text-center">{`${row.original.id || 0}`.padStart(5, "0")}</div>; },
    },
    // createStatusColumn(handlePatch, statuses, isChangable),
    createStatusColumn(),
    createActualSizeColumn(handlePatch, true),
    createNameColumn(handlePatch, false),
    createWorkstationColumn(handlePatch, workstations, true),
    createProductColumn(handlePatch, products, true),
    createSearchColumn(),
    createActorColumn(),
    createDateColumn(),
    // ...departments.map((dept) => createMilestoneColumn(dept)),
    ...departments.map((dept) => createMilestoneColumn(dept, showAllTransitions)),
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
                {/* <DropdownMenuItem onClick={() => openEditDialog(row.original)}> */}
                <DropdownMenuItem onClick={console.log}>
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
