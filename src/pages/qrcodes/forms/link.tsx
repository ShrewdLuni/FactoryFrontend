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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Batch, Device, Workstation, QRCode, QRCodePatch } from "@/api/generated/models";
import { useGetAllBatches } from "@/api/generated/batch/batch";
import { BASE_URL } from "@/config";
import { useGetAllWorkstations } from "@/api/generated/workstation/workstation";
import { useGetAllDevices } from "@/api/generated/device/device";
import { Bolt, Box, Package, Unplug } from "lucide-react";

interface QRCodeLinkFormProps {
  qrcode: QRCode;
  qrcodes: QRCode[];
  onSubmit: (id: number, url: string) => void;
  isPending?: boolean;
}

const RESOURCE_TYPES = {
  BATCH: "Партія",
  DEVICE: "Пристрій",
  WORKSTATION: "Машина",
} as const;

type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

const resources: { label: ResourceType; icon: React.ReactNode }[] = [
  { label: RESOURCE_TYPES.BATCH, icon: <Package /> },
  { label: RESOURCE_TYPES.DEVICE, icon: <Unplug /> },
  { label: RESOURCE_TYPES.WORKSTATION, icon: <Bolt /> },
];

export const QRCodeLinkForm = ({ qrcode, qrcodes, onSubmit, isPending }: QRCodeLinkFormProps) => {

  const [resource, setResource] = useState<ResourceType | null>(null);

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  const { data: rawBatches = [] } = useGetAllBatches();
  const { data: devices = [] } = useGetAllDevices();
  const { data: workstations = [] } = useGetAllWorkstations();

  const batches = rawBatches?.filter((batch) => batch.isActive === true && !batch.status.isTerminal);

  const takenResources = new Set(
    qrcodes
      .filter((qr) => qr.resource && qr.id !== qrcode.id)
      .map((qr) => qr.resource)
  );

  const normalizedBatches = batches.filter(
    (batch) => !takenResources.has(`${BASE_URL}/batch/${batch.id}`)
  );
  const normalizedDevices = devices.filter(
    (device) => !takenResources.has(`${BASE_URL}/device/${device.id}`)
  );
  const normalizedWorkstations = workstations.filter(
    (workstation) => !takenResources.has(`${BASE_URL}/workstation/${workstation.id}`)
  );

  const resourceUrl =
    resource === RESOURCE_TYPES.BATCH && selectedBatch
      ? `${BASE_URL}/batch/${selectedBatch.id}`
      : resource === RESOURCE_TYPES.DEVICE && selectedDevice
      ? `${BASE_URL}/device/${selectedDevice.id}`
      : resource === RESOURCE_TYPES.WORKSTATION && selectedWorkstation
      ? `${BASE_URL}/workstation/${selectedWorkstation.id}`
      : undefined;

  const handleResourceChange = (value: string) => {
    setResource(value as ResourceType);
    setSelectedBatch(null);
    setSelectedDevice(null);
    setSelectedWorkstation(null);
  };

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel>Тип ресурсу</FieldLabel>
          <Select value={resource} onValueChange={handleResourceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Оберіть ресурс" />
            </SelectTrigger>
            <SelectContent>
              {resources.map((d) => (
                <SelectItem key={d.label} value={d.label}>
                  {d.icon}
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {resource === RESOURCE_TYPES.BATCH && (
          <Field>
            <Combobox
              items={normalizedBatches}
              itemToStringLabel={(batch) =>
                `ID: ${batch.id} | Назва: ${batch.name} | Продукт: ${batch.product.id}`
              }
              value={selectedBatch}
              onValueChange={(e) => setSelectedBatch(e ?? undefined)}
            >
              <ComboboxInput placeholder="Виберіть партію" />
              <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
                <ComboboxEmpty>Елементів не знайдено.</ComboboxEmpty>
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
        )}

        {resource === RESOURCE_TYPES.DEVICE && (
          <Field>
            <Combobox
              items={normalizedDevices}
              itemToStringLabel={(device) => `ID: ${device.id} | Назва: ${device.name}`}
              value={selectedDevice}
              onValueChange={(e) => setSelectedDevice(e ?? undefined)}
            >
              <ComboboxInput placeholder="Виберіть пристрій" />
              <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
                <ComboboxEmpty>Елементів не знайдено.</ComboboxEmpty>
                <ComboboxList className="scrollbar-pretty overflow-y-scroll max-h-64">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {`ID: ${item.id} | Назва: ${item.name}`}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        )}

        {resource === RESOURCE_TYPES.WORKSTATION && (
          <Field>
            <Combobox
              items={normalizedWorkstations}
              itemToStringLabel={(workstation) => `ID: ${workstation.id} | Назва: ${workstation.name}`}
              value={selectedWorkstation}
              onValueChange={(e) => setSelectedWorkstation(e ?? undefined)}
            >
              <ComboboxInput placeholder="Виберіть машину" />
              <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
                <ComboboxEmpty>Елементів не знайдено.</ComboboxEmpty>
                <ComboboxList className="scrollbar-pretty overflow-y-scroll max-h-64">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {`ID: ${item.id} | Назва: ${item.name}`}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        )}
      </FieldGroup>

      <Button
        disabled={isPending || !resourceUrl}
        onClick={() => {
          if (resourceUrl) onSubmit(qrcode.id, resourceUrl);
        }}
      >
        {isPending ? "Триває прив'язування..." : "Прив'язати"}
      </Button>
    </FieldSet>
  );
};
