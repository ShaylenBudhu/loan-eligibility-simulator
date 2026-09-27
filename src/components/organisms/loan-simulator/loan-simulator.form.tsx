import { cn } from "cn";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toNum } from "@/utils";

import { Button } from "@/components/atoms";
import { ExpenseBreakdownDialog } from "@/components";
import { FormField, FormSelectField } from "@/components/molecules";

import type {
  SectionProps,
  SimulatorMode,
  AdvancedLoanCalculator,
  LoanSimulatorFormProps,
} from "./types";
import {
  WATER_OPTIONS,
  DWELLING_OPTIONS,
  STABILITY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  SANITATION_OPTIONS,
  ELECTRICITY_OPTIONS,
  SIMULATOR_MODE_VALUES,
  PAYMENT_HISTORY_OPTIONS,
} from "./constants";
import {
  calculateBasicResults,
  calculateAdvancedResults,
} from "./loan-calculator";
import { useTermsQuery } from "./terms.query";
import { advancedLoanCalculatorSchema } from "./schema";

const CollapsibleSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: SectionProps) => (
  <div className="rounded-lg border bg-muted/30">
    <Button
      variant="ghost"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-muted/50 transition-colors rounded-lg"
    >
      {title}
      <span className="text-muted-foreground text-base leading-none">
        {isOpen ? "−" : "+"}
      </span>
    </Button>
    {isOpen && (
      <div className="grid grid-cols-1 gap-4 px-4 pb-4 pt-1 sm:grid-cols-2 border-t">
        {children}
      </div>
    )}
  </div>
);

export const LoanSimulatorForm = ({ onResults }: LoanSimulatorFormProps) => {
  const [mode, setMode] = useState<SimulatorMode>("basic");
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("household");
  const { data: terms = [], isLoading: termsLoading } = useTermsQuery();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdvancedLoanCalculator>({
    resolver: zodResolver(advancedLoanCalculatorSchema),
    defaultValues: {
      dwellingType: "formal_house",
      waterSource: "running",
      electricityAccess: "reliable",
      sanitationType: "flush_toilet",
      employmentType: "formal",
      employmentDuration: 36,
      incomeStability: "steady",
      paymentHistory: "ontime",
    },
  });

  const termOptions = terms.map((term) => ({
    value: String(term.value),
    label: term.label,
  }));

  const onSubmit = (data: AdvancedLoanCalculator) => {
    const results =
      mode === "advanced"
        ? calculateAdvancedResults(data)
        : calculateBasicResults(data);
    onResults(results, mode);
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleModeChange = (next: SimulatorMode) => {
    setMode(next);
    onResults(null, next);
  };

  const onClickBreakdown = () => setBreakdownOpen(true);

  const onToggleHousehold = () => toggleSection("household");

  const onToggleDwelling = () => toggleSection("dwelling");

  const onToggleEmployment = () => toggleSection("employment");

  const onToggleFinancial = () => toggleSection("financial");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {SIMULATOR_MODE_VALUES.map((m) => (
          <Button
            key={m}
            variant="ghost"
            onClick={() => handleModeChange(m)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors hover:bg-capitec-blue hover:text-white dark:hover:bg-white dark:hover:text-capitec-blue",
              mode === m
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-white",
            )}
          >
            {m}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Gross Monthly Income"
          description="Income before tax. We'll estimate your net using SARS 2025/26 tables."
          error={errors.grossMonthlyIncome?.message}
          type="number"
          step="any"
          placeholder="e.g. 25 000"
          {...register("grossMonthlyIncome", { setValueAs: toNum })}
        />
        <FormField
          label="Monthly Debt Payments"
          description="Total of all existing loan and credit repayments"
          error={errors.debtMonthlyPayment?.message}
          type="number"
          step="any"
          placeholder="e.g. 3 000"
          {...register("debtMonthlyPayment", { setValueAs: toNum })}
        />
        <div className="relative">
          <FormField
            label={
              mode === "advanced"
                ? "Other Monthly Expenses"
                : "Monthly Living Expenses"
            }
            description={
              mode === "advanced"
                ? "Food, transport, utilities (excl. rent — captured separately below)"
                : "Rent, food, transport, utilities — everything non-debt"
            }
            error={errors.monthlyExpenses?.message}
            type="number"
            step="any"
            placeholder="e.g. 8 000"
            {...register("monthlyExpenses", { setValueAs: toNum })}
          />
          <Button
            variant="ghost"
            onClick={onClickBreakdown}
            className="absolute right-0 top-0 text-xs font-medium text-capitec-blue underline-offset-2 hover:underline dark:text-blue-300"
          >
            Break it down →
          </Button>
        </div>
        <FormField
          label="Requested Loan Amount"
          description="The amount you wish to borrow"
          error={errors.requestedLoanAmount?.message}
          type="number"
          step="any"
          placeholder="e.g. 20 000"
          {...register("requestedLoanAmount", { setValueAs: toNum })}
        />
        <FormSelectField
          control={control}
          name="repaymentTerms"
          label="Repayment Term"
          description="Duration of the loan in months"
          options={termOptions}
          disabled={termsLoading}
        />
      </div>

      {mode === "advanced" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Additional SEM-based criteria — these weight your risk score.
          </p>

          <CollapsibleSection
            title="Household"
            isOpen={openSection === "household"}
            onToggle={onToggleHousehold}
          >
            <FormField
              label="Rent / Bond Payment"
              description="Monthly rent or home loan repayment"
              error={errors.rent?.message}
              type="number"
              step="any"
              placeholder="e.g. 6 000"
              {...register("rent", { setValueAs: toNum })}
            />
            <FormField
              label="Dependants"
              description="Number of people financially reliant on you"
              error={errors.dependants?.message}
              type="number"
              placeholder="e.g. 2"
              {...register("dependants", { setValueAs: toNum })}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Dwelling & Infrastructure"
            isOpen={openSection === "dwelling"}
            onToggle={onToggleDwelling}
          >
            <FormSelectField
              control={control}
              name="dwellingType"
              label="Dwelling Type"
              options={DWELLING_OPTIONS}
            />
            <FormSelectField
              control={control}
              name="waterSource"
              label="Water Source"
              options={WATER_OPTIONS}
            />
            <FormSelectField
              control={control}
              name="electricityAccess"
              label="Electricity Access"
              options={ELECTRICITY_OPTIONS}
            />
            <FormSelectField
              control={control}
              name="sanitationType"
              label="Sanitation"
              options={SANITATION_OPTIONS}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Employment & Income"
            isOpen={openSection === "employment"}
            onToggle={onToggleEmployment}
          >
            <FormSelectField
              control={control}
              name="employmentType"
              label="Employment Type"
              options={EMPLOYMENT_OPTIONS}
            />
            <FormField
              label="Employment Duration (months)"
              description="How long in your current role"
              error={errors.employmentDuration?.message}
              type="number"
              placeholder="e.g. 36"
              {...register("employmentDuration", { setValueAs: toNum })}
            />
            <FormSelectField
              control={control}
              name="incomeStability"
              label="Income Stability"
              options={STABILITY_OPTIONS}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Financial History"
            isOpen={openSection === "financial"}
            onToggle={onToggleFinancial}
          >
            <FormSelectField
              control={control}
              name="paymentHistory"
              label="Payment History"
              options={PAYMENT_HISTORY_OPTIONS}
            />
          </CollapsibleSection>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full">
        Check Eligibility
      </Button>

      <ExpenseBreakdownDialog
        open={breakdownOpen}
        onOpenChange={setBreakdownOpen}
        mode={mode}
        grossMonthlyIncome={watch("grossMonthlyIncome") ?? 0}
        currentValue={watch("monthlyExpenses") ?? 0}
        onApply={(total) =>
          setValue("monthlyExpenses", total, { shouldValidate: true })
        }
      />
    </form>
  );
};
