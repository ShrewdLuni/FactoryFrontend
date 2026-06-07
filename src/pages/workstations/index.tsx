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
import { toast } from "sonner";
import { WorkstationForm } from "./form/form";
import type { Workstation, WorkstationPatch } from "@/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDeleteMultipleDialog } from "@/components/dialogs/confirm-delete-multiple-dialog";
import { ConfirmEditMultipleDialog } from "@/components/dialogs/confirm-edit-multiple-dialog";

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

  const handlePatchMultiple = () => {
    if (editData == null) return;
    patchWorkstations(
      { data: { ids: selectedIds.map(Number), data: editData } },
      {
        onSuccess: () => {
          setIsEditRequested(false);
          setEditData(null);
        },
      }
    );
  };


  const handleDelete = (id: number) => {
    deleteWorkstation({ id: String(id) });
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
            <ConfirmDeleteMultipleDialog
              isPending = {isDeleteWorkstationsPending}
              selectedIds={selectedIds}
              handleDeleteMultiple={handleDeleteMultiple}
            />
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
      <ConfirmEditMultipleDialog
        isPending={isPatchWorkstationsPending}
        open={isEditRequested}
        onOpenChange={setIsEditRequested}
        selectedIds={selectedIds}
        handlePatchMultiple={handlePatchMultiple}
      />      
    </div>
  );
};
