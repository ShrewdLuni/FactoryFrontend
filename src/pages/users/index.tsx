import { getUserColumns } from "./columns";
import { useUsers } from "@/hooks/useUsers";
import { useCallback, useMemo } from "react";
import type { User, UserGender, InsertUser } from "@/types/users";
import type { Row } from "@tanstack/react-table";
import { useGetAllUsers } from "@/api/generated/user/user";
import { useRoleOptions } from "@/hooks/useRoleOptions";
import { useDepartmentOptions } from "@/hooks/useDepartmentOptions";
import { useGenderOptions } from "@/hooks/useGenderOptions";
import { DataTable } from "@/components/data-table";


export function userToInsert(user: User): InsertUser {
  return {
    code: user.code,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    patronymic: user.patronymic,
    email: user.email,
    phone: user.phone,
    gender: user.gender ?? "Other",
    dateOfBirth: user.dateOfBirth,
    isActive: user.isActive,
    roleId: user.role?.id ?? null,
    departmentIds: user.departments?.map((d) => d.id) ?? [],
  };
}

export const EmployeesPage = () => {
  const { data: roles, isLoading } = useRoleOptions();
  const { data: departments } = useDepartmentOptions();
  const { data: gender } = useGenderOptions();

  const filters = [
    { column: "role", title: "Role", options: roles },
    { column: "gender", title: "Gender", options: gender },
    { column: "departments", title: "Departments", options: departments },
  ];

  const { data: users } = useGetAllUsers();
  const { mutate: updateUser } = useUsers.update();

  const handleCellUpdate = useCallback(
    (field: string, value: unknown, row: Row<User>) => {
      const base = userToInsert(row.original);

      let patch: Partial<InsertUser> = {};

      if (field === "role") {
        const match = roles.find((r) => r.value === value);
        patch = { roleId: match?.id ?? null };
      } else if (field === "departments") {
        const ids = (value as string[])
        .map((v) => departments.find((d) => d.value === v)?.id)
        .filter((id): id is number => id !== undefined);
        patch = { departmentIds: ids };
      } else if (field === "gender") {
        patch = { gender: value as UserGender };
      }

      updateUser({ id: row.original.id, data: { ...base, ...patch } });
    },
    [updateUser],
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        roleSelect: roles,
        genderSelect: gender,
        departmentsSelect: departments,
        onCellUpdate: handleCellUpdate,
      }),
    [handleCellUpdate, roles, departments, gender],
  );

  if (isLoading)
    return <div>Loading</div>

  return <DataTable columns={columns} isAddSection={false} data={users ? users : []} filters={filters} searchValues={"fullName"} initialState={{columnVisibility: { code: false, email: false, phone: false }}} />;
};
