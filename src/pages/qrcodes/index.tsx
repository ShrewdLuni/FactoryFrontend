import { DataTable } from "@/components/data-table"
import { useMemo, useRef, useState } from "react"
import { getColumns } from "./columns"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { ActivateQRCodeForm } from "@/components/forms/activateQRCode"
import { QRCodeCanvas } from 'qrcode.react';
import { BASE_URL } from "@/config"
import { Button } from "@/components/ui/button"
import { CirclePlus, Printer } from "lucide-react"
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog"
import type { QRCode, QRCodeBulkPatch, QRCodeInsert, QRCodePatch } from "@/api/generated/models"
import { getGetAllQRCodesQueryKey, useGetAllQRCodes, usePatchQRCode, useCreateQRCode, useCreateQRCodes, useDeleteQRCode, useDeleteQRCodes, usePatchQRCodes } from "@/api/generated/qrcode/qrcode"
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog"
import { FormDialog } from "@/components/dialogs/form-dialog"
import { QRCodeAddForm } from "./forms/add"
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud"
import { useQueryClient } from "@tanstack/react-query";
import { printMultipleQRCodes } from "./utils"

export const QrCodeGenerationPage = () => {

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [activateOpen, setActivateOpen] = useState(false)
  const [seeOpen, setSeeOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)

  const queryClient = useQueryClient();
  const queryKey = getGetAllQRCodesQueryKey();

  const optimistic = createOptimisticCrudHandlers<QRCode, QRCodePatch, QRCode, QRCodeBulkPatch>(queryClient, queryKey, "QRCode");
  const invalidated = createInvalidateCrudHandlers<QRCode>(queryClient, queryKey, "QRCode");

  const { data: qrcodes = [], isLoading } = useGetAllQRCodes();
  const { mutate: patchWorkstation, isPending: isPatchQRCodePending } = usePatchQRCode({ mutation: optimistic.patch });
  const { mutate: patchQRCodes, isPending: isPatchQRCodesPending } = usePatchQRCodes({ mutation: optimistic.patchMany });
  const { mutate: deleteQRCode } = useDeleteQRCode({ mutation: invalidated.delete });
  const { mutate: deleteQRCodes, isPending: isDeleteQRCodesPending } = useDeleteQRCodes({ mutation: invalidated.deleteMany });
  const { mutate: createQRCode, isPending: isCreateQRCodePending } = useCreateQRCode({ mutation: invalidated.create });
  const { mutate: createQRCodes, isPending: isCreateQRCodesPending } = useCreateQRCodes({ mutation: invalidated.createMany });

  const openActivateDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setActivateOpen(true)
  }

  const openSeeDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setSeeOpen(true)
  }

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
  }

  const handleCreateMany = (qr: QRCodeInsert, amount: number) => {
    const qrCodes: QRCodeInsert[] = Array.from({ length: amount }, () => ({ ...qr }));
    createQRCodes({ data: qrCodes },
      {
        onSuccess: (createdQRCodes) => {
          printMultipleQRCodes(createdQRCodes);
          setAddOpen(false);
        },
      }
    );
  };

  const columns = getColumns(openActivateDialog, openSeeDialog);

  const handlePrintSelected = () => {
    const selected = qrcodes.filter((qr) =>
      selectedIds.includes(String(qr.id))
    );

    printMultipleQRCodes(selected);
  };

  const toolbarExtras = (
    <div className="flex flex-row gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        disabled={selectedIds.length === 0}
        onClick={handlePrintSelected}
      >
        <Printer className="mr-2 h-4 w-4" />
        Друкувати вибрані QR-коди{selectedIds.length > 0 && `(${selectedIds.length})`}
      </Button>
      {selectedIds.length > 1 && (
        <ConfirmDeleteManyDialog
          isPending={isDeleteQRCodesPending}
          selectedIds={selectedIds}
          handleDeleteMany={handleDeleteMany}
        />
      )}
      <Button className="h-8 ml-auto" variant="outline" onClick={() => setAddOpen(true)}>
        Додати
        <CirclePlus />
      </Button>
    </div>
  )

  if (isLoading) return <div>Loading</div>

  return (
    <div>
      <DataTable
        columns={columns}
        searchValues={"id"}
        data={qrcodes}
        toolbarExtras={toolbarExtras}
        onRowSelectionChange={setSelectedIds}
      />    
      {/* <ConfirmEditManyDialog/> */}
      <FormDialog title={"Додати QR-коди"} open={addOpen} onOpenChange={setAddOpen}>
        <QRCodeAddForm onSubmit={handleCreateMany}/>
      </FormDialog>
       <Dialog open={seeOpen} onOpenChange={setSeeOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
            </DialogHeader>
            {activeQRCode && 
            (<QRCodeCanvas style={{ width: '100%', height: '100%' }} className="border-4 rounded-xl p-8 bg-white" value={activeQRCode.resource || `${BASE_URL}/qrcodes/${activeQRCode.id}`} size={300} level="M" />)}
          </DialogContent>
        </Dialog>
    </div>
  )
}
