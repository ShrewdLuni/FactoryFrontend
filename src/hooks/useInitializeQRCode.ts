import { API_URL } from "@/config"
import { useState } from "react"
import type { QRCode, QRCodeInitialization } from "@/types/qrcode";


export const useInitializeQRCode = () => {

  const [qrcodes, setInitializedQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState<Boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const initializeQRCodes = async (qrcodeData: QRCodeInitialization) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/qrcodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrcodeData)
      })

      if (!response.ok) {
        throw new Error("Failed to initialize qrcode(s)");
      }

      const data = await response.json();
      setInitializedQRCodes(data);
    } catch(error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { initializeQRCodes, qrcodes, loading, error }
}


