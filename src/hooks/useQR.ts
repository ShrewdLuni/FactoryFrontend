import { qrcodeService as service } from "@/services/qrcodes";
import type { InsertQRCode, InsertQRCodeBulk, QRCode } from "@/types/qrcode";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60 * 5;

export const qrcodeKeys = {
  all: () => ["qrcodes"] as const,
  lists: () => [...qrcodeKeys.all(), "list"] as const,
  detail: (id: number) => [...qrcodeKeys.all(), "detail", id] as const,
};

export const useGetAllQRCodes = () => {
  return useQuery({
    queryKey: qrcodeKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetQRCode = (id: number) => {
  return useQuery({
    queryKey: qrcodeKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
  });
};

export const useCreateQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode, Error, InsertQRCode>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useCreateQRCodes = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode[], Error, InsertQRCodeBulk>({
    mutationFn: (data) => service.createMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useUpdateQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode, Error, { id: number; data: InsertQRCode }>({
    mutationFn: (data) => service.update(data),
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useDeleteQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useActivateQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode, Error, number>({
    mutationFn: (id) => service.activate(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useScanQRCode = () => {
  const queryClient = useQueryClient();
  return useMutation<QRCode, Error, number>({
    mutationFn: (id) => service.scan(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useQRCodes = {
  getAll: useGetAllQRCodes,
  get: useGetQRCode,
  create: useCreateQRCode,
  createMultiple: useCreateQRCodes,
  update: useUpdateQRCode,
  delete: useDeleteQRCode,
  activate: useActivateQRCode,
  scan: useScanQRCode,
};
