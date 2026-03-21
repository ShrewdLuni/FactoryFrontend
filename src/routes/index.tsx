import { AuthenticationPage } from "@/pages/auth";
import { BatchPage } from "@/pages/batches";
import { EmployeesPage } from "@/pages/users";
import { BatchPreviewPage } from "@/pages/batches/detail";
import { ProductsPage } from "@/pages/products";
import { QrCodeGenerationPage } from "@/pages/qrcodes";
import { WorkerPlanPage } from "@/pages/worker-plan";
import { WorkstationsPage } from "@/pages/workstations";
import { WorkstationPreviewPage } from "@/pages/workstations/detail";
import { QRCodePreviewPage } from "@/pages/qrcodes/detail";
import type { ForwardRefExoticComponent, JSX, RefAttributes } from "react";
import {
  Bolt,
  Boxes,
  ClipboardList,
  // LandPlot,
  Package,
  PackageCheck,
  PackageOpen,
  QrCode,
  ScanEye,
  Users,
  type LucideProps,
} from "lucide-react";

export interface Route {
  name: string;
  path: string;
  element: React.ReactNode;
  roles: string[];
  group?: string;
  layout?: boolean;
}

const emptyRoute = {
  name: "empty",
  path: "/",
  element: <div></div>,
  roles: ["*"],
  icon: Bolt,
  layout: true,
};

const loginRoute = {
  name: "Authentication",
  path: "/auth",
  element: <AuthenticationPage />,
  roles: ["*"],
  icon: Users,
};

const employeesRoute = {
  name: "Employees",
  path: "/employees",
  element: <EmployeesPage />,
  roles: ["Master"],
  icon: Users,
  layout: true,
};

const productsRoute = {
  name: "Products",
  path: "/products",
  element: <ProductsPage />,
  roles: ["Master"],
  icon: Boxes,
  layout: true,
};

const inProgressBatchesRoute = {
  name: "In Progress",
  path: "/batch/in-progress",
  element: <BatchPage />,
  roles: ["Master"],
  icon: PackageOpen,
  layout: true,
};

const doneBatchesRoute = {
  name: "Batches",
  path: "/batch",
  element: <BatchPage />,
  roles: ["Master"],
  icon: Package,
  layout: true,
};

const singularBatchRoute = {
  name: "Scan",
  path: "/batch/:id/",
  element: <BatchPreviewPage />,
  roles: ["*"],
  icon: PackageCheck,
};

const qrcodeRoute = {
  name: "Generate QR",
  path: "/qrcodes",
  element: <QrCodeGenerationPage />,
  roles: ["Master"],
  icon: QrCode,
  layout: true,
};

const singularQRCodeRoute = {
  name: "Scan",
  path: "/qrcodes/:id/",
  element: <QRCodePreviewPage />,
  roles: ["*"],
  icon: PackageCheck,
};

const workerPlanRoute = {
  name: "Worker Plan",
  path: "/woker/plan",
  element: <WorkerPlanPage />,
  roles: ["Worker"],
  icon: ClipboardList,
  layout: true,
};

const workstationsRoute = {
  name: "Workstations",
  path: "/workstations",
  element: <WorkstationsPage />,
  roles: ["Master"],
  icon: Bolt,
  layout: true,
};

const singularWorkstationRoute = {
  name: "Scan",
  path: "/workstations/:id/",
  element: <WorkstationPreviewPage />,
  roles: ["*"],
  icon: PackageCheck,
};

// const planRoute = {
//   name: "Plan",
//   path: "/plan",
//   element: <EmptyPage />,
//   roles: ["Master"],
//   icon: LandPlot,
//   layout: true,
// };
//
const actionsRoute = {
  name: "Actions",
  path: "/actions",
  element: <div></div>,
  roles: ["Master"],
  icon: ScanEye,
  layout: true,
};

export const routes: Route[] = [
  emptyRoute,
  loginRoute,
  employeesRoute,
  productsRoute,
  inProgressBatchesRoute,
  doneBatchesRoute,
  qrcodeRoute,
  singularQRCodeRoute,
  singularBatchRoute,
  workerPlanRoute,
  workstationsRoute,
  singularWorkstationRoute,
  actionsRoute,
];

export const sidebarElements: (
  | {
      name: string;
      path: string;
      element: JSX.Element;
      roles: string[];
      icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
      layout: boolean;
    }
  | {
      group: string;
      icon: any;
      items: {
        name: string;
        path: string;
        element: JSX.Element;
        roles: string[];
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
        layout: boolean;
      }[];
    }
)[] = [
  employeesRoute,
  productsRoute,
  workstationsRoute,
  // {
  //   group: "Batches",
  //   icon: FileBox,
  //   items: [inProgressBatchesRoute, doneBatchesRoute],
  // },
  doneBatchesRoute,
  qrcodeRoute,
  // actionsRoute,
  emptyRoute,
  workerPlanRoute,
];
