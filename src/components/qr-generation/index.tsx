import { useQRCodes } from "@/hooks/useQRCodes"
import { DataTable } from "../data-table"
import { QRCodeForm } from "../forms/qrcode"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { getColumns } from "./columns"

export const QrCodeGenerationPage = () => {

  const { qrcodes, refetch } = useQRCodes()

  const navigate = useNavigate();
  const columns = useMemo(() => getColumns(navigate), [navigate]);

  return (
    <DataTable columns={columns} data={qrcodes} contentForm={<QRCodeForm onSuccess={refetch}/>}/>
  )
}
