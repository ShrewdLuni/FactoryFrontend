import { ThemeProvider } from "./ThemeProvider";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function App() {

  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes/>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App;
