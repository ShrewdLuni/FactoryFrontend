import { Bookmark, Square } from "lucide-react"
import { Toggle } from "../ui/toggle"
import { cn } from "@/lib/utils"

interface ToggleCellProps {
  pressed: boolean;
  onPressed: (pressed: boolean) => void;
}

export const ToggleCell = ({ pressed, onPressed }: ToggleCellProps) => {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressed}
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent data-[state=on]:bg-transparent",
      )}
    >
      <Square
        className={cn(pressed ? "fill-green-600 text-green-600" : "fill-none text-red-500")}
      />
      {pressed ? "Active" : "Inactive"}
    </Toggle>
  )
}
