import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export const InputCell = ({ className, type, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      className={cn(
        "hover:bg-input/30! focus-visible:bg-background! dark:hover:bg-input/30! dark:focus-visible:bg-input/30! h-8 border-transparent! bg-transparent! text-center shadow-none focus-visible:border! dark:bg-transparent! w-full! field-sizing-content",
        className
      )}
      {...props }
    />
  );
};
