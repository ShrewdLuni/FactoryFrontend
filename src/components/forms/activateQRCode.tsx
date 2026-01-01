import { useState } from "react"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, } from "@/components/ui/field"
import { Button } from "../ui/button"
import type { QRCode } from "@/types/qrcode"
import { useBatches } from "@/hooks/useBatches"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { useActivateQRCode } from "@/hooks/useActivateQRCode"
import { API_URL } from "@/config"

interface QRCodeFormProps {
  qrcode: QRCode,
  onDone: () => void,
}

export const ActivateQRCodeForm = ({ qrcode, onDone}: QRCodeFormProps) => {
  const [linkedBatch, setLinkedBatch] = useState("")

  const { success, activateQRCode } = useActivateQRCode()
  const { batches } = useBatches();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(qrcode.id, linkedBatch)
    activateQRCode(qrcode.id, linkedBatch)

    if (success) {
      onDone()
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>QR-Code Information</FieldLegend>
        <FieldGroup>
         <Field>
            <FieldLabel>Product</FieldLabel>
            <Select value={linkedBatch} onValueChange={setLinkedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.filter((batch) => batch.progressStatus == "Inactive").map((batch) => {return <SelectItem value={`${API_URL}/batches/${String(batch.id)}`}>{`ID: ${batch.id} | Name: ${batch.name} | Product: ${batch.productName} | Size: ${batch.size}`}</SelectItem>})}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit">
        Initialize
      </Button>
    </form>
  )
}


