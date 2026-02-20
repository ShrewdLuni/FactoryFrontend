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

export const scanBatch = async (id: number): Promise<Batch> => {
  const response = await fetch(`${BASE_URL}/${id}/scan`, { method: "PATCH", credentials: "include" });
  if (!response.ok) throw new Error("Failed to scan batches");
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
  scan: scanBatch,
  planned: {
    initialize: initializePlannedBatches,
    execute: executePlannedBatches,
  },
};
