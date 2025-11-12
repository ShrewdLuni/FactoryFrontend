import { type JSX } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

interface SidebarSingleItemProps {
  name: string,
  path: string,
  element: JSX.Element;
  roles: string[];
}

export const SidebarSingleItem = ({name, path, element, roles}: SidebarSingleItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={path}>
          <span>{name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
