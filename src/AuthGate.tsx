import { useAuth } from "@/AuthProvider";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();

  if (loading) {
    return null; 
  }

  return <>{children}</>;
};

