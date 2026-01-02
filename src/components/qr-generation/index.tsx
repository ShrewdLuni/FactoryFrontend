import { useQRCodes } from "@/hooks/useQRCodes"
import { DataTable } from "../data-table"
import { QRCodeForm } from "../forms/qrcode"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getColumns } from "./columns"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog"
import type { QRCode } from "@/types/qrcode"
import { ActivateQRCodeForm } from "../forms/activateQRCode"

export const QrCodeGenerationPage = () => {

  const { qrcodes, refetch } = useQRCodes()
  const [activateOpen, setActivateOpen] = useState(false)
  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)

  const openActivateDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setActivateOpen(true)
  }

  const navigate = useNavigate();
  const columns = useMemo(() => getColumns(openActivateDialog), [navigate]);

  return (
    <div>
      <DataTable columns={columns} data={qrcodes} contentForm={<QRCodeForm onSuccess={refetch}/>}/>
      <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
        <DialogContent className="max-w-lg">
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
    </div>
  )


}
