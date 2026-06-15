import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { QRCodeInsert } from "@/api/generated/models";
import { SwitchCell } from "@/components/data-table/switch-cell";
import { useRandomId } from "@/hooks/useRandomId";

interface QRCodeAddFormProps {
  onSubmit: (data: QRCodeInsert, amount: number) => void;
  isPending?: boolean;
}

export const QRCodeAddForm = ({ onSubmit, isPending }: QRCodeAddFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(1);
  const [shouldPrint, setShouldPrint] = useState(false);
  const id = useRandomId(10, 10000);

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel>Назва</FieldLabel>
          <Input placeholder={`QR-Code-${id}`} onChange={(e) => setName(e.target.value)} value={name} />
        </Field>
        <Field>
          <FieldLabel>Кількість</FieldLabel>
          <Input placeholder={"50"} value={amount} onChange={(e) => setAmount(Number(e.target.value))}></Input>
        </Field>
        <Field className="flex">
          <div className="flex w-full flex-row justify-between">
            <FieldLabel>Друкувати після створення</FieldLabel>
            <SwitchCell pressed={shouldPrint} onPressed={setShouldPrint} />
          </div>
          <FieldDescription>Відкриє діалог друку після створення.</FieldDescription>        
        </Field>
        <Button disabled={isPending} onClick={() => onSubmit({ name }, amount)}>
          {isPending ? "Триває додавання..." : "Додати"}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};

