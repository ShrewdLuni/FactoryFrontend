import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  element: any,
  roles: string[],
}

export const ProtectedRoute = ({element, roles} : ProtectedRouteProps) => {
  const user = useAuth()

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return element;
}
