import { useAuth } from "@/AuthProvider"
import { ChevronUp } from "lucide-react";

export function NavFooter() {
  const { user } = useAuth();

  return (
    <div className="px-2 flex flex-row justify-between">
      <p className="texl-2xl">
        {user.role}
      </p>
      <ChevronUp/>
    </div>
  )
}
