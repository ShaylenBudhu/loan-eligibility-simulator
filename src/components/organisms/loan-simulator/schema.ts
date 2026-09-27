import { z } from "zod";

export const loanCalculatorSchema = z.object({
  grossMonthlyIncome: z.number().min(1, "Gross monthly income is required"),
  debtMonthlyPayment: z
    .number()
    .min(0, "Monthly debt payment cannot be negative"),
  monthlyExpenses: z
    .number()
    .min(0, "Monthly expenses cannot be negative"),
  requestedLoanAmount: z.number().min(1, "Requested loan amount is required"),
  repaymentTerms: z
    .number("Repayment term is required")
    .int("Repayment term must be a whole number")
    .min(1, "Repayment term is required"),
  creditScore: z
    .number()
    .int("Credit score must be a whole number")
    .min(300, "Credit score must be at least 300")
    .max(850, "Credit score cannot exceed 850")
    .optional(),
});

export const advancedLoanCalculatorSchema = loanCalculatorSchema.extend({
  rent: z.number().min(0, "Rent cannot be negative").optional(),
  dependants: z
    .number()
    .int("Dependants must be a whole number")
    .min(0, "Dependants cannot be negative")
    .optional(),
  dwellingType: z
    .enum(["formal_house", "townhouse", "flat", "informal"])
    .optional(),
  waterSource: z.enum(["running", "tap", "other"]).optional(),
  electricityAccess: z.enum(["reliable", "occasional", "none"]).optional(),
  sanitationType: z.enum(["flush_toilet", "pit", "none"]).optional(),
  employmentType: z.enum(["formal", "self-employed", "informal"]).optional(),
  employmentDuration: z.number().int().min(0).optional(),
  incomeStability: z.enum(["steady", "moderate", "irregular"]).optional(),
  paymentHistory: z.enum(["ontime", "occasional_late", "default"]).optional(),
});

export const repaymentTermSchema = z.object({
  value: z.number().int().positive(),
  label: z.string().min(1),
  description: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export const termsResponseSchema = z.object({
  repaymentTerms: z.array(repaymentTermSchema),
});
