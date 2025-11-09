import type { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "./app-sidebar"

interface LayoutProps {
  children: ReactNode,
}

export const Layout = ({ children } : LayoutProps) => {
  return (
    <SidebarProvider className="flex">
      <AppSidebar/>
      <main className="px-4 flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
