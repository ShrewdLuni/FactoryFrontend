import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { WorkstationInsert } from "@/api/generated/models";

interface WorkstationAddFormProps {
  onSubmit: (data: WorkstationInsert) => void;
  isPending?: boolean;
}

export const WorkstationAddForm = ({ onSubmit, isPending }: WorkstationAddFormProps) => {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="workstation-name">Назва машини</Label>
        <Input id="workstation-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть назву машини" />
      </div>
      <Button disabled={!name.trim() || isPending} onClick={() => onSubmit({ name })}>
        {isPending ? "Триває додавання..." : "Додати"}
      </Button>
    </div>
  );
};
