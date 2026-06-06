import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export const InputCell = ({ className, type, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      className={cn(
        "hover:bg-input/30! max-w-full min-w-16 focus-visible:bg-background! dark:hover:bg-input/30! dark:focus-visible:bg-input/30! border-transparent! bg-transparent! text-center shadow-none focus-visible:border! dark:bg-transparent! field-sizing-content",
        className
      )}
      {...props }
    />
  );
};
