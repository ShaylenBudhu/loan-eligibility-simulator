import { createRootRoute, Outlet } from "@tanstack/react-router";

import { NavBar } from "@/components/organisms/NavBar";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
