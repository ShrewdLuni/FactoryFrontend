import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { CirclePlus, Printer } from "lucide-react";
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog";
import type { QRCode, QRCodeBulkPatch, QRCodeInsert, QRCodePatch } from "@/api/generated/models";
import {
  getGetAllQRCodesQueryKey,
  useGetAllQRCodes,
  usePatchQRCode,
  useCreateQRCodes,
  useDeleteQRCode,
  useDeleteQRCodes,
  usePatchQRCodes,
} from "@/api/generated/qrcode/qrcode";
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { QRCodeAddForm } from "./forms/add";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { useQueryClient } from "@tanstack/react-query";
import { printMultipleQRCodes } from "./utils";
import { QRCodeSeeDialog } from "./dialogs/see";
import { QRCodeEditForm } from "./forms/edit";
import { QRCodeLinkForm } from "./forms/link";

export const QrCodeGenerationPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [seeOpen, setSeeOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [linkOpen, setLinkOpen] = useState<boolean>(false);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<QRCodePatch | null>();
  const [editedRecord, setEditedRecord] = useState<QRCode | null>(null);

  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null);

  const queryClient = useQueryClient();
  const queryKey = getGetAllQRCodesQueryKey();

  const optimistic = createOptimisticCrudHandlers<QRCode, QRCodePatch, QRCode, QRCodeBulkPatch>(queryClient, queryKey, "QRCode");
  const invalidated = createInvalidateCrudHandlers(queryClient, queryKey, "QRCode");

  const { data: qrcodes = [], isLoading } = useGetAllQRCodes();
  const { mutate: patchQRCode, isPending: isPatchQRCodePending } = usePatchQRCode({ mutation: optimistic.patch });  
  const { mutate: patchQRCodes, isPending: isPatchQRCodesPending } = usePatchQRCodes({ mutation: optimistic.patchMany });
  const { mutate: deleteQRCode } = useDeleteQRCode({ mutation: invalidated.delete });
  const { mutate: deleteQRCodes, isPending: isDeleteQRCodesPending } = useDeleteQRCodes({ mutation: invalidated.deleteMany });
  const { mutate: createQRCodes  } = useCreateQRCodes({ mutation: invalidated.createMany });

  const openLinkDialog = (qr: QRCode) => {
    setActiveQRCode(qr);
    setLinkOpen(true)
  };

  const openSeeDialog = (qr: QRCode) => {
    setActiveQRCode(qr);
    setSeeOpen(true);
  };

  const openEditDialog = (qr: QRCode) => {
    setEditedRecord(qr);
    setEditOpen(true);
  }

  const handleLink = (id: number, resource: string) => {
    patchQRCode({ id: String(id), data: { resource: resource }})
    setLinkOpen(false)
  }

  const handlePatch = (id: number, data: QRCodePatch) => {
    if (selectedIds.length < 2) {
      patchQRCode({ id: String(id), data });
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setEditData(data);
    }
  };

  const handlePatchMany = () => {
    if (editData == null) return;
    patchQRCodes(
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
    deleteQRCode(
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
    deleteQRCodes(
      { data: { ids: idsToDelete.map(Number) } },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => !idsToDelete.includes(sid)));
        },
      },
    );
  };

  const handleCreateMany = (qr: QRCodeInsert, amount: number, shouldPrint: boolean) => {
    const qrCodes: QRCodeInsert[] = Array.from({ length: amount }, () => ({ ...qr }));
    createQRCodes(
      { data: qrCodes },
      {
        onSuccess: (createdQRCodes) => {
          setAddOpen(false);
          if(shouldPrint) 
            printMultipleQRCodes(createdQRCodes);
        },
      },
    );
  };

  const handlePrintSelected = () => {
    const selected = qrcodes.filter((qr) => selectedIds.includes(String(qr.id)));
    printMultipleQRCodes(selected);
  };

  const columns = getColumns({
    handlePatch,
    handleDelete,
    openSeeDialog,
    openLinkDialog,
    openEditDialog
  });

  const toolbarExtras = (
    <div className="flex flex-row gap-2 w-full">
      <Button variant="outline" size="sm" disabled={selectedIds.length === 0} onClick={handlePrintSelected}>
        <Printer className="mr-2 h-4 w-4" />
        Друкувати вибрані QR-коди{selectedIds.length > 0 && `(${selectedIds.length})`}
      </Button>
      {selectedIds.length > 1 && (
        <ConfirmDeleteManyDialog isPending={isDeleteQRCodesPending} selectedIds={selectedIds} handleDeleteMany={handleDeleteMany} />
      )}
      <Button className="h-8 ml-auto" variant="outline" onClick={() => setAddOpen(true)}>
        Додати
        <CirclePlus />
      </Button>
    </div>
  );

  if (isLoading) return <div>Loading</div>;

  return (
    <div>
      <DataTable columns={columns} searchValues={"id"} data={qrcodes} toolbarExtras={toolbarExtras} onRowSelectionChange={setSelectedIds} />
      <ConfirmEditManyDialog isPending={isPatchQRCodesPending} open={isEditRequested} onOpenChange={setIsEditRequested} selectedIds={selectedIds} handlePatchMany={handlePatchMany}/>
      <FormDialog title={"Редагування запису"} open={editOpen} onOpenChange={setEditOpen}>
        {editedRecord && <QRCodeEditForm
          previous={editedRecord}
          isPending={isPatchQRCodePending}
          onSubmit={(data) => {
            if (editedRecord != null) handlePatch(editedRecord.id, data);
          }}
        />}
      </FormDialog>
      <FormDialog title={"Додати QR-коди"} open={addOpen} onOpenChange={setAddOpen}>
        <QRCodeAddForm onSubmit={handleCreateMany} />
      </FormDialog>
      <FormDialog title={"Прив’язати QR-код"} open={linkOpen} onOpenChange={setLinkOpen}>
        <QRCodeLinkForm
          qrcode={activeQRCode!}
          qrcodes={qrcodes}
          onSubmit={handleLink}
        />
      </FormDialog>
      <QRCodeSeeDialog open={seeOpen} onOpenChange={setSeeOpen} qrCode={activeQRCode} />
    </div>
  );
};
