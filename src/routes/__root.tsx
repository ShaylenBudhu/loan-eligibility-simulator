import { createRootRoute, Outlet } from "@tanstack/react-router";

import { NavBar } from "@/components/organisms/nav-bar";
import { ThemeProvider } from "@/contexts/theme-context";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </ThemeProvider>
  ),
});
