import { getGetAllStorageEntriesQueryKey, useGetAllStorageEntries } from "@/api/generated/storage-entry/storage-entry"
import { DataTable } from "@/components/data-table"
import { getStorageColumns } from "./columns"
import { FormDialog } from "@/components/dialogs/form-dialog"
import { useGetAllProducts, usePackProduct } from "@/api/generated/product/product"
import { MoveForm } from "./forms/add"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

export const StoragePage = () => {
  const [moveOpen, setMoveOpen] = useState<boolean>(false)

  const { data: storageEntries = [], isLoading } = useGetAllStorageEntries()
  const { data: products = [] } = useGetAllProducts()

  const queryClient = useQueryClient()

  const { mutate: packProducts } = usePackProduct({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getGetAllStorageEntriesQueryKey(),
        })
        setMoveOpen(false)
      },
    },
  })

  const handlePack = (id: number, boxSize: number, quantity: number) => {
    packProducts({ id, data: { boxSize, quantity }})
  }

  const columns = getStorageColumns()

  if (isLoading) return <div>Loading...</div>;

  return (
    <div >
      <DataTable 
        searchValues="product"
        data={storageEntries}
        columns={columns}
        toolbarExtras={
          <div className="flex flex-row w-full">
            <Button className="h-8 ml-auto" variant="outline" onClick={() => setMoveOpen(true)}>
              Додати
              <CirclePlus />
            </Button>
          </div>
        }
      />
      <FormDialog title="Перемістити на склад" open={moveOpen} onOpenChange={setMoveOpen}>
        <MoveForm  products={products} onSubmit={handlePack}/>
      </FormDialog>
    </div>
  )
}
