import { DataTable } from "../data-table";
import { getUserColumns } from "./columns";
import { Mars, Venus, CircleSmall, HardHat, UserStar, UserCog, Spool, Scissors, Layers, Tag, ArchiveIcon } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useCallback, useMemo } from "react";

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
  {
    label: "Worker",
    value: "Worker",
    icon: HardHat,
  },
  {
    label: "Master",
    value: "Master",
    icon: UserCog,
  },
  {
    label: "Manager",
    value: "Manager",
    icon: UserStar
  },
];

const departments = [
  {
    label: "Knitting",
    value: "Knitting",
    icon: Scissors,
  },
  {
    label: "Sewing",
    value: "Sewing",

    icon: Spool,
  },
  {
    label: "Molding",
    value: "Molding",
    icon: Layers,
  },
  {
    label: "Labeling",
    value: "Labeling",
    icon: Tag,
  },
  {
    label: "Packaging",
    value: "Packaging",
    icon: ArchiveIcon,
  },
];

const filters = [
  { column: "role", title: "Role", options: roles },
  { column: "gender", title: "Gender", options: gender },
  { column: "departments", title: "Departments", options: departments },
];

export const EmployeesPage = () => {
  const { data: users } = useUsers.getAll();
  const { mutate: updateUser } = useUsers.update();

  const handleCellUpdate = useCallback(
    (field: string, value: string, row: any) => {
      updateUser({
        id: row.original.id,
        data: {
          ...row.original,
          [field]: value,
        },
      });
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
