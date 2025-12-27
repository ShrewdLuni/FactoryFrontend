import { useState } from "react"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, } from "@/components/ui/field"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useRandomId } from "@/hooks/useRandomId"
import { useInitializeQRCode } from "@/hooks/useInitializeQRCode"

interface QRCodeFormProps {
  onSuccess: () =>  void;
}

export const QRCodeForm = ({ onSuccess }: QRCodeFormProps) => {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(10);
  const id = useRandomId(10, 1000)

  const { initializeQRCodes, error } = useInitializeQRCode();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("click")
    e.preventDefault();
    await initializeQRCodes({name: name, amount: amount});

    if (!error) {
      onSuccess()
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>QR-Code Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder={`QR-Code-${id}`} onChange={e => setName(e.target.value)} value={name}/>
          </Field>
          <Field className="">
            <FieldLabel>Amount</FieldLabel>
            <Input placeholder={"50"} value={amount} onChange={e => setAmount(Number(e.target.value))}></Input>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit">
        Initialize
      </Button>
    </form>
  )
}

