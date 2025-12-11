import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"

export const EmployeeForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <FieldSet>
        <FieldLegend>Employee Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input id="checkout" placeholder="John Smith"/>
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input id="checkout" placeholder="john.smith@gmail.com"/>
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input id="checkout" placeholder="+380 12 345 67 89"/>
          </Field>
        </FieldGroup>
      </FieldSet>
      <div>
        <Button>
          Add Employee
        </Button>
      </div>
    </form>
  )
}
