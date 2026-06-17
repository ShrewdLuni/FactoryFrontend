import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Batch, QRCode, QRCodePatch } from "@/api/generated/models";
import { useGetAllBatches } from "@/api/generated/batch/batch";
import { BASE_URL } from "@/config";

interface QRCodeLinkFormProps {
  qrcode: QRCode;
  qrcodes: QRCode[];
  onSubmit: (data: QRCodePatch) => void;
  isPending?: boolean;
}

export const QRCodeLinkForm = ({ qrcode, qrcodes, onSubmit, isPending }: QRCodeLinkFormProps) => {
  const [activeBatch, setActiveBatch] = useState<Batch>();

  const { data: rawBatches = [] } = useGetAllBatches();

  const batches = rawBatches?.filter((batch) => batch.isActive === true && !batch.status.isTerminal);

  const takenResources = new Set(
    qrcodes
      .filter((qr) => qr.resource && qr.id !== qrcode.id)
      .map((qr) => qr.resource)
  );

  const normalizedBatches = batches.filter((batch) => {
    const batchUrl = `${BASE_URL}/batch/${batch.id}`;
    return !takenResources.has(batchUrl);
  });

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel>Партія</FieldLabel>
          <Combobox
            items={normalizedBatches}
            itemToStringLabel={(batch) =>
              `ID: ${batch.id} | Назва: ${batch.name} | Продукт: ${batch.product.id} | Розмір: ${batch.size}`
            }
            value={activeBatch}
            onValueChange={(e) => {
              if (!e) return;
              setActiveBatch(e);
            }}
          >
            <ComboboxInput placeholder="Виберіть партію" />
            <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList className="scrollbar-pretty overflow-y-scroll max-h-64">
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    {`ID: ${item.id} | Назва: ${item.name} | Продукт: ${item.product.id} | Розмір: ${item.size}`}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </FieldGroup>
      <Button disabled={isPending || !activeBatch} onClick={() => { if(activeBatch) onSubmit({ resource: `${BASE_URL}/batch/${activeBatch.id}`})}}>
        {isPending ? "Триває прив'язування..." : "Прив'язати"}
      </Button>
    </FieldSet>
  );
};
