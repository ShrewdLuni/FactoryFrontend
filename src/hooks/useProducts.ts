import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { productService as service } from "@/services/products";
import type { InsertProduct, Product } from "@/types/products";

export const productsKeys = {
  all: () => ["prudcts"] as const,
  lists: () => [...productsKeys.all(), "list"] as const,
  detail: (id: number) => [...productsKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: productsKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetProducts = (id: number) => {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
  });
};

export const useCreateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, InsertProduct>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
};

export const useUpdateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; data: InsertProduct }>({
    mutationFn: (data) => service.update(data),
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
};

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
};

export const useProducts = {
  getAll: useGetAllProducts,
  get: useGetProducts,
  create: useCreateProducts,
  update: useUpdateProducts,
  delete: useDeleteProducts,
};
