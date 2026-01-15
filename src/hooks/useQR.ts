import { API_URL } from "@/config";
import type { QRCode, QRCodeInitialization } from "@/types/qrcode";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ['qrcode'] as const;

const BASE_URL = `${API_URL}/qrcodes`

const fetchQRCodes = async (): Promise<QRCode[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch qrcodes');
  return response.json();
}

const initializeQRCodes = async (qrcodeData: QRCodeInitialization): Promise<QRCode> => {
  const response = await fetch(`${API_URL}/qrcodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(qrcodeData)
  })
  if (!response.ok) throw new Error("Failed to initialize qrcode(s)");
  return response.json();
}

const activateQRCode = async ({ id, resource }: {id: number, resource: string}): Promise<QRCode> => {
  const response = await fetch(`${API_URL}/qrcodes/${id}/activate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource }),
    }
  );
  if (!response.ok) throw new Error("Failed to activate QR code");
  return response.json();
}

export const useQR = {
  getAll: () => {
    return useQuery<QRCode[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchQRCodes,
    });
  },
  initialize: () => {
    const queryClient = useQueryClient();

    return useMutation<QRCode, Error, QRCodeInitialization>({
      mutationFn: initializeQRCodes, 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  activate: () => {
    const queryClient = useQueryClient();

    return useMutation<QRCode, Error, { id: number, resource: string }>({
      mutationFn: activateQRCode, 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  }
}
