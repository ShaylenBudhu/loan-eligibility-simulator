import { createFileRoute } from "@tanstack/react-router";

import { LoanSimulatorPage } from "@/pages/loan-simulator.page";

export const Route = createFileRoute("/loan-simulator")({
  component: LoanSimulatorPage,
});
