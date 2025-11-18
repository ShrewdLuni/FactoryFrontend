import { useAuth } from "@/AuthProvider"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  element: any,
  roles: string[],
}

export const ProtectedRoute = ({element, roles} : ProtectedRouteProps) => {
  const { user } = useAuth(); 

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (!roles.includes(user.role) && !roles.includes("*")) {
    return <Navigate to="/employees" replace />
  }

  return element;
}
