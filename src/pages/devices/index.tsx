import { DataTable } from "@/components/data-table";
import { getDeviceColumns } from "./columns";
import { CircleCheck, CirclePlus, CircleX } from "lucide-react";
import {
  getGetAllDevicesQueryKey,
  useCreateDevice,
  useDeleteDevice,
  useDeleteDevices,
  useGetAllDevices,
  usePatchDevice,
  usePatchDevices,
} from "@/api/generated/device/device";
import type { Device, DeviceBulkPatch, DeviceInsert, DevicePatch } from "@/api/generated/models";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { ConfirmEditManyDialog } from "@/components/dialogs/confirm-edit-many-dialog";
import { ConfirmDeleteManyDialog } from "@/components/dialogs/confirm-delete-many-dialog";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { Button } from "@/components/ui/button";
import { DeviceAddForm } from "./forms/add";
import { DeviceEditForm } from "./forms/edit";

const isActiveFilter = {
  column: "isActive",
  title: "Статус активності",
  options: [
    { label: "Активні", value: "true", icon: CircleCheck },
    { label: "Неактивні", value: "false", icon: CircleX },
  ],
};

const filters = [isActiveFilter];

export const DevicesPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  const [editData, setEditData] = useState<DevicePatch | null>();
  const [editedRecord, setEditedRecord] = useState<Device | null>(null);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const queryKey = getGetAllDevicesQueryKey();

  const optimistic = createOptimisticCrudHandlers<Device, DevicePatch, Device, DeviceBulkPatch>(queryClient, queryKey, "Device");
  const invalidated = createInvalidateCrudHandlers<Device>(queryClient, queryKey, "Device");

  const { data: devices = [], isLoading } = useGetAllDevices();

  const { mutate: patchDevice, isPending: isPatchDevicePending } = usePatchDevice({ mutation: optimistic.patch });
  const { mutate: patchDevices, isPending: isPatchDevicesPending } = usePatchDevices({ mutation: optimistic.patchMany });

  const { mutate: deleteDevice } = useDeleteDevice({ mutation: invalidated.delete });
  const { mutate: deleteDevices, isPending: isDeleteDevicesPending } = useDeleteDevices({ mutation: invalidated.deleteMany });
  const { mutate: createDevice, isPending: isCreateDevicePending } = useCreateDevice({ mutation: invalidated.create });

  const handleCreate = (data: DeviceInsert) => {
    createDevice({ data });
    setAddOpen(false);
  };

  const handlePatch = (id: number, data: DevicePatch) => {
    if (selectedIds.length < 2) {
      patchDevice({ id: String(id), data });
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setEditData(data);
    }
  };

  const handlePatchMany = () => {
    if (editData == null) return;
    patchDevices(
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
    deleteDevice(
      { id: String(id) },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => sid !== String(id)));
        },
      },
    );
  };

  const handleDeleteMany = () => {
    const idsToDelete = selectedIds;
    deleteDevices(
      { data: { ids: idsToDelete.map(Number) } },
      {
        onSuccess: () => {
          setSelectedIds((prev) => prev.filter((sid) => !idsToDelete.includes(sid)));
        },
      },
    );
  };

  const columns = getDeviceColumns({
    handlePatch,
    handleDelete,
    onEditDialogOpenClick: (data: Device) => {
      setEditOpen(true);
      setEditedRecord(data);
    },
  });

  console.log(devices)

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DataTable
        columns={columns}
        data={devices}
        searchValues="name"
        filters={filters}
        onRowSelectionChange={setSelectedIds}
        toolbarExtras={
          <div className="flex flex-row w-full">
            {selectedIds.length > 1 && (
              <ConfirmDeleteManyDialog isPending={isDeleteDevicesPending} selectedIds={selectedIds} handleDeleteMany={handleDeleteMany} />
            )}
            <Button className="h-8 ml-auto" variant="outline" onClick={() => setAddOpen(true)}>
              Додати
              <CirclePlus />
            </Button>
          </div>
        }
      />
      <FormDialog title={"Додати пристрій"} open={addOpen} onOpenChange={setAddOpen}>
        <DeviceAddForm isPending={isCreateDevicePending} onSubmit={handleCreate} />
      </FormDialog>
      <FormDialog title={"Редагування пристрою"} open={editOpen} onOpenChange={setEditOpen}>
        <DeviceEditForm
          previous={editedRecord!}
          isPending={isPatchDevicePending}
          onSubmit={(data) => {
            if (editedRecord != null) handlePatch(editedRecord.id, data);
          }}
        />
      </FormDialog>
      <ConfirmEditManyDialog
        isPending={isPatchDevicesPending}
        open={isEditRequested}
        onOpenChange={setIsEditRequested}
        selectedIds={selectedIds}
        handlePatchMany={handlePatchMany}
      />
    </div>
  );
};
