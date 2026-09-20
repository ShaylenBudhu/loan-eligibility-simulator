import {
  Zap,
  Lock,
  Clock,
  Shield,
  BarChart3,
  Calculator,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export const TRUST_BADGES: { Icon: LucideIcon; label: string }[] = [
  { Icon: Lock, label: "No credit check" },
  { Icon: Shield, label: "Bank-grade security" },
  { Icon: Clock, label: "<3 min result" },
];

export const PREVIEW_LOAN_DETAILS: [string, string][] = [
  ["Monthly Repayment", "R 2,340"],
  ["Interest Rate", "15.5% p.a."],
  ["Loan Term", "84 months"],
];

export const STATS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "~3 min", label: "Average assessment time", Icon: Clock },
  { value: "R 500K", label: "Maximum loan amount", Icon: TrendingUp },
  { value: "100%", label: "Secure & private", Icon: Shield },
];

export const TOOL_CARDS: {
  Icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    Icon: BarChart3,
    title: "Affordability Analysis",
    description:
      "Understand your debt-to-income ratio and how it affects your eligibility across different scenarios.",
  },
  {
    Icon: TrendingUp,
    title: "Amortisation Schedule",
    description:
      "A month-by-month breakdown showing exactly how your balance reduces over the loan term.",
  },
  {
    Icon: Shield,
    title: "Risk Assessment",
    description:
      "A colour-coded risk rating based on South African National Credit Act guidelines.",
  },
  {
    Icon: Zap,
    title: "Advanced SEM Mode",
    description:
      "Enter individual expense categories using the Standard Expenditure Model for a granular picture.",
  },
];

export const HOW_IT_WORKS_STEPS: {
  step: string;
  Icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    step: "1",
    Icon: Calculator,
    title: "Enter your details",
    description:
      "Provide your monthly income, existing expenses, and the loan amount you have in mind.",
  },
  {
    step: "2",
    Icon: BarChart3,
    title: "We run the numbers",
    description:
      "Our simulator applies NCA guidelines to calculate your debt-to-income ratio and affordability score.",
  },
  {
    step: "3",
    Icon: CheckCircle2,
    title: "Get your result",
    description:
      "Receive a clear eligibility verdict, maximum loan amount, and a full breakdown of your finances.",
  },
];
