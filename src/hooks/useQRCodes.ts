import { useEffect, useState } from "react"
import { API_URL } from "@/config"
import type { QRCode } from "@/types/qrcode";

export const useQRCodes = () => {
  const [qrcodes, setQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getQRCodes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/qrcodes`, { credentials: "include"});

      if (!res.ok) {
        throw new Error("Failed to fetch QR-codes");
      }
      const data: QRCode[] = await res.json();
      setQRCodes(data);

    } catch (error: any) {
      console.log(error);
      setError(error);
      setQRCodes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getQRCodes();
  }, [])

  return { qrcodes, loading, error, refetch: getQRCodes };
} 

