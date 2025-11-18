import { AuthenticationPage } from "@/components/authentication";
import { BatchPage } from "@/components/batch";
import { EmployeesPage } from "@/components/employees";
import { Preview } from "@/components/preview";
import { ProductsPage } from "@/components/products";
import { WorkerPlanPage } from "@/components/worker-plan";
import {
  Boxes,
  FileBox,
  ListTodo,
  PackageCheck,
  PackageOpen,
  PackagePlus,
  ScanBarcode,
  Users,
} from "lucide-react";

export interface Route {
  name: string;
  path: string;
  element: React.ReactNode;
  roles: string[];
  group?: string;
  layout?: boolean;
}

const loginRoute = {
  name: "Authentication",
  path: "/auth",
  element: <AuthenticationPage/>,
  roles: ["*"],
  icon: Users,
  layout: false,
}

const employeesRoute = {
  name: "Employees",
  path: "/employees",
  element: <EmployeesPage />,
  roles: ["manager", "observer", "superuser"],
  icon: Users,
  layout: true,
};

const productsRoute = {
  name: "Products",
  path: "/products",
  element: <ProductsPage />,
  roles: ["manager", "master", "observer", "superuser"],
  icon: Boxes,
  layout: true,
};

const inProgressBatchesRoute = {
  name: "In Progress",
  path: "/batch/in-progress",
  element: <BatchPage />,
  roles: ["manager", "master", "observer", "superuser"],
  icon: PackageOpen,
  layout: true,
};

const doneBatchesRoute = {
  name: "Done",
  path: "/batch/done",
  element: <BatchPage />,
  roles: ["manager", "observer", "superuser"],
  icon: PackageCheck,
  layout: true,
};

const previewRoute = {
  name: "Preview",
  path: "/batch/preview",
  element: <Preview/>,
  roles: ["*"],
  icon: PackageOpen,
  layout: false,
}

const createBatchRotue = {
  name: "Initialize",
  path: "/batch/create",
  element: <BatchPage/>,
  roles: ["manager", "observer", "superuser"],
  icon: PackagePlus 
}

// const planRoute = {
//   name: "Plan",
//   path: "/plan",
//   element: <WorkerPlanPage />,
//   roles: ["worker", "manager", "master", "observer", "superuser"],
//   icon: ListTodo,
// };
//
// const scanRoute = {
//   name: "Scan",
//   path: "/scan",
//   element: <WorkerPlanPage />,
//   roles: ["worker", "manager", "master", "observer", "superuser"],
//   icon: ScanBarcode,
// };
//

export const routes: Route[] = [
  employeesRoute,
  productsRoute,
  inProgressBatchesRoute,
  doneBatchesRoute,
  // createBatchRotue,
  // planRoute,
  // scanRoute,
  loginRoute,
  previewRoute
];

export const sidebarElements = [
  employeesRoute,
  productsRoute,
  {
    group: "Batches",
    icon: FileBox,
    items: [inProgressBatchesRoute, doneBatchesRoute],
  },
  // planRoute,
  // scanRoute,
];
