import { API_URL } from "@/config";
import type { User, InsertUser } from "@/types/users";

const BASE_URL = `${API_URL}/users`;

export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const updateUsers = async ({ id, data }: { id: number; data: InsertUser }): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update users");
  return response.json();
};

export const userService = {
  getAll: getAllUsers,
  get: getUser,
  update: updateUsers,
}
