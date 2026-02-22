import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { useProducts } from "@/hooks/useProducts";
import { useRandomId } from "@/hooks/useRandomId";
import { useCreateBatches } from "@/hooks/useBatch";
import { useWorkstations } from "@/hooks/useWorkstations";
import type { UserDepartment } from "@/types/users";

interface BatchFormProps {
  onSuccess: () => void;
}

export const BatchForm = ({ onSuccess }: BatchFormProps) => {
  const { data: products } = useProducts.getAll();
  const { data: users } = useUsers.getAll();
  const { data: workstation } = useWorkstations.getAll();

  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);
  const [activeWorkstationId, setActiveWorkstationId] = useState<string | undefined>(undefined);

  const [knittingWorkerId, setKnittingWorkerId] = useState<string | undefined>(undefined);
  const [sewingWorkerId, setSewingWorkerId] = useState<string | undefined>(undefined);
  const [moldingWorkerId, setMoldingWorkerId] = useState<string | undefined>(undefined);
  const [labelingWorkerId, setLabelingWorkerId] = useState<string | undefined>(undefined);
  const [packagingWorkerId, setPackagingWorkerId] = useState<string | undefined>(undefined);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [batchName, setBatchName] = useState("");
  const [batchSize, setBatchSize] = useState(100);
  const [amount, setAmount] = useState(100);
  const id = useRandomId(1000, 10000);

  const { mutate: createBatches, error } = useCreateBatches();

  const workers = [
    { label: "Knitting", workerId: knittingWorkerId, onChange: setKnittingWorkerId },
    { label: "Sewing", workerId: sewingWorkerId, onChange: setSewingWorkerId },
    { label: "Molding", workerId: moldingWorkerId, onChange: setMoldingWorkerId },
    { label: "Labeling", workerId: labelingWorkerId, onChange: setLabelingWorkerId },
    { label: "Packaging", workerId: packagingWorkerId, onChange: setPackagingWorkerId },
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault()
    createBatches({
      name: batchName,
      size: batchSize,
      productId: Number(activeProductId),
      workstationId: Number(activeWorkstationId),
      masters: {
        knitting: Number(knittingWorkerId),
        sewing: Number(sewingWorkerId),
        molding: Number(moldingWorkerId),
        labeling: Number(labelingWorkerId),
        packaging: Number(packagingWorkerId),
      },
      isPlanned: false,
      plannedFor: String(date),
      amount,
    });

    if (!error) {
      onSuccess();
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Batch Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Batch name</FieldLabel>
            <Input placeholder={`Batch-${id}`} onChange={(e) => setBatchName(e.target.value)} value={batchName} />
          </Field>
          <Field>
            <FieldLabel>Workstation</FieldLabel>
            <Select value={activeWorkstationId} onValueChange={setActiveWorkstationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a workstation" />
              </SelectTrigger>
              <SelectContent>
                {workstation?.map((workstation) => {
                  return (
                    <SelectItem key={workstation.id} value={String(workstation.id)}>
                      {workstation.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Product</FieldLabel>
            <Select value={activeProductId} onValueChange={setActiveProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products
                  ?.filter((product) => product.isActive)
                  .map((product) => {
                    return (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </Field>
          <FieldGroup>
            <FieldLabel>Workers</FieldLabel>
            {workers.map((worker) => {
              return (
                <Field key={worker.label}>
                  <Select value={worker.workerId} onValueChange={worker.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Assign a ${worker.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                          ?.filter((user) => user.role === "Worker" && user.departments?.includes(worker.label as UserDepartment))
                          .map((user) => {
                            return <SelectItem key={user.id} value={String(user.id)}>{user.fullName}</SelectItem>;
                          })}
                    </SelectContent>
                  </Select>
                </Field>
              );
            })}
          </FieldGroup>
          <Field>
            <FieldLabel>Planned execution date</FieldLabel>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-full justify-between font-normal">
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2" />
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </span>
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel>Batch size</FieldLabel>
            <Input placeholder={String(batchSize)} value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} />
          </Field>
          <Tabs defaultValue="batch">
            <TabsList>
              <TabsTrigger value="batch">Amount of batches</TabsTrigger>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <TabsTrigger value="pair">Amount of pairs</TabsTrigger>
            </TabsList>
            <TabsContent value="batch">
              <Field className="w-[60%]">
                <Input
                  placeholder={String(amount / batchSize)}
                  value={amount / batchSize}
                  onChange={(e) => setAmount(Number(e.target.value) * batchSize)}
                ></Input>
              </Field>
            </TabsContent>
            <TabsContent value="pair">
              <Field className="w-[60%]">
                <Input placeholder={String(batchSize)} value={amount} onChange={(e) => setAmount(Number(e.target.value))}></Input>
              </Field>
            </TabsContent>
          </Tabs>
        </FieldGroup>
      </FieldSet>
      <Button type="submit">Initialize</Button>
    </form>
  );
};
