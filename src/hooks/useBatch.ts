import type { Batch, InsertBatch, InsertBatchBulk } from "@/types/batches";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { batchService as service } from "@/services/batches";

export const batchKeys = {
  all: () => ["batches"] as const,
  lists: () => [...batchKeys.all(), "list"] as const,
  detail: (id: number) => [...batchKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllBatches = () => {
  return useQuery({
    queryKey: batchKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetBatch = (id: number) => {
  return useQuery({
    queryKey: batchKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, InsertBatch>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useCreateBatches = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch[], Error, InsertBatchBulk>({
    mutationFn: (data) => service.createMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, { id: number; data: InsertBatch }>({
    mutationFn: (data) => service.update(data),
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useScanBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, number>({
    mutationFn: (id) => service.scan(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useInitializePlannedBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, void>({
    mutationFn: service.planned.initialize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useExecutePlannedBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, void>({
    mutationFn: service.planned.execute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useBatches = {
  getAll: useGetAllBatches,
  get: useGetBatch,
  create: useCreateBatch,
  createMultiple: useCreateBatches,
  update: useUpdateBatch,
  delete: useDeleteBatch,
  scan: useScanBatch,
};

export const usePlannedBatches = {
  initialize: useInitializePlannedBatch,
  execute: useExecutePlannedBatch,
};
