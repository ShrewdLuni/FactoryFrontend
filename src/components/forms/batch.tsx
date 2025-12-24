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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { useUsers } from "@/hooks/useUsers"

interface BatchFormProps {
  onSuccess: () =>  void;
}

export const BatchForm = ({ onSuccess }: BatchFormProps) => {
  const { products } = useProducts()
  const { users } = useUsers()

  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);
  const [activeMasterId, setActiveMasterId] = useState<string | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [batchName, setBatchName] = useState("")
  const [batchSize, setBatchSize] = useState(100);
  const [amount, setAmount] = useState(100);
  const id = useRandomId(1000, 10000)

  const { initializeBatch, error } = useInitializeBatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await initializeBatch({name: batchName, size: batchSize, productId: Number(activeProductId), assignedMasterId: Number(activeMasterId), plannedFor: date, amount});

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
            <FieldLabel>Master</FieldLabel>
            <Select value={activeMasterId} onValueChange={setActiveMasterId}>
              <SelectTrigger>
                <SelectValue placeholder="Assign a master" />
              </SelectTrigger>
              <SelectContent>
                {users.filter((user) => user.role == "Master").map((user) => {return <SelectItem value={String(user.id)}>{user.fullName}</SelectItem>})}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Planned execution date</FieldLabel>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant='outline' id='date' className='w-full justify-between font-normal'>
                  <span className='flex items-center'>
                    <CalendarIcon className='mr-2' />
                    {date ? date.toLocaleDateString() : 'Pick a date'}
                  </span>
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={date => {
                    setDate(date)
                    setCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
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

