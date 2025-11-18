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
            ? (<Navigate to="/batch/in-progress" replace />) 
            : (<Navigate to="/auth" replace />)
        }
      />
      {routes.map((route) => {
        const isAuthRoute = route.path === "/auth";

        const element = isAuthRoute
        ? (user ? <Navigate to="/" replace/> : route.element)
        : <ProtectedRoute element={route.element} roles={route.roles}/>

        return <Route
          key = {route.path}
          path = {route.path}
          element = {route.layout ? <Layout>{element}</Layout> : element}
        />
      })}
    </Routes>
  )
}
