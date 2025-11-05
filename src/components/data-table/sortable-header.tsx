import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface SortableHeaderProps {
  column: Column<any, any> 
  field: string
}

export const SortableHeader = ({column, field}: SortableHeaderProps) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {field} 
    </Button>
  )
}
