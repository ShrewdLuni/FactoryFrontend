import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { routes } from "./routes/index";
import { useAuth } from "./AuthProvider";
import { Layout } from "./components/sidebar/layout";

export function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate to="/employees" replace />
            : <Navigate to="/auth" replace />
        }
      />

      <Route
        path="/auth"
        element={
          user ? <Navigate to="/" replace /> : routes.find(r => r.path === "/auth")!.element
        }
      />

      <Route element={<ProtectedRoute roles={["*"]} />}>
        {routes
          .filter(r => r.path !== "/auth")
          .map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.layout
                  ? <Layout>{route.element}</Layout>
                  : route.element
              }
            />
          ))}
      </Route>
    </Routes>
  );
}

