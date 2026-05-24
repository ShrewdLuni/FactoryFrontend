import { API_URL } from "@/config";

export const customFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
