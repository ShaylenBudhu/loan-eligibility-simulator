import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "@/contexts";
import { ContactPage } from "@/pages/contact.page";

vi.mock("@/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api")>()),
  sendContactMessage: vi.fn().mockResolvedValue(undefined),
}));

const renderContact = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <ContactPage />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("ContactPage — form", () => {
  beforeEach(() => {
    localStorage.setItem("theme", "light");
    renderContact();
  });

  afterEach(() => localStorage.removeItem("theme"));

  it("renders the form with all fields", () => {
    expect(document.getElementById("name")).toBeInTheDocument();
    expect(document.getElementById("email")).toBeInTheDocument();
    expect(document.getElementById("message")).toBeInTheDocument();
  });

  it("does not submit when fields are empty", async () => {
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.queryByText("Message sent!")).not.toBeInTheDocument();
  });

  it("shows success state after valid submission", async () => {
    await userEvent.type(document.getElementById("name")!, "John Doe");
    await userEvent.type(document.getElementById("email")!, "john@example.com");
    await userEvent.type(
      document.getElementById("message")!,
      "This is a test message.",
    );
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() =>
      expect(screen.getByText("Message sent!")).toBeInTheDocument(),
    );
  });

  it("shows the 24-hour reply message on success", async () => {
    await userEvent.type(document.getElementById("name")!, "Jane");
    await userEvent.type(document.getElementById("email")!, "jane@example.com");
    await userEvent.type(document.getElementById("message")!, "Hello there");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/We'll get back to you within 24 hours/i),
      ).toBeInTheDocument(),
    );
  });

  it('resets form when "Send another message" is clicked', async () => {
    await userEvent.type(document.getElementById("name")!, "Reset Test");
    await userEvent.type(document.getElementById("email")!, "reset@test.com");
    await userEvent.type(document.getElementById("message")!, "Testing reset");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));
    await screen.findByText("Message sent!");
    await userEvent.click(
      screen.getByRole("button", { name: /send another message/i }),
    );
    await waitFor(() => {
      expect(document.getElementById("name")).toHaveValue("");
      expect(document.getElementById("email")).toHaveValue("");
      expect(document.getElementById("message")).toHaveValue("");
    });
  });

  it("renders all 4 contact detail cards", () => {
    expect(screen.getByText("Call us")).toBeInTheDocument();
    expect(screen.getByText("Email us")).toBeInTheDocument();
    expect(screen.getByText("Head office")).toBeInTheDocument();
    expect(screen.getByText("Branch hours")).toBeInTheDocument();
  });
});
