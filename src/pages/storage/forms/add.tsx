import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { PackProduct, Product, ProductInsert } from "@/api/generated/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
interface MoveFormProps {
  onSubmit: (id: number, boxSize: number, quantity: number) => void;
  product: Product;
  products: Product[];
  isPending?: boolean;
}
export const MoveForm = ({ onSubmit, product, products, isPending }: MoveFormProps) => {
  const [boxSize, setBoxSize] = useState<string>("60")
  const [activeProduct, setActiveProduct] = useState<Product | null>(product)
  const [quantity, setQuantity] = useState<number>(1)
  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          <FieldLabel>Продукт</FieldLabel>

          <Combobox
            items={products}
            itemToStringLabel={(product) => product.name}
            value={activeProduct}
            onValueChange={(e) => {
              if (!e) return;
              setActiveProduct(e);
            }}
          >
            <ComboboxInput placeholder="Виберіть продукт" />
            <ComboboxContent
              onWheel={(e) => e.stopPropagation()}
              className="pointer-events-auto"
            >
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList className="scrollbar-pretty max-h-64 overflow-y-scroll">
                {(item) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {activeProduct && (
            <FieldDescription className="mt-2 text-base font-semibold">
              Доступно: <span className="text-primary">{activeProduct.quantity}</span> шт.
            </FieldDescription>
          )}
        </Field>
        <Field className="flex flex-row">
          <FieldLabel htmlFor="box-size">Розмір коробки</FieldLabel>
          <Select value={boxSize} onValueChange={setBoxSize}>
            <SelectTrigger className="w-fit max-w-48">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field className="flex flex-row">
          <FieldLabel htmlFor="quantity">Кількість</FieldLabel>
          <Input
            id="quantity"
            min={1}
            className="w-fit max-w-48"
            value={quantity}
            onChange={(e) => {
              const value = Number(e.target.value);
              setQuantity(Number.isNaN(value) ? 1 : Math.max(1, Math.trunc(value)));
            }}
          />
        </Field>
        <Button disabled={isPending || !activeProduct} onClick={() => {
            if (!activeProduct) 
              return; 
            onSubmit(activeProduct.id, Number(boxSize), quantity)
          }}>
          {isPending ? "Триває додавання..." : "Додати"}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};
