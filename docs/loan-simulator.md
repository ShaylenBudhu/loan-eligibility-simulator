# Loan Simulator — Formulas & Flow

Written for: engineers or reviewers who need to understand or audit the eligibility calculations. All financial logic lives in [`src/components/organisms/loan-simulator/loan-calculator.ts`](../src/components/organisms/loan-simulator/loan-calculator.ts); the UI is a thin shell around it.

---

## 1. Scope

This is an **educational simulator**, not a credit decisioning engine. It approximates NCA-aligned affordability logic but is not calibrated against real default data. Numbers are directional.

Two modes:

- **Basic** — DTI-driven affordability and rate assignment.
- **Advanced** — Composite SEM (Socio-Economic Measure) score, six weighted factors.

Both modes share the same input pipeline for income, expenses, and loan parameters; only the risk-tier + rate assignment differs.

---

## 2. Inputs

| Field | Both modes | Advanced only | Notes |
|---|---|---|---|
| Gross monthly income | ✓ | | Before tax |
| Monthly debt payments | ✓ | | Existing loans / credit repayments |
| Monthly living expenses | ✓ | | Basic: everything non-debt. Advanced: excludes rent (captured separately). A **"Break it down"** dialog is available next to the field — line items (food, transport, utilities, insurance, schooling, other, plus rent in basic mode) with a live total. On Apply, the sum is written back into `monthlyExpenses`; line items are helper-only and are not stored on the form. |
| Rent / bond | | ✓ | Advanced only — kept separate for line-item clarity |
| Dependants | | ✓ | Advanced only — informational, not yet used in calc |
| Requested loan amount | ✓ | | Principal |
| Repayment term | ✓ | | Months, from `/terms.json` |
| Credit score | (schema only) | | Currently commented out in the UI |
| Dwelling / infrastructure / employment / income stability / payment history | | ✓ | Enumerations |

---

## 3. Derived income

### 3.1 Net income (SARS 2025/26)

The user enters **gross** income; we estimate **net** using SARS brackets for the under-65 primary rebate, plus UIF.

```
annualGross = grossMonthly × 12
annualTaxDue = max(0, tax(annualGross) − 17 235)   # R17 235 primary rebate
uif = min(grossMonthly × 0.01, R177.12)             # UIF ceiling
netMonthly = grossMonthly − (annualTaxDue ÷ 12) − uif
```

Bracket table (annual, 2025/26):

| Bracket ceiling | Formula |
|---|---|
| R237 100 | 18% of amount |
| R370 500 | R42 678 + 26% above R237 100 |
| R512 800 | R77 362 + 31% above R370 500 |
| R673 000 | R121 475 + 36% above R512 800 |
| R857 900 | R179 147 + 39% above R673 000 |
| R1 817 000 | R251 258 + 41% above R857 900 |
| >R1 817 000 | R644 489 + 45% above R1 817 000 |

**Assumptions the estimate does not account for**: medical-aid credits, pension/RA contributions, age rebates (65+, 75+), travel allowances, or any deductions that reduce taxable income. Real net can differ meaningfully — the number is a floor estimate.

### 3.2 Disposable income

```
livingExpenses = monthlyExpenses + rent           # rent = 0 in basic mode
disposableIncome = max(0, netMonthly − debt − livingExpenses)
```

Disposable income drives affordability decisions. It is **not** the same as "money left over" — the affordability cap (below) further restricts how much of it may be committed to a new loan.

### 3.3 NCA minimum-expense floor

We compute the NCA Reg 23A minimum expected household expenses for the user's income band and flag `belowNcaMinimum` if the user's reported expenses fall below it. This is a *sanity warning*, not a rejection.

| Gross monthly income | Minimum expected expenses |
|---|---|
| ≤ R800 | R0 |
| R800.01 – R6 250 | R800 + 6.75% of (income − R800) |
| R6 250.01 – R25 000 | R1 167.88 + 9% of (income − R6 250) |
| R25 000.01 – R50 000 | R2 855.38 + 8.2% of (income − R25 000) |
| > R50 000 | R4 905.38 + 6.75% of (income − R50 000) |

---

## 4. Loan mechanics

### 4.1 Monthly payment (standard amortisation)

```
r = annualRate ÷ 12                 # monthly rate
factor = (1 + r) ^ termMonths
monthlyPayment = principal × [r × factor] ÷ [factor − 1]
```

Zero-rate edge case: `monthlyPayment = principal ÷ termMonths`.

### 4.2 Max loan (Basic mode)

Computed as the **smaller** of two ceilings, each solved for principal by inverting the amortisation formula:

**Ceiling A — Affordability cap** (default 60% of disposable):
```
maxAffordablePayment = disposableIncome × 0.60
```

**Ceiling B — Total-DSI cap** (post-loan debt share of gross ≤ 50%):
```
maxNewPaymentByDsi = max(0, grossMonthly × 0.50 − debt)
```

Then:
```
maxNewPayment = min(A, B)
maxLoan       = maxNewPayment × [(1 + r)^n − 1] ÷ [r × (1 + r)^n]   # zero-rate: × n
```

The DSI cap prevents "same disposable income, wildly different existing-debt loads" from producing identical max-loan figures.

### 4.3 Max loan (Advanced mode)

Advanced uses an **income-multiplier** rather than affordability inversion:
```
maxLoan = grossMonthly × TIER_MAX_LOAN_MULTIPLIER[tier]
```

| Tier | Multiplier |
|---|---|
| 1 – Low | 8.5× |
| 2 – Moderate | 5× |
| 3 – High | 3× |
| 4 – Very High | 1.5× |

⚠️ **Methodology mismatch** — basic and advanced compute max-loan differently. This is intentional (advanced treats tier as a hard constraint the way lenders do), but flag it if you're comparing results across modes.

### 4.4 Affordability verdict

```
isAffordable = monthlyPayment ≤ maxAffordablePayment
```

---

## 5. Risk-tier assignment

### 5.1 Basic — from DTI

```
DTI = debtMonthlyPayment ÷ grossMonthlyIncome
```

| DTI | Tier |
|---|---|
| ≤ 30% | 1 – Low |
| 30–40% | 2 – Moderate |
| 40–50% | 3 – High |
| > 50% | 4 – Very High (over-indebted) |

### 5.2 Basic — interest rate

If a credit score is provided, rate comes from the Experian band map:

| Credit score ≥ | Rate |
|---|---|
| 658 | 14% |
| 634 | 16% |
| 616 | 20% |
| 599 | 24% |
| < 599 | 27% |

Otherwise the rate is the tier midpoint: 14 / 20 / 24 / 27% for tiers 1–4.

### 5.3 Advanced — SEM composite score

Score starts at **50** and each factor applies a weighted delta from a neutral baseline of 50:

```
score += (points − 50) × weight
```

| Factor | Weight | Points |
|---|---|---|
| Dwelling type | 15% | formal house 90 / townhouse 75 / flat 60 / informal 30 |
| Infrastructure (all-or-nothing) | 15% | full infra 85 / anything less 50 |
| Employment type + tenure | 20% | formal ≥36 mo 95 / formal <36 mo 70 / self-employed 50 / informal 30 |
| DTI band | 25% | ≤36% 100 / 36–43% 80 / 43–50% 50 / >50% 20 |
| Payment history | 15% | on-time 95 / occasional late 60 / default 20 |
| Income stability | 10% | steady 90 / moderate 60 / irregular 30 |

Weights sum to 100%. Final score is clamped to `[0, 100]`.

Tier from score:

| Score | Tier |
|---|---|
| ≥ 80 | 1 – Low |
| 60–79 | 2 – Moderate |
| 40–59 | 3 – High |
| < 40 | 4 – Very High |

Interest rate: tier midpoint (14/20/24/27%). Credit-score refinement is not applied in advanced mode.

**Known limitations of the composite score:**
- Starting baseline of 50 is arbitrary, not calibrated against defaults.
- Deltas are linear and symmetric — real risk isn't.
- Infrastructure is boolean (all-or-nothing), not additive.
- Employment tenure has one threshold (36 mo), not a continuous curve.
- DTI is used twice (in the score and in the affordability check).

---

## 6. Advanced-only outputs

- **`riskScore`** — the raw 0–100 composite.
- **`newDsi`** — post-loan debt-service-to-income: `(debt + newPayment) ÷ gross`. Displayed with a warning band above 50%.

---

## 7. Files

| File | Purpose |
|---|---|
| [`src/components/organisms/loan-simulator/loan-calculator.ts`](../src/components/organisms/loan-simulator/loan-calculator.ts) | All financial logic. Pure functions, no React. |
| [`src/components/organisms/loan-simulator/schema.ts`](../src/components/organisms/loan-simulator/schema.ts) | Zod validation for form inputs. |
| [`src/components/organisms/loan-simulator/loan-simulator.form.tsx`](../src/components/organisms/loan-simulator/loan-simulator.form.tsx) | Form UI, mode toggle, collapsible advanced sections. |
| [`src/components/organisms/loan-simulator/loan-results/expense-breakdown.dialog.tsx`](../src/components/organisms/loan-simulator/loan-results/expense-breakdown.dialog.tsx) | Optional breakdown modal — line items, live total, NCA sanity check. Writes the sum back into the form's `monthlyExpenses` field. |
| [`src/components/organisms/loan-simulator/loan-results/results-panel.tsx`](../src/components/organisms/loan-simulator/loan-results/results-panel.tsx) | Metric rows, affordability verdict, NCA warning. |
| [`src/components/organisms/loan-simulator/loan-results/loan-charts.tsx`](../src/components/organisms/loan-simulator/loan-results/loan-charts.tsx) | Income-breakdown bar + amortisation line chart. |
| [`src/components/organisms/loan-simulator/terms.query.ts`](../src/components/organisms/loan-simulator/terms.query.ts) | Repayment-term options from `/public/terms.json`. |

---

## 8. Constants at a glance

| Name | Value | Source |
|---|---|---|
| `AFFORDABILITY_CAP` | 0.60 | Design choice — flat cap. Real NCA scales with income band. |
| `DTI_THRESHOLDS.warning` | 0.30 | Basic tier boundary |
| `DTI_THRESHOLDS.critical` | 0.40 | Basic tier boundary |
| `DTI_THRESHOLDS.overIndebted` | 0.50 | Basic tier boundary + DSI ceiling |
| `TIER_RATES` | 0.14 / 0.20 / 0.24 / 0.27 | Tier midpoints for basic + advanced |
| `TIER_MAX_LOAN_MULTIPLIER` | 8.5 / 5 / 3 / 1.5 | Advanced-mode income multiples |
| `PRIMARY_REBATE` | R17 235 | SARS 2025/26 under-65 |
| `UIF_MONTHLY_CAP` | R177.12 | 1% of R17 712 monthly ceiling |

These constants are defined at the top of [`loan-calculator.ts`](../src/components/organisms/loan-simulator/loan-calculator.ts). Update them there when they change.

---

## 9. Worked example

**Input** (basic mode): gross R25 000, debt R2 000, expenses R8 000, loan R50 000 over 36 months.

1. **Net income** — R25 000 × 12 = R300 000 annual gross.
   Tax bracket 2: R42 678 + 26% × (R300 000 − R237 100) = R59 032. After rebate: R41 797. Monthly tax ≈ R3 483.
   UIF: min(R250, R177.12) = R177.12.
   Net ≈ R21 340.
2. **Living expenses** — R8 000. NCA minimum for R25k band ≈ R2 855.38 → user is above, no warning.
3. **Disposable** — R21 340 − R2 000 − R8 000 = R11 340.
4. **DTI** — R2 000 ÷ R25 000 = 8% → Tier 1.
5. **Rate** — 14% p.a. (Tier 1 midpoint).
6. **Monthly payment** — R50 000 amortised at 14% over 36 months ≈ R1 709.
7. **Affordability cap** — R11 340 × 60% = R6 804. Payment R1 709 ≤ cap → **affordable**.
8. **Max loan** —
   - Ceiling A (affordability): principal from R6 804/mo at 14% × 36 mo ≈ R199 000.
   - Ceiling B (DSI): max new payment = R25 000 × 50% − R2 000 = R10 500 → principal ≈ R307 000.
   - Bound is A → **max loan ≈ R199 000**.
