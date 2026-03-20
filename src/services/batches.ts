import { API_URL } from "@/config";
import type { Batch, InsertBatch, InsertBatchBulk } from "@/types/batches";

const BASE_URL = `${API_URL}/batches`;

export const getAllBatches = async (): Promise<Batch[]> => {
  const response = await fetch(BASE_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch batches");
  return response.json();
};

export const getBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch batches");
  return response.json();
};

export const createBatch = async (data: InsertBatch): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create batch");
  return response.json();
};

export const createBatches = async (data: InsertBatchBulk): Promise<Batch[]> => {
  const response = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create batch bulk");
  return response.json();
};

export const updateBatch = async ({ id, data }: { id: number; data: InsertBatch }): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update batches");
  return response.json();
};

export const deleteBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Failed to delete batches");
  return response.json();
};

export type AdvanceBatchPayload = {
  id: number;
  defects: { defect_type_id: number; quantity: number }[];
  sizeOverride?: number;
};

export const advanceBatch  = async ({ id , defects, sizeOverride }: AdvanceBatchPayload): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}/advance`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ defects, sizeOverride }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to advance batch");
  return response.json();
};

export const initializePlannedBatches = async (): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/planned`, { method: "POST", credentials: "include" });
  if (!response.ok) throw new Error("Failed to initialize planned batches");
  return response.json();
};

export const executePlannedBatches = async (): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/planned/execute`, { method: "PATCH", credentials: "include" });
  if (!response.ok) throw new Error("Failed to execute planned batches");
  return response.json();
};

export const batchService = {
  getAll: getAllBatches,
  get: getBatch,
  create: createBatch,
  createMultiple: createBatches,
  update: updateBatch,
  delete: deleteBatch,
  advance: advanceBatch,
  planned: {
    initialize: initializePlannedBatches,
    execute: executePlannedBatches,
  },
};
