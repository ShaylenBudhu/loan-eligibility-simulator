import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import { ThemeProvider } from "@/contexts";
import { ThemeToggle } from "@/components";

const renderToggle = (dark = false) => {
  localStorage.setItem("theme", dark ? "dark" : "light");
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
};

describe("ThemeToggle", () => {
  afterEach(() => localStorage.removeItem("theme"));

  it("renders the toggle button with aria-label", () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });

  it("has cursor-pointer class", () => {
    renderToggle();
    expect(screen.getByRole("button", { name: "Toggle theme" })).toHaveClass(
      "cursor-pointer",
    );
  });

  it("clicking in light mode applies dark class to <html>", async () => {
    renderToggle(false);
    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement).toHaveClass("dark");
  });

  it("clicking in dark mode removes dark class from <html>", async () => {
    renderToggle(true);
    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("saves updated preference to localStorage after click", async () => {
    renderToggle(false);
    await userEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
