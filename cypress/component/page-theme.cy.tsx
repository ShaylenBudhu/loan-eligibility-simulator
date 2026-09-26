import { PageTheme } from "@/components/templates";

describe("PageTheme", () => {
  it("renders children", () => {
    cy.mount(
      <PageTheme>
        <p data-cy="child">Hello</p>
      </PageTheme>,
    );
    cy.get('[data-cy="child"]').should("contain.text", "Hello");
  });

  it("applies gradient background classes", () => {
    cy.mount(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    cy.get("div")
      .first()
      .should("have.class", "bg-linear-to-br")
      .and("have.class", "from-capitec-blue");
  });

  it("renders 2 blob overlay divs", () => {
    cy.mount(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    cy.get(".blur-3xl").should("have.length", 2);
  });

  it("renders the grid overlay with low opacity", () => {
    cy.mount(
      <PageTheme>
        <div />
      </PageTheme>,
    );

    cy.get('[class*="opacity-"]').should("exist");
  });

  it("passes additional className to content wrapper", () => {
    cy.mount(
      <PageTheme className="my-custom-class">
        <div />
      </PageTheme>,
    );
    cy.get(".my-custom-class").should("exist");
  });

  it("has min-height class applied", () => {
    cy.mount(
      <PageTheme>
        <div />
      </PageTheme>,
    );
    cy.get("div").first().should("have.class", "min-h-[calc(100vh-56px)]");
  });
});
