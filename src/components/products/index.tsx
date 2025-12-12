import { useProducts } from "@/hooks/useProducts"
import { DataTable } from "../data-table"
import { columns } from "./columns"
import { BatchForm } from "../forms/batch"

export const ProductsPage = () => {

  const { products } = useProducts()

  return (
    <DataTable columns={columns} data={products} contentForm={<BatchForm/>}/>
  )
}
