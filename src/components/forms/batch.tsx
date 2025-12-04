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
import { useProducts } from "@/hooks/useProducts"

export const BatchForm = () => {
  const { products } = useProducts()

  return (
    <form className="flex flex-col gap-4">
      <FieldSet>
        <FieldLegend>Batch Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Batch name</FieldLabel>
            <Input id="checkout" placeholder="Batch-2351"/>
          </Field>
          <Field>
            <FieldLabel>Product</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => {return <SelectItem value={product.name}>{product.name}</SelectItem>})}
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

