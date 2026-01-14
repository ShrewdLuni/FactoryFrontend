import { API_URL } from "@/config";
import type { Workstation } from "@/types/workstation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["workstations"] as const;

const BASE_URL = `${API_URL}/workstations`;

const fetchWorkstations = async (): Promise<Workstation[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch workstations");
  return response.json();
};

const fetchWorkstation = async (id: number): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response) throw new Error("Failed to fetch workstation");
  return response.json();
};

const createWorkstation = async ({name, qrCode}: {name: string, qrCode: number}): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({name, qrCode}),
  });
  if (!response) throw new Error("Failed to create workstation");
  return response.json();
};

const updateWorkstation = async ({
  id,
  data,
}: {
  id: number;
  data: Omit<Workstation, "id">;
}): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to update workstation");
  return response.json();
};

const deleteWorkstation = async (id: number): Promise<Workstation> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response) throw new Error("Failed to fetch workstation");
  return response.json();
};

export const useWorkstations = {
  getAll: () => {
    return useQuery<Workstation[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchWorkstations,
    });
  },
  get: (id: number) => {
    return useQuery<Workstation>({
      queryKey: QUERY_KEY,
      queryFn: () => fetchWorkstation(id),
    });
  },
  create: () => {
    const queryClient = useQueryClient();

    return useMutation<Workstation, Error, {name: string, qrCode: number}>({
      mutationFn: createWorkstation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  update: () => {
    const queryClient = useQueryClient();

    return useMutation<
      Workstation,
      Error,
      { id: number; data: Omit<Workstation, "id"> }
    >({
      mutationFn: updateWorkstation,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEY, variables.id],
        });
      },
    });
  },
  delete: () => {
    const queryClient = useQueryClient();

    return useMutation<Workstation, Error, number>({
      mutationFn: deleteWorkstation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
};
