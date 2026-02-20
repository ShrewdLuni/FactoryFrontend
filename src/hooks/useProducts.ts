import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { productService as service } from "@/services/products";
import type { InsertProduct, Product } from "@/types/products";

export const productKeys = {
  all: () => ["prudcts"] as const,
  lists: () => [...productKeys.all(), "list"] as const,
  detail: (id: number) => [...productKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
    enabled: !!id
  });
};

export const useCreateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, InsertProduct>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; data: InsertProduct }, { previousProducts: Product[] | undefined }>({
    mutationFn: (data) => service.update(data),
    onMutate: async ({id, data}) => {
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });
      const previousProducts = queryClient.getQueryData<Product[]>(productKeys.lists());
      queryClient.setQueryData<Product[]>(productKeys.lists(), (old) => old?.map((product) => (product.id === id ? { ...product, ...data } : product)) ?? []);
      return { previousProducts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(productKeys.lists(), context.previousProducts);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useProducts = {
  getAll: useGetAllProducts,
  get: useGetProduct,
  create: useCreateProducts,
  update: useUpdateProducts,
  delete: useDeleteProducts,
};
