import { API_URL } from "@/config";
import type { User } from "@/types/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["users"] as const;

const BASE_URL = `${API_URL}/users`;

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response) throw new Error("Failed to fetch user");
  return response.json();
};

const createUser = async (data: Omit<User, "id" | "fullname">): Promise<User> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to create user");
  return response.json();
};

const updateUser = async ({ id, data }: {  id: number; data: Omit<User, "id" | "fullName">;}): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response) throw new Error("Failed to update user");
  return response.json();
};

const deleteUser = async (id: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response) throw new Error("Failed to fetch user");
  return response.json();
};

export const useUsers = {
  getAll: () => {
    return useQuery<User[]>({
      queryKey: QUERY_KEY,
      queryFn: fetchUsers,
    });
  },
  get: (id: number) => {
    return useQuery<User>({
      queryKey: QUERY_KEY,
      queryFn: () => fetchUser(id),
    });
  },
  create: () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, User>({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
  update: () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error,{ id: number; data: Omit<User, "id"> }>({
      mutationFn: updateUser,
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

    return useMutation<User, Error, number>({
      mutationFn: deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });
  },
};

