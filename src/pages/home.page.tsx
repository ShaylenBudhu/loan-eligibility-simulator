import {
  Zap,
  ArrowRight,
  Calculator,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { cn } from "cn";
import { Fragment, type FC } from "react";
import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/atoms";

import {
  STATS,
  TOOL_CARDS,
  TRUST_BADGES,
  HOW_IT_WORKS_STEPS,
  PREVIEW_LOAN_DETAILS,
} from "./constants";

export const HomePage: FC = () => (
  <div className="min-h-screen bg-linear-to-br from-capitec-blue via-[#003557] to-[#001a2e]">
    <section className="relative min-h-[calc(100vh-72px)] bg-linear-to-br from-capitec-blue via-[#003557] to-[#001a2e] dark:from-[#002e47] dark:via-[#001f33] dark:to-[#000d1a] overflow-hidden flex items-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 size-150 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 size-125 rounded-full bg-blue-400/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="size-2 animate-pulse rounded-full bg-green-400" />
              Free · Instant · Secure
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl xl:text-6xl">
                Your financial
                <br />
                future,{" "}
                <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/70">
                Understand your loan eligibility before you apply. Get an
                accurate, personalised assessment in under 3 minutes — no credit
                check required.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/loan-simulator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white font-semibold text-capitec-blue shadow-xl shadow-black/20 hover:bg-white/90",
                )}
              >
                Check My Eligibility
                <ArrowRight className="ml-1" />
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "border border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                How it works
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/50">
              {TRUST_BADGES.map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <Icon className="size-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-3xl bg-blue-400/20 blur-2xl" />

              <div className="relative w-80 space-y-6 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">
                    Eligibility Result
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-green-400/30 bg-green-400/20 px-3 py-1 text-xs font-semibold text-green-300">
                    <CheckCircle2 className="size-3" />
                    Eligible
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-white/50">
                    Maximum Loan Amount
                  </p>
                  <p className="text-4xl font-bold tracking-tight text-white">
                    R 150,000
                  </p>
                </div>

                <div className="space-y-3">
                  {PREVIEW_LOAN_DETAILS.map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-white/60">{label}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Debt-to-Income Ratio</span>
                    <span className="font-medium text-green-300">
                      28% · Healthy
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-green-400 to-cyan-400"
                      style={{ width: "28%" }}
                    />
                  </div>
                </div>

                <Link
                  to="/loan-simulator"
                  className={cn(
                    buttonVariants(),
                    "w-full bg-white font-semibold text-capitec-blue hover:bg-white/90",
                  )}
                >
                  Check yours
                  <ArrowRight className="ml-1" />
                </Link>
              </div>

              <div className="absolute -right-8 -top-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl dark:bg-neutral-800">
                <TrendingUp className="size-4 text-green-500" />
                <span className="text-xs font-semibold text-gray-800 dark:text-white">
                  98% Accuracy
                </span>
              </div>
              <div className="absolute -bottom-4 -left-8 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl dark:bg-neutral-800">
                <Zap className="size-4 text-capitec-blue" />
                <span className="text-xs font-semibold text-gray-800 dark:text-white">
                  Instant results
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {STATS.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-8 text-center"
            >
              <Icon className="mb-1 size-5 text-blue-300" />
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-sm text-white/50">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-20 dark:bg-transparent">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-capitec-blue dark:text-blue-300">
            Our Tools
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Everything you need to plan your loan
          </h2>
          <p className="mx-auto max-w-xl text-gray-500 dark:text-white/60">
            Capitec's suite of financial planning tools helps you make
            confident, informed decisions before you commit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gray-100 p-8 text-gray-900 dark:bg-white/10 dark:text-white">
            <div className="pointer-events-none absolute -bottom-8 -right-8 size-40 rounded-full bg-black/5 dark:bg-white/5" />

            <div className="relative z-10 flex-1 space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-capitec-blue/10 dark:bg-white/20">
                <Calculator className="size-6 text-capitec-blue dark:text-white" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/50">
                  Featured Tool
                </span>
                <h3 className="text-xl font-bold">
                  Loan Eligibility Simulator
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-white/70">
                  Enter your income, expenses, and desired loan amount to get an
                  instant eligibility assessment with a detailed affordability
                  breakdown.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <Link
                to="/loan-simulator"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full bg-capitec-blue font-semibold text-white hover:bg-capitec-blue/90 dark:bg-white dark:text-capitec-blue dark:hover:bg-white/90",
                )}
              >
                Get Started
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="col-span-1 grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-2">
            {TOOL_CARDS.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="group space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-capitec-blue/30 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25 dark:hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-capitec-blue/10 transition-colors group-hover:bg-capitec-blue/20 dark:bg-white/10 dark:group-hover:bg-white/20">
                    <Icon className="size-5 text-capitec-blue dark:text-blue-300" />
                  </div>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-400/15 dark:text-green-300">
                    Included
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-white/50">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section
      id="how-it-works"
      className="bg-gray-50 py-20 dark:bg-transparent dark:border-t dark:border-white/10"
    >
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-capitec-blue dark:text-blue-300">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Three steps to your answer
          </h2>
        </div>

        <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start">
          {HOW_IT_WORKS_STEPS.map(
            ({ step, Icon, title, description }, index) => (
              <Fragment key={step}>
                <div className="flex flex-1 flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <div className="flex size-20 items-center justify-center rounded-full bg-capitec-blue/10 dark:bg-white/10">
                      <Icon className="size-8 text-capitec-blue dark:text-blue-300" />
                    </div>
                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-capitec-blue text-xs font-bold text-white">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-white/50">
                    {description}
                  </p>
                </div>

                {index < 2 && (
                  <div className="hidden w-28 shrink-0 items-center pt-8 md:flex">
                    <div className="flex w-full items-center">
                      <div className="h-px flex-1 bg-gray-300 dark:bg-white/20" />
                      <svg
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="none"
                        className="-ml-px shrink-0 text-gray-300 dark:text-white/20"
                      >
                        <path
                          d="M1 1L9 7L1 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </Fragment>
            ),
          )}
        </div>
      </div>
    </section>

    <section className="border-t border-white/10 bg-white/5 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl space-y-6 px-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to find out if you qualify?
        </h2>
        <p className="text-lg text-white/70">
          It takes under 3 minutes and won't affect your credit score.
        </p>
        <Link
          to="/loan-simulator"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-white font-semibold text-capitec-blue shadow-xl hover:bg-white/90",
          )}
        >
          Start Your Assessment
          <ArrowRight />
        </Link>
      </div>
    </section>
  </div>
);
