import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"

interface SortableHeaderProps {
  column: Column<any, any> 
  field: string
}

export const SortableHeader = ({column, field}: SortableHeaderProps) => {
  console.log(column.getIsSorted(), field)

  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {field} 
      {column.getIsSorted() === false ? <></> : column.getIsSorted() == "asc" ? <ArrowUpAZ/> : <ArrowDownAZ/>} 
    </Button>
  )
}
