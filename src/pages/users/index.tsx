import { DataTable } from "@/components/data-table";
import { getUserColumns } from "./columns";
import { Mars, Venus, CircleSmall, HardHat, UserCog, Spool, Scissors, Layers, Tag, ArchiveIcon, Cone } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useCallback, useMemo } from "react";
import type { User, UserGender, InsertUser } from "@/types/users";
import type { Row } from "@tanstack/react-table";

const gender = [
  {
    label: "Male",
    value: "Male",
    icon: Mars,
  },
  {
    label: "Female",
    value: "Female",
    icon: Venus
  },
  {
    label: "Other",
    value: "Other",
    icon: CircleSmall 
  },
];

const roles = [
  { id: 1, label: "Worker", value: "Worker", icon: HardHat },
  { id: 2, label: "Master", value: "Master", icon: UserCog },
];

const departments = [
  { id: 1, label: "Knitting", value: "Knitting", icon: Scissors },
  { id: 2, label: "Sewing", value: "Sewing", icon: Spool },
  { id: 3, label: "Turning", value: "Turning", icon: Cone },
  { id: 4, label: "Molding", value: "Molding", icon: Layers },
  { id: 5, label: "Labeling", value: "Labeling", icon: Tag },
  { id: 6, label: "Packaging", value: "Packaging", icon: ArchiveIcon },
];

const filters = [
  { column: "role", title: "Role", options: roles },
  { column: "gender", title: "Gender", options: gender },
  { column: "departments", title: "Departments", options: departments },
];

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
  const { data: users } = useUsers.getAll();
  const { mutate: updateUser } = useUsers.update();

  console.log(users)

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
    [handleCellUpdate],
  );

  return <DataTable columns={columns} isAddSection={false} data={users ? users : []} filters={filters} searchValues={"fullName"} initialState={{columnVisibility: { code: false, email: false, phone: false }}} />;
};
