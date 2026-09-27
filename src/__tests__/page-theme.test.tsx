import { render, screen } from "@testing-library/react";

import { PageTheme } from "@/components/templates";

describe("PageTheme", () => {
  it("renders children", () => {
    render(
      <PageTheme>
        <p data-testid="child">Hello</p>
      </PageTheme>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });

  it("applies gradient background classes", () => {
    const { container: c } = render(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    expect(c.firstElementChild).toHaveClass(
      "bg-linear-to-br",
      "from-capitec-blue",
    );
  });

  it("renders 2 blob overlay divs", () => {
    const { container: c } = render(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    expect(c.querySelectorAll(".blur-3xl")).toHaveLength(2);
  });

  it("renders an element with an opacity class", () => {
    const { container: c } = render(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    const opacityEl = c.querySelector('[class*="opacity-"]');
    expect(opacityEl).toBeInTheDocument();
  });

  it("passes additional className to content wrapper", () => {
    const { container: c } = render(
      <PageTheme className="my-custom-class">
        <div />
      </PageTheme>,
    );
    expect(c.querySelector(".my-custom-class")).toBeInTheDocument();
  });

  it("has min-height class applied", () => {
    const { container: c } = render(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    expect(c.firstElementChild).toHaveClass("min-h-[calc(100vh-56px)]");
  });
});
