import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
  ComboboxInput
} from "@/components/ui/combobox"
import { renderIcon } from "@/lib/renderIcon";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";


interface SelectCellSearchProps {
  data: { label: string; value: string; icon?: LucideIcon | React.ReactNode }[];
  defaultValue: any;
  inputPlaceholder: string;
  onChange: (e: any) => void
}

export function SelectCellSearch({ data, defaultValue, inputPlaceholder, onChange }: SelectCellSearchProps) {
  const anchor = useComboboxAnchor()

  const resolvedDefaultValue = useMemo(() => {
    if (!defaultValue) return undefined;
    return data.find((item) => item.value === defaultValue);
  }, [defaultValue, data]);

  return (
    <Combobox items={data} autoHighlight defaultValue={resolvedDefaultValue} onValueChange={onChange}>
      <ComboboxInput
        placeholder={inputPlaceholder}
        className="w-full shrink-0 [&_input]:field-sizing-content [&_input]:whitespace-nowrap"
      />
      <ComboboxContent anchor={anchor} className="w-full">
        <ComboboxEmpty>Елементів не знайдено.</ComboboxEmpty>
        <ComboboxList className="scrollbar-pretty overflow-y-auto max-h-64">
          {(item) => (
            <ComboboxItem key={`${item.label}-item`} value={item} className={"whitespace-nowrap"}>
              {renderIcon(item.icon)}
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
