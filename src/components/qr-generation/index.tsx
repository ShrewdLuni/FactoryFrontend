import { DataTable } from "../data-table"
import { QRCodeForm } from "../forms/qrcode"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getColumns } from "./columns"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog"
import type { QRCode } from "@/types/qrcode"
import { ActivateQRCodeForm } from "../forms/activateQRCode"
import { useGetAllQRCodes } from "@/hooks/useQR"
import { QRCodeCanvas } from 'qrcode.react';
import { BASE_URL } from "@/config"

export const QrCodeGenerationPage = () => {

  const {data: qrcodes, isLoading, refetch} = useGetAllQRCodes()
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

  console.log(activeQRCode)

  return (
    <div>
      <DataTable columns={columns} searchValues={"name"} data={qrcodes ? qrcodes : []} contentForm={<QRCodeForm onSuccess={() => {refetch}}/>}/>
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
