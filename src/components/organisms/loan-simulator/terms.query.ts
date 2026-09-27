import { useQuery } from "@tanstack/react-query";

import type { RepaymentTerm } from "./types";
import { termsResponseSchema } from "./schema";

const fetchTerms = async (): Promise<RepaymentTerm[]> => {
  const response = await fetch("/terms.json");

  if (!response.ok) throw new Error("Failed to fetch repayment terms");

  const data = termsResponseSchema.parse(await response.json());

  return data.repaymentTerms;
};

export const useTermsQuery = () =>
  useQuery({
    queryKey: ["repaymentTerms"],
    queryFn: fetchTerms,
  });
