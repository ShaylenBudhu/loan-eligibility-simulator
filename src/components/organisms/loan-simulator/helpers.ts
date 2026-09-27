import {
  type ExpenseLine,
  type SimulatorMode,
  type TierAndDtiVariant,
} from "./types";

export const defaultLines = (mode: SimulatorMode): ExpenseLine[] => {
  const base: ExpenseLine[] = [
    { key: "food", label: "Food & groceries", value: 0 },
    { key: "transport", label: "Transport / fuel", value: 0 },
    { key: "utilities", label: "Utilities (electricity, water)", value: 0 },
    { key: "insurance", label: "Insurance / medical aid", value: 0 },
    { key: "schooling", label: "School / childcare", value: 0 },
    { key: "other", label: "Other", value: 0 },
  ];

  return mode === "basic"
    ? [{ key: "rent", label: "Rent / bond", value: 0 }, ...base]
    : base;
};

export const tierVariant = (tier: number): TierAndDtiVariant => {
  if (tier === 1) return "success";
  if (tier === 2) return "warning";

  return "danger";
};

export const dtiVariant = (dti: number): TierAndDtiVariant => {
  if (dti <= 0.3) return "success";
  if (dti <= 0.4) return "warning";

  return "danger";
};
