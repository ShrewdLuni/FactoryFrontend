import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarSingleItemProps {
  name: string;
  path: string;
  icon: any;
  isSub?: boolean;
  location: string;
}

export const SidebarSingleItem = ({ name, path, icon: Icon, isSub = false, location }: SidebarSingleItemProps) => {
  const Wrapper = isSub ? SidebarMenuSubItem : SidebarMenuItem;
  const Button = isSub ? SidebarMenuSubButton : SidebarMenuButton;

  return (
    <Wrapper>
      <Button asChild>
        <Link to={path} className={cn("flex items-center gap-2 text-sm py-2!", location === path && "hover:bg-white hover:text-black! bg-white text-black !rounded-md font-semibold", isSub ? "text-sm" : "text-sm")}>
          {Icon && <Icon />}
          <span>{name}</span>
        </Link>
      </Button>
    </Wrapper>
  );
};
