import { Download } from "lucide-react";
import { useState, type FC } from "react";
import { Link } from "@tanstack/react-router";

import {
  Button,
  Dialog,
  PageTheme,
  LoanCharts,
  DialogTitle,
  ResultsPanel,
  DialogHeader,
  DialogFooter,
  DialogContent,
  downloadResults,
  type LoanResults,
  LoanSimulatorForm,
  DialogDescription,
  type SimulatorMode,
} from "@/components";

import { TRUST_BADGES, WHAT_YOU_GET } from "./constants";

export const LoanSimulatorPage: FC = () => {
  const [results, setResults] = useState<LoanResults | null>(null);
  const [mode, setMode] = useState<SimulatorMode>("basic");
  const [isOpen, setIsOpen] = useState(false);

  const handleResults = (next: LoanResults | null, nextMode: SimulatorMode) => {
    setResults(next);
    setMode(nextMode);

    if (next) setIsOpen(true);
  };

  const onClickDownload = () => results && downloadResults(results, mode);

  return (
    <PageTheme>
      <section className="w-full px-6 py-20">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Loan Eligibility Simulator
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
            Know before{" "}
            <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              you borrow.
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/70">
            Enter your income, expenses, and desired loan amount to get an
            instant eligibility assessment — no credit check, no commitment.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
            {TRUST_BADGES.map(({ Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-transparent">
        <div className="mx-auto px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-white dark:shadow-2xl dark:backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Your financial details
              </h2>
              <LoanSimulatorForm onResults={handleResults} />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-2xl dark:backdrop-blur-sm space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-capitec-blue dark:text-blue-300">
                  What you'll receive
                </p>
                {WHAT_YOU_GET.map(({ Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-capitec-blue/10 dark:bg-white/10">
                      <Icon className="size-4 text-capitec-blue dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {title}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-500 dark:text-white/50">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-capitec-blue/20 bg-capitec-blue/5 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-capitec-blue dark:text-blue-300">
                  Pro tip
                </p>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-white/70">
                  Switch to{" "}
                  <span className="font-semibold text-capitec-blue dark:text-white">
                    Advanced mode
                  </span>{" "}
                  for a full SEM-based risk assessment that mirrors what lenders
                  see.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-capitec-blue py-12 dark:border-t dark:border-white/10 dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-lg font-bold text-white">
              Not sure what the results mean?
            </p>
            <p className="text-sm text-white/70">
              Our team is here to walk you through your assessment — no jargon.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-capitec-blue transition hover:bg-white/90"
          >
            Talk to us →
          </Link>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Your Assessment</DialogTitle>
            <DialogDescription>
              Based on the details you provided
              {mode === "advanced" ? ", including SEM criteria." : "."}
            </DialogDescription>
          </DialogHeader>

          {results && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <ResultsPanel results={results} mode={mode} />
              <div className="md:col-span-2">
                <LoanCharts results={results} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClickDownload}
              disabled={!results}
            >
              <Download className="size-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTheme>
  );
};
