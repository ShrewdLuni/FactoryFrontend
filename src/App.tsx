import { Layout } from "./components/sidebar/layout";
import { Routes, Route} from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { routes } from "./routes";
import { ThemeProvider } from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          {routes.map((route) => {
            return <Route
              key = {route.path}
              path = {route.path}
              element = {<ProtectedRoute element={route.element} roles={route.roles}/>}
            />
          })}
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App;
