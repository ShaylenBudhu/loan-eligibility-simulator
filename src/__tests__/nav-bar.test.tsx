import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createMemoryHistory,
} from "@tanstack/react-router";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import { NavBar } from "@/components";
import { ThemeProvider } from "@/contexts";

const makeRouter = (dark = false) => {
  localStorage.setItem("theme", dark ? "dark" : "light");
  const root = createRootRoute({
    component: () => (
      <ThemeProvider>
        <NavBar />
      </ThemeProvider>
    ),
  });
  return createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
};

describe("NavBar", () => {
  afterEach(() => localStorage.removeItem("theme"));

  it("renders the burger menu button", async () => {
    render(<RouterProvider router={makeRouter()} />);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Toggle menu" }),
      ).toBeInTheDocument(),
    );
  });

  it("renders nav links", async () => {
    render(<RouterProvider router={makeRouter()} />);
    await waitFor(() =>
      expect(screen.getAllByRole("link").length).toBeGreaterThan(1),
    );
  });

  it("opens mobile menu on burger click (aria-expanded becomes true)", async () => {
    render(<RouterProvider router={makeRouter()} />);
    const burger = await screen.findByRole("button", { name: "Toggle menu" });
    await userEvent.click(burger);
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes mobile menu on second click (aria-expanded becomes false)", async () => {
    render(<RouterProvider router={makeRouter()} />);
    const burger = await screen.findByRole("button", { name: "Toggle menu" });
    await userEvent.click(burger);
    await userEvent.click(burger);
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("uses a different logo in light vs dark mode", async () => {
    const { unmount } = render(<RouterProvider router={makeRouter(false)} />);
    const lightImg = await screen.findByAltText("Capitec Bank");
    const lightSrc = lightImg.getAttribute("src");
    unmount();

    render(<RouterProvider router={makeRouter(true)} />);
    const darkImg = await screen.findByAltText("Capitec Bank");
    const darkSrc = darkImg.getAttribute("src");

    expect(lightSrc).toBeTruthy();
    expect(darkSrc).toBeTruthy();
    expect(lightSrc).not.toBe(darkSrc);
  });
});
