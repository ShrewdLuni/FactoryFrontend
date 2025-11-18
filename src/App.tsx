import { Layout } from "./components/sidebar/layout";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { AppRoutes } from "./AppRoutes";

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
