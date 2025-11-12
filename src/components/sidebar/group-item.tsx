import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar"
import { ChevronDown, ChevronRight, ChevronRightSquare, ChevronUp } from "lucide-react"
import { useState } from "react"

interface SidebarGroupItemProps {
  group: string,
  items: any[] 
}

export const SidebarGroupItem = ({group, items} : SidebarGroupItemProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible asChild defaultOpen open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild> 
          <SidebarMenuButton className="flex justify-between">
            {group}
            {isOpen ? <ChevronDown/> : <ChevronRight/>} 
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => {
              return (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>
                    <a href={item.path}>
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
