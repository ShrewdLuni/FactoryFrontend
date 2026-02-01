import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem  } from "../ui/select";

interface SelectCellProps {
  row: any;
  data: {label: string, value: string, icon?: any }[];
  placeholder: string;
  onChange?: (value: string, row: any) => void;
  defaultValue: string,
}

export const SelectCell = ({ row, data, placeholder, onChange, defaultValue }: SelectCellProps) => {

  const [value, setValue] = useState(defaultValue)

  return (
    <div className="w-full flex justify-center">
      <Select defaultValue={defaultValue} value={value} onValueChange={(value) => {console.log(value, row.original);setValue(value);onChange?.(value, row)}}>
        <SelectTrigger className="w-full min-w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncatj " size="sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="end">
          {data.map((option) => {
              return <SelectItem value={option.value}>{option.label}</SelectItem>
          })}
        </SelectContent>
      </Select>
    </div>
  )
};
