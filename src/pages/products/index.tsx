import { DataTable } from "@/components/data-table";
import { getProductColumns } from "./columns";
import { CircleCheck, CirclePlus, CircleX } from "lucide-react";
import {
  getGetAllProductsQueryKey,
  useCreateProduct,
  useDeleteProduct,
  useDeleteProducts,
  useGetAllProducts,
  usePackProduct,
  usePatchProduct,
  usePatchProducts,
} from "@/api/generated/product/product";
import type { Product, ProductBulkPatch, ProductInsert, ProductPatch } from "@/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog";
import { Button } from "@/components/ui/button";
import { ProductEditForm } from "./forms/edit";
import { ProductAddForm } from "./forms/add";
import { MoveForm } from "../storage/forms/add";


const isActiveFilter = {
  column: "isActive",
  title: "Статус актуальності",
  options: [
    {
      label: "Актуальні",
      value: "true",
      icon: CircleCheck,
    },
    {
      label: "Неактуальні",
      value: "false",
      icon: CircleX,
    },
  ],
};

const filters = [isActiveFilter];

export const ProductsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<ProductPatch | null>();
  const [editedRecord, setEditedRecord] = useState<Product | null>(null);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const [moveOpen, setMoveOpen] = useState<boolean>(false);
  const [moveData, setMoveData] = useState<Product | null>();

  const queryClient = useQueryClient();
  const queryKey = getGetAllProductsQueryKey();

  const optimistic = createOptimisticCrudHandlers<Product, ProductPatch, Product, ProductBulkPatch>(queryClient, queryKey, "Product");
  const invalidated = createInvalidateCrudHandlers(queryClient, queryKey, "Product");

  const { data: products = [], isLoading } = useGetAllProducts();

  const { mutate: patchProduct, isPending: isPatchProductPending } = usePatchProduct({ mutation: optimistic.patch });
  const { mutate: patchProducts, isPending: isPatchProductsPending } = usePatchProducts({ mutation: optimistic.patchMany });

  const { mutate: deleteProduct } = useDeleteProduct({ mutation: invalidated.delete });
  const { mutate: deleteProducts, isPending: isDeleteProdcutsPendings } = useDeleteProducts({ mutation: invalidated.deleteMany });
  const { mutate: createProduct, isPending: isCreateProdcutPendings } = useCreateProduct({ mutation: invalidated.create });
  const { mutate: packProducts } = usePackProduct({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKey,
        })
        setMoveOpen(false)
      },
    },
  })

  const handlePack = (id: number, boxSize: number, quantity: number) => {
    packProducts({ id, data: { boxSize, quantity }})
  }

  const handleCreate = (data: ProductInsert) => {
    createProduct({ data });
    setAddOpen(false);
  };

  const handlePatch = (id: number, data: ProductPatch) => {
    if (selectedIds.length < 2) {
      patchProduct({ id: String(id), data });
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setEditData(data);
    }
  };

  const handlePatchMany = () => {
    if (editData == null) return;
    patchProducts(
      { data: { ids: selectedIds.map(Number), data: editData } },
      {
        onSuccess: () => {
          setIsEditRequested(false);
          setEditData(null);
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteProduct(
      { id: String(id) },
      {
        onSuccess: () => {
          setSelectedIds([]);
          setSelectedIds((prev) => prev.filter((sid) => sid !== String(id)));
        },
      },
    );
  };

  const handleDeleteMany = () => {
    const idsToDelete = selectedIds;
    deleteProducts(
      { data: { ids: idsToDelete.map(Number) } },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => !idsToDelete.includes(sid)));
        },
      },
    );
  };

  const columns = getProductColumns({
    handlePatch,
    handleDelete,
    onEditDialogOpenClick: (data: Product) => {
      setEditOpen(true);
      setEditedRecord(data);
    },
    onMoveDialogOpenClick: (data: Product) => {
      setMoveOpen(true);
      setMoveData(data)
    }
  });


  if (isLoading) <div>Loading...</div>;

  return (
    <div>
      <DataTable
        columns={columns}
        data={products}
        searchValues="name"
        filters={filters}
        onRowSelectionChange={setSelectedIds}
        toolbarExtras={
          <div className="flex flex-row w-full">
            {selectedIds.length > 1 && (
              <ConfirmDeleteManyDialog isPending={isDeleteProdcutsPendings} selectedIds={selectedIds} handleDeleteMany={handleDeleteMany} />
            )}
            <Button className="h-8 ml-auto" variant="outline" onClick={() => setAddOpen(true)}>
              Додати
              <CirclePlus />
            </Button>
          </div>
        }
      />
      <FormDialog title="Перемістити на склад" open={moveOpen} onOpenChange={setMoveOpen}>
        <MoveForm product={moveData || undefined} products={products} onSubmit={handlePack}/>
      </FormDialog>
      <FormDialog title={"Додати запис"} open={addOpen} onOpenChange={setAddOpen}>
        <ProductAddForm isPending={isCreateProdcutPendings} onSubmit={handleCreate} />
      </FormDialog>
      <FormDialog open={editOpen} onOpenChange={setEditOpen}>
        {editedRecord && <ProductEditForm
          previous={editedRecord}
          isPending={isPatchProductPending}
          onSubmit={(data) => {
            if (editedRecord != null) handlePatch(editedRecord.id, data);
          }}
        />}
      </FormDialog>
      <ConfirmEditManyDialog
        isPending={isPatchProductsPending}
        open={isEditRequested}
        onOpenChange={setIsEditRequested}
        selectedIds={selectedIds}
        handlePatchMany={handlePatchMany}
      />
    </div>
  );
};
