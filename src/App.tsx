import { ThemeProvider } from "./ThemeProvider";
import { AppRoutes } from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes/>
        <Toaster richColors/>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App;
