import { AuthenticationPage } from "@/components/authentication";
import { BatchPage } from "@/components/batch";
import { EmployeesPage } from "@/components/employees";
import { PlanPage } from "@/components/plan";
import { BatchPreviewPage } from "@/components/batch-preview";
import { ProductsPage } from "@/components/products";
import { QrCodeGenerationPage } from "@/components/qr-generation";
import { WorkerPlanPage } from "@/components/worker-plan";
import { WorkstationsPage } from "@/components/workstations";

import {
  Bolt,
  Boxes,
  ClipboardList,
  LandPlot,
  Package,
  PackageCheck,
  PackageOpen,
  QrCode,
  // ScanEye,
  Users,
  type LucideProps,
} from "lucide-react";
import { WorkstationPreviewPage } from "@/components/workstation-preview";
import { QRCodePreviewPage } from "@/components/qrcode-preview";
// import { Questioner } from "@/components/questioner";
import { EmptyPage } from "@/components/empty";
import type { ForwardRefExoticComponent, JSX, RefAttributes } from "react";

export interface Route {
  name: string;
  path: string;
  element: React.ReactNode;
  roles: string[];
  group?: string;
  layout?: boolean;
}

// ('Superuser', 'Master', 'Manager', 'Worker', 'Observer'); 

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
  roles: ["Master", "Manager", "Observer", "Superuser"],
  icon: Users,
  layout: true,
};

const productsRoute = {
  name: "Products",
  path: "/products",
  element: <ProductsPage />,
  roles: ["Master", "Manager", "Observer", "Superuser"],
  icon: Boxes,
  layout: true,
};

const inProgressBatchesRoute = {
  name: "In Progress",
  path: "/batch/in-progress",
  element: <BatchPage />,
  roles: ["Manager", "Master", "Observer", "Superuser"],
  icon: PackageOpen,
  layout: true,
};

const doneBatchesRoute = {
  name: "Batches",
  path: "/batch",
  element: <BatchPage />,
  roles: ["Manager", "Master", "Observer", "Superuser"],
  icon: Package,
  layout: true,
};

const singularBatchRoute = {
  name: "Scan",
  path: "/batch/:id/",
  element: <BatchPreviewPage/>,
  roles: ["*"],
  icon: PackageCheck,
};

const qrcodeRoute = {
  name: "Generate QR",
  path: "/qrcodes",
  element: <QrCodeGenerationPage />,
  roles: ["Manager", "Master", "Observer", "Superuser"],
  icon: QrCode,
  layout: true,
};

const singularQRCodeRoute = {
  name: "Scan",
  path: "/qrcodes/:id/",
  element: <QRCodePreviewPage/>,
  roles: ["*"],
  icon: PackageCheck,
};

const workerPlanRoute = {
  name: "Worker Plan",
  path: "/woker/plan",
  element: <WorkerPlanPage/>,
  roles: ["Worker"],
  icon: ClipboardList, 
  layout: true,
}

const workstationsRoute = {
  name: "Workstations",
  path: "/workstations",
  element: <WorkstationsPage/>,
  roles: ["Manager", "Master", "Observer", "Superuser"],
  icon: Bolt, 
  layout: true,
}

const emptyRoute = {
  name: "empty",
  path: "/",
  element: <EmptyPage/>,
  roles: ["*"],
  icon: Bolt, 
  layout: true,
}

const singularWorkstationRoute = {
  name: "Scan",
  path: "/workstations/:id/",
  element: <WorkstationPreviewPage/>,
  roles: ["*"],
  icon: PackageCheck,
};

const planRoute = {
  name: "Plan",
  path: "/plan",
  element: <PlanPage/>,
  roles: ["Manager", "Master", "Observer", "Superuser"],
  icon: LandPlot, 
  layout: true,
}

// const actionsRoute = {
//   name: "Actions",
//   path: "/actions",
//   element: <Questioner/>,
//   roles: ["Manager", "Master", "Observer", "Superuser"],
//   icon: ScanEye, 
//   layout: true,
// }

export const routes: Route[] = [
  employeesRoute,
  productsRoute,
  inProgressBatchesRoute,
  doneBatchesRoute,
  loginRoute,
  qrcodeRoute,
  singularQRCodeRoute,
  singularBatchRoute,
  workerPlanRoute,
  workstationsRoute,
  singularWorkstationRoute,
  planRoute,
  // actionsRoute,
  emptyRoute,
];

export const sidebarElements: ({
  name: string;
  path: string;
  element: JSX.Element;
  roles: string[];
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  layout: boolean;
} | {
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
  })[] = [
    employeesRoute,
    productsRoute,
    workstationsRoute,
    // {
    //   group: "Batches",
    //   icon: FileBox,
    //   items: [inProgressBatchesRoute, doneBatchesRoute],
    // },
    doneBatchesRoute,
    planRoute,
    qrcodeRoute,
    // actionsRoute,
    emptyRoute,
    workerPlanRoute,
  ];
