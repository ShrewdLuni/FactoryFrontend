import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main";


export const AppSidebar = () =>  {

  return (
    <Sidebar variant="sidebar" >
      <SidebarHeader>
        Test
      </SidebarHeader>
      <SidebarContent>
        <NavMain/>
      </SidebarContent>
      <SidebarFooter/> 
      <SidebarRail/>
    </Sidebar>
  )
}
