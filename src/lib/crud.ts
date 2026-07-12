import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

type WithId = { id: number | string };

export const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export function createOptimisticCrudHandlers<
  T extends WithId,
  TPatch = Partial<T>,
  TUpdate = T,
  TBulkPatch extends { ids: (string | number)[]; data?: TPatch } = {
    ids: (string | number)[];
    data?: TPatch;
  },
  TBulkUpdate extends { ids: (string | number)[]; data?: TUpdate } = {
    ids: (string | number)[];
    data?: TUpdate;
  },
>(queryClient: QueryClient, 
  queryKey: QueryKey, 
  entityName: string, 
  options?: { toOptimistic?: (data: Partial<TPatch>) => Partial<T> }) {

  const toOptimistic = options?.toOptimistic ?? ((data: any) => data)

  const withOptimistic = <V,>(
    updateFn: (old: T[], vars: V) => T[],
    successMsg: string,
    errorFallback: string,
    options?: { resync?: boolean },
  ) => ({
      onMutate: async (vars: V) => {
        await queryClient.cancelQueries({ queryKey });
        const previous = queryClient.getQueryData<T[]>(queryKey);
        queryClient.setQueryData<T[]>(queryKey, (old = []) => updateFn(old, vars));
        return { previous };
      },
      onError: (error: any, _vars: V, context?: { previous?: T[] }) => {
        queryClient.setQueryData(queryKey, context?.previous);
        toast.error(getErrorMessage(error, errorFallback));
      },
      onSuccess: () => toast.success(successMsg),
      ...(options?.resync && {
        onSettled: () => queryClient.invalidateQueries({ queryKey }),
      }),
    });

  return {
    patch: withOptimistic<{ id: string; data?: TPatch }>(
      (old, { id, data }) =>
        old.map((i) => (String(i.id) === id ? { ...i, ...toOptimistic(data ?? {}) } : i)),
      `${entityName} змінено`, `Не вдалося змінити ${entityName}`,
    ),
    patchMany: withOptimistic<{ data?: TBulkPatch }>(
      (old, { data }) => {
        if (!data) return old;
        const { ids, data: patchData } = data;
        return old.map((i) => (ids.includes(i.id) ? { ...i, ...toOptimistic(patchData ?? {}) } : i));
      },
      `${entityName} змінено`, `Не вдалося змінити ${entityName}`,
    ),
    update: withOptimistic<{ id: string; data: TUpdate }>(
      (old, { id, data }) => old.map((i) => (String(i.id) === id ? { ...i, ...data } : i)),
      `${entityName} оновлено`, `Не вдалося оновити ${entityName}`,
    ),
    updateMany: withOptimistic<{ data?: TBulkUpdate }>(
      (old, { data }) => {
        if (!data) return old;
        const { ids, data: updateData } = data;
        return old.map((i) => (ids.includes(i.id) ? { ...i, ...updateData } : i));
      },
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

export function createInvalidateCrudHandlers(
  queryClient: QueryClient,
  queryKey: QueryKey,
  entityName: string,
) {
  const withInvalidate = (successMsg: string, errorFallback: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success(successMsg);
    },
    onError: (error: any) => toast.error(getErrorMessage(error, errorFallback)),
  });

  return {
    create: withInvalidate(`${entityName} створено`, `Не вдалося створити ${entityName}`),
    createMany: withInvalidate(`${entityName} створено`, `Не вдалося створити ${entityName}`),
    delete: withInvalidate(`${entityName} видалено`, `Не вдалося видалити ${entityName}`),
    deleteMany: withInvalidate(`${entityName} видалено`, `Не вдалося видалити ${entityName}`),
  };
}
