describe("Loan Simulator", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit("/loan-simulator");
  });

  it("loads the page with hero and form", () => {
    cy.contains("Loan Eligibility Simulator").should("be.visible");
    cy.contains("Your financial details").should("be.visible");
    cy.contains("button", "Check Eligibility").should("be.visible");
  });

  it("shows validation errors when submitting empty", () => {
    cy.contains("button", "Check Eligibility").click();
    cy.contains(/required|too small/i).should("be.visible");
    cy.contains("Your Assessment").should("not.exist");
  });

  it("submits basic mode and opens the results dialog", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#monthly-living-expenses").type("8000");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("Your Assessment").should("be.visible");
    cy.contains(/Tier \d/).should("be.visible");
    cy.contains("Monthly Payment").should("be.visible");
    cy.contains("Max Loan Eligible").should("be.visible");
  });

  it("switches to advanced mode and reveals extra sections", () => {
    cy.contains("button", /advanced/i).click();
    cy.contains("Household").should("be.visible");
    cy.contains("Dwelling & Infrastructure").should("be.visible");
    cy.contains("Employment & Income").should("be.visible");
    cy.contains("Financial History").should("be.visible");
    cy.contains("Rent / Bond Payment").should("be.visible");
    cy.contains("Other Monthly Expenses").should("be.visible");
  });

  it("shows Risk Score in the dialog for advanced submissions", () => {
    cy.contains("button", /advanced/i).click();
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#other-monthly-expenses").type("5000");
    cy.get("#rent-bond-payment").type("6000");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("Your Assessment").should("be.visible");
    cy.contains("Risk Score").should("be.visible");
    cy.contains("DSI with Proposed Loan").should("be.visible");
    cy.contains(/including SEM criteria/i).should("be.visible");
  });

  it("surfaces the NCA warning when expenses are unrealistically low", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#monthly-living-expenses").type("100");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("Expenses look low").should("be.visible");
  });

  it("flags high requested amounts as unaffordable", () => {
    cy.get("#gross-monthly-income").type("15000");
    cy.get("#monthly-debt-payments").type("5000");
    cy.get("#monthly-living-expenses").type("6000");
    cy.get("#requested-loan-amount").type("500000");
    cy.get("#repayment-term").click();
    cy.contains("12 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("May strain your budget").should("be.visible");
  });

  it("closes the results dialog on escape", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#monthly-living-expenses").type("8000");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();
    cy.contains("Your Assessment").should("be.visible");

    cy.get("body").type("{esc}");
    cy.contains("Your Assessment").should("not.exist");
  });

  it("shows a Download PDF button when results are open", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#monthly-living-expenses").type("8000");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("button", "Download PDF").should("be.visible").click();
    // The click triggers a PDF download via a Blob-URL anchor. Cypress can't
    // easily inspect the saved file, but confirming no error is thrown and
    // the button remains interactive covers the happy path.
    cy.contains("button", "Download PDF").should("be.visible");
  });

  it("applies a breakdown total from the expense modal", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.contains("button", "Break it down").click();
    cy.contains("Break down your monthly expenses").should("be.visible");
    cy.get("#rent-bond").type("4000");
    cy.get("#food-groceries").type("2500");
    cy.contains("button", "Apply total").click();
    cy.contains("Break down your monthly expenses").should("not.exist");
    cy.get("#monthly-living-expenses").should("have.value", "6500");
  });

  it("renders charts in the results dialog", () => {
    cy.get("#gross-monthly-income").type("25000");
    cy.get("#monthly-debt-payments").type("2000");
    cy.get("#monthly-living-expenses").type("8000");
    cy.get("#requested-loan-amount").type("50000");
    cy.get("#repayment-term").click();
    cy.contains("36 months").click();
    cy.contains("button", "Check Eligibility").click();

    cy.contains("Net Income Allocation").should("be.visible");
    cy.contains("Loan Balance Over Time").should("be.visible");
  });
});
