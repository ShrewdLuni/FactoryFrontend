import { useMemo } from "react";
import { HardHat, UserCog, type LucideIcon } from "lucide-react";
import type { SelectOption } from "./types";
import { useGetAllRoles } from "@/api/generated/role/role";

const ROLE_ICONS: Record<number, LucideIcon> = {
  1: HardHat,
  2: UserCog,
};

const DEFAULT_ROLE_ICON = UserCog;

export function useRoleOptions() {
  const { data, ...rest } = useGetAllRoles();

  const options = useMemo<SelectOption[]>(
    () =>
      (data ?? [])
        .filter((r) => r.isActive)
        .map((r) => ({
          id: r.id,
          label: r.label,
          value: String(r.id),
          icon: ROLE_ICONS[r.id] ?? DEFAULT_ROLE_ICON,
        })),
    [data],
  );

  return { data: options, ...rest };
}
