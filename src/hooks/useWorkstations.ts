import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { InsertWorkstation, Workstation } from "@/types/workstation";
import { workstationService as service } from "@/services/workstations";
import { qrcodeKeys } from "./useQR";

export const workstationKeys = {
  all: () => ["workstations"] as const,
  lists: () => [...workstationKeys.all(), "list"] as const,
  detail: (id: number) => [...workstationKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllWorkstations = () => {
  return useQuery({
    queryKey: workstationKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetWorkstation = (id: number) => {
  return useQuery({
    queryKey: workstationKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
  });
};

export const useCreateWorkstation = () => {
  const queryClient = useQueryClient();
  return useMutation<Workstation, Error, InsertWorkstation>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workstationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useUpdateWorkstation = () => {
  const queryClient = useQueryClient();
  return useMutation<Workstation, Error, { id: number; data: InsertWorkstation }, { previousWorkstations: Workstation[] | undefined}>({
    mutationFn: (data) => service.update(data),
    onMutate: async ({id, data}) => {
      await queryClient.cancelQueries({ queryKey: workstationKeys.lists() });
      const previousWorkstations = queryClient.getQueryData<Workstation[]>(workstationKeys.lists());
      queryClient.setQueryData<Workstation[]>(workstationKeys.lists(), (old) => old?.map((workstation) => (workstation.id === id ? { ...workstation, ...data } : workstation)) ?? []);
      return { previousWorkstations };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousWorkstations) {
        queryClient.setQueryData(workstationKeys.lists(), context.previousWorkstations);
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: workstationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workstationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useDeleteWorkstation = () => {
  const queryClient = useQueryClient();
  return useMutation<Workstation, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: workstationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workstationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: qrcodeKeys.lists() });
    },
  });
};

export const useWorkstations = {
  getAll: useGetAllWorkstations,
  get: useGetWorkstation,
  create: useCreateWorkstation,
  update: useUpdateWorkstation,
  delete: useDeleteWorkstation,
};
