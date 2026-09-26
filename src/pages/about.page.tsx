import { cn } from "cn";
import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { PageTheme } from "@/components/templates";
import { buttonVariants } from "@/components/atoms";

import { ABOUT_US_STATS, ABOUT_US_VALUES, OUR_PROMISES } from "./constants";

export const AboutPage: FC = () => (
  <PageTheme>
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="space-y-6 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
          About Capitec
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
          Banking that works{" "}
          <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            for everyone.
          </span>
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
          Capitec Bank was founded on the belief that banking should be simple,
          affordable, and accessible to all South Africans. Today we're one of
          the country's most innovative banks — and we're just getting started.
        </p>
        <Link
          to="/loan-simulator"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-white font-semibold text-capitec-blue hover:bg-white/90 shadow-xl shadow-black/20",
          )}
        >
          Try our Loan Simulator
          <ArrowRight />
        </Link>
      </div>
    </section>

    <section className="bg-white py-16 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {ABOUT_US_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-2xl dark:backdrop-blur-sm"
            >
              <p className="text-3xl font-bold text-capitec-blue dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-capitec-blue py-16 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200 dark:text-blue-300">
              Our Mission
            </p>
            <h2 className="text-3xl font-bold text-white">
              Simplifying banking for millions
            </h2>
            <p className="text-white/70 leading-relaxed">
              We set out to give South Africans one banking app, one card, and
              one low monthly fee. No complicated product tiers — just a single,
              powerful account that handles everything from savings to credit.
            </p>
            <p className="text-white/70 leading-relaxed">
              Our Loan Eligibility Simulator is a reflection of that mission:
              transparent, instant, and completely free — so you know exactly
              where you stand before you apply.
            </p>
          </div>

          <div className="rounded-3xl border border-white/25 bg-white/15 p-8 backdrop-blur-sm shadow-2xl space-y-4 dark:border-white/20 dark:bg-white/10 dark:backdrop-blur-xl">
            <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">
              Our Promise
            </p>
            {OUR_PROMISES.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-400/20 border border-green-400/30">
                  <svg
                    className="size-3 text-green-200"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-white/85">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-capitec-blue dark:text-blue-300">
            What we stand for
          </p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our values
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_US_VALUES.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-xl transition-all hover:border-capitec-blue/30 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-2xl dark:backdrop-blur-sm dark:hover:border-white/25 dark:hover:bg-white/10"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-capitec-blue/10 transition-colors group-hover:bg-capitec-blue/15 dark:bg-white/10 dark:group-hover:bg-white/20">
                <Icon className="size-5 text-capitec-blue dark:text-blue-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed dark:text-white/50">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageTheme>
);
