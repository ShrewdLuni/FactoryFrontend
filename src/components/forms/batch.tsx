import { useState } from "react"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet, } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useProducts } from "@/hooks/useProducts"
import { Separator } from "../ui/separator"
import { useRandomId } from "@/hooks/useRandomId"
import { useInitializeBatch } from "@/hooks/useInitializeBatch"

interface BatchFormProps {
  onSuccess: () =>  void;
}

export const BatchForm = ({ onSuccess }: BatchFormProps) => {
  const { products } = useProducts()
  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);
  const [batchName, setBatchName] = useState("")
  const [batchSize, setBatchSize] = useState(100);
  const [amount, setAmount] = useState(100);
  const id = useRandomId(1000, 10000)

  const { initializeBatch, error } = useInitializeBatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await initializeBatch({name: batchName, size: batchSize, productId: Number(activeProductId), amount});

    if (!error) {
      onSuccess()
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Batch Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Batch name</FieldLabel>
            <Input placeholder={`Batch-${id}`} onChange={e => setBatchName(e.target.value)} value={batchName}/>
          </Field>
          <Field>
            <FieldLabel>Product</FieldLabel>
            <Select value={activeProductId} onValueChange={setActiveProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => {return <SelectItem value={String(product.id)}>{product.name}</SelectItem>})}
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
                <Input placeholder={String(amount / batchSize)} value={amount / batchSize} onChange={e => setAmount(Number(e.target.value) * batchSize)}></Input>
              </Field>
            </TabsContent>
            <TabsContent value="pair">
              <Field className="w-[60%]">
                <Input placeholder={String(batchSize)} value={amount} onChange={e => setAmount(Number(e.target.value))}></Input>
              </Field>
            </TabsContent>
          </Tabs>
        </FieldGroup>
      </FieldSet>
      <Button type="submit">
        Initialize
      </Button>
    </form>
  )
}

