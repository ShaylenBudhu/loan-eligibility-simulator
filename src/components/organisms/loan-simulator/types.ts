import { z } from "zod";

import type {
  repaymentTermSchema,
  termsResponseSchema,
  loanCalculatorSchema,
  advancedLoanCalculatorSchema,
} from "./schema";
import type { LoanResults } from "./loan-calculator";

export type LoanCalculator = z.infer<typeof loanCalculatorSchema>;
export type AdvancedLoanCalculator = z.infer<
  typeof advancedLoanCalculatorSchema
>;
export type RepaymentTerm = z.infer<typeof repaymentTermSchema>;
export type TermsResponse = z.infer<typeof termsResponseSchema>;
export type SimulatorMode = "basic" | "advanced";

export type SectionProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export type LoanSimulatorFormProps = {
  onResults: (results: LoanResults | null, mode: SimulatorMode) => void;
};

export type ExpenseLine = {
  key: string;
  label: string;
  value: number;
};

export type ExpenseBreakdownDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SimulatorMode;
  grossMonthlyIncome: number;
  currentValue: number;
  onApply: (total: number) => void;
};

export type MetricRowProps = {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning" | "danger";
  progress?: number;
};

export type TierAndDtiVariant = "success" | "warning" | "danger";

export type ResultsPanelProps = {
  results: LoanResults | null;
  mode: SimulatorMode;
};
