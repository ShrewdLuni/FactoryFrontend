import type { LucideIcon } from "lucide-react";

export interface SelectOption<TValue = string> {
  id: number;
  label: string;
  value: TValue;
  icon: LucideIcon;
}
