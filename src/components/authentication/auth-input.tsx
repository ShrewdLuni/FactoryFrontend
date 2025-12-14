import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useRandomId } from "@/hooks/useRandomId";

interface AuthInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AuthInput = ({ value, onChange }: AuthInputProps) => {
  const passwordLength = 8;
  const example = useRandomId(100, 1000000)
  
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

