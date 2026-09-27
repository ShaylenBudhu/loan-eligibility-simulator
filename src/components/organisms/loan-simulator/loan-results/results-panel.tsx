import { cn } from "cn";

import { formatPct, formatZAR } from "@/utils";
import type { MetricRowProps, ResultsPanelProps } from "@/components";

import { dtiVariant, tierVariant } from "../helpers";

const MetricRow = ({
  label,
  value,
  variant = "default",
  progress,
}: MetricRowProps) => {
  const valueColor = {
    default: "text-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
  }[variant];

  const barColor = {
    default: "bg-muted-foreground/40",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  }[variant];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-semibold tabular-nums", valueColor)}>
          {value}
        </span>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              barColor,
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ResultsPanel = ({ results, mode }: ResultsPanelProps) => {
  if (!results) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-2 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">No results yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill in your financial details and click "Check Eligibility" to see
            your assessment.
          </p>
        </div>
      </div>
    );
  }

  const tv = tierVariant(results.riskTier);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "rounded-lg border px-3 py-2 text-sm font-medium",
          tv === "success" &&
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
          tv === "warning" &&
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
          tv === "danger" &&
            "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        )}
      >
        {results.riskTierLabel}
      </div>

      {mode === "advanced" && results.riskScore !== undefined && (
        <MetricRow
          label="Risk Score"
          value={`${results.riskScore}/100`}
          variant={tv}
          progress={results.riskScore}
        />
      )}

      <div className="space-y-3">
        <MetricRow
          label="Interest Rate (p.a.)"
          value={formatPct(results.interestRate)}
          variant={tv}
        />
        <MetricRow
          label="Monthly Payment"
          value={formatZAR(results.monthlyPayment)}
          variant={results.isAffordable ? "success" : "danger"}
        />
        <MetricRow
          label="Net Income (est.)"
          value={formatZAR(results.netMonthlyIncome)}
          variant="default"
        />
        <MetricRow
          label="Living Expenses"
          value={formatZAR(results.livingExpenses)}
          variant={results.belowNcaMinimum ? "warning" : "default"}
        />
        <MetricRow
          label="Disposable Income"
          value={formatZAR(results.disposableIncome)}
          variant={results.disposableIncome > 0 ? "success" : "danger"}
        />
        <MetricRow
          label={`Affordability Cap (${formatPct(results.affordabilityCap)})`}
          value={formatZAR(results.maxAffordablePayment)}
          variant="default"
        />
        <MetricRow
          label="Debt-to-Income Ratio"
          value={formatPct(results.dti)}
          variant={dtiVariant(results.dti)}
          progress={results.dti * 100}
        />
        {mode === "advanced" && results.newDsi !== undefined && (
          <MetricRow
            label="DSI with Proposed Loan"
            value={formatPct(results.newDsi)}
            variant={results.newDsi <= 0.5 ? "warning" : "danger"}
            progress={results.newDsi * 100}
          />
        )}
        <MetricRow
          label="Max Loan Eligible"
          value={formatZAR(results.maxLoanAmount)}
          variant="default"
        />
      </div>

      <div
        className={cn(
          "rounded-lg border px-3 py-2.5",
          results.isAffordable
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        )}
      >
        <p
          className={cn(
            "text-xs font-semibold",
            results.isAffordable
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-red-700 dark:text-red-300",
          )}
        >
          {results.isAffordable ? "Affordable" : "May strain your budget"}
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs",
            results.isAffordable
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {results.isAffordable
            ? `Monthly repayment is within ${formatPct(results.affordabilityCap)} of your disposable income.`
            : `Monthly repayment exceeds ${formatPct(results.affordabilityCap)} of disposable income. Consider a smaller amount or longer term.`}
        </p>
      </div>

      {results.belowNcaMinimum && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Expenses look low
          </p>
          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
            NCA guidelines suggest household expenses of at least{" "}
            {formatZAR(results.ncaMinimumExpenses)} for your income band. Real
            affordability may be tighter than shown.
          </p>
        </div>
      )}
    </div>
  );
};
