import { API_URL } from "@/config";
import type { Product } from "@/types/products";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["products"] as const;

const BASE_URL = `${API_URL}/products`;

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(BASE_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, { credentials: "include" });
  if (!response) throw new Error("Failed to fetch product");
  return response.json();
};

const createProduct = async (data: Omit<Product, "id">): Promise<Product> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response) throw new Error("Failed to create product");
  return response.json();
};

const updateProduct = async ({ id, data }: {  id: number; data: Omit<Product, "id">;}): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response) throw new Error("Failed to update product");
  return response.json();
};

const deleteProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response) throw new Error("Failed to delete product");
  return response.json();
};

export const useProducts = {
  getAll: () => {
    return useQuery<Product[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchProducts,
    });
  },
  get: (id: number) => {
    return useQuery<Product>({
      queryKey: QUERY_KEY,
      queryFn: () => fetchProduct(id),
    });
  },
  create: () => {
    const queryClient = useQueryClient();

    return useMutation<Product, Error, Omit<Product, "id">>({
      mutationFn: createProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  update: () => {
    const queryClient = useQueryClient();

    return useMutation<Product, Error,{ id: number; data: Omit<Product, "id"> }>({
      mutationFn: updateProduct,
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

    return useMutation<Product, Error, number>({
      mutationFn: deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
};


