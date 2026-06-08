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
import { createOptimisticCrudHandlers, getErrorMessage } from "@/lib/optimistic-crud";

export const WorkstationsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<WorkstationPatch | null>();

  const queryClient = useQueryClient();
  const queryKey = getGetAllWorkstationsQueryKey();

  const { data: workstations = [], isLoading } = useGetAllWorkstations();

  const handlers = createOptimisticCrudHandlers<Workstation>(queryClient, queryKey, "Workstation");

  const { mutate: patchWorkstation, isPending: isPatchWorkstationPending } = usePatchWorkstation({ mutation: handlers.patch });
  const { mutate: patchWorkstations, isPending: isPatchWorkstationsPending } = usePatchWorkstations({ mutation: handlers.patchMany });

  const { mutate: deleteWorkstation, isPending: isDeleteWorkstationPending } = useDeleteWorkstation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast.success("Workstation deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Failed to delete workstation")),
    },
  });

  const { mutate: deleteWorkstations, isPending: isDeleteWorkstationsPending } = useDeleteWorkstations({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
        toast.success("Workstations deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Failed to delete workstations")),
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
    if (selectedIds.length < 2) patchWorkstation({ id: String(id), data });
    else {
      setIsEditRequested(true);
      setEditData(data);
    }
  };

  const handlePatchMultiple = () => {
    if (editData == null) return;
    patchWorkstations(
      { data: { ids: selectedIds.map(Number), data: editData } },
      {
        onSuccess: () => {
          setIsEditRequested(false);
          setEditData(null);
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteWorkstation(
      { id: String(id) },
      {
        onSuccess: () => {
          setSelectedIds([])
          setSelectedIds((prev) => prev.filter((sid) => sid !== String(id)));
        },
      },
    );
  };

  const handleDeleteMultiple = () => {
    const idsToDelete = selectedIds;
    deleteWorkstations(
      { data: { ids: idsToDelete.map(Number) } },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => !idsToDelete.includes(sid)));
        },
      },
    );
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
              isPending={isDeleteWorkstationsPending}
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
                    toast.error("Failed to create workstation");
                  },
                },
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
