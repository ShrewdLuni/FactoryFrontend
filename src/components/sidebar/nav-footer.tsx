import { useAuth } from "@/AuthProvider"
import { ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

export function NavFooter() {
  const { user, logout } = useAuth();

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex-col w-full hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
          <div className="flex flex-row justify-between w-full">
            <p className="texl-2xl">
              {`${user?.fullName} | ${user?.role}`}
            </p>
            <ChevronUp/>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="data-[state=open]:!zoom-in-0 data-[state=closed]:!zoom-out-0 origin-center duration-400 w-60 dark:bg-black/25">
        <Button className="w-full" size={"sm"} variant="default" onClick={logout}>Logout</Button>
      </PopoverContent>
    </Popover>
  )
}
