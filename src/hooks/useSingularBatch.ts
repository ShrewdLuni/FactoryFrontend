import { useState, useCallback } from "react";
import { API_URL } from "@/config";
import type { Batch } from "@/types/batches";

export const useSingularBatch = () => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBatch = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/batches/${id}`, { credentials: "include" });

      if (!res.ok) throw new Error("Failed to fetch batch");

      const data: Batch = await res.json();
      setBatch(data);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err);
      setBatch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { batch, loading, error, fetchBatch };
};

