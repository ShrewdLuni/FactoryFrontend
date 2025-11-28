import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { AppRoutes } from "./AppRoutes";
import { AuthGate } from "./AuthGate";

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <AppRoutes/>
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
