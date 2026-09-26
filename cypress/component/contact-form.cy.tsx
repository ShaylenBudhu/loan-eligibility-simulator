import { ThemeProvider } from "@/contexts";
import { ContactPage } from "@/pages/contact.page";

const mountContact = () => {
  cy.mount(
    <ThemeProvider>
      <ContactPage />
    </ThemeProvider>,
  );
};

describe("ContactPage — form", () => {
  beforeEach(mountContact);

  it("renders the form with all fields", () => {
    cy.get("#name").should("exist");
    cy.get("#email").should("exist");
    cy.get("#message").should("exist");
  });

  it("does not submit when fields are empty", () => {
    cy.get("form").find('button[type="submit"]').click();
    cy.contains("Message sent!").should("not.exist");
  });

  it("shows success state after valid submission", () => {
    cy.get("#name").type("John Doe");
    cy.get("#email").type("john@example.com");
    cy.get("#message").type("This is a test message.");
    cy.get("form").find('button[type="submit"]').click();
    cy.contains("Message sent!").should("be.visible");
  });

  it("shows the 24-hour reply message on success", () => {
    cy.get("#name").type("Jane");
    cy.get("#email").type("jane@example.com");
    cy.get("#message").type("Hello there");
    cy.get("form").find('button[type="submit"]').click();
    cy.contains("We'll get back to you within 24 hours").should("be.visible");
  });

  it('resets form when "Send another message" is clicked', () => {
    cy.get("#name").type("Reset Test");
    cy.get("#email").type("reset@test.com");
    cy.get("#message").type("Testing reset");
    cy.get("form").find('button[type="submit"]').click();
    cy.contains("Send another message").click();
    cy.get("#name").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#message").should("have.value", "");
  });

  it("renders all 4 contact detail cards", () => {
    cy.contains("Call us").should("exist");
    cy.contains("Email us").should("exist");
    cy.contains("Head office").should("exist");
    cy.contains("Branch hours").should("exist");
  });
});
