import { useUsers } from "@/hooks/useUsers"
import { Field, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface AuthSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AuthSelect = ({ value, onChange }: AuthSelectProps) => {
  const { users } = useUsers();

  console.log(value);

  return (
    <Field>
      <FieldLabel htmlFor="id">Profile</FieldLabel>
      <Select onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select your login"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users.map((item) => {
              return (
                <SelectItem value={item.code ? String(item.code) : item.username}>{item.fullName}</SelectItem> 
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
