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

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useProducts } from "@/hooks/useProducts"
import { TabsContent } from "@radix-ui/react-tabs"
import { Separator } from "../ui/separator"
import { useState } from "react"

export const BatchForm = () => {
  const { products } = useProducts()
  const [batchSize, setBatchSize] = useState(100);
  const [amount, setAmount] = useState(100);

  return (
    <form className="flex flex-col gap-4">
      <FieldSet>
        <FieldLegend>Batch Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Batch name</FieldLabel>
            <Input placeholder="Batch-2351"/>
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
            <Input placeholder={String(batchSize)} value={batchSize} onChange={e => setBatchSize(Number(e.target.value))}/>
          </Field>
          <Tabs defaultValue="batch">
            <TabsList>
              <TabsTrigger value="batch">Amount of batches</TabsTrigger>
              <Separator orientation="vertical" className="mx-2 h-6"/>
              <TabsTrigger value="pair">Amount of pairs</TabsTrigger>
            </TabsList>
            <TabsContent value="batch">
              <Field className="w-[60%]">
                <Input type="number" placeholder={String(amount / batchSize)} value={amount / batchSize} onChange={e => setAmount(Number(e.target.value) * batchSize)}></Input>
              </Field>
            </TabsContent>
            <TabsContent value="pair">
              <Field className="w-[60%]">
                <Input type="number" placeholder={String(batchSize)} value={amount} onChange={e => setAmount(Number(e.target.value))}></Input>
              </Field>
            </TabsContent>
          </Tabs>
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

