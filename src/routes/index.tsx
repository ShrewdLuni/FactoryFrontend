import { BatchPage } from "@/components/batch"
import { EmployeesPage } from "@/components/employees"
import { WorkerPlanPage } from "@/components/worker-plan"

export const routes = [
  {
    path: "/employees",
    element: <EmployeesPage/>,
    roles: ["manager", "observer", "superuser"]
  },
  {
    path: "/batch",
    element: <BatchPage/>,
    roles: ["manager", "master", "observer", "superuser"]
  },
  {
    path: "/plan",
    element: <WorkerPlanPage/>,
    roles: ["worker", "manager", "master", "observer", "superuser"]
  },
]
