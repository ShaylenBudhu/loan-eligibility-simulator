import type { FC } from "react";
import { PageTheme } from "@/components/templates";

export const LoanSimulatorPage: FC = () => (
  <PageTheme className="mx-auto max-w-7xl px-6 py-16">
    <h1 className="text-3xl font-bold text-white">
      Loan Eligibility Simulator
    </h1>
  </PageTheme>
);
