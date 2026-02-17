import { API_URL } from "@/config";
import type { InsertWorkstation, Workstation } from "@/types/workstation";

const BASE_URL = `${API_URL}/workstations`;

export const getAllWorkstations = async (): Promise<Workstation[]> => {
  const response = await fetch(BASE_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch workstations");
  return response.json();
};

export const getWorkstation = async (id: number): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch workstation");
  return response.json();
};

export const createWorkstation = async (data: InsertWorkstation): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create workstation");
  return response.json();
};

export const updateWorkstation = async ({ id, data }: { id: number; data: InsertWorkstation }): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update workstation");
  return response.json();
};

export const deleteWorkstation = async (id: number): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Failed to delete workstation");
  return response.json();
};

export const workstationService = {
  getAll: getAllWorkstations,
  get: getWorkstation,
  create: createWorkstation,
  update: updateWorkstation,
  delete: deleteWorkstation,
};
