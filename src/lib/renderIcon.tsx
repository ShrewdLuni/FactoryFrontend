import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function renderIcon(icon: LucideIcon | ReactNode) {
  if (!icon) return null;
  
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)) {
    const Icon = icon as LucideIcon;
    return <Icon className="h-4 w-4 shrink-0" />;
  }
  return icon as ReactNode;
}


