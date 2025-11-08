import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/routes";
import { Link } from "react-router-dom";


export const AppSidebar = () =>  {

  const user = useAuth()

  const allowedLinks = routes.filter(r => r.roles.includes(user.role)) ;

  return (
    <Sidebar variant="sidebar" >
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroupLabel className="text-xl">WMS</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {allowedLinks.map((r) => (
              <SidebarMenuItem key={r.path}>
                <SidebarMenuButton asChild>
                  <Link to={r.path} className="text-lg">
                    {r.path.replace("/", "") || "Home"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
