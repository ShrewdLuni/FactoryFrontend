import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

type WithId = { id: number | string };

export const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export function createOptimisticCrudHandlers<
  T extends WithId,
  TPatch = Partial<T>,
  TUpdate = T,
>(queryClient: QueryClient, queryKey: QueryKey, entityName: string) {
  const withOptimistic = <V>(
    updateFn: (old: T[], vars: V) => T[],
    successMsg: string,
    errorFallback: string,
  ) => ({
    onMutate: async (vars: V) => {
      const previous = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData<T[]>(queryKey, (old = []) => updateFn(old, vars));
      return { previous };
    },
    onError: (error: any, _vars: V, context?: { previous?: T[] }) => {
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error(getErrorMessage(error, errorFallback));
    },
    onSuccess: () => toast.success(successMsg),
  });

  return {
    patch: withOptimistic<{ id: string; data?: TPatch }>(
      (old, { id, data }) =>
        old.map((i) => (String(i.id) === id ? { ...i, ...(data ?? {}) } : i)),
      `${entityName} змінено`, `Не вдалося змінити ${entityName}`,
    ),
    patchMany: withOptimistic<{ data: { ids: (string | number)[]; data?: TPatch } }>(
      (old, { data: { ids, data } }) =>
        old.map((i) => (ids.includes(i.id) ? { ...i, ...(data ?? {}) } : i)),
      `${entityName} змінено`, `Не вдалося змінити ${entityName}`,
    ),
    update: withOptimistic<{ id: string; data: TUpdate }>(
      (old, { id, data }) => old.map((i) => (String(i.id) === id ? { ...i, ...data } : i)),
      `${entityName} оновлено`, `Не вдалося оновити ${entityName}`,
    ),
    updateMany: withOptimistic<{ data: { ids: (string | number)[]; data: TUpdate } }>(
      (old, { data: { ids, data } }) =>
        old.map((i) => (ids.includes(i.id) ? { ...i, ...data } : i)),
      `${entityName} оновлено`, `Не вдалося оновити ${entityName}`,
    ),
    delete: withOptimistic<{ id: string }>(
      (old, { id }) => old.filter((i) => String(i.id) !== id),
      `${entityName} видалено`, `Не вдалося видалити ${entityName}`,
    ),
    deleteMany: withOptimistic<{ data: { ids: (string | number)[] } }>(
      (old, { data: { ids } }) => old.filter((i) => !ids.includes(i.id)),
      `${entityName} видалено`, `Не вдалося видалити ${entityName}`,
    ),
  };
}
