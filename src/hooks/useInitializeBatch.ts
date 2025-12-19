import { API_URL } from "@/config"
import { useState } from "react"
import type { Batch, BatchInitialization } from "@/types/batches"


export const useInitializeBatch = () => {

  const [initializedBatches, setInitializedBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<Boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const initializeBatch = async (batchData: BatchInitialization) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/batches/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData)
      })

      if (!response.ok) {
        throw new Error("Failed to initialize batch");
      }

      const data = await response.json();
      setInitializedBatches(data);
    } catch(error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { initializeBatch, initializedBatches, loading, error }
}

