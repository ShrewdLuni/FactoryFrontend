import { BatchPage } from "@/components/batch"
import { EmployeesPage } from "@/components/employees"
import { WorkerPlanPage } from "@/components/worker-plan"

export interface Route {
  name: string
  path: string
  element: React.ReactNode
  roles: string[]
  group?: string
}

const employeesRoute = {
  name: "Employees",
  path: "/employees",
  element: <EmployeesPage/>,
  roles: ["manager", "observer", "superuser"],
}

const inProgressBatchesRoute = {
  name: "In Progress",
  path: "/batch",
  element: <BatchPage/>,
  roles: ["manager", "master", "observer", "superuser"],
}

const doneBatchesRoute = {
  name: "Done",
  path: "/batch",
  element: <BatchPage/>,
  roles: ["manager", "observer", "superuser"],
}

const planRoute = {
  name: "Plan",
  path: "/plan",
  element: <WorkerPlanPage/>,
  roles: ["worker", "manager", "master", "observer", "superuser"],
}

export const routes: Route[] = [
  employeesRoute,
  inProgressBatchesRoute,
  doneBatchesRoute,
  planRoute
]

export const sidebarElements = [
  employeesRoute,
  {
    group: "Batch",
    items: [inProgressBatchesRoute, doneBatchesRoute],
  },
  planRoute
]
