import { useState } from "react"
import { API_URL } from "@/config"

export const useActivateQRCode = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const activateQRCode = async (id: number, resource: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_URL}/qrcodes/${id}/activate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resource }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to activate QR code");
      }

      const data = await res.json();
      console.log(data);

      setSuccess(true);
    } catch (err) {
      setError(err as Error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { success, loading, error, activateQRCode };
};

