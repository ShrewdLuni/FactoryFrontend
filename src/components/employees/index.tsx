import { useUsers } from "@/hooks/useUsers";
import { DataTable } from "../data-table";
import { EmployeeForm } from "../forms/employee";
import { columns } from "./columns"
import { Mars, Venus, CircleSmall, HardHat, UserStar, UserCog} from "lucide-react";

export const EmployeesPage = () => {

  const { users } = useUsers()

  const gender = [
    {
      label: "Male",
      value: "Male",
      icon: Mars,
    },
    {
      label: "Female",
      value: "Female",
      icon: Venus,
    },
    {
      label: "Other",
      value: "Other",
      icon: CircleSmall,
    },
  ]

  const roles = [
    {
      label: "Worker",
      value: "worker",
      icon: HardHat,
    },
    {
      label: "Manager",
      value: "manager",
      icon: UserStar,
    },
    {
      label: "Master",
      value: "master",
      icon: UserCog,
    },
  ]

  const filters = [
    {column: "role", title: "Role", options: roles,},
    {column: "gender", title: "Gender", options: gender,}
  ]
 
  return (
    <DataTable columns={columns} data={users} contentForm={<EmployeeForm/>} filters={filters}/>
  )
}
