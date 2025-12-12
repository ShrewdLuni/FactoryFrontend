import { type JSX } from "react";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar"
import { Link } from "react-router-dom";

interface SidebarSingleItemProps {
  name: string;
  path: string;
  element: JSX.Element;
  roles: string[];
  icon: any;
  isSub?: boolean;
}

export const SidebarSingleItem = ({name, path, element, roles, icon: Icon, isSub = false}: SidebarSingleItemProps) => {
  const Wrapper = isSub ? SidebarMenuSubItem : SidebarMenuItem
  const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton 

  console.log(element, roles)

  return (
    <Wrapper>
      <Button asChild>
        <div className={"flex flex-row gap-4 " + isSub ? "text-lg" : "texl-xl"}>
          {Icon && <Icon/>}
          <Link to={path} className="text-lg">
            <span>{name}</span>
          </Link>
        </div>
      </Button>
    </Wrapper>
  )
}
