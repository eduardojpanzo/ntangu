import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { DialogContextProvider } from "./contexts/dialog-context";
import { RootRoutes } from "./routes";
import { queryClient } from "./lib/query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogContextProvider>
        <>
          <RootRoutes />
          <Toaster />
        </>
      </DialogContextProvider>
    </QueryClientProvider>
  );
}

export default App;
