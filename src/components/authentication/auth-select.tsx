import { Field, FieldLabel } from "../ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const AuthSelect = () => {
  const data = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "nineth",
    "tenth",
  ]

  return (
    <Field>
      <FieldLabel htmlFor="id">Profile</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select your login"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data.map((item) => {
              return (
                <SelectItem value={item}>{item}</SelectItem> 
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
