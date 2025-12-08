import { ThemeProvider } from "./ThemeProvider";
import { AppRoutes } from "./AppRoutes";

function App() {

  return (
    <ThemeProvider>
      <AppRoutes/>
    </ThemeProvider>
  )
}

export default App;
