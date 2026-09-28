import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  type LoanResults,
  LoanSimulatorForm,
  type SimulatorMode,
} from "@/components";

const user = userEvent.setup({ pointerEventsCheck: 0 });

const mockTerms = {
  repaymentTerms: [
    { value: 12, label: "12 months", description: "one year" },
    {
      value: 24,
      label: "24 months",
      description: "two years",
      isDefault: true,
    },
    { value: 36, label: "36 months", description: "three years" },
  ],
};

interface Capture {
  results: LoanResults | null;
  mode: SimulatorMode | null;
  callCount: number;
}

function renderForm(capture: Capture) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTerms,
    }),
  );

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const onResults = (results: LoanResults | null, mode: SimulatorMode) => {
    capture.results = results;
    capture.mode = mode;
    capture.callCount += 1;
  };

  return render(
    <QueryClientProvider client={client}>
      <LoanSimulatorForm onResults={onResults} />
    </QueryClientProvider>,
  );
}

describe("LoanSimulatorForm", () => {
  let capture: Capture;

  beforeEach(() => {
    capture = { results: null, mode: null, callCount: 0 };
    renderForm(capture);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders all basic-mode fields", async () => {
    expect(screen.getByLabelText(/gross monthly income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly debt payments/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/monthly living expenses/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/requested loan amount/i)).toBeInTheDocument();
    expect(screen.getByText("Repayment Term")).toBeInTheDocument();
  });

  it("does not show advanced sections in basic mode", () => {
    expect(screen.queryByText("Household")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Dwelling & Infrastructure"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/rent \/ bond payment/i)).not.toBeInTheDocument();
  });

  it("switches to advanced and reveals extra sections", async () => {
    await user.click(screen.getByRole("button", { name: /advanced/i }));
    expect(screen.getByText("Household")).toBeInTheDocument();
    expect(screen.getByText("Dwelling & Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Employment & Income")).toBeInTheDocument();
    expect(screen.getByText("Financial History")).toBeInTheDocument();
    expect(screen.getByText(/rent \/ bond payment/i)).toBeInTheDocument();
    expect(screen.getByText("Dependants")).toBeInTheDocument();
  });

  it("relabels the expense field in advanced mode", async () => {
    expect(screen.getByText("Monthly Living Expenses")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /advanced/i }));
    expect(screen.getByText("Other Monthly Expenses")).toBeInTheDocument();
    expect(
      screen.queryByText("Monthly Living Expenses"),
    ).not.toBeInTheDocument();
  });

  it("clears results on mode switch", async () => {
    await user.type(screen.getByLabelText(/gross monthly income/i), "25000");
    await user.type(screen.getByLabelText(/monthly debt payments/i), "2000");
    await user.type(screen.getByLabelText(/monthly living expenses/i), "8000");
    await user.type(screen.getByLabelText(/requested loan amount/i), "50000");
    await user.click(document.getElementById("repayment-term")!);
    await user.click(await screen.findByText("36 months (3 years)"));
    await user.click(
      screen.getByRole("button", { name: /check eligibility/i }),
    );
    await waitFor(() => expect(capture.results).not.toBeNull());

    await user.click(screen.getByRole("button", { name: /advanced/i }));
    await waitFor(() => {
      expect(capture.results).toBeNull();
      expect(capture.mode).toBe("advanced");
    });
  });

  it("shows validation errors when submitted empty", async () => {
    await user.click(
      screen.getByRole("button", { name: /check eligibility/i }),
    );
    await waitFor(() =>
      expect(screen.getAllByText(/required|too small/i).length).toBeGreaterThan(
        0,
      ),
    );
    expect(capture.callCount).toBe(0);
  });

  it("submits basic mode with valid data and calls onResults", async () => {
    await user.type(screen.getByLabelText(/gross monthly income/i), "25000");
    await user.type(screen.getByLabelText(/monthly debt payments/i), "2000");
    await user.type(screen.getByLabelText(/monthly living expenses/i), "8000");
    await user.type(screen.getByLabelText(/requested loan amount/i), "50000");
    await user.click(document.getElementById("repayment-term")!);
    await user.click(await screen.findByText("36 months (3 years)"));
    await user.click(
      screen.getByRole("button", { name: /check eligibility/i }),
    );

    await waitFor(() => {
      expect(capture.results).not.toBeNull();
      expect(capture.mode).toBe("basic");
    });

    const r = capture.results!;
    expect(r.grossMonthlyIncome).toBe(25000);
    expect(r.livingExpenses).toBe(8000);
    expect(r.repaymentTerms).toBe(36);
    expect([1, 2, 3, 4]).toContain(r.riskTier);
    expect(r.isAffordable).toBe(true);
  });

  it("submits advanced mode and produces riskScore", async () => {
    await user.click(screen.getByRole("button", { name: /advanced/i }));
    await user.type(screen.getByLabelText(/gross monthly income/i), "25000");
    await user.type(screen.getByLabelText(/monthly debt payments/i), "2000");
    await user.type(screen.getByLabelText(/other monthly expenses/i), "5000");
    await user.type(screen.getByLabelText(/requested loan amount/i), "50000");
    await user.click(document.getElementById("repayment-term")!);
    await user.click(await screen.findByText("36 months (3 years)"));
    await user.type(screen.getByLabelText(/rent \/ bond payment/i), "6000");
    await user.click(
      screen.getByRole("button", { name: /check eligibility/i }),
    );

    await waitFor(() => {
      expect(capture.results).not.toBeNull();
      expect(capture.mode).toBe("advanced");
    });

    const r = capture.results!;
    expect(typeof r.riskScore).toBe("number");
    expect(typeof r.newDsi).toBe("number");
    expect(r.livingExpenses).toBe(11000);
  });
});
