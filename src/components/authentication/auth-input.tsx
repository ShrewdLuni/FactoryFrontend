import { useRef, useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface AuthInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AuthInput = ({ value, onChange }: AuthInputProps) => {

  const passwordLength = 8;
  const min = 100
  const max = 1000000
  const [example] = useState<string>(() => String(Math.floor(Math.random() * (max - min + 1)) + min))

  return (
    <Field>
      <FieldLabel htmlFor="userId">Id</FieldLabel>
      <Input
        id="userId"
        type="text"
        placeholder={example.padStart(passwordLength, "0")}
        onChange={e => onChange(e.target.value)}
        value={value}
        required
      />
    </Field>
  );
};

