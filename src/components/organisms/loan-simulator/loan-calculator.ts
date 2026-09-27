export type RiskTier = 1 | 2 | 3 | 4;

export type RiskTierLabel =
  | "Tier 1 – Low Risk"
  | "Tier 2 – Moderate Risk"
  | "Tier 3 – High Risk"
  | "Tier 4 – Very High Risk";

const TIER_LABELS: Record<RiskTier, RiskTierLabel> = {
  1: "Tier 1 – Low Risk",
  2: "Tier 2 – Moderate Risk",
  3: "Tier 3 – High Risk",
  4: "Tier 4 – Very High Risk",
};

const DTI_THRESHOLDS = {
  warning: 0.3,
  critical: 0.4,
  overIndebted: 0.5,
} as const;

export const AFFORDABILITY_CAP = 0.6;

// SARS 2025/26 tax year — under-65 primary rebate, no medical/pension credits.
const PRIMARY_REBATE = 17235;
const UIF_MONTHLY_CAP = 177.12;

export const annualTax = (annual: number): number => {
  if (annual <= 237100) return annual * 0.18;
  if (annual <= 370500) return 42678 + (annual - 237100) * 0.26;
  if (annual <= 512800) return 77362 + (annual - 370500) * 0.31;
  if (annual <= 673000) return 121475 + (annual - 512800) * 0.36;
  if (annual <= 857900) return 179147 + (annual - 673000) * 0.39;
  if (annual <= 1817000) return 251258 + (annual - 857900) * 0.41;
  return 644489 + (annual - 1817000) * 0.45;
};

export const estimateNetFromGross = (grossMonthly: number): number => {
  if (grossMonthly <= 0) return 0;
  const annualTaxDue = Math.max(
    0,
    annualTax(grossMonthly * 12) - PRIMARY_REBATE,
  );
  const uif = Math.min(grossMonthly * 0.01, UIF_MONTHLY_CAP);
  return Math.max(0, grossMonthly - annualTaxDue / 12 - uif);
};

// NCA Reg 23A Table A — minimum monthly household expenses by gross-income band.
// Used as a sanity floor; if the user reports less, we flag it.
export const getNcaMinimumExpenses = (grossMonthly: number): number => {
  if (grossMonthly <= 800) return 0;
  if (grossMonthly <= 6250) return 800 + (grossMonthly - 800) * 0.0675;
  if (grossMonthly <= 25000) return 1167.88 + (grossMonthly - 6250) * 0.09;
  if (grossMonthly <= 50000) return 2855.38 + (grossMonthly - 25000) * 0.082;
  return 4905.38 + (grossMonthly - 50000) * 0.0675;
};

// Mid-point annual rates per tier
const TIER_RATES: Record<RiskTier, number> = {
  1: 0.14,
  2: 0.2,
  3: 0.24,
  4: 0.27,
};

// Max loan as multiple of gross monthly income per tier
const TIER_MAX_LOAN_MULTIPLIER: Record<RiskTier, number> = {
  1: 8.5,
  2: 5,
  3: 3,
  4: 1.5,
};

export const calculateDTI = (
  debtMonthlyPayment: number,
  grossMonthlyIncome: number,
): number => {
  if (grossMonthlyIncome <= 0) return 0;
  return debtMonthlyPayment / grossMonthlyIncome;
};

// Amortisation formula: M = P × [r(1+r)^n] / [(1+r)^n − 1]
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termMonths: number,
): number => {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (principal * (r * factor)) / (factor - 1);
};

export const getRiskTierFromDTI = (dti: number): RiskTier => {
  if (dti > DTI_THRESHOLDS.overIndebted) return 4;
  if (dti > DTI_THRESHOLDS.critical) return 3;
  if (dti > DTI_THRESHOLDS.warning) return 2;
  return 1;
};

export const getRiskTierFromScore = (score: number): RiskTier => {
  if (score >= 80) return 1;
  if (score >= 60) return 2;
  if (score >= 40) return 3;
  return 4;
};

// Maps Experian credit score bands to mid-point annual rates
export const getInterestRateFromCreditScore = (creditScore: number): number => {
  if (creditScore >= 658) return 0.14;
  if (creditScore >= 634) return 0.16;
  if (creditScore >= 616) return 0.2;
  if (creditScore >= 599) return 0.24;
  return 0.27;
};

export type LoanResults = {
  // Inputs echoed back for chart consumers
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  estimatedTax: number;
  debtMonthlyPayment: number;
  livingExpenses: number;
  requestedLoanAmount: number;
  repaymentTerms: number;
  // Computed outputs
  dti: number;
  disposableIncome: number;
  affordabilityCap: number;
  maxAffordablePayment: number;
  riskTier: RiskTier;
  riskTierLabel: RiskTierLabel;
  interestRate: number;
  monthlyPayment: number;
  maxLoanAmount: number;
  isAffordable: boolean;
  belowNcaMinimum: boolean;
  ncaMinimumExpenses: number;
  riskScore?: number;
  newDsi?: number;
  dependants?: number;
};

export type BasicLoanInput = {
  grossMonthlyIncome: number;
  debtMonthlyPayment: number;
  monthlyExpenses: number;
  requestedLoanAmount: number;
  repaymentTerms: number;
  creditScore?: number;
};

export type AdvancedLoanInput = {
  rent?: number;
  dependants?: number;
  dwellingType?: string;
  waterSource?: string;
  electricityAccess?: string;
  sanitationType?: string;
  employmentType?: string;
  employmentDuration?: number;
  incomeStability?: string;
  paymentHistory?: string;
} & BasicLoanInput;

export const calculateBasicResults = (input: BasicLoanInput): LoanResults => {
  const {
    grossMonthlyIncome,
    debtMonthlyPayment,
    monthlyExpenses,
    requestedLoanAmount,
    repaymentTerms,
    creditScore,
  } = input;

  const netMonthlyIncome = estimateNetFromGross(grossMonthlyIncome);
  const estimatedTax = grossMonthlyIncome - netMonthlyIncome;

  const livingExpenses = monthlyExpenses;
  const ncaMinimumExpenses = getNcaMinimumExpenses(grossMonthlyIncome);
  const belowNcaMinimum = livingExpenses < ncaMinimumExpenses;

  const dti = calculateDTI(debtMonthlyPayment, grossMonthlyIncome);
  const disposableIncome = Math.max(
    0,
    netMonthlyIncome - debtMonthlyPayment - livingExpenses,
  );
  const riskTier = getRiskTierFromDTI(dti);

  const interestRate = creditScore
    ? getInterestRateFromCreditScore(creditScore)
    : TIER_RATES[riskTier];

  const monthlyPayment = calculateMonthlyPayment(
    requestedLoanAmount,
    interestRate,
    repaymentTerms,
  );

  // Max loan is the smaller of two ceilings:
  //   1. Affordability — new payment ≤ 60% of disposable (net) income
  //   2. Total-DSI — (existing debt + new payment) / gross ≤ over-indebted threshold
  const maxAffordablePayment = disposableIncome * AFFORDABILITY_CAP;
  const maxNewPaymentByDsi = Math.max(
    0,
    grossMonthlyIncome * DTI_THRESHOLDS.overIndebted - debtMonthlyPayment,
  );
  const maxNewPayment = Math.min(maxAffordablePayment, maxNewPaymentByDsi);

  const r = interestRate / 12;
  const factor = Math.pow(1 + r, repaymentTerms);
  const principalFromPayment = (payment: number) =>
    r === 0
      ? payment * repaymentTerms
      : (payment * (factor - 1)) / (r * factor);
  const maxLoanAmount = Math.round(
    Math.max(0, principalFromPayment(maxNewPayment)),
  );

  const isAffordable = monthlyPayment <= maxAffordablePayment;

  return {
    grossMonthlyIncome,
    netMonthlyIncome,
    estimatedTax,
    debtMonthlyPayment,
    livingExpenses,
    requestedLoanAmount,
    repaymentTerms,
    dti,
    disposableIncome,
    affordabilityCap: AFFORDABILITY_CAP,
    maxAffordablePayment,
    riskTier,
    riskTierLabel: TIER_LABELS[riskTier],
    interestRate,
    monthlyPayment,
    maxLoanAmount,
    isAffordable,
    belowNcaMinimum,
    ncaMinimumExpenses,
  };
};

export const calculateAdvancedResults = (
  input: AdvancedLoanInput,
): LoanResults => {
  const {
    grossMonthlyIncome,
    debtMonthlyPayment,
    monthlyExpenses,
    rent = 0,
    dependants,
    requestedLoanAmount,
    repaymentTerms,
    dwellingType = "formal_house",
    waterSource = "running",
    electricityAccess = "reliable",
    sanitationType = "flush_toilet",
    employmentType = "formal",
    employmentDuration = 36,
    incomeStability = "steady",
    paymentHistory = "ontime",
  } = input;

  const dti = calculateDTI(debtMonthlyPayment, grossMonthlyIncome);

  let score = 50;

  // Dwelling permanence (15% weight)
  const dwellingPts: Record<string, number> = {
    formal_house: 90,
    townhouse: 75,
    flat: 60,
    informal: 30,
  };
  score += ((dwellingPts[dwellingType] ?? 50) - 50) * 0.15;

  // Infrastructure quality (15% weight)
  const hasFullInfra =
    waterSource === "running" &&
    electricityAccess === "reliable" &&
    sanitationType === "flush_toilet";
  score += ((hasFullInfra ? 85 : 50) - 50) * 0.15;

  // Employment formality + tenure (20% weight)
  const empPts: Record<string, number> = {
    formal: employmentDuration >= 36 ? 95 : 70,
    "self-employed": 50,
    informal: 30,
  };
  score += ((empPts[employmentType] ?? 50) - 50) * 0.2;

  // DTI score (25% weight)
  const dtiPct = dti * 100;
  let dtiPts = 100;
  if (dtiPct > 50) dtiPts = 20;
  else if (dtiPct > 43) dtiPts = 50;
  else if (dtiPct > 36) dtiPts = 80;
  score += (dtiPts - 50) * 0.25;

  // Payment history (15% weight)
  const payPts: Record<string, number> = {
    ontime: 95,
    occasional_late: 60,
    default: 20,
  };
  score += ((payPts[paymentHistory] ?? 50) - 50) * 0.15;

  // Income stability (10% weight)
  const stabPts: Record<string, number> = {
    steady: 90,
    moderate: 60,
    irregular: 30,
  };
  score += ((stabPts[incomeStability] ?? 50) - 50) * 0.1;

  const riskScore = Math.max(0, Math.min(100, score));
  const riskTier = getRiskTierFromScore(riskScore);
  const interestRate = TIER_RATES[riskTier];

  const netMonthlyIncome = estimateNetFromGross(grossMonthlyIncome);
  const estimatedTax = grossMonthlyIncome - netMonthlyIncome;

  const livingExpenses = monthlyExpenses + rent;
  const ncaMinimumExpenses = getNcaMinimumExpenses(grossMonthlyIncome);
  const belowNcaMinimum = livingExpenses < ncaMinimumExpenses;

  const disposableIncome = Math.max(
    0,
    netMonthlyIncome - debtMonthlyPayment - livingExpenses,
  );
  const maxAffordablePayment = disposableIncome * AFFORDABILITY_CAP;
  const monthlyPayment = calculateMonthlyPayment(
    requestedLoanAmount,
    interestRate,
    repaymentTerms,
  );
  const maxLoanAmount = Math.round(
    grossMonthlyIncome * TIER_MAX_LOAN_MULTIPLIER[riskTier],
  );
  const isAffordable = monthlyPayment <= maxAffordablePayment;
  const newDsi =
    grossMonthlyIncome > 0
      ? (debtMonthlyPayment + monthlyPayment) / grossMonthlyIncome
      : 0;

  return {
    grossMonthlyIncome,
    netMonthlyIncome,
    estimatedTax,
    debtMonthlyPayment,
    livingExpenses,
    requestedLoanAmount,
    repaymentTerms,
    dti,
    disposableIncome,
    affordabilityCap: AFFORDABILITY_CAP,
    maxAffordablePayment,
    riskTier,
    riskTierLabel: TIER_LABELS[riskTier],
    interestRate,
    monthlyPayment,
    maxLoanAmount,
    isAffordable,
    belowNcaMinimum,
    ncaMinimumExpenses,
    riskScore,
    newDsi,
    dependants,
  };
};
