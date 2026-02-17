import { API_URL } from "@/config";
import type { Product, InsertProduct } from "@/types/products";

const BASE_URL = `${API_URL}/products`;

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(BASE_URL, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

export const createProduct = async (data: InsertProduct): Promise<Product> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
};

export const updateProduct = async ({ id, data }: { id: number; data: InsertProduct }): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update products");
  return response.json();
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Failed to delete products");
  return response.json();
};

export const productService = {
  getAll: getAllProducts,
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
};
