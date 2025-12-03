import { useEffect, useState } from "react"
import { API_URL } from "@/config"
import { Batch } from "@/types/batches";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getBatches = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/batches`, { credentials: "include"});

        if (!res.ok) {
          throw new Error("Failed to fetch batches");
        }
        const data: Batch[] = await res.json();
        setBatches(data);

      } catch (error: any) {
        console.log(error);
        setError(error);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    }
    getBatches();
  }, [])

  return { batches, loading, error };
} 
