import { DataTable } from "../data-table"
import { QRCodeForm } from "../forms/qrcode"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getColumns } from "./columns"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog"
import type { QRCode } from "@/types/qrcode"
import { ActivateQRCodeForm } from "../forms/activateQRCode"
import { useQR } from "@/hooks/useQR"

export const QrCodeGenerationPage = () => {

  const {data: qrcodes, isLoading, refetch} = useQR.getAll()
  const [activateOpen, setActivateOpen] = useState(false)
  const [seeOpen, setSeeOpen] = useState(false)
  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)

  const openActivateDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setActivateOpen(true)
  }

  const openSeeDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setSeeOpen(true)
  }

  const navigate = useNavigate();
  const columns = useMemo(() => getColumns(openActivateDialog, openSeeDialog), [navigate]);

  if (isLoading) {
    <div>Loading</div>
  }

  return (
    <div>
      <DataTable columns={columns} searchValues={"name"} data={qrcodes ? qrcodes : []} contentForm={<QRCodeForm onSuccess={refetch}/>}/>
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
            {(activeQRCode && activeQRCode.qrcodeImage) && (<img 
              src={activeQRCode.qrcodeImage} 
              alt={activeQRCode.name || `QR Code ${activeQRCode.id}`}
              className="w-full h-full border-2 border-gray-300 rounded"
            />)}
          </DialogContent>
        </Dialog>
    </div>
  )
}
