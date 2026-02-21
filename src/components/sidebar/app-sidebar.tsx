import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main";
import { NavFooter } from "./nav-footer";


export const AppSidebar = () =>  {

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="mb-4 pl-2">
        <span className="text-4xl font-bold">
          WMS 
        </span>
      </SidebarHeader>
      <SidebarContent className="w-[90%] px-2">
        <NavMain/>
      </SidebarContent>
      <SidebarFooter className="border-t-2 pb-4"> 
        <NavFooter/>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
