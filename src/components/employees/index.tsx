import { DataTable } from "../data-table";
import { EmployeeForm } from "../forms/employee";
import { getUserColumns} from "./columns"
import { Mars, Venus, CircleSmall, HardHat, UserStar, UserCog} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

export const EmployeesPage = () => {


  const { data: users, isLoading } = useUsers.getAll()
  const { mutate: updateUser } = useUsers.update()

  const handleCellUpdate = (field: string, value: string, row: any) => {
    updateUser({
      id: row.original.id,
      data: {
        ...row.original,
        [field]: value,
      }
    })
  }

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
      value: "Worker",
      icon: HardHat,
    },
    {
      label: "Manager",
      value: "Manager",
      icon: UserStar,
    },
    {
      label: "Master",
      value: "Master",
      icon: UserCog,
    },
  ]

  const departments = [
    {
      label: "Knitting",
      value: "Knitting",
    },
    {
      label: "Sewing",
      value: "Sewing",
    },
    {
      label: "Molding",
      value: "Molding",
    },
    {
      label: "Labeling",
      value: "Labeling",
    },
    {
      label: "Packaging",
      value: "Packaging",
    }
  ]

  const filters = [
    {column: "role", title: "Role", options: roles,},
    {column: "gender", title: "Gender", options: gender,}
  ]

  if (isLoading) {
    return <div>Is loading</div>
  }
 
  return (
    <DataTable 
      columns={
        getUserColumns({
          roleSelect: roles, 
          genderSelect: gender, 
          departmentsSelect: departments,
          onCellUpdate: handleCellUpdate,
        })
      } 
      data={users ? users : []} 
      contentForm={<EmployeeForm/>} 
      filters={filters} 
      searchValues={"fullName"}/>
  )
}
