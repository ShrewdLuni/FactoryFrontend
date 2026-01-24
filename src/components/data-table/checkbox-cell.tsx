import { useState } from "react"
import { Checkbox } from "../ui/checkbox"
import type { Product } from "@/types/products";
import type { Row } from "@tanstack/react-table";

interface CheckBoxCellProps {
  row: Row<Product> 
  defaultValue: boolean;
  field: string;
  onChange: (field: string, value: string | boolean, row: any) => void;
}

export const CheckBoxCell = ({ row, field, defaultValue, onChange }: CheckBoxCellProps) => {

  const [checked, setChecked] = useState(defaultValue)

  return (
    <Checkbox 
      defaultChecked={defaultValue} 
      checked={checked} 
      onCheckedChange={(checked) => {
        setChecked(!!checked); 
        onChange(field, !!checked, row)}
      }/>
  )
}
