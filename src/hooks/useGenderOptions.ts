import { Mars, Venus, CircleSmall, type LucideIcon } from "lucide-react";
import type { UserGender } from "@/types/users";
import type { SelectOption } from "./types";

const GENDER_ICONS = {
  Male: Mars,
  Female: Venus,
  Other: CircleSmall,
} satisfies Record<UserGender, LucideIcon>;

const GENDER_OPTIONS: SelectOption<UserGender>[] = (
  Object.keys(GENDER_ICONS) as UserGender[]
).map((g) => ({
  id: 0,
  label: g,
  value: g,
  icon: GENDER_ICONS[g],
}));

export function useGenderOptions() {
  return { data: GENDER_OPTIONS };
}
