import { buildResultsPdf, type LoanResults } from "@/components";

const base: LoanResults = {
  grossMonthlyIncome: 25000,
  netMonthlyIncome: 21340,
  estimatedTax: 3660,
  debtMonthlyPayment: 2000,
  livingExpenses: 8000,
  requestedLoanAmount: 50000,
  repaymentTerms: 36,
  dti: 0.08,
  disposableIncome: 11340,
  affordabilityCap: 0.6,
  maxAffordablePayment: 6804,
  riskTier: 1,
  riskTierLabel: "Tier 1 – Low Risk",
  interestRate: 0.14,
  monthlyPayment: 1709,
  maxLoanAmount: 190000,
  isAffordable: true,
  belowNcaMinimum: false,
  ncaMinimumExpenses: 2855,
};

describe("buildResultsPdf", () => {
  it("returns a jsPDF instance whose output is a PDF Blob", () => {
    const doc = buildResultsPdf(base, "basic");
    const blob = doc.output("blob");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("emits a valid PDF header", async () => {
    const doc = buildResultsPdf(base, "basic");
    const blob = doc.output("blob");
    const text = await blob.slice(0, 8).text();
    expect(text).toMatch(/^%PDF-\d\.\d/);
  });

  it("produces a larger document in advanced mode (extra fields)", () => {
    const basic = buildResultsPdf(base, "basic").output("blob").size;
    const advanced = buildResultsPdf(
      { ...base, riskScore: 85, newDsi: 0.15 },
      "advanced",
    ).output("blob").size;
    expect(advanced).toBeGreaterThan(basic);
  });

  it("adds a note when belowNcaMinimum is true", () => {
    const clean = buildResultsPdf(base, "basic").output("blob").size;
    const flagged = buildResultsPdf(
      { ...base, belowNcaMinimum: true },
      "basic",
    ).output("blob").size;
    expect(flagged).toBeGreaterThan(clean);
  });

  it("does not throw for either verdict path", () => {
    expect(() => buildResultsPdf(base, "basic")).not.toThrow();
    expect(() =>
      buildResultsPdf({ ...base, isAffordable: false }, "basic"),
    ).not.toThrow();
  });
});
