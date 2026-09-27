import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { NavBar } from "@/components";
import { ThemeProvider } from "@/contexts/theme-context";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </ThemeProvider>
    </QueryClientProvider>
  ),
});
