import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Device, DeviceInsert } from "@/api/generated/models";
import { useGetAllDepartments } from "@/api/generated/department/department";

interface DeviceEditFormProps {
  previous: Device;
  onSubmit: (data: DeviceInsert) => void;
  isPending?: boolean;
}

export const DeviceEditForm = ({ previous, onSubmit, isPending }: DeviceEditFormProps) => {
  const [name, setName] = useState(previous.name);
  const [capacity, setCapacity] = useState<number>(previous.capacity);
  const [departmentId, setDepartmentId] = useState<string>(String(previous.department?.id ?? ""));

  const { data: departments = [] } = useGetAllDepartments();

  const canSubmit = name.trim().length > 0 && capacity > 0 && departmentId !== "";

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="device-name">Назва пристрою</FieldLabel>
          <Textarea id="device-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть назву пристрою" />
        </Field>
        <Field>
          <FieldLabel htmlFor="device-capacity">Місткість</FieldLabel>
          <Input
            id="device-capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            placeholder="0"
          />
        </Field>
        <Field>
          <FieldLabel>Відділ</FieldLabel>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Оберіть відділ" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>Пристрій буде прив’язано до обраного відділу.</FieldDescription>
        </Field>
        <Button
          disabled={!canSubmit || isPending}
          onClick={() =>
            onSubmit({
              name,
              capacity,
              department: { id: Number(departmentId) },
            })
          }
        >
          {isPending ? "Триває редагування..." : "Редагувати"}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};
