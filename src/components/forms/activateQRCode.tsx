import { useState } from "react"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, } from "@/components/ui/field"
import { Button } from "../ui/button"
import type { QRCode } from "@/types/qrcode"
import { useBatches } from "@/hooks/useBatches"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { useQR } from "@/hooks/useQR"

interface QRCodeFormProps {
  qrcode: QRCode,
  onDone: () => void,
}

export const ActivateQRCodeForm = ({ qrcode, onDone }: QRCodeFormProps) => {
  const [linkedBatch, setLinkedBatch] = useState("")
  const { batches } = useBatches();

  const { mutate: activateQRCode, isPending }= useQR.activate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    activateQRCode(
      { id: qrcode.id, resource: linkedBatch },
      {
        onSuccess: () => {
          onDone()
        },
        onError: (error) => {
          console.log("Failed to activate QR code:", error)
        }
      })
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
                {batches.filter((batch) => batch.progressStatus == "Inactive").map((batch) => {return <SelectItem value={`https://shrwd.dev/batch/${String(batch.id)}`}>{`ID: ${batch.id} | Name: ${batch.name} | Product: ${batch.productName} | Size: ${batch.size}`}</SelectItem>})}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit" disabled={isPending || !linkedBatch}>
        { isPending ? 'Activating...' : 'Initialize' }
      </Button>
    </form>
  )
}


