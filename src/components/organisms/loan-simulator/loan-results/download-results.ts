import { jsPDF } from "jspdf";

import { formatPct, formatZAR } from "@/utils";
import type { SimulatorMode } from "@/components";

import type { LoanResults } from "../loan-calculator";

export const buildResultsPdf = (
  results: LoanResults,
  mode: SimulatorMode,
): jsPDF => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const marginX = 48;
  const today = new Date().toISOString().split("T")[0];
  let y = 60;

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, marginX, y);
    doc.text(value, pageW - marginX, y, { align: "right" });
    y += 16;
  };

  const heading = (title: string) => {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, marginX, y);
    doc.setDrawColor(220);
    doc.line(marginX, y + 4, pageW - marginX, y + 4);
    y += 18;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Loan Eligibility Assessment", marginX, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `Generated: ${today}   |   Mode: ${mode === "advanced" ? "Advanced (SEM)" : "Basic"}`,
    marginX,
    y,
  );
  doc.setTextColor(0);
  y += 8;

  heading("Assessment");
  row("Risk Tier", results.riskTierLabel);
  if (results.riskScore !== undefined) {
    row("Risk Score", `${results.riskScore}/100`);
  }
  row("Interest Rate (p.a.)", formatPct(results.interestRate));
  row("Monthly Payment", formatZAR(results.monthlyPayment));
  row("Max Loan Eligible", formatZAR(results.maxLoanAmount));
  row(
    "Verdict",
    results.isAffordable ? "Affordable" : "May strain your budget",
  );

  heading("Income");
  row("Gross Monthly", formatZAR(results.grossMonthlyIncome));
  row("Net (estimated)", formatZAR(results.netMonthlyIncome));
  row("Estimated Tax", formatZAR(results.estimatedTax));

  heading("Expenses");
  row("Debt Payments", formatZAR(results.debtMonthlyPayment));
  row("Living Expenses", formatZAR(results.livingExpenses));
  row("Disposable Income", formatZAR(results.disposableIncome));
  if (results.belowNcaMinimum) {
    doc.setTextColor(180, 100, 0);
    doc.setFontSize(9);
    doc.text(
      `Note: expenses are below the NCA guideline of ${formatZAR(results.ncaMinimumExpenses)} for this income band.`,
      marginX,
      y,
    );
    doc.setTextColor(0);
    y += 14;
  }

  heading("Loan");
  row("Requested Amount", formatZAR(results.requestedLoanAmount));
  row("Term", `${results.repaymentTerms} months`);
  row("Debt-to-Income", formatPct(results.dti));
  row(
    "Affordability Cap",
    `${formatPct(results.affordabilityCap)} of disposable = ${formatZAR(results.maxAffordablePayment)}`,
  );
  if (results.newDsi !== undefined) {
    row("DSI (post-loan)", formatPct(results.newDsi));
  }

  y += 20;
  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text(
    "This is an educational simulator, not a formal credit decision.",
    marginX,
    y,
  );

  return doc;
};

export const downloadResults = (
  results: LoanResults,
  mode: SimulatorMode,
): void => {
  const doc = buildResultsPdf(results, mode);
  const today = new Date().toISOString().split("T")[0];
  doc.save(`loan-assessment-${today}.pdf`);
};
