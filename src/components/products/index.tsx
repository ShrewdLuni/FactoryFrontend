import { useProducts } from "@/hooks/useProducts"
import { DataTable } from "../data-table"
import { columns, type Product } from "./columns"

export const ProductsPage = () => {

  const { products, loading, error } = useProducts()

  return (
    <DataTable columns={columns} data={products} />
  )
}
