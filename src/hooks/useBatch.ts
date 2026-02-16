import { API_URL } from "@/config";
import type { Batch } from "@/types/batches";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["batches"] as const;

const BASE_URL = `${API_URL}/batches`;

const fetchBatches = async (): Promise<Batch[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch batches");
  return response.json();
};

const fetchBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response) throw new Error("Failed to fetch batch");
  return response.json();
};

const createBatch = async (data: Omit<Batch, "id">): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to create batch");
  return response.json();
};

const updateBatch = async ({ id, data,}: { id: number; data: Omit<Batch, "id">; }): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to update batch");
  return response.json();
};

const deleteBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response) throw new Error("Failed to delete batch");
  return response.json();
};

const scanBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}/scan`, { credentials: "include" });
  if (!response) throw new Error("Failed to scan batch");
  return response.json()
}

const initializePlannedBatches = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/planned/initialize`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to initialize planned batches");
};

const executePlannedBatches = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/planned/execute`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to execute planned batches");
};

export const useBatches = {
  getAll: () => {
    return useQuery<Batch[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchBatches
    });
  },
  get: (id: number) => {
    return useQuery<Batch>({
      queryKey: QUERY_KEY,
      queryFn: () => fetchBatch(id),
    });
  },
  create: () => {
    const queryClient = useQueryClient();

    return useMutation<Batch, Error, Omit<Batch, "id">>({
      mutationFn: createBatch,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  update: () => {
    const queryClient = useQueryClient();

    return useMutation<Batch,Error,{ id: number; data: Omit<Batch, "id"> }>({
      mutationFn: updateBatch,
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

    return useMutation<Batch, Error, number>({
      mutationFn: deleteBatch,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  initialize: () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error>({
      mutationFn: initializePlannedBatches,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  execute: () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error>({
      mutationFn: executePlannedBatches,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  scan: () => {
    const queryClient = useQueryClient();

    return useMutation<Batch, Error, number>({
      mutationFn: (id: number) => scanBatch(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEY, id],
        });
      },
    });
  },
};

