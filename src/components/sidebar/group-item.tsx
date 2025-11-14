import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { SidebarSingleItem } from "./single-item";

interface SidebarGroupItemProps {
  group: string;
  items: any[];
  icon: any;
}

export const SidebarGroupItem = ({
  group,
  items,
  icon: Icon,
}: SidebarGroupItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex justify-between">
            <div className="flex flex-row gap-2 text-xl">
              {Icon && <Icon />}
              <span>{group}</span>
            </div>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarSingleItem
                name={item.name}
                path={item.path}
                element={item.element}
                roles={item.roles}
                icon={item.icon}
                isSub={true}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
