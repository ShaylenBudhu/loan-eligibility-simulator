export const toNum = (v: string) => {
  const n = parseFloat(v);

  return isNaN(n) ? 0 : n;
};

export const formatZAR = (value: number) =>
  `R ${Math.round(value).toLocaleString("en-ZA")}`;

export const formatPct = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;
