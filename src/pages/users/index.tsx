import { getUserColumns } from "./columns";
// import { getGetAllUsersQueryKey, useCreateUser, useDeleteUser, useDeleteUsers, useGetAllUsers, usePatchUser, usePatchUsers } from "@/api/generated/user/user";
import { getGetAllUsersQueryKey, useGetAllUsers, usePatchUser } from "@/api/generated/user/user";
import { useRoleOptions } from "@/hooks/useRoleOptions";
import { useDepartmentOptions } from "@/hooks/useDepartmentOptions";
import { useGenderOptions } from "@/hooks/useGenderOptions";
import { DataTable } from "@/components/data-table";
import { useQueryClient } from "@tanstack/react-query";
// import { createInvalidateCrudHandlers, createOptimisticCrudHandlers } from "@/lib/crud";
import { createOptimisticCrudHandlers } from "@/lib/crud";
import type { User, UserBulkPatch, UserPatch } from "@/api/generated/models";
import { useState } from "react";

export const UsersPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPatch>()

  // const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const [isEditRequested, setIsEditRequested] = useState<boolean>(false);
  console.log(selectedUser, isEditRequested, editOpen)

  const { data: roles } = useRoleOptions();
  const { data: departments, raw: rawDepartments } = useDepartmentOptions();
  const { data: gender } = useGenderOptions();

  const filters = [
    { column: "role", title: "Роль", options: roles },
    { column: "gender", title: "Стать", options: gender },
    { column: "departments", title: "Відділи", options: departments },
  ];

  const queryClient = useQueryClient();
  const queryKey = getGetAllUsersQueryKey();

  const optimistic = createOptimisticCrudHandlers<User, UserPatch, User, UserBulkPatch>(
    queryClient,
    queryKey,
    "User",
    {
      toOptimistic: (data) => {
        const { departmentIds, role, ...rest } = data as UserPatch & { departmentIds?: number[] };
        return {
          ...rest,
          ...(departmentIds && {
            departments: rawDepartments.filter((d) => departmentIds.includes(d.id)),
          }),
          // ...(role?.id != null && {
          //   role: rawRoles.find((r) => r.id === role.id) ?? undefined,
          // }),
        };
      },
    },
  );

  // const invalidated = createInvalidateCrudHandlers(queryClient, queryKey, "User");

  const { data: users = [], isLoading } = useGetAllUsers();
  const { mutate: patchUser, isPending: isPatchUserPending } = usePatchUser({ mutation: optimistic.patch });  
  // const { mutate: patchUsers, isPending: isPatchUsersPending } = usePatchUsers({ mutation: optimistic.patchMany });
  // const { mutate: deleteUser } = useDeleteUser({ mutation: invalidated.delete });
  // const { mutate: deleteUsers, isPending: isDeleteUsersPending } = useDeleteUsers({ mutation: invalidated.deleteMany });
  // const { mutate: createUser, isPending: isCreateUserPending } = useCreateUser({ mutation: invalidated.create });


  const handlePatch = (id: number, data: UserPatch) => {
    console.log(isPatchUserPending)
    if (selectedIds.length < 2) {
      patchUser({ id: String(id), data });
      setEditOpen(false);
    } else {
      setEditOpen(false);
      setIsEditRequested(true);
      setSelectedUser(data);
    }
  }

  const handleDelete = () => {

  }

  const openEditDialog = () => {

  }

  const columns = getUserColumns({
    roleSelect: roles,
    genderSelect: gender,
    departmentsSelect: departments,
    handlePatch,
    handleDelete,
    openEditDialog,
  })

  if (isLoading) return <div>Loading</div>

  return (
    <DataTable 
      columns={columns} 
      data={users} 
      filters={filters} 
      searchValues={"fullName"} 
      onRowSelectionChange={setSelectedIds}
      initialState={{columnVisibility: { code: false, email: false, phone: false }}} />
  );
};
