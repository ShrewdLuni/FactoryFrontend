import { DataTable } from "@/components/data-table"
import { getProductColumns } from "./columns"
import { CircleCheck, CircleX } from "lucide-react"
import { getGetAllProductsQueryKey, useCreateProduct, useCreateProducts, useDeleteProduct, useDeleteProducts, useGetAllProducts, usePatchProduct, usePatchProducts, useUpdateProduct } from "@/api/generated/product/product"
import { useGetAllPackedStock } from "@/api/generated/packed-stock/packed-stock"
import type { Product, ProductPatch } from "@/api/generated/models"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

export const ProductsPage = () => {

  const queryClient = useQueryClient()
  const queryKey = getGetAllProductsQueryKey();

  const { data: products = [], isLoading } =  useGetAllProducts()
  const { data: packedStock } = useGetAllPackedStock();
  const { mutate: patchProduct, isPending: isPatchProductPending } = usePatchProduct({
    mutation: {
      onMutate: async ({ id, data }) => {
        const previous = queryClient.getQueryData<Product[]>(queryKey);
        queryClient.setQueryData<Product[]>(queryKey, (old = []) =>
          old.map((w) => (String(w.id) === id ? { ...w, ...data } : w))
        );
        return { previous };
      },
      onError: (error, _vars, context) => {
        queryClient.setQueryData(queryKey, context?.previous);
      },
      onSuccess: () => toast.success("Workstation patched"),
    },
  })
  const { mutate: patchProducts, isPending: isPatchProductsPending } = usePatchProducts()
  const { mutate: deleteProduct, isPending: isDeleteProdcutPending } = useDeleteProduct()
  const { mutate: deleteProducts, isPending: isDeleteProdcutsPendings } = useDeleteProducts()
  const { mutate: createProduct, isPending: isDeleteProdcutPendings } = useCreateProduct()
  const { mutate: createProducts, isPending: isCreateProductPendings } = useCreateProducts()

  if (isLoading) {
    <div>Loading...</div>
  }

  const isActiveFilter = {
    column: "isActive", 
    title: "Статус активності", 
    options: [
      {
        label: "Активні",
        value: "true",
        icon: CircleCheck,
      },
      {
        label: "Неактивні",
        value: "false",
        icon: CircleX,
      }
    ],
  }

  const filters = [isActiveFilter]

  const handlePatch = (id: number, data: ProductPatch) => {
    patchProduct({ id: String(id), data })
  }

  const columns = useMemo(
    () => getProductColumns({ handlePatch, packedStock }),
    [packedStock]   
  )

  return (
    <DataTable 
      columns={columns} 
      data={products} 
      searchValues="name" 
      filters={filters}
      initialState={{
        columnVisibility: { code: true } 
      }}
    />
  )
}
