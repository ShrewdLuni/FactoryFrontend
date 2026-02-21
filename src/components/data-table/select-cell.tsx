import type { LucideIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import type { ReactNode } from "react";
import { renderIcon } from "@/lib/renderIcon";

interface SelectCellProps {
  row: any;
  data: { label: string; value: string; icon?: LucideIcon | ReactNode }[];
  placeholder: string;
  onChange?: (value: string, row: any) => void;
  defaultValue: string;
}

export const SelectCell = ({ row, data, placeholder, onChange, defaultValue }: SelectCellProps) => {
  return (
    <div className="w-full flex justify-center">
      <Select defaultValue={defaultValue} onValueChange={(value) => {onChange?.(value, row);}}>
        <SelectTrigger className="w-full min-w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="end">
          {data.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {/* {Icon && <Icon className="h-4 w-4 shrink-0 text" />} */}
                  {renderIcon(option.icon)}
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
