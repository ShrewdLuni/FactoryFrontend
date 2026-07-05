import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { renderIcon } from "@/lib/renderIcon";
import type { SelectOption } from "@/hooks/types";

interface SelectCellProps {
  data: SelectOption[];
  placeholder: string;
  defaultValue: string;
  onChange: (e: any) => void;
}

export const SelectCell = ({ data, placeholder, defaultValue, onChange }: SelectCellProps) => {
  return (
    <div className="w-full flex justify-center">
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="w-full min-w-full **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="end">
          {data.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
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
