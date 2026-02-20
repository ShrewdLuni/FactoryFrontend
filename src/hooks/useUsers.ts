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

export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
    enabled: !!id
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: number; data: InsertUser }, { previousUsers: User[] | undefined}>({
    mutationFn: (data) => service.update(data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists());
      queryClient.setQueryData<User[]>(userKeys.lists(), (old) => old?.map((user) => (user.id === id ? { ...user, ...data } : user)) ?? []);
      return { previousUsers };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
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
