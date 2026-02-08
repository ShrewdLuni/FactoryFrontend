import { DataTable } from "../data-table"
import { getProductColumns } from "./columns"
import { BatchForm } from "../forms/batch"
import { useProducts } from "@/hooks/useProducts"
import { CircleCheck, CircleX } from "lucide-react"

export const ProductsPage = () => {

  const { data: products, isLoading } = useProducts.getAll() 
  const { mutate: updateProduct } = useProducts.update()

  const handleCellUpdate = (field: string, value: string | boolean, row: any) => {
    updateProduct({
      id: row.original.id,
      data: {
        ...row.original,
        [field]: value,
      }
    })
  }

  if (isLoading) {
    <div>Loading...</div>
  }

  const isActiveFilter = {
    column: "isActive", 
    title: "Is active", 
    options: [
      {
        label: "Active",
        value: "true",
        icon: CircleCheck,
      },
      {
        label: "Inactive",
        value: "false",
        icon: CircleX,
      }
    ],
  }

  const filters = [isActiveFilter]

  return (
    <DataTable 
      columns={getProductColumns({onCellUpdate: handleCellUpdate})} 
      data={products ? products : []} 
      contentForm={<BatchForm onSuccess={() => console.log("true")}/>} 
      isAddSection={false}
      searchValues="name" 
      filters={filters}
      initialState={{
        columnFilters: [
          { id: "isActive", value: ["true"] }
        ]
      }}
    />
  )
}
