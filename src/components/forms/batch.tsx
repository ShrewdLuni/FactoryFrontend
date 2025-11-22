import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const BatchForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <FieldSet>
        <FieldLegend>Batch Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Batch Name</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch-a">Batch A</SelectItem>
                <SelectItem value="batch-b">Batch B</SelectItem>
                <SelectItem value="batch-c">Batch C</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Batch size</FieldLabel>
            <Input id="checkout" placeholder="100"/>
          </Field>
        </FieldGroup>
      </FieldSet>
      <div>
        <Button>
          Initialize
        </Button>
      </div>
    </form>
  )
}

