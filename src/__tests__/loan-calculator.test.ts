import {
  calculateDTI,
  AFFORDABILITY_CAP,
  getRiskTierFromDTI,
  getRiskTierFromScore,
  estimateNetFromGross,
  calculateBasicResults,
  getNcaMinimumExpenses,
  calculateMonthlyPayment,
  calculateAdvancedResults,
  getInterestRateFromCreditScore,
} from "@/components";

describe("loan-calculator", () => {
  describe("estimateNetFromGross", () => {
    it("returns 0 for non-positive input", () => {
      expect(estimateNetFromGross(0)).toBe(0);
      expect(estimateNetFromGross(-100)).toBe(0);
    });

    it("nets only UIF below the tax-threshold", () => {
      expect(estimateNetFromGross(7000)).toBeCloseTo(7000 - 70, 0);
    });

    it("caps UIF at R177.12/month for high earners", () => {
      const a = estimateNetFromGross(50000);
      const b = estimateNetFromGross(49000);
      // UIF is capped at both income levels, so only tax difference affects the delta
      expect(a - b).toBeGreaterThan(400);
      expect(a - b).toBeLessThan(900);
    });
  });

  describe("calculateMonthlyPayment", () => {
    it("returns 0 for non-positive principal or term", () => {
      expect(calculateMonthlyPayment(0, 0.14, 36)).toBe(0);
      expect(calculateMonthlyPayment(1000, 0.14, 0)).toBe(0);
    });

    it("splits evenly at zero interest", () => {
      expect(calculateMonthlyPayment(12000, 0, 12)).toBe(1000);
    });

    it("matches the amortisation formula", () => {
      expect(calculateMonthlyPayment(50000, 0.14, 36)).toBeCloseTo(1709, 0);
    });
  });

  describe("calculateDTI", () => {
    it("returns 0 when income is zero", () => {
      expect(calculateDTI(1000, 0)).toBe(0);
    });

    it("computes the ratio", () => {
      expect(calculateDTI(2000, 10000)).toBe(0.2);
    });
  });

  describe("getRiskTierFromDTI", () => {
    it("maps DTI thresholds to tiers", () => {
      expect(getRiskTierFromDTI(0.1)).toBe(1);
      expect(getRiskTierFromDTI(0.3)).toBe(1);
      expect(getRiskTierFromDTI(0.35)).toBe(2);
      expect(getRiskTierFromDTI(0.45)).toBe(3);
      expect(getRiskTierFromDTI(0.6)).toBe(4);
    });
  });

  describe("getRiskTierFromScore", () => {
    it("maps SEM scores to tiers", () => {
      expect(getRiskTierFromScore(85)).toBe(1);
      expect(getRiskTierFromScore(65)).toBe(2);
      expect(getRiskTierFromScore(45)).toBe(3);
      expect(getRiskTierFromScore(20)).toBe(4);
    });
  });

  describe("getInterestRateFromCreditScore", () => {
    it("maps Experian bands to rates", () => {
      expect(getInterestRateFromCreditScore(700)).toBe(0.14);
      expect(getInterestRateFromCreditScore(640)).toBe(0.16);
      expect(getInterestRateFromCreditScore(620)).toBe(0.2);
      expect(getInterestRateFromCreditScore(600)).toBe(0.24);
      expect(getInterestRateFromCreditScore(500)).toBe(0.27);
    });
  });

  describe("getNcaMinimumExpenses", () => {
    it("returns 0 for income below R800", () => {
      expect(getNcaMinimumExpenses(500)).toBe(0);
    });

    it("scales through the R6.25k–R25k band", () => {
      expect(getNcaMinimumExpenses(25000)).toBeCloseTo(2855.38, 2);
    });

    it("scales into the top band", () => {
      expect(getNcaMinimumExpenses(60000)).toBeCloseTo(5580.38, 2);
    });
  });

  describe("calculateBasicResults", () => {
    const input = {
      grossMonthlyIncome: 25000,
      debtMonthlyPayment: 2000,
      monthlyExpenses: 8000,
      requestedLoanAmount: 50000,
      repaymentTerms: 36,
    };

    it("returns a full LoanResults shape", () => {
      const r = calculateBasicResults(input);
      expect(r.livingExpenses).toBe(8000);
      expect(r.affordabilityCap).toBe(AFFORDABILITY_CAP);
      expect(r).toHaveProperty("dti");
      expect(r).toHaveProperty("disposableIncome");
      expect(r).toHaveProperty("maxLoanAmount");
      expect(r).toHaveProperty("belowNcaMinimum");
      expect(r).toHaveProperty("ncaMinimumExpenses");
    });

    it("nets expenses out of disposable income", () => {
      const r = calculateBasicResults(input);
      expect(r.disposableIncome).toBeCloseTo(
        r.netMonthlyIncome - r.debtMonthlyPayment - r.livingExpenses,
        1,
      );
    });

    it("flags affordable when payment ≤ 60% of disposable", () => {
      const r = calculateBasicResults(input);
      expect(r.isAffordable).toBe(
        r.monthlyPayment <= r.disposableIncome * AFFORDABILITY_CAP,
      );
    });

    it("clamps disposable and max-loan to 0 when expenses swamp net income", () => {
      const r = calculateBasicResults({ ...input, monthlyExpenses: 100000 });
      expect(r.disposableIncome).toBe(0);
      expect(r.maxLoanAmount).toBe(0);
    });

    it("flags belowNcaMinimum when reported expenses are unrealistically low", () => {
      const r = calculateBasicResults({ ...input, monthlyExpenses: 100 });
      expect(r.belowNcaMinimum).toBe(true);
    });

    it("caps max loan by the total-DSI ceiling when it binds", () => {
      const r = calculateBasicResults({ ...input, debtMonthlyPayment: 12000 });
      expect(r.maxLoanAmount).toBeLessThan(20000);
    });

    it("prefers credit-score rate over tier default when provided", () => {
      const withScore = calculateBasicResults({ ...input, creditScore: 700 });
      const noScore = calculateBasicResults(input);
      const lowScore = calculateBasicResults({ ...input, creditScore: 500 });
      expect(lowScore.interestRate).toBe(0.27);
      expect(withScore.interestRate).toBe(noScore.interestRate);
    });
  });

  describe("calculateAdvancedResults", () => {
    const base = {
      grossMonthlyIncome: 25000,
      debtMonthlyPayment: 2000,
      monthlyExpenses: 5000,
      rent: 6000,
      requestedLoanAmount: 50000,
      repaymentTerms: 36,
    };

    it("computes a bounded risk score", () => {
      const r = calculateAdvancedResults(base);
      expect(r.riskScore).toBeGreaterThanOrEqual(0);
      expect(r.riskScore).toBeLessThanOrEqual(100);
    });

    it("sums rent + monthlyExpenses into livingExpenses", () => {
      const r = calculateAdvancedResults(base);
      expect(r.livingExpenses).toBe(11000);
    });

    it("exposes newDsi in advanced mode", () => {
      const r = calculateAdvancedResults(base);
      expect(typeof r.newDsi).toBe("number");
    });

    it("penalises poor SEM factors", () => {
      const good = calculateAdvancedResults({
        ...base,
        dwellingType: "formal_house",
        incomeStability: "steady",
        paymentHistory: "ontime",
        employmentType: "formal",
        employmentDuration: 60,
      });
      const bad = calculateAdvancedResults({
        ...base,
        dwellingType: "informal",
        incomeStability: "irregular",
        paymentHistory: "default",
        employmentType: "informal",
        employmentDuration: 3,
      });
      expect(bad.riskScore!).toBeLessThan(good.riskScore!);
      expect(bad.riskTier).toBeGreaterThanOrEqual(good.riskTier);
    });

    it("uses income × tier-multiplier for max loan", () => {
      const r = calculateAdvancedResults(base);
      expect(r.maxLoanAmount % 1).toBe(0);
      expect(r.maxLoanAmount).toBeGreaterThan(0);
    });
  });
});
