import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import { ExpenseBreakdownDialog, type SimulatorMode } from "@/components";

type HarnessProps = {
  mode?: SimulatorMode;
  grossMonthlyIncome?: number;
  currentValue?: number;
  onApply?: (total: number) => void;
};

const Harness = ({
  mode = "basic",
  grossMonthlyIncome = 25000,
  currentValue = 0,
  onApply = () => {},
}: HarnessProps) => {
  const [open, setOpen] = useState(true);
  return (
    <ExpenseBreakdownDialog
      open={open}
      onOpenChange={setOpen}
      mode={mode}
      grossMonthlyIncome={grossMonthlyIncome}
      currentValue={currentValue}
      onApply={onApply}
    />
  );
};

describe("ExpenseBreakdownDialog", () => {
  it("renders the basic-mode line items including rent", () => {
    render(<Harness mode="basic" />);
    expect(screen.getByLabelText(/rent \/ bond/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/food & groceries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transport \/ fuel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/utilities/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/insurance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/school/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other/i)).toBeInTheDocument();
  });

  it("hides rent in advanced mode", () => {
    render(<Harness mode="advanced" />);
    expect(screen.queryByLabelText(/rent \/ bond/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/food & groceries/i)).toBeInTheDocument();
  });

  it("computes a live total as lines are entered", async () => {
    render(<Harness mode="basic" />);
    await userEvent.type(screen.getByLabelText(/rent \/ bond/i), "4000");
    await userEvent.type(screen.getByLabelText(/food & groceries/i), "2500");
    expect(screen.getByText(/R\s?6[\s.]?500/)).toBeInTheDocument();
  });

  it("warns when the total is below the NCA minimum", async () => {
    render(<Harness mode="basic" grossMonthlyIncome={25000} />);
    await userEvent.type(screen.getByLabelText(/food & groceries/i), "100");
    expect(screen.getByText(/your total is below this/i)).toBeInTheDocument();
  });

  it("hides the NCA line when income is 0", () => {
    render(<Harness mode="basic" grossMonthlyIncome={0} />);
    expect(screen.queryByText(/NCA guideline/i)).not.toBeInTheDocument();
  });

  it("calls onApply with the total and closes on Apply", async () => {
    const applied: number[] = [];
    render(<Harness mode="basic" onApply={(total) => applied.push(total)} />);
    await userEvent.type(screen.getByLabelText(/rent \/ bond/i), "4000");
    await userEvent.type(screen.getByLabelText(/food & groceries/i), "2500");
    await userEvent.click(screen.getByRole("button", { name: /apply total/i }));
    await waitFor(() => {
      expect(applied).toEqual([6500]);
    });
    expect(
      screen.queryByText("Break down your monthly expenses"),
    ).not.toBeInTheDocument();
  });

  it("shows a mismatch banner when currentValue differs from breakdown total", () => {
    render(<Harness mode="basic" currentValue={10000} />);
    expect(screen.getByText(/currently shows/i)).toBeInTheDocument();
    expect(screen.getAllByText(/R\s?10[\s. ]?000/).length).toBeGreaterThan(0);
  });

  it("hides the mismatch banner once totals align", async () => {
    render(<Harness mode="basic" currentValue={2500} />);
    expect(screen.getByText(/currently shows/i)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/food & groceries/i), "2500");
    await waitFor(() => {
      expect(screen.queryByText(/currently shows/i)).not.toBeInTheDocument();
    });
  });

  it("loads the current form value into 'Other' on demand", async () => {
    render(<Harness mode="basic" currentValue={7500} />);
    await userEvent.click(
      screen.getByRole("button", { name: /load .* into "Other"/i }),
    );
    expect(screen.getByLabelText(/other/i)).toHaveValue(7500);
    expect(screen.getByText(/R\s?7[\s.]?500/)).toBeInTheDocument();
  });

  it("does not call onApply when Cancel is clicked", async () => {
    const applied: number[] = [];
    render(<Harness mode="basic" onApply={(total) => applied.push(total)} />);
    await userEvent.type(screen.getByLabelText(/food & groceries/i), "2500");
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(applied).toEqual([]);
    });
  });
});
