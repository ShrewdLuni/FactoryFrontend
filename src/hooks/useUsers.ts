import type { InsertUser, User } from "@/types/users";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { userService as service } from "@/services/users";

export const userKeys = {
  all: () => ["users"] as const,
  lists: () => [...userKeys.all(), "list"] as const,
  detail: (id: number) => [...userKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: number; data: InsertUser }>({
    mutationFn: (data) => service.update(data),
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUsers = {
  getAll: useGetAllUsers,
  update: useUpdateUser,
};
