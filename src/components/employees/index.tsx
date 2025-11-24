import { useUsers } from "@/hooks/useUsers";
import { DataTable } from "../data-table";
import { EmployeeForm } from "../forms/employee";
import { columns, type EmployeeData } from "./column"

export const EmployeesPage = () => {

  const { users, loading, error } = useUsers()

  console.log(users);
 
  return (
    <DataTable columns={columns} data={users} contentForm={<EmployeeForm/>}/>
  )
}
