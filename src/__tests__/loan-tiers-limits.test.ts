import {
  getRiskTierFromDTI,
  getRiskTierFromScore,
  calculateBasicResults,
  calculateAdvancedResults,
  getInterestRateFromCreditScore,
} from "@/components";

// ─── Shared fixture ──────────────────────────────────────────────────────────

const BASE_INPUT = {
  grossMonthlyIncome: 25000,
  debtMonthlyPayment: 2000,
  monthlyExpenses: 8000,
  requestedLoanAmount: 50000,
  repaymentTerms: 36,
} as const;

// ─── 1. DTI Calculation & Boundary Values ────────────────────────────────────

describe("DTI tier boundaries", () => {
  // The thresholds use strict >, so the boundary value itself stays in the
  // lower tier: DTI > 0.3 → Tier 2, so exactly 0.3 is still Tier 1.

  it("1. DTI of exactly 0.30 stays in Tier 1", () => {
    expect(getRiskTierFromDTI(0.3)).toBe(1);
  });

  it("2. DTI just above 0.30 (0.301) escalates to Tier 2", () => {
    expect(getRiskTierFromDTI(0.301)).toBe(2);
  });

  it("3. DTI of exactly 0.40 stays in Tier 2", () => {
    expect(getRiskTierFromDTI(0.4)).toBe(2);
  });

  it("4. DTI just above 0.40 (0.401) escalates to Tier 3", () => {
    expect(getRiskTierFromDTI(0.401)).toBe(3);
  });

  it("5. DTI of exactly 0.50 stays in Tier 3", () => {
    expect(getRiskTierFromDTI(0.5)).toBe(3);
  });

  it("6. DTI just above 0.50 (0.501) escalates to Tier 4", () => {
    expect(getRiskTierFromDTI(0.501)).toBe(4);
  });

  it("7. DTI of 0 maps to Tier 1", () => {
    expect(getRiskTierFromDTI(0)).toBe(1);
  });

  it("8. DTI of 1.0 maps to Tier 4", () => {
    expect(getRiskTierFromDTI(1.0)).toBe(4);
  });
});

// ─── 2. Risk Tier Labels ─────────────────────────────────────────────────────

describe("risk tier labels", () => {
  it("9. Tier 1 label is 'Tier 1 – Low Risk'", () => {
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 0, // DTI = 0 → Tier 1
    });
    expect(r.riskTierLabel).toBe("Tier 1 – Low Risk");
  });

  it("10. Tier 2 label is 'Tier 2 – Moderate Risk'", () => {
    // DTI = 8000 / 25000 = 0.32 → Tier 2
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 8000,
    });
    expect(r.riskTierLabel).toBe("Tier 2 – Moderate Risk");
  });

  it("11. Tier 3 label is 'Tier 3 – High Risk'", () => {
    // DTI = 11000 / 25000 = 0.44 → Tier 3
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 11000,
    });
    expect(r.riskTierLabel).toBe("Tier 3 – High Risk");
  });

  it("12. Tier 4 label is 'Tier 4 – Very High Risk'", () => {
    // DTI = 13000 / 25000 = 0.52 → Tier 4
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 13000,
    });
    expect(r.riskTierLabel).toBe("Tier 4 – Very High Risk");
  });
});

// ─── 3. Interest Rate per Tier ───────────────────────────────────────────────

describe("interest rate per risk tier", () => {
  it("13. Tier 1 carries a 14% annual rate", () => {
    // DTI = 0 → Tier 1
    const r = calculateBasicResults({ ...BASE_INPUT, debtMonthlyPayment: 0 });
    expect(r.interestRate).toBe(0.14);
  });

  it("14. Tier 2 carries a 20% annual rate", () => {
    // DTI = 8000 / 25000 = 0.32 → Tier 2
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 8000,
    });
    expect(r.interestRate).toBe(0.2);
  });

  it("15. Tier 3 carries a 24% annual rate", () => {
    // DTI = 11000 / 25000 = 0.44 → Tier 3
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 11000,
    });
    expect(r.interestRate).toBe(0.24);
  });

  it("16. Tier 4 carries a 27% annual rate", () => {
    // DTI = 13000 / 25000 = 0.52 → Tier 4
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 13000,
    });
    expect(r.interestRate).toBe(0.27);
  });
});

// ─── 4. Score-Based Tier Boundaries (advanced mode) ─────────────────────────

describe("score-based tier boundaries", () => {
  // getRiskTierFromScore uses inclusive >=: score >= 80 → Tier 1.

  it("17. Score of exactly 80 maps to Tier 1", () => {
    expect(getRiskTierFromScore(80)).toBe(1);
  });

  it("18. Score of 79 drops to Tier 2", () => {
    expect(getRiskTierFromScore(79)).toBe(2);
  });

  it("19. Score of exactly 60 maps to Tier 2", () => {
    expect(getRiskTierFromScore(60)).toBe(2);
  });

  it("20. Score of 59 drops to Tier 3", () => {
    expect(getRiskTierFromScore(59)).toBe(3);
  });

  it("21. Score of exactly 40 maps to Tier 3", () => {
    expect(getRiskTierFromScore(40)).toBe(3);
  });

  it("22. Score of 39 drops to Tier 4", () => {
    expect(getRiskTierFromScore(39)).toBe(4);
  });

  it("23. Score of 0 maps to Tier 4", () => {
    expect(getRiskTierFromScore(0)).toBe(4);
  });

  it("24. Score of 100 maps to Tier 1", () => {
    expect(getRiskTierFromScore(100)).toBe(1);
  });
});

// ─── 5. Max Loan — Basic Mode ────────────────────────────────────────────────

describe("max loan amount — basic mode", () => {
  it("25. Max loan is 0 when existing debt exhausts the DSI ceiling (debt ≥ gross × 0.5)", () => {
    // DSI ceiling = max(0, 25000 × 0.5 − 13000) = 0 → maxLoanAmount = 0
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 13000, // 13000 / 25000 = 52% DTI, ceiling = 25000×0.5−13000 = −500 → clamped to 0
    });
    expect(r.maxLoanAmount).toBe(0);
  });

  it("26. Max loan is 0 when expenses consume all net income (disposable = 0)", () => {
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 0,
      monthlyExpenses: 100000, // swamps net income
    });
    expect(r.maxLoanAmount).toBe(0);
  });

  it("27. Affordability ceiling binds when disposable is the tighter constraint", () => {
    // gross = 25000, debt = 0 → DSI ceiling = 25000×0.5 = 12500 (very generous)
    // high expenses shrink disposable, so affordability binds first
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 0,
      monthlyExpenses: 18000,
    });
    // maxAffordablePayment = disposable × 0.6 < maxNewPaymentByDsi, so affordability binds
    expect(r.maxAffordablePayment).toBeLessThan(
      r.grossMonthlyIncome * 0.5 - r.debtMonthlyPayment,
    );
    expect(r.maxLoanAmount).toBeGreaterThan(0);
  });

  it("28. DSI ceiling binds when high existing debt is the tighter constraint", () => {
    // debt = 9000 → DSI ceiling = 25000×0.5 − 9000 = 3500
    // disposable = net − 9000 − 5000 → affordability cap likely larger than 3500
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 9000,
      monthlyExpenses: 5000,
    });
    const dsiCeiling = r.grossMonthlyIncome * 0.5 - r.debtMonthlyPayment;
    // The DSI ceiling (3500) is lower than the affordability cap on its own
    expect(r.maxAffordablePayment).toBeGreaterThan(dsiCeiling);
    expect(r.maxLoanAmount).toBeGreaterThan(0);
  });

  it("29. Max loan is always a whole integer", () => {
    const r = calculateBasicResults(BASE_INPUT);
    expect(r.maxLoanAmount % 1).toBe(0);
  });
});

// ─── 6. Max Loan — Advanced Mode (tier multipliers) ─────────────────────────

describe("max loan amount — advanced mode tier multipliers", () => {
  // All-best profile → score ≈ 93.5 → Tier 1
  const TIER1_PROFILE = {
    grossMonthlyIncome: 20000,
    debtMonthlyPayment: 0,
    monthlyExpenses: 3000,
    requestedLoanAmount: 50000,
    repaymentTerms: 36,
    dwellingType: "formal_house",
    waterSource: "running",
    electricityAccess: "reliable",
    sanitationType: "flush_toilet",
    employmentType: "formal",
    employmentDuration: 60,
    incomeStability: "steady",
    paymentHistory: "ontime",
  } as const;

  // Flat, no full infra, formal < 36mo, DTI 44%, on-time, steady → score ≈ 66 → Tier 2
  const TIER2_PROFILE = {
    grossMonthlyIncome: 10000,
    debtMonthlyPayment: 4400, // DTI 44% → dtiPts = 50
    monthlyExpenses: 2000,
    requestedLoanAmount: 20000,
    repaymentTerms: 36,
    dwellingType: "flat",
    waterSource: "borehole",
    electricityAccess: "reliable",
    sanitationType: "flush_toilet",
    employmentType: "formal",
    employmentDuration: 12, // < 36 → pts 70
    incomeStability: "steady",
    paymentHistory: "ontime",
  } as const;

  // Informal dwelling, partial infra, informal employment, DTI 37%, occasional late, moderate → score ≈ 53 → Tier 3
  const TIER3_PROFILE = {
    grossMonthlyIncome: 10000,
    debtMonthlyPayment: 3700, // DTI 37% → dtiPts = 80
    monthlyExpenses: 2000,
    requestedLoanAmount: 20000,
    repaymentTerms: 36,
    dwellingType: "informal",
    waterSource: "borehole",
    electricityAccess: "reliable",
    sanitationType: "flush_toilet",
    employmentType: "informal",
    employmentDuration: 12,
    incomeStability: "moderate",
    paymentHistory: "occasional_late",
  } as const;

  // All-worst profile → score ≈ 29 → Tier 4
  const TIER4_PROFILE = {
    grossMonthlyIncome: 20000,
    debtMonthlyPayment: 11000, // DTI 55% → dtiPts = 20
    monthlyExpenses: 2000,
    requestedLoanAmount: 50000,
    repaymentTerms: 36,
    dwellingType: "informal",
    waterSource: "borehole",
    electricityAccess: "unreliable",
    sanitationType: "pit_latrine",
    employmentType: "informal",
    employmentDuration: 3,
    incomeStability: "irregular",
    paymentHistory: "default",
  } as const;

  it("30. Tier 1: max loan = round(gross × 8.5)", () => {
    const r = calculateAdvancedResults(TIER1_PROFILE);
    expect(r.riskTier).toBe(1);
    expect(r.maxLoanAmount).toBe(
      Math.round(TIER1_PROFILE.grossMonthlyIncome * 8.5),
    );
  });

  it("31. Tier 2: max loan = round(gross × 5.0)", () => {
    const r = calculateAdvancedResults(TIER2_PROFILE);
    expect(r.riskTier).toBe(2);
    expect(r.maxLoanAmount).toBe(
      Math.round(TIER2_PROFILE.grossMonthlyIncome * 5.0),
    );
  });

  it("32. Tier 3: max loan = round(gross × 3.0)", () => {
    const r = calculateAdvancedResults(TIER3_PROFILE);
    expect(r.riskTier).toBe(3);
    expect(r.maxLoanAmount).toBe(
      Math.round(TIER3_PROFILE.grossMonthlyIncome * 3.0),
    );
  });

  it("33. Tier 4: max loan = round(gross × 1.5)", () => {
    const r = calculateAdvancedResults(TIER4_PROFILE);
    expect(r.riskTier).toBe(4);
    expect(r.maxLoanAmount).toBe(
      Math.round(TIER4_PROFILE.grossMonthlyIncome * 1.5),
    );
  });
});

// ─── 7. Affordability Flag ───────────────────────────────────────────────────

describe("affordability flag", () => {
  it("34. isAffordable is true when monthly payment ≤ disposable × 0.6", () => {
    // R50k at 14% over 36 mo ≈ R1 709/mo; disposable ≈ R11 340 → cap ≈ R6 804
    const r = calculateBasicResults(BASE_INPUT);
    expect(r.monthlyPayment).toBeLessThanOrEqual(r.disposableIncome * 0.6);
    expect(r.isAffordable).toBe(true);
  });

  it("35. isAffordable is false when monthly payment > disposable × 0.6", () => {
    // R500k loan at 14% over 36 mo ≈ R17 090/mo, far above the cap
    const r = calculateBasicResults({
      ...BASE_INPUT,
      requestedLoanAmount: 500000,
    });
    expect(r.monthlyPayment).toBeGreaterThan(r.disposableIncome * 0.6);
    expect(r.isAffordable).toBe(false);
  });
});

// ─── 8. Tier + Rate Assignment in calculateBasicResults ──────────────────────

describe("tier and rate assignment in calculateBasicResults", () => {
  it("36. Low-DTI profile → Tier 1, 14% rate, correct label", () => {
    // DTI = 2000 / 25000 = 0.08 → Tier 1
    const r = calculateBasicResults(BASE_INPUT);
    expect(r.riskTier).toBe(1);
    expect(r.interestRate).toBe(0.14);
    expect(r.riskTierLabel).toBe("Tier 1 – Low Risk");
    expect(r.dti).toBeCloseTo(0.08, 5);
  });

  it("37. High-DTI profile → Tier 4, 27% rate, correct label", () => {
    // DTI = 13000 / 25000 = 0.52 → Tier 4
    const r = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 13000,
    });
    expect(r.riskTier).toBe(4);
    expect(r.interestRate).toBe(0.27);
    expect(r.riskTierLabel).toBe("Tier 4 – Very High Risk");
    expect(r.dti).toBeCloseTo(0.52, 5);
  });

  it("38. Credit score overrides tier rate regardless of DTI tier", () => {
    // DTI = 8750 / 25000 = 0.35 → would be Tier 2 (20%) without credit score
    const withoutScore = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 8750,
    });
    expect(withoutScore.riskTier).toBe(2);
    expect(withoutScore.interestRate).toBe(0.2);

    // Same DTI but credit score 700 → Experian band ≥ 658 → 14%
    const withGoodScore = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 8750,
      creditScore: 700,
    });
    expect(withGoodScore.riskTier).toBe(2); // tier unchanged — DTI still 35%
    expect(withGoodScore.interestRate).toBe(0.14); // rate overridden downward

    // Credit score below 599 → 27%, even on a Tier 1 DTI profile
    const withPoorScore = calculateBasicResults({
      ...BASE_INPUT,
      debtMonthlyPayment: 0, // DTI 0% → Tier 1 default would be 14%
      creditScore: 550,
    });
    expect(withPoorScore.riskTier).toBe(1);
    expect(withPoorScore.interestRate).toBe(0.27); // rate overridden upward
    expect(getInterestRateFromCreditScore(550)).toBe(0.27);
  });
});
