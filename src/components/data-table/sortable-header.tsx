import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

interface SortableHeaderProps {
  column: Column<any, any> 
  field: string
}

export const SortableHeader = ({column, field}: SortableHeaderProps) => {

  return (
    <Button className="w-full" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {field} 
      {column.getIsSorted() === false ? <ChevronsUpDown/> : column.getIsSorted() == "asc" ? <ArrowUp/> : <ArrowDown/>} 
    </Button>
  )
}
