"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import type { LucideIcon } from "lucide-react";
import { renderIcon } from "@/lib/renderIcon";

interface SelectCellProps {
  row: any;
  data: { label: string; value: string; icon?: LucideIcon | React.ReactNode }[];
  onChange?: (value: string[], row: any) => void;
  defaultValue: any;
}

export const MultipleSelectCell = ({ row, data, onChange, defaultValue }: SelectCellProps) =>  {
  const anchor = useComboboxAnchor()

  const resolvedDefaultValue = React.useMemo(() => {
    if (!defaultValue) return [];
    const values = Array.isArray(defaultValue) ? defaultValue : [defaultValue].filter(Boolean);
    return data.filter((item) => values.includes(item.value));
  }, [defaultValue, data]);

  return (
    <Combobox
      multiple
      autoHighlight
      items={data}
      defaultValue={resolvedDefaultValue}
      onValueChange={(value: typeof data) => {
        const update = value.map(value => value.value);
        onChange?.(update, row);
      }}
    >
      <ComboboxChips ref={anchor} className="w-full flex-nowrap">
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: any) => (
                <ComboboxChip key={`${value.label}-chip`}>
                  {renderIcon(value.icon)}
                  {value.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={`${item.label}-item`} value={item}>
              {renderIcon(item.icon)}
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

