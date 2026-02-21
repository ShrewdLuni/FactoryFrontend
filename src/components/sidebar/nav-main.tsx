import { SidebarMenu } from "@/components/ui/sidebar";
import { sidebarElements } from "@/routes";
import { SidebarGroupItem } from "./group-item";
import { SidebarSingleItem } from "./single-item";
import { useAuth } from "@/AuthProvider";
import { useLocation } from "react-router-dom";

export function NavMain() {
  const { user } = useAuth()

  const allowedSidebar = sidebarElements.flatMap(element => {
    if ("group" in element) {
      const allowedItems = element.items.filter(item => item.roles.includes(user!.role || ""))
      if (allowedItems.length === 0) 
        return []
      if (allowedItems.length === 1)
        return allowedItems[0]
      return {
        ...element,
        items: allowedItems
      }
    }
    if (element.roles.includes(user!.role || "")) {
      return element
    }
    return []
  })

  const location = useLocation()

  return (
    <SidebarMenu>
      {allowedSidebar.map((element, _) => 
        ("group" in element) ? (
          <SidebarGroupItem key={element.group} {...element}/>
        ) : (
          <SidebarSingleItem key={element.path} {...element} location={location.pathname}/>
        )
      )}
    </SidebarMenu>
  )
}
