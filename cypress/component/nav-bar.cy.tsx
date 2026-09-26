import {
  createRouter,
  RouterProvider,
  createRootRoute,
  createMemoryHistory,
} from "@tanstack/react-router";

import { ThemeProvider } from "@/contexts";
import { NavBar } from "@/components/organisms";

const makeRouter = () => {
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

const mountNav = (dark = false) => {
  localStorage.setItem("theme", dark ? "dark" : "light");
  cy.mount(<RouterProvider router={makeRouter()} />);
};

describe("NavBar", () => {
  afterEach(() => localStorage.removeItem("theme"));

  describe("desktop (≥1024px)", () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      mountNav();
    });

    it("hides the burger button", () => {
      cy.get('button[aria-label="Toggle menu"]').should("not.be.visible");
    });

    it("shows nav links", () => {
      cy.get("nav a").should("have.length.greaterThan", 1);
    });
  });

  describe("mobile (<1024px)", () => {
    beforeEach(() => {
      cy.viewport(768, 900);
      mountNav();
    });

    it("shows the burger button", () => {
      cy.get('button[aria-label="Toggle menu"]').should("be.visible");
    });

    it("opens mobile menu on burger click", () => {
      cy.get('button[aria-label="Toggle menu"]').click();
      cy.get('[aria-expanded="true"]').should("exist");
    });

    it("closes mobile menu on second click", () => {
      cy.get('button[aria-label="Toggle menu"]').click();
      cy.get('button[aria-label="Toggle menu"]').click();
      cy.get('[aria-expanded="false"]').should("exist");
    });
  });

  describe("logo swap", () => {
    it("uses capitec-logo in light mode", () => {
      mountNav(false);
      cy.get('img[alt="Capitec Bank"]')
        .invoke("attr", "src")
        .should("include", "capitec-logo");
    });

    it("uses capitecfull in dark mode", () => {
      mountNav(true);
      cy.get('img[alt="Capitec Bank"]')
        .invoke("attr", "src")
        .should("include", "capitecfull");
    });
  });
});
