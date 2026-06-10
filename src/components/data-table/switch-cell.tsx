import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

interface SwitchCellProps {
  pressed: boolean;
  onPressed: (pressed: boolean) => void;
}

export const SwitchCell = ({ pressed, onPressed }: SwitchCellProps) => {
  return (
    <Switch
      checked={pressed}
      onCheckedChange={onPressed}
      aria-label="Toggle active"
      className={cn(
        "data-[state=checked]:bg-green-500",
        "data-[state=checked]:[&_[data-slot=switch-thumb]]:bg-white",
        "data-[state=checked]:[&_[data-slot=switch-thumb]]:dark:bg-white"
      )}
    />
  )
}
