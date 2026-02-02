import { API_URL } from "@/config";
import type { PlannedBatch } from "@/types/plannedBatch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["plannedBatches"] as const;

const BASE_URL = `${API_URL}/planned-batches`;

const fetchPlannedBatches = async (): Promise<PlannedBatch[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch planned batches");
  return response.json();
};

const fetchPlannedBatch = async (id: number): Promise<PlannedBatch> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response) throw new Error("Failed to fetch planned batch");
  return response.json();
};

const createPlannedBatch = async (data: Omit<PlannedBatch, "id">): Promise<PlannedBatch> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to create planned batch");
  return response.json();
};

const updatePlannedBatch = async ({ id, data,}: { id: number; data: Omit<PlannedBatch, "id">; }): Promise<PlannedBatch> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to update planned batch");
  return response.json();
};

const deletePlannedBatch = async (id: number): Promise<PlannedBatch> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response) throw new Error("Failed to fetch planned batch");
  return response.json();
};

export const usePlannedBatches = {
  getAll: () => {
    return useQuery<PlannedBatch[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchPlannedBatches,
    });
  },
  get: (id: number) => {
    return useQuery<PlannedBatch>({
      queryKey: QUERY_KEY,
      queryFn: () => fetchPlannedBatch(id),
    });
  },
  create: () => {
    const queryClient = useQueryClient();

    return useMutation<PlannedBatch, Error, Omit<PlannedBatch, "id">>({
      mutationFn: createPlannedBatch,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  update: () => {
    const queryClient = useQueryClient();

    return useMutation<PlannedBatch,Error,{ id: number; data: Omit<PlannedBatch, "id"> }>({
      mutationFn: updatePlannedBatch,
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

    return useMutation<PlannedBatch, Error, number>({
      mutationFn: deletePlannedBatch,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
