import { DataTable } from "@/components/data-table"
import { getProductColumns } from "./columns"
import { CircleCheck, CircleX } from "lucide-react"
import { useGetAllProducts, useUpdateProduct } from "@/api/generated/product/product"
import { useGetAllPackedStock } from "@/api/generated/packed-stock/packed-stock"

export const ProductsPage = () => {
  const { data: products, isLoading } =  useGetAllProducts()
  const { mutate: updateProduct } = useUpdateProduct()
  const { data: packedStock } = useGetAllPackedStock();

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
      columns={getProductColumns({onCellUpdate: handleCellUpdate, packedStock})} 
      data={products ? products : []} 
      isAddSection={false}
      searchValues="name" 
      filters={filters}
      initialState={{
        columnFilters: [
          { id: "isActive", value: ["true"] }
        ],
        columnVisibility: { code: false, measureUnit: false, category: false } 
      }}
    />
  )
}
