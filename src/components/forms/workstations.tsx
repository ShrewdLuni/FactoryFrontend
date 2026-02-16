import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRandomId } from "@/hooks/useRandomId";
import { useQR } from "@/hooks/useQR";
import { useWorkstations } from "@/hooks/useWorkstations";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

interface WorkstationsFormProps {
  onSuccess: () => void;
}

export const WorkstationsForm = ({ onSuccess }: WorkstationsFormProps) => {
  const [name, setName] = useState("");
  const [activeQRCodeID, setActiveQRCodeID] = useState("");

  const id = useRandomId(10, 1000);

  const { mutate: createWorkstation, error: createError } = useWorkstations.create();

  const { data: qrcodes, isLoading: isQRLoading } = useQR.getAll();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, activeQRCodeID)

    createWorkstation({ name: name, qrCode: parseInt(activeQRCodeID),});

    if (!createError) {
      onSuccess();
    }
  };

  if (isQRLoading) {
    return <div>Loading</div>
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Workstation Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder={`Workstation-${id}`} onChange={(e) => setName(e.target.value)} value={name}/>
          </Field>
          <Field>
            <FieldLabel>QR-Code</FieldLabel>
            <Select value={activeQRCodeID} onValueChange={setActiveQRCodeID}>
              <SelectTrigger>
                <SelectValue placeholder="Select QR code" />
              </SelectTrigger>
              <SelectContent>
                {qrcodes?.filter((qr) => !qr.isTaken).map((qr: any) => (
                  <SelectItem key={qr.id} value={String(qr.id)}>
                    {qr.name ? qr.name != '' ? qr.name : `QR-${qr.id}` : `QR-${qr.id}` }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit" disabled={ isQRLoading}>
        Initialize
      </Button>
    </form>
  );
};
