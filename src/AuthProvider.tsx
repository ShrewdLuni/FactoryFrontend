import { createContext, useEffect, useState, useContext, useMemo, useCallback } from "react"

interface AuthContextType {
  user: any;
  login: (identity: string, password: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const baseURI = "http://localhost:3000/api/auth"

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${baseURI}/whoami`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [])

  const login = useCallback((async (identity: string, password: string) => {
    const res = await fetch(`${baseURI}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username: identity, password})
    })

    if (!res.ok) {
      throw new Error(`Login failed ${res}`);
    }
    
    const me = await fetch(`${baseURI}/whoami`, { credentials: "include" })

    const data = await me.json()

    setUser(data);
  }), []);

  const logout = useCallback((async () => {
    await fetch(`${baseURI}/logout`, {
      method: "POST",
      credentials: "include"
    })

    setUser(null);
  }), []);

  const values = useMemo(() => { return { user, login, logout, loading }}, [user, login, logout, loading])

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // console.log(ctx)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
