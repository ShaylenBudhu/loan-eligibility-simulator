import { type FC } from "react";

import { PageTheme } from "@/components/templates";
import { ContactForm } from "@/components/organisms";

import { CONTACT_DETAILS } from "./constants";

export const ContactPage: FC = () => (
  <PageTheme>
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="space-y-4 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
          Get in touch
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
          We'd love to{" "}
          <span className="bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            hear from you.
          </span>
        </h1>
        <p className="text-lg text-white/60 leading-relaxed">
          Have a question about your eligibility, our products, or just want to
          say hello? Reach out — our team is here to help.
        </p>
      </div>
    </section>

    <section className="bg-white py-16 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-white/15 dark:bg-white/5 dark:shadow-2xl dark:backdrop-blur-sm">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-5">
            {CONTACT_DETAILS.map(({ Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-2xl dark:backdrop-blur-sm"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-capitec-blue/10 dark:bg-white/10">
                  <Icon className="size-5 text-capitec-blue dark:text-blue-300" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/50">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-capitec-blue py-12 dark:bg-transparent dark:border-t-0 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-lg font-bold text-white">
            Prefer to check your eligibility first?
          </p>
          <p className="text-sm text-white/70">
            Get an instant result — no credit check required.
          </p>
        </div>
        <a
          href="/loan-simulator"
          className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-capitec-blue transition hover:bg-white/90"
        >
          Try the Loan Simulator →
        </a>
      </div>
    </section>
  </PageTheme>
);
