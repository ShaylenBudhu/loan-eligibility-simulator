import type { LoanChartsProps } from "./types";
import { AmortisationChart, IncomeBreakdownChart } from "./helper";

export const LoanCharts = ({ results }: LoanChartsProps) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <IncomeBreakdownChart results={results} />
    <AmortisationChart results={results} />
  </div>
);
