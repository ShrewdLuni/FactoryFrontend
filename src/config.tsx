export const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("VITE_BASE_URL is not defined");
}

