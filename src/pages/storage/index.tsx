import { getGetAllStorageEntriesQueryKey, useGetAllStorageEntries, usePatchStorageEntry } from "@/api/generated/storage-entry/storage-entry"
import { DataTable } from "@/components/data-table"
import { getStorageColumns } from "./columns"
import { FormDialog } from "@/components/dialogs/form-dialog"
import { useGetAllProducts, usePackProduct } from "@/api/generated/product/product"
import { MoveForm } from "./forms/add"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { createOptimisticCrudHandlers } from "@/lib/crud"
import type { StorageEntry, StorageEntryBulkPatch, StorageEntryPatch } from "@/api/generated/models"
import { groupStorageEntries, type GroupedStorageEntry } from "./group"

export const StoragePage = () => {
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [moveOpen, setMoveOpen] = useState<boolean>(false)
  const [showWrittenOff, setShowWrittenOff] = useState<boolean>(false)
  const [isGrouped, setIsGrouped] = useState<boolean>(true)

  const { data: storageEntries = [] } = useGetAllStorageEntries()
  const { data: products = [] } = useGetAllProducts()

  const queryClient = useQueryClient();
  const queryKey = getGetAllStorageEntriesQueryKey();

  const optimistic = createOptimisticCrudHandlers<StorageEntry, StorageEntryPatch, StorageEntry, StorageEntryBulkPatch>(queryClient, queryKey, "StorageEntry");
  // const invalidated = createInvalidateCrudHandlers(queryClient, queryKey, "StorageEntry");

  const { mutate: patchStorageEntry } = usePatchStorageEntry({ mutation: optimistic.patch });


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

  const handleWriteOff = async (id: number) => {
    await patchStorageEntry({ id: String(id), data: { writtenOffAt: String(new Date()) }})
  }

  const columns = getStorageColumns({ isGrouped, showWrittenOff, handleWriteOff })
  console.log(storageEntries)

  const tableData: GroupedStorageEntry[] = useMemo(() => {
    const filtered = storageEntries.filter((e) =>
      showWrittenOff ? e.writtenOffAt !== null : e.writtenOffAt === null
    );

    if (isGrouped) return groupStorageEntries(filtered);
    return filtered.map((e) => ({ ...e, totalBoxSize: e.boxSize, entriesCount: 1, groupedIds: [e.id] }));
  }, [storageEntries, isGrouped, showWrittenOff]);

  return (
    <div >
      <DataTable 
        searchValues="product"
        data={tableData}
        columns={columns}
        toolbarExtras={
          <div className="flex flex-row w-full">
            <div className="flex flex-row justify-between gap-2 px-2">
              {!showWrittenOff && <Button className="h-8 ml-auto" variant="outline" onClick={() => setIsGrouped((prev) => !prev)}>
                Згрупувати 
                Розгрупувати
                {/* <CirclePlus /> */}
              </Button>}
              {!isGrouped && <Button className="h-8 ml-auto" variant="outline" onClick={() => setShowWrittenOff((prev) => !prev)}>
                Показати списанi 
                Сховати списані
                {/* <CirclePlus /> */}
              </Button>}
            </div>
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
