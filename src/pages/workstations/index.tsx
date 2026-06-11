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
import { WorkstationAddForm } from "./form/add";
import { WorkstationEditForm } from "./form/edit";
import type { Workstation, WorkstationPatch, WorkstationBulkPatch, WorkstationInsert } from "@/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog";
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/dialogs/form-dialog";

export const WorkstationsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<WorkstationPatch | null>();
  const [editedRecord, setEditedRecord] = useState<Workstation | null>(null);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const queryKey = getGetAllWorkstationsQueryKey();

  const optimistic = createOptimisticCrudHandlers<Workstation, WorkstationPatch, Workstation, WorkstationBulkPatch>(queryClient, queryKey, "Workstation");
  const invalidated = createInvalidateCrudHandlers<Workstation>(queryClient, queryKey, "Workstation");

  const { data: workstations = [], isLoading } = useGetAllWorkstations();
  const { mutate: patchWorkstation, isPending: isPatchWorkstationPending } = usePatchWorkstation({ mutation: optimistic.patch });
  const { mutate: patchWorkstations, isPending: isPatchWorkstationsPending } = usePatchWorkstations({ mutation: optimistic.patchMany });
  const { mutate: deleteWorkstation } = useDeleteWorkstation({ mutation: invalidated.delete });
  const { mutate: deleteWorkstations, isPending: isDeleteWorkstationsPending } = useDeleteWorkstations({ mutation: invalidated.deleteMany });
  const { mutate: createWorkstation, isPending: isCreatePending } = useCreateWorkstation({ mutation: invalidated.create });

  const handleCreate = (data: WorkstationInsert) => {
    createWorkstation({ data });
    setAddOpen(false);
  };

  const handlePatchWithDialog = (id: number, data: WorkstationPatch) => {
    if (selectedIds.length < 2) {
      patchWorkstation({ id: String(id), data });
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setEditData(data);
    }
  };

  const handlePatchMany = () => {
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
          setSelectedIds([]);
          setSelectedIds((prev) => prev.filter((sid) => sid !== String(id)));
        },
      },
    );
  };

  const handleDeleteMany = () => {
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

  const columns = getWorkstationColumns({
    handlePatch: handlePatchWithDialog,
    handleDelete,
    onEditDialogOpenClick: (data: Workstation) => {
      setEditOpen(true);
      setEditedRecord(data);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DataTable
        columns={columns}
        data={workstations}
        searchValues={"name"}
        onRowSelectionChange={setSelectedIds}
        toolbarExtras={
          <div className="flex flex-row w-full">
            {selectedIds.length > 1 && (
              <ConfirmDeleteManyDialog
                isPending={isDeleteWorkstationsPending}
                selectedIds={selectedIds}
                handleDeleteMany={handleDeleteMany}
              />
            )}
            <Button className="h-8 ml-auto" variant="outline" onClick={() => setAddOpen(true)}>
              Додати
              <CirclePlus />
            </Button>
          </div>
        }
      />
      <FormDialog title={"Додати запис"} open={addOpen} onOpenChange={setAddOpen}>
        <WorkstationAddForm isPending={isCreatePending} onSubmit={handleCreate} />
      </FormDialog >
      <FormDialog title={"Редагування запису"} open={editOpen} onOpenChange={setEditOpen}>
        <WorkstationEditForm
          previous={editedRecord}
          isPending={isPatchWorkstationPending}
          onSubmit={(data) => {
            if (editedRecord != null) handlePatchWithDialog(editedRecord.id, data);
          }}
        />
      </FormDialog >
      <ConfirmEditManyDialog
        isPending={isPatchWorkstationsPending}
        open={isEditRequested}
        onOpenChange={setIsEditRequested}
        selectedIds={selectedIds}
        handlePatchMany={handlePatchMany}
      />
    </div>
  );
};
