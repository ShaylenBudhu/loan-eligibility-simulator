import {
  Zap,
  Lock,
  Mail,
  Users,
  Award,
  Clock,
  Phone,
  Shield,
  MapPin,
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

export const CONTACT_DETAILS = [
  {
    Icon: Phone,
    label: "Call us",
    value: "0860 10 20 43",
    sub: "Mon – Fri, 8am – 5pm",
  },
  {
    Icon: Mail,
    label: "Email us",
    value: "support@capitecbank.co.za",
    sub: "We reply within 24 hours",
  },
  {
    Icon: MapPin,
    label: "Head office",
    value: "1 Quantum Street, Technopark",
    sub: "Stellenbosch, 7600",
  },
  {
    Icon: Clock,
    label: "Branch hours",
    value: "Mon – Fri: 8am – 5pm",
    sub: "Sat: 8am – 1pm",
  },
];

export const ABOUT_US_STATS = [
  { value: "1996", label: "Founded" },
  { value: "18M+", label: "Clients served" },
  { value: "850+", label: "Branches nationwide" },
  { value: "A+", label: "Credit rating" },
];

export const ABOUT_US_VALUES = [
  {
    Icon: Shield,
    title: "Trusted & Secure",
    description:
      "We apply bank-grade security to every interaction, keeping your financial data safe at all times.",
  },
  {
    Icon: Users,
    title: "Client-First",
    description:
      "Every product we build starts with a simple question: does this make our clients' lives simpler?",
  },
  {
    Icon: TrendingUp,
    title: "Financial Empowerment",
    description:
      "We believe everyone deserves clarity about their finances — no jargon, no hidden terms.",
  },
  {
    Icon: Award,
    title: "Proven Track Record",
    description:
      "Award-winning banking services backed by decades of innovation in the South African market.",
  },
];

export const OUR_PROMISES = [
  "No hidden fees",
  "Plain-language terms",
  "Instant decisions",
  "Human support, always",
];

export const WHAT_YOU_GET = [
  {
    Icon: CheckCircle2,
    title: "Eligibility verdict",
    desc: "A clear yes/no with the reasoning behind it.",
  },
  {
    Icon: TrendingUp,
    title: "Max loan amount",
    desc: "The highest amount you qualify for at current rates.",
  },
  {
    Icon: BarChart3,
    title: "Affordability breakdown",
    desc: "Debt-to-income ratio, monthly repayment, and disposable income.",
  },
  {
    Icon: Shield,
    title: "Risk tier assessment",
    desc: "Colour-coded risk rating aligned to NCA guidelines.",
  },
];
