import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { routes } from "@/routes/index";
import { useAuth } from "@/AuthProvider";
import { Layout } from "@/components/sidebar/layout";

export function AppRoutes() {
  const { user } = useAuth();

  const authRoute = routes.find(r => r.path === "/auth");
  const protectedRoutes = routes.filter(r => r.path !== "/auth");
  const layoutRoutes = protectedRoutes.filter(r => r.layout);
  const plainRoutes = protectedRoutes.filter(r => !r.layout);

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : authRoute!.element}
      />
      <Route element={<ProtectedRoute roles={["*"]} />}>
        <Route element={<Layout/>}>
          {layoutRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element}/>
          ))}
        </Route>
        {plainRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element}/>
        ))}
      </Route>
    </Routes>
  );
}
