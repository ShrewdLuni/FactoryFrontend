import { Checkbox } from "../ui/checkbox"

interface CheckBoxCellProps {
  defaultValue: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckBoxCell = ({ defaultValue, onChange }: CheckBoxCellProps) => (
  <Checkbox 
    checked={defaultValue}
    onCheckedChange={(checked) => onChange(!!checked)}
  />
);
