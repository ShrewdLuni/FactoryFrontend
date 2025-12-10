import { useAuth } from "@/AuthProvider"
import { ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

export function NavFooter() {
  const { user, logout } = useAuth();
  const [folded, setFolded] = useState(true);

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"ghost"} className="px-2 flex flex-col w-full" onClick={() => setFolded(!folded)}>
          <div className="flex flex-row justify-between w-full">
            <p className="texl-2xl">
              {user?.fullName}
            </p>
            <ChevronUp/>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="data-[state=open]:!zoom-in-0 data-[state=closed]:!zoom-out-0 origin-center duration-400 w-60 dark:bg-black/25">
        <Button className="w-full" size={"sm"} variant="default" onClick={logout}>Logout</Button>
      </PopoverContent>
    </Popover>
  )
}
