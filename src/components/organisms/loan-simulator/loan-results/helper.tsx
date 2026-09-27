import { useMemo } from "react";
import { scaleBand, scaleLinear } from "d3-scale";

import {
  Chart,
  type BarDatum,
  type LoanResults,
  type AmortiDatum,
} from "@/components";
import { formatZAR } from "@/utils";
import { defineChart, barY, text, areaY, lineY } from "@tanstack/charts";

import { COLOUR_PALETTE } from "../constants";

const LIVING_COLOR = "#6366f1";

export const IncomeBreakdownChart = ({ results }: { results: LoanResults }) => {
  const remaining = Math.max(
    0,
    results.netMonthlyIncome -
      results.livingExpenses -
      results.debtMonthlyPayment -
      results.monthlyPayment,
  );

  const data: BarDatum[] = useMemo(
    () => [
      {
        category: "Living Expenses",
        value: results.livingExpenses,
        color: LIVING_COLOR,
      },
      {
        category: "Existing Debt",
        value: results.debtMonthlyPayment,
        color: COLOUR_PALETTE.debt,
      },
      {
        category: "Loan Repayment",
        value: results.monthlyPayment,
        color: results.isAffordable ? COLOUR_PALETTE.loan : COLOUR_PALETTE.debt,
      },
      {
        category: "Remaining",
        value: remaining,
        color: COLOUR_PALETTE.remaining,
      },
    ],
    [results, remaining],
  );

  const net = results.netMonthlyIncome;

  const contextLine = (category: string, value: number): string => {
    switch (category) {
      case "Living Expenses":
        return results.belowNcaMinimum
          ? "Below NCA minimum"
          : "Within NCA guidelines";
      case "Existing Debt":
        return `DTI: ${(results.dti * 100).toFixed(1)}% of gross income`;
      case "Loan Repayment":
        return results.isAffordable
          ? `Rate: ${(results.interestRate * 100).toFixed(0)}% p.a. — Affordable`
          : `Rate: ${(results.interestRate * 100).toFixed(0)}% p.a. — Exceeds limit`;
      case "Remaining":
        return value > 0
          ? "Available buffer after all obligations"
          : "No buffer remaining";
      default:
        return "";
    }
  };

  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          barY(data, {
            x: (d) => d.category,
            y: (d) => d.value,
            fill: (d) => d.color,
            radius: { end: 3 },
          }),
          text(data, {
            x: (d) => d.category,
            y: (d) => d.value,
            text: (d) => formatZAR(d.value),
            dy: -6,
            anchor: "middle",
            fontSize: 9,
            fill: "var(--muted-foreground)",
          }),
        ],
        scales: {
          x: { scale: () => scaleBand<string>().padding(0.3) },
          y: { scale: () => scaleLinear<number>() },
        },
      }),
    [data],
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Net Income Allocation
      </p>
      <Chart
        definition={definition}
        ariaLabel="Net income breakdown showing living expenses, existing debt, new loan repayment, and remaining buffer"
        height={200}
        className="w-full"
        renderTooltipBody={({ primaryPoint }) => {
          const datum = primaryPoint?.datum as BarDatum | undefined;
          if (!datum) return null;
          const pct = net > 0 ? (datum.value / net) * 100 : 0;

          return (
            <div className="rounded-md bg-popover px-3 py-2 text-xs shadow-md ring-1 ring-border space-y-1 min-w-45">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ background: datum.color }}
                />
                <p className="font-semibold">{datum.category}</p>
              </div>
              <p className="text-foreground font-medium">
                {formatZAR(datum.value)}
              </p>
              <p className="text-muted-foreground">
                {pct.toFixed(1)}% of net income
              </p>
              <p className="text-muted-foreground">
                {contextLine(datum.category, datum.value)}
              </p>
            </div>
          );
        }}
      />
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {data.map((d) => (
          <span key={d.category} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: d.color }}
            />
            {d.category}
          </span>
        ))}
      </div>
    </div>
  );
};

const buildAmortisationData = (
  principal: number,
  annualRate: number,
  termMonths: number,
  monthlyPayment: number,
): AmortiDatum[] => {
  const r = annualRate / 12;
  return Array.from({ length: termMonths + 1 }, (_, n) => {
    const balance =
      r === 0
        ? Math.max(0, principal - n * monthlyPayment)
        : Math.max(
            0,
            principal * (1 + r) ** n -
              (monthlyPayment * ((1 + r) ** n - 1)) / r,
          );

    const principalRepaid = principal - balance;
    const totalPaid = n * monthlyPayment;
    const cumulativeInterest = Math.max(0, totalPaid - principalRepaid);
    const percentPaidOff =
      principal > 0 ? (principalRepaid / principal) * 100 : 0;

    return { month: n, balance, cumulativeInterest, percentPaidOff };
  });
};

export const formatMonthLabel = (month: number): string => {
  if (month === 0) return "Start";
  const years = Math.floor(month / 12);
  const months = month % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr`;
  return `${years}yr ${months}mo`;
};

export const AmortisationChart = ({ results }: { results: LoanResults }) => {
  const data = useMemo(
    () =>
      buildAmortisationData(
        results.requestedLoanAmount,
        results.interestRate,
        results.repaymentTerms,
        results.monthlyPayment,
      ),
    [results],
  );

  const dataByMonth = useMemo(
    () => new Map(data.map((d) => [d.month, d])),
    [data],
  );

  const totalInterest = Math.max(
    0,
    results.monthlyPayment * results.repaymentTerms -
      results.requestedLoanAmount,
  );

  // Month where cumulative interest first exceeds remaining balance (crossover point)
  const crossoverMonth = useMemo(
    () =>
      data.find((d) => d.month > 0 && d.cumulativeInterest >= d.balance)?.month,
    [data],
  );

  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          // Filled area under the balance curve
          areaY(data, {
            x: (d) => d.month,
            y: (d) => d.balance,
            fill: COLOUR_PALETTE.balanceFade,
            strokeWidth: 0,
          }),
          // Balance line on top of area
          lineY(data, {
            x: (d) => d.month,
            y: (d) => d.balance,
            stroke: COLOUR_PALETTE.balance,
            strokeWidth: 2,
          }),
          // Cumulative interest paid line
          lineY(data, {
            x: (d) => d.month,
            y: (d) => d.cumulativeInterest,
            stroke: COLOUR_PALETTE.debt,
            strokeWidth: 1.5,
          }),
        ],
        scales: {
          x: { scale: () => scaleLinear<number>() },
          y: { scale: () => scaleLinear<number>() },
        },
      }),
    [data],
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Loan Balance Over Time
      </p>
      <Chart
        definition={definition}
        ariaLabel="Loan balance and cumulative interest paid over the repayment period"
        height={220}
        className="w-full"
        renderTooltipBody={({ primaryPoint }) => {
          const month = Math.round(Number(primaryPoint?.xValue ?? 0));
          const datum =
            dataByMonth.get(month) ?? data[Math.min(month, data.length - 1)];

          return (
            <div className="rounded-md bg-popover px-3 py-2 text-xs shadow-md ring-1 ring-border space-y-1 min-w-50">
              <p className="font-semibold">
                Month {month}
                <span className="font-normal text-muted-foreground ml-1">
                  ({formatMonthLabel(month)})
                </span>
              </p>
              <div className="border-t border-border pt-1 space-y-0.5">
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="inline-block h-1.5 w-3 rounded-full"
                      style={{ background: COLOUR_PALETTE.balance }}
                    />
                    Balance
                  </span>
                  <span className="font-medium">
                    {formatZAR(datum?.balance ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span
                      className="inline-block h-1.5 w-3 rounded-full"
                      style={{ background: COLOUR_PALETTE.debt }}
                    />
                    Interest paid
                  </span>
                  <span className="font-medium text-destructive">
                    {formatZAR(datum?.cumulativeInterest ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Paid off</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {(datum?.percentPaidOff ?? 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: COLOUR_PALETTE.balance }}
          />
          Remaining Balance
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: COLOUR_PALETTE.debt }}
          />
          Interest Paid
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="rounded-md bg-muted px-2 py-1.5 text-center">
          <p className="text-[10px] text-muted-foreground">Principal</p>
          <p className="text-xs font-semibold truncate">
            {formatZAR(results.requestedLoanAmount)}
          </p>
        </div>
        <div className="rounded-md bg-muted px-2 py-1.5 text-center">
          <p className="text-[10px] text-muted-foreground">Total Interest</p>
          <p className="text-xs font-semibold text-destructive truncate">
            {formatZAR(totalInterest)}
          </p>
        </div>
        <div className="rounded-md bg-muted px-2 py-1.5 text-center">
          <p className="text-[10px] text-muted-foreground">Crossover</p>
          <p className="text-xs font-semibold truncate">
            {crossoverMonth ? `Mo. ${crossoverMonth}` : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};
