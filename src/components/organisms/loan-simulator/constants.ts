import type { SimulatorMode } from "@/components";

export const DWELLING_OPTIONS = [
  { value: "formal_house", label: "Formal house" },
  { value: "townhouse", label: "Townhouse" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "informal", label: "Informal settlement" },
];

export const WATER_OPTIONS = [
  { value: "running", label: "Running water (indoor)" },
  { value: "tap", label: "Tap outside" },
  { value: "other", label: "Other source" },
];

export const ELECTRICITY_OPTIONS = [
  { value: "reliable", label: "Reliable access" },
  { value: "occasional", label: "Occasional / prepaid" },
  { value: "none", label: "No access" },
];

export const SANITATION_OPTIONS = [
  { value: "flush_toilet", label: "Flush toilet" },
  { value: "pit", label: "Pit latrine" },
  { value: "none", label: "No toilet" },
];

export const EMPLOYMENT_OPTIONS = [
  { value: "formal", label: "Formal employment" },
  { value: "self-employed", label: "Self-employed" },
  { value: "informal", label: "Informal / casual" },
];

export const STABILITY_OPTIONS = [
  { value: "steady", label: "Steady (same amount monthly)" },
  { value: "moderate", label: "Moderate (some variation)" },
  { value: "irregular", label: "Irregular / seasonal" },
];

export const PAYMENT_HISTORY_OPTIONS = [
  { value: "ontime", label: "Always on time" },
  { value: "occasional_late", label: "Occasional late payments" },
  { value: "default", label: "Defaults / adverse listings" },
];

export const COLOUR_PALETTE = {
  debt: "#e34948",
  loan: "#eda100",
  remaining: "#1baf7a",
  balance: "#3987e5",
  balanceFade: "#3987e520",
} as const;

export const REPAYMENT_TERM_OPTIONS = [
  { value: "12", label: "12 months (1 year)" },
  { value: "24", label: "24 months (2 years)" },
  { value: "36", label: "36 months (3 years)" },
  { value: "48", label: "48 months (4 years)" },
  { value: "60", label: "60 months (5 years)" },
  { value: "72", label: "72 months (6 years)" },
  { value: "84", label: "84 months (7 years)" },
];

export const SIMULATOR_MODE_VALUES = ["basic", "advanced"] as SimulatorMode[];
