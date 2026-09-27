import { render, screen } from "@testing-library/react";

import { type LoanResults, ResultsPanel } from "@/components";

const basicResults: LoanResults = {
  grossMonthlyIncome: 25000,
  netMonthlyIncome: 21000,
  estimatedTax: 4000,
  debtMonthlyPayment: 2000,
  livingExpenses: 8000,
  requestedLoanAmount: 50000,
  repaymentTerms: 36,
  dti: 0.08,
  disposableIncome: 11000,
  affordabilityCap: 0.6,
  maxAffordablePayment: 6600,
  riskTier: 1,
  riskTierLabel: "Tier 1 – Low Risk",
  interestRate: 0.14,
  monthlyPayment: 1709,
  maxLoanAmount: 190000,
  isAffordable: true,
  belowNcaMinimum: false,
  ncaMinimumExpenses: 2855,
};

describe("ResultsPanel", () => {
  it("renders the empty state when results are null", () => {
    render(<ResultsPanel results={null} mode="basic" />);
    expect(screen.getByText("No results yet")).toBeInTheDocument();
  });

  it("renders the tier badge and core metric rows", () => {
    render(<ResultsPanel results={basicResults} mode="basic" />);
    expect(screen.getByText("Tier 1 – Low Risk")).toBeInTheDocument();
    expect(screen.getByText("Interest Rate (p.a.)")).toBeInTheDocument();
    expect(screen.getByText("Monthly Payment")).toBeInTheDocument();
    expect(screen.getByText("Net Income (est.)")).toBeInTheDocument();
    expect(screen.getByText("Living Expenses")).toBeInTheDocument();
    expect(screen.getByText("Disposable Income")).toBeInTheDocument();
    expect(screen.getByText("Debt-to-Income Ratio")).toBeInTheDocument();
    expect(screen.getByText("Max Loan Eligible")).toBeInTheDocument();
  });

  it("shows the affordable verdict when isAffordable is true", () => {
    render(<ResultsPanel results={basicResults} mode="basic" />);
    expect(screen.getByText("Affordable")).toBeInTheDocument();
    expect(screen.getByText(/within 60/i)).toBeInTheDocument();
  });

  it("shows the strain verdict when isAffordable is false", () => {
    render(
      <ResultsPanel
        results={{ ...basicResults, isAffordable: false }}
        mode="basic"
      />,
    );
    expect(screen.getByText("May strain your budget")).toBeInTheDocument();
    expect(screen.getByText(/exceeds 60/i)).toBeInTheDocument();
  });

  it("shows the NCA warning when belowNcaMinimum is true", () => {
    render(
      <ResultsPanel
        results={{ ...basicResults, belowNcaMinimum: true }}
        mode="basic"
      />,
    );
    expect(screen.getByText("Expenses look low")).toBeInTheDocument();
    expect(screen.getByText(/NCA guidelines/i)).toBeInTheDocument();
  });

  it("hides the NCA warning when belowNcaMinimum is false", () => {
    render(<ResultsPanel results={basicResults} mode="basic" />);
    expect(screen.queryByText("Expenses look low")).not.toBeInTheDocument();
  });

  it("hides advanced-only rows in basic mode", () => {
    render(
      <ResultsPanel
        results={{ ...basicResults, riskScore: 85, newDsi: 0.15 }}
        mode="basic"
      />,
    );
    expect(screen.queryByText("Risk Score")).not.toBeInTheDocument();
    expect(
      screen.queryByText("DSI with Proposed Loan"),
    ).not.toBeInTheDocument();
  });

  it("shows Risk Score and DSI rows in advanced mode", () => {
    render(
      <ResultsPanel
        results={{ ...basicResults, riskScore: 85, newDsi: 0.15 }}
        mode="advanced"
      />,
    );
    expect(screen.getByText("Risk Score")).toBeInTheDocument();
    expect(screen.getByText("85/100")).toBeInTheDocument();
    expect(screen.getByText("DSI with Proposed Loan")).toBeInTheDocument();
  });

  it("formats currency values with the R prefix", () => {
    render(<ResultsPanel results={basicResults} mode="basic" />);
    expect(screen.getByText(/R\s?190/)).toBeInTheDocument();
  });
});
