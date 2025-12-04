import { useUsers } from "@/hooks/useUsers";
import { DataTable } from "../data-table";
import { EmployeeForm } from "../forms/employee";
import { columns } from "./column"

export const EmployeesPage = () => {

  const { users, loading, error } = useUsers()
 
  return (
    <DataTable columns={columns} data={users} contentForm={<EmployeeForm/>}/>
  )
}
