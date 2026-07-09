
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { QRCode, QRCodeInsert } from "@/api/generated/models";
import { Textarea } from "@/components/ui/textarea";

interface QRCodeEditFormProps {
  previous: QRCode;
  onSubmit: (data: QRCodeInsert) => void;
  isPending?: boolean;
}

export const QRCodeEditForm = ({ previous, onSubmit, isPending }: QRCodeEditFormProps) => {
  const [name, setName] = useState(previous.name ?? "");

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="qr-name">Назва QR-Коду</FieldLabel>
          <Textarea id="qr-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть назву QR-Коду" />
        </Field>
        <Button disabled={!name.trim() || isPending} onClick={() => onSubmit({ name })}>
          {isPending ? "Триває редагування..." : "Редагувати"}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};
