import { DataTable } from "@/components/data-table";
import { getWorkstationColumns } from "./columns";
import {
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
import { WorkstationForm } from "./form";
import type { WorkstationInsert, WorkstationPatch } from "@/api/generated/models";
import { Trash } from "lucide-react";

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const WorkstationsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: workstations = [], isLoading } = useGetAllWorkstations();

  const { mutate: patchWorkstation } = usePatchWorkstation({
    mutation: {
      onError: (error) => toast.error(getErrorMessage(error, "Failed to patch workstation")),
      onSuccess: () => toast.success("Workstation patched"),
    },
  });

  const { mutate: patchWorkstations } = usePatchWorkstations({
    mutation: {
      onError: (error) => toast.error(getErrorMessage(error, "Failed to patch workstations")),
      onSuccess: () => toast.success("Workstations patched"),
    },
  });

  const { mutate: deleteWorkstation } = useDeleteWorkstation({
    mutation: {
      onSuccess: () => toast.success("Workstation deleted"),
      onError: (error) => toast.error(getErrorMessage(error, "Failed to delete workstation")),
    },
  });

  const { mutate: deleteWorkstations, isPending: isDeleteWorkstationsPending } = useDeleteWorkstations({
    mutation: {
      onSuccess: () => {
        toast.success("Workstations deleted");
        setSelectedIds([]);
      },
      onError: (error) => toast.error(getErrorMessage(error, "Failed to delete workstations")),
    },
  });

  const { mutate: createWorkstation, isPending: isCreatePending } = useCreateWorkstation();

  const handlePatch = (id: number, data: WorkstationPatch) => {
    if (selectedIds.length < 2)
      patchWorkstation({ id: String(id), data })
    else
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
    handlePatch,
    handleDelete,
  });

  return (
    <DataTable
      columns={columns}
      data={workstations}
      searchValues={"name"}
      toolbarExtras={
        selectedIds.length > 1 ? (
          <div>
            <Button
              variant={"destructive"}
              size="sm"
              onClick={() => handleDeleteMultiple()}
              disabled={isDeleteWorkstationsPending}
            >
              <Trash className="mr-2 h-4 w-4"/>
              Видалити машини 
            </Button>
          </div>
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
  );
};
