import type { LoanResults } from "@/components";

export type BarDatum = { category: string; value: number; color: string };

export type LoanChartsProps = {
  results: LoanResults;
};

export type AmortiDatum = {
  month: number;
  balance: number;
  cumulativeInterest: number;
  percentPaidOff: number;
};
