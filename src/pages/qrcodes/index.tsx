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
import type { QRCode } from "@/api/generated/models"
import { useDeleteQRCodes, useGetAllQRCodes } from "@/api/generated/qrcode/qrcode"

export const QrCodeGenerationPage = () => {

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [activateOpen, setActivateOpen] = useState(false)
  const [seeOpen, setSeeOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)

  const { data: qrcodes = [], isLoading } = useGetAllQRCodes()
  const { mutate: deleteQRCodes, isPending: isDeleteQRCodesPending } = useDeleteQRCodes()

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

  const columns = getColumns(openActivateDialog, openSeeDialog);

  const handlePrintSelected = () => {
    console.log()
  };

  const toolbarExtras = (
    <div className="flex flex-row w-full">
      <Button
        variant="outline"
        size="sm"
        disabled={selectedIds.length === 0}
        onClick={handlePrintSelected}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
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
      <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activate QR Code</DialogTitle>
          </DialogHeader>
            {activeQRCode && (
              <ActivateQRCodeForm
                qrcode={activeQRCode}
                onDone={() => setActivateOpen(false)}
              />
            )}
        </DialogContent>
      </Dialog>
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
