import { Button } from "@/components";

describe("Button", () => {
  it("renders with default variant", () => {
    cy.mount(<Button>Click me</Button>);
    cy.get("button").should("exist").and("contain.text", "Click me");
  });

  it("renders ghost variant", () => {
    cy.mount(<Button variant="ghost">Ghost</Button>);
    cy.get("button").should("exist").and("contain.text", "Ghost");
  });

  it("renders lg size", () => {
    cy.mount(<Button size="lg">Large</Button>);
    cy.get("button").should("have.class", "h-9");
  });

  it("renders icon size", () => {
    cy.mount(<Button size="icon">★</Button>);
    cy.get("button").should("have.class", "size-8");
  });

  it("fires onClick when clicked", () => {
    const onClick = cy.stub().as("onClick");
    cy.mount(<Button onClick={onClick}>Click</Button>);
    cy.get("button").click();
    cy.get("@onClick").should("have.been.calledOnce");
  });

  it("is disabled when disabled prop is set", () => {
    cy.mount(<Button disabled>Disabled</Button>);
    cy.get("button").should("be.disabled");
  });

  it("renders children correctly", () => {
    cy.mount(<Button>Save Changes</Button>);
    cy.get("button").should("contain.text", "Save Changes");
  });
});
