import { useMemo } from "react";
import { Scissors, Spool, Cone, Layers, Tag, ArchiveIcon, type LucideIcon } from "lucide-react";
import { useGetAllDepartments } from "@/api/generated/department/department";
import type { SelectOption } from "./types";

const DEPARTMENT_ICONS: Record<number, LucideIcon> = {
  1: Scissors,
  2: Spool,
  3: Cone,
  4: Layers,
  5: Tag,
  6: ArchiveIcon,
};
const DEFAULT_DEPARTMENT_ICON = Layers;

export function useDepartmentOptions() {
  const { data, ...rest } = useGetAllDepartments();

  const options = useMemo<SelectOption[]>(
    () =>
      (data ?? []).map((d) => ({
        id: d.id,
        label: d.label,
        value: String(d.id),
        icon: DEPARTMENT_ICONS[d.id] ?? DEFAULT_DEPARTMENT_ICON,
      })),
    [data],
  );

  return { data: options, ...rest };
}
