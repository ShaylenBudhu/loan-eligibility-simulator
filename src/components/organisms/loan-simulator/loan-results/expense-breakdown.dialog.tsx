import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/atoms";
import { formatZAR } from "@/utils";
import { FormField } from "@/components/molecules";

import { defaultLines } from "../helpers";
import { getNcaMinimumExpenses } from "../loan-calculator";
import type { ExpenseBreakdownDialogProps, ExpenseLine } from "../types";

export const ExpenseBreakdownDialog = ({
  open,
  mode,
  currentValue,
  grossMonthlyIncome,
  onApply,
  onOpenChange,
}: ExpenseBreakdownDialogProps) => {
  const [lines, setLines] = useState<ExpenseLine[]>(() => defaultLines(mode));
  const total = lines.reduce((sum, line) => sum + line.value, 0);
  const ncaMinimum = getNcaMinimumExpenses(grossMonthlyIncome);
  const belowNca = grossMonthlyIncome > 0 && total < ncaMinimum;
  const hasMismatch = currentValue > 0 && Math.abs(currentValue - total) > 0.5;

  useEffect(() => {
    setLines((prev) => {
      const hasRent = prev.some((l) => l.key === "rent");
      if (mode === "basic" && !hasRent) {
        return [{ key: "rent", label: "Rent / bond", value: 0 }, ...prev];
      }
      if (mode === "advanced" && hasRent) {
        return prev.filter((l) => l.key !== "rent");
      }

      return prev;
    });
  }, [mode]);

  const handleChange = (key: string, next: number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.key === key
          ? { ...line, value: Number.isNaN(next) ? 0 : next }
          : line,
      ),
    );
  };

  const loadCurrentIntoOther = () => {
    setLines((prev) =>
      prev.map((line) => ({
        ...line,
        value: line.key === "other" ? currentValue : 0,
      })),
    );
  };

  const onCancel = () => onOpenChange(false);

  const handleApply = () => {
    onApply(total);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Break down your monthly expenses</DialogTitle>
          <DialogDescription>
            Add each category — the total is applied to the form when you're
            done.
          </DialogDescription>
        </DialogHeader>

        {hasMismatch && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              The expenses field currently shows{" "}
              <span className="font-semibold">{formatZAR(currentValue)}</span>,
              but the breakdown below totals{" "}
              <span className="font-semibold">{formatZAR(total)}</span>.
              Applying will overwrite the field.
            </p>
            <Button
              onClick={loadCurrentIntoOther}
              className="mt-1.5 text-xs font-medium text-amber-800 underline-offset-2 hover:underline dark:text-amber-200"
            >
              Load {formatZAR(currentValue)} into "Other" →
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {lines.map((line) => (
            <FormField
              key={line.key}
              label={line.label}
              type="number"
              step="any"
              placeholder="0"
              value={line.value === 0 ? "" : line.value}
              onChange={(event) =>
                handleChange(line.key, parseFloat(event.target.value))
              }
            />
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-semibold tabular-nums">
              {formatZAR(total)}
            </span>
          </div>
          {grossMonthlyIncome > 0 && (
            <p
              className={
                belowNca
                  ? "mt-1 text-xs text-amber-600 dark:text-amber-400"
                  : "mt-1 text-xs text-muted-foreground"
              }
            >
              NCA guideline for your income band: {formatZAR(ncaMinimum)}
              {belowNca
                ? " — your total is below this."
                : " — you're above this."}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply total →
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
