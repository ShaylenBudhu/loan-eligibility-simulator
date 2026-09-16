import { createFileRoute } from "@tanstack/react-router";

import { LoanSimulatorPage } from "@/pages/LoanSimulatorPage";

export const Route = createFileRoute("/loan-simulator")({
  component: LoanSimulatorPage,
});
