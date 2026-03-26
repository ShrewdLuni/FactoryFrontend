import { ThemeProvider } from "./ThemeProvider";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes/>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App;
