import { DataTable } from "@/components/data-table";
import { getWorkstationColumns } from "./columns";
import {
  getGetAllWorkstationsQueryKey,
  useCreateWorkstation,
  useDeleteWorkstation,
  useDeleteWorkstations,
  useGetAllWorkstations,
  usePatchWorkstation,
  usePatchWorkstations,
} from "@/api/generated/workstation/workstation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WorkstationForm } from "./form/form";
import type { Workstation, WorkstationInsert, WorkstationPatch } from "@/api/generated/models";
import { Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger  } from "@/components/ui/alert-dialog";

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const WorkstationsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<WorkstationPatch | null>();

  const queryClient = useQueryClient()
  const queryKey = getGetAllWorkstationsQueryKey();

  const { data: workstations = [], isLoading } = useGetAllWorkstations();

  const { mutate: patchWorkstation, isPending: isPatchWorkstationPending } = usePatchWorkstation({
    mutation: {
      onMutate: async ({ id, data }) => {
        const previous = queryClient.getQueryData<Workstation[]>(queryKey);
        queryClient.setQueryData<Workstation[]>(queryKey, (old = []) =>
          old.map((w) => (String(w.id) === id ? { ...w, ...data } : w))
        );
        return { previous };
      },
      onError: (error, _vars, context) => {
        queryClient.setQueryData(queryKey, context?.previous);
        toast.error(getErrorMessage(error, "Failed to patch workstation"));
      },
      onSuccess: () => toast.success("Workstation patched"),
    },
  });

  const { mutate: patchWorkstations, isPending: isPatchWorkstationsPending } = usePatchWorkstations({
    mutation: {
      onMutate: async ({ data: { ids, data } }) => {
        const previous = queryClient.getQueryData<Workstation[]>(queryKey);
        queryClient.setQueryData<Workstation[]>(queryKey, (old = []) =>
          old.map((w) => (ids.includes(w.id) ? { ...w, ...data } : w))
        );
        return { previous };
      },
      onError: (error, _vars, context) => {
        queryClient.setQueryData(queryKey, context?.previous);
        toast.error(getErrorMessage(error, "Failed to patch workstations"));
      },
      onSuccess: () => toast.success("Workstations patched"),
    },
  });

  const { mutate: deleteWorkstation } = useDeleteWorkstation({
    mutation: {
      onMutate: async ({ id }) => {
        const previous = queryClient.getQueryData<Workstation[]>(queryKey);
        queryClient.setQueryData<Workstation[]>(queryKey, (old = []) =>
          old.filter((w) => String(w.id) !== id)
        );
        return { previous };
      },
      onError: (error, _vars, context) => {
        queryClient.setQueryData(queryKey, context?.previous);
        toast.error(getErrorMessage(error, "Failed to delete workstation"));
      },
      onSuccess: () => toast.success("Workstation deleted"),
    },
  });

  const { mutate: deleteWorkstations, isPending: isDeleteWorkstationsPending } = useDeleteWorkstations({
    mutation: {
      onMutate: async ({ data: { ids } }) => {
        const previous = queryClient.getQueryData<Workstation[]>(queryKey);
        queryClient.setQueryData<Workstation[]>(queryKey, (old = []) =>
          old.filter((w) => !ids.includes(w.id))
        );
        return { previous };
      },
      onError: (error, _vars, context) => {
        queryClient.setQueryData(queryKey, context?.previous);
        toast.error(getErrorMessage(error, "Failed to delete workstations"));
      },
      onSuccess: () => {
        toast.success("Workstations deleted");
        setSelectedIds([]);
      },
    },
  });

  const { mutate: createWorkstation, isPending: isCreatePending } = useCreateWorkstation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  });


  const handlePatchWithDialog = (id: number, data: WorkstationPatch) => {
    if (selectedIds.length < 2)
      patchWorkstation({ id: String(id), data })
    else {
        setIsEditRequested(true)
        setEditData(data)
    }
  }

  const handlePatch = (id: number, data: WorkstationPatch) => {
    if (selectedIds.length < 2)
      patchWorkstation({ id: String(id), data })
    else {
        patchWorkstations({data: { ids: selectedIds.map(Number), data }})
    }
  }

  const handlePatchMultiple = (data: WorkstationPatch | null | undefined) => {
    if (data == null || data === undefined) return
    patchWorkstations({data: { ids: selectedIds.map(Number), data }})
  }


  const handleDelete = (id: number) => {
    if (selectedIds.length < 2)
      deleteWorkstation({ id: String(id) });
    else
      deleteWorkstations({ data: { ids: selectedIds.map(Number) } });
  };

  const handleDeleteMultiple = () => {
    deleteWorkstations({ data: { ids: selectedIds.map((id) => Number(id)) } });
  };

  if (isLoading) return <div>Loading...</div>;

  const columns = getWorkstationColumns({
    // handlePatch,
    handlePatch: handlePatchWithDialog,
    handleDelete,
  });

  return (
    <div>
      <DataTable
        columns={columns}
        data={workstations}
        searchValues={"name"}
        toolbarExtras={
          selectedIds.length > 1 ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleteWorkstationsPending}
                  >
                    <Trash className="h-4 w-4"/>
                    Видалити машини 
                  </Button>
                }
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Видалити {selectedIds.length} машини?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Це назавжди видалить вибрані машини ({selectedIds.length}) та пов’язану з ними інформацію.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">Скасувати</AlertDialogCancel>
                  <AlertDialogAction 
                    variant="destructive"
                    onClick={handleDeleteMultiple}
                    disabled={isDeleteWorkstationsPending}
                  >Видалити</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
              <></>
            )
        }
        isAddSection={true}
        onRowSelectionChange={setSelectedIds}
        contentForm={({ onClose }) => (
          <WorkstationForm
            isPending={isCreatePending}
            onSubmit={(name) => {
              createWorkstation(
                { data: { name } },
                {
                  onSuccess: () => {
                    toast.success("Workstation created");
                    onClose();
                  },
                  onError: (error) => {
                    toast.error(getErrorMessage(error, "Failed to create workstation"));
                  },
                }
              );
            }}
          />
        )}
      />
      <AlertDialog open={isEditRequested} onOpenChange={setIsEditRequested}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Редагувати {selectedIds.length} машини?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете редагувати {selectedIds.length} машин?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={() => { 
              handlePatchMultiple(editData)
              setIsEditRequested(false);
              setEditData(null);
            }} disabled={isPatchWorkstationsPending}>Підтвердити</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
