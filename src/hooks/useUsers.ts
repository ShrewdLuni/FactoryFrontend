import { API_URL } from "@/config"
import type { User } from "@/types/users"
import { useEffect, useState } from "react"

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users`)
        const data = await response.json()
        setUsers(data);
      } catch(error: any){
        console.log(error);
        setError(error);
        setUsers([])
      } finally {
        setLoading(false);
      }
    }   
    getUsers();
  }, [])

  return { users, loading, error }
}
