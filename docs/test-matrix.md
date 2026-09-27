# Test Matrix — Loan Eligibility Simulator

**Total tests:** 125 · **All passing** · Generated 2026-09-27  
**Runner:** Vitest 5 · **Environment:** jsdom

---

## Legend

| Column | Meaning |
|---|---|
| **ID** | Sequential test identifier |
| **Type** | `Unit` — pure function · `Component` — React render + interaction · `Integration` — multi-layer |
| **Mode** | `Basic` / `Advanced` / `Both` / `N/A` |
| **Boundary** | ✓ if the test targets an exact threshold or edge case |
| **Status** | ✅ Pass |

---

## 1. DTI Tier Boundaries
**File:** `loan-tiers-limits.test.ts` · **Function:** `getRiskTierFromDTI`  
**Rule:** thresholds are strict `>` — the boundary value stays in the lower tier.

| ID | Type | Input Condition | Expected Tier | Boundary | Status |
|---|---|---|---|---|---|
| T-01 | Unit | DTI = 0.30 (exactly) | Tier 1 | ✓ | ✅ |
| T-02 | Unit | DTI = 0.301 (just above 0.30) | Tier 2 | ✓ | ✅ |
| T-03 | Unit | DTI = 0.40 (exactly) | Tier 2 | ✓ | ✅ |
| T-04 | Unit | DTI = 0.401 (just above 0.40) | Tier 3 | ✓ | ✅ |
| T-05 | Unit | DTI = 0.50 (exactly) | Tier 3 | ✓ | ✅ |
| T-06 | Unit | DTI = 0.501 (just above 0.50) | Tier 4 | ✓ | ✅ |
| T-07 | Unit | DTI = 0 (no debt) | Tier 1 | | ✅ |
| T-08 | Unit | DTI = 1.0 (over-indebted) | Tier 4 | | ✅ |

---

## 2. Risk Tier Labels
**File:** `loan-tiers-limits.test.ts` · **Function:** `calculateBasicResults`  
**Rule:** each tier maps to a fixed label string used throughout the UI.

| ID | Type | Input: DTI | Expected Label | Status |
|---|---|---|---|---|
| T-09 | Unit | 0% (debt = R 0) | `"Tier 1 – Low Risk"` | ✅ |
| T-10 | Unit | 32% (debt = R 8 000 / gross R 25 000) | `"Tier 2 – Moderate Risk"` | ✅ |
| T-11 | Unit | 44% (debt = R 11 000 / gross R 25 000) | `"Tier 3 – High Risk"` | ✅ |
| T-12 | Unit | 52% (debt = R 13 000 / gross R 25 000) | `"Tier 4 – Very High Risk"` | ✅ |

---

## 3. Interest Rate per Risk Tier
**File:** `loan-tiers-limits.test.ts` · **Function:** `calculateBasicResults`

| ID | Type | Input: DTI | Expected Rate | Tier | Status |
|---|---|---|---|---|---|
| T-13 | Unit | 0% | 14.0% p.a. | 1 | ✅ |
| T-14 | Unit | 32% | 20.0% p.a. | 2 | ✅ |
| T-15 | Unit | 44% | 24.0% p.a. | 3 | ✅ |
| T-16 | Unit | 52% | 27.0% p.a. | 4 | ✅ |

---

## 4. Score-Based Tier Boundaries (Advanced Mode)
**File:** `loan-tiers-limits.test.ts` · **Function:** `getRiskTierFromScore`  
**Rule:** thresholds are inclusive `>=` — the boundary score stays in the better tier.

| ID | Type | Input: SEM Score | Expected Tier | Boundary | Status |
|---|---|---|---|---|---|
| T-17 | Unit | 80 (exactly) | Tier 1 | ✓ | ✅ |
| T-18 | Unit | 79 (just below 80) | Tier 2 | ✓ | ✅ |
| T-19 | Unit | 60 (exactly) | Tier 2 | ✓ | ✅ |
| T-20 | Unit | 59 (just below 60) | Tier 3 | ✓ | ✅ |
| T-21 | Unit | 40 (exactly) | Tier 3 | ✓ | ✅ |
| T-22 | Unit | 39 (just below 40) | Tier 4 | ✓ | ✅ |
| T-23 | Unit | 0 (worst possible) | Tier 4 | | ✅ |
| T-24 | Unit | 100 (perfect score) | Tier 1 | | ✅ |

---

## 5. Maximum Loan Amount — Basic Mode
**File:** `loan-tiers-limits.test.ts` · **Function:** `calculateBasicResults`  
**Rule:** `maxLoan = min(affordability ceiling, DSI ceiling)` — both independently cap the loan.

| ID | Type | Input Conditions | Expected `maxLoanAmount` | Binding Constraint | Status |
|---|---|---|---|---|---|
| T-25 | Unit | Debt ≥ gross × 50% (R 13 000 debt / R 25 000 gross) | R 0 | DSI ceiling exhausted | ✅ |
| T-26 | Unit | Expenses = R 100 000 (wipes out net income) | R 0 | Disposable = 0 | ✅ |
| T-27 | Unit | Debt = R 0, expenses = R 18 000 (high expenses) | > R 0 | Affordability ceiling | ✅ |
| T-28 | Unit | Debt = R 9 000, expenses = R 5 000 (high existing debt) | > R 0 | DSI ceiling | ✅ |
| T-29 | Unit | Any valid positive result | Integer (no decimals) | N/A | ✅ |

---

## 6. Maximum Loan Amount — Advanced Mode (Tier Multipliers)
**File:** `loan-tiers-limits.test.ts` · **Function:** `calculateAdvancedResults`  
**Rule:** `maxLoan = round(grossMonthlyIncome × tierMultiplier)`

| ID | Type | Profile | Expected Score Range | Tier | Multiplier | Expected Formula | Status |
|---|---|---|---|---|---|---|---|
| T-30 | Unit | All-best (formal house, stable employment, DTI 0%, on-time) | ~93.5 | 1 | 8.5× | `round(20 000 × 8.5)` = R 170 000 | ✅ |
| T-31 | Unit | Mixed (flat, formal <36 mo, DTI 44%, on-time) | ~66 | 2 | 5.0× | `round(10 000 × 5.0)` = R 50 000 | ✅ |
| T-32 | Unit | Weak (informal dwelling, informal employment, DTI 37%, occasional late) | ~53 | 3 | 3.0× | `round(10 000 × 3.0)` = R 30 000 | ✅ |
| T-33 | Unit | All-worst (informal, DTI 55%, default history) | ~29 | 4 | 1.5× | `round(20 000 × 1.5)` = R 30 000 | ✅ |

---

## 7. Affordability Flag
**File:** `loan-tiers-limits.test.ts` · **Function:** `calculateBasicResults`  
**Rule:** `isAffordable = (monthlyPayment ≤ disposableIncome × 0.6)`

| ID | Type | Loan Request | Monthly Payment | Affordability Cap | `isAffordable` | Status |
|---|---|---|---|---|---|---|
| T-34 | Unit | R 50 000 (small loan, 36 mo) | ~R 1 709 | ~R 6 804 | `true` | ✅ |
| T-35 | Unit | R 500 000 (large loan, 36 mo) | ~R 17 090 | ~R 6 804 | `false` | ✅ |

---

## 8. Tier + Rate + Label Integration (calculateBasicResults)
**File:** `loan-tiers-limits.test.ts`

| ID | Type | Input: Gross / Debt | DTI | Tier | Rate | Label | Credit Score Override | Status |
|---|---|---|---|---|---|---|---|---|
| T-36 | Integration | R 25 000 / R 2 000 | 8% | 1 | 14% | Tier 1 – Low Risk | None | ✅ |
| T-37 | Integration | R 25 000 / R 13 000 | 52% | 4 | 27% | Tier 4 – Very High Risk | None | ✅ |
| T-38 | Integration | R 25 000 / R 8 750 (Tier 2 profile) | 35% | 2 | 14% (overridden ↓) | — | Score 700 → Experian ≥ 658 | ✅ |
| T-38b | Integration | R 25 000 / R 0 (Tier 1 profile) | 0% | 1 | 27% (overridden ↑) | — | Score 550 → Experian < 599 | ✅ |

---

## 9. Core Calculator Unit Tests
**File:** `loan-calculator.test.ts`

### estimateNetFromGross

| ID | Type | Input | Expected Output | Note | Status |
|---|---|---|---|---|---|
| C-01 | Unit | Gross = R 0 | Net = R 0 | Edge — zero income | ✅ |
| C-02 | Unit | Gross = -R 100 | Net = R 0 | Edge — negative income | ✅ |
| C-03 | Unit | Gross = R 7 000 | Net ≈ R 6 930 | Below tax threshold — UIF only | ✅ |
| C-04 | Unit | Gross = R 50 000 vs R 49 000 | Δ between R 400–R 900 | UIF capped at R 177.12 at both levels | ✅ |

### calculateMonthlyPayment

| ID | Type | Input | Expected Output | Note | Status |
|---|---|---|---|---|---|
| C-05 | Unit | Principal = R 0, rate 14%, 36 mo | R 0 | Edge — zero principal | ✅ |
| C-06 | Unit | R 1 000, 14%, term = 0 months | R 0 | Edge — zero term | ✅ |
| C-07 | Unit | R 12 000, 0% rate, 12 mo | R 1 000 | Zero interest — equal split | ✅ |
| C-08 | Unit | R 50 000, 14%, 36 mo | ≈ R 1 709 | Standard amortisation formula | ✅ |

### calculateDTI

| ID | Type | Input | Expected | Status |
|---|---|---|---|---|
| C-09 | Unit | Debt R 1 000, gross = R 0 | 0 | Edge — zero income | ✅ |
| C-10 | Unit | Debt R 2 000, gross R 10 000 | 0.2 (20%) | Standard ratio | ✅ |

### getRiskTierFromDTI (summary mapping)

| ID | Type | DTI Inputs | Expected Tiers | Status |
|---|---|---|---|---|
| C-11 | Unit | 0.1, 0.3 | Tier 1, Tier 1 | ✅ |
| C-11b | Unit | 0.35, 0.45, 0.6 | Tier 2, Tier 3, Tier 4 | ✅ |

### getInterestRateFromCreditScore (Experian bands)

| ID | Type | Credit Score | Expected Rate | Band | Status |
|---|---|---|---|---|---|
| C-12 | Unit | 700 | 14% | ≥ 658 | ✅ |
| C-13 | Unit | 640 | 16% | 634–657 | ✅ |
| C-14 | Unit | 620 | 20% | 616–633 | ✅ |
| C-15 | Unit | 600 | 24% | 599–615 | ✅ |
| C-16 | Unit | 500 | 27% | < 599 | ✅ |

### getNcaMinimumExpenses (NCA Reg 23A Table A)

| ID | Type | Gross Monthly | Expected Minimum | Income Band | Status |
|---|---|---|---|---|---|
| C-17 | Unit | R 500 | R 0 | Below R 800 floor | ✅ |
| C-18 | Unit | R 25 000 | ≈ R 2 855.38 | R 6 250–R 25 000 band | ✅ |
| C-19 | Unit | R 60 000 | ≈ R 5 580.38 | R 50 000+ top band | ✅ |

### calculateBasicResults (full output shape)

| ID | Type | Scenario | Key Assertions | Status |
|---|---|---|---|---|
| C-20 | Unit | Normal inputs (gross R 25 000) | All required fields present on result | ✅ |
| C-21 | Unit | Normal inputs | `disposable = net − debt − expenses` | ✅ |
| C-22 | Unit | Normal inputs | `isAffordable = (payment ≤ disposable × 0.6)` | ✅ |
| C-23 | Unit | Expenses = R 100 000 | `disposable = 0`, `maxLoan = 0` | ✅ |
| C-24 | Unit | Expenses = R 100 (unrealistically low) | `belowNcaMinimum = true` | ✅ |
| C-25 | Unit | Debt = R 12 000 (high DSI) | `maxLoan < R 20 000` — DSI ceiling binds | ✅ |
| C-26 | Unit | Credit score 500 vs no score | Rate = 27% overrides tier default | ✅ |

### calculateAdvancedResults

| ID | Type | Scenario | Key Assertions | Status |
|---|---|---|---|---|
| C-27 | Unit | Any valid advanced input | `riskScore` is 0–100 | ✅ |
| C-28 | Unit | Rent R 6 000 + expenses R 5 000 | `livingExpenses = R 11 000` | ✅ |
| C-29 | Unit | Any valid advanced input | `newDsi` is a number | ✅ |
| C-30 | Unit | Best vs worst SEM factors | `bad.riskScore < good.riskScore`, `bad.riskTier ≥ good.riskTier` | ✅ |
| C-31 | Unit | Any valid advanced input | `maxLoanAmount % 1 === 0` (integer) | ✅ |

---

## 10. PDF Report Generation
**File:** `download-results.test.ts` · **Function:** `buildResultsPdf`

| ID | Type | Mode | Input Conditions | Expected Output | Status |
|---|---|---|---|---|---|
| P-01 | Unit | Basic | Standard result set | Output is a `Blob` with `type = "application/pdf"` and `size > 0` | ✅ |
| P-02 | Unit | Basic | Standard result set | First 8 bytes match `/^%PDF-\d\.\d/` | ✅ |
| P-03 | Unit | Both | Basic vs advanced (with `riskScore`, `newDsi`) | Advanced PDF `size > basic PDF size` | ✅ |
| P-04 | Unit | Basic | `belowNcaMinimum = true` vs `false` | PDF with flag is larger (NCA note added) | ✅ |
| P-05 | Unit | Basic | Both `isAffordable = true` and `false` | Does not throw on either path | ✅ |

---

## 11. Results Panel Component
**File:** `results-panel.test.tsx` · **Component:** `ResultsPanel`

| ID | Type | Mode | Input Props | Expected UI | Status |
|---|---|---|---|---|---|
| R-01 | Component | Both | `results = null` | Shows "No results yet" empty state | ✅ |
| R-02 | Component | Basic | Full basic result | Tier badge + all 7 core metric rows visible | ✅ |
| R-03 | Component | Basic | `isAffordable = true` | "Affordable" verdict + "within 60" text | ✅ |
| R-04 | Component | Basic | `isAffordable = false` | "May strain your budget" + "exceeds 60" text | ✅ |
| R-05 | Component | Basic | `belowNcaMinimum = true` | "Expenses look low" NCA warning visible | ✅ |
| R-06 | Component | Basic | `belowNcaMinimum = false` | NCA warning absent | ✅ |
| R-07 | Component | Basic | `riskScore = 85`, `newDsi = 0.15` | Risk Score and DSI rows hidden | ✅ |
| R-08 | Component | Advanced | `riskScore = 85`, `newDsi = 0.15` | Risk Score "85/100" and DSI row visible | ✅ |
| R-09 | Component | Basic | `maxLoanAmount = 190 000` | Formatted value contains "R" prefix + digits | ✅ |

---

## 12. Expense Breakdown Dialog
**File:** `expense-breakdown-dialog.test.tsx` · **Component:** `ExpenseBreakdownDialog`

| ID | Type | Mode | Input Conditions | Expected UI / Behaviour | Status |
|---|---|---|---|---|---|
| E-01 | Component | Basic | Dialog open | All 7 line items rendered (rent + 6 categories) | ✅ |
| E-02 | Component | Advanced | Dialog open | Rent / bond hidden; other categories visible | ✅ |
| E-03 | Component | Basic | Type R 4 000 rent + R 2 500 food | Total updates live to R 6 500 | ✅ |
| E-04 | Component | Basic | Income R 25 000; type R 100 food only | NCA warning "your total is below this" shown | ✅ |
| E-05 | Component | Basic | `grossMonthlyIncome = 0` | NCA guideline line absent | ✅ |
| E-06 | Component | Basic | Type values; click "Apply total" | `onApply(6500)` called; dialog closes | ✅ |
| E-07 | Component | Basic | `currentValue = 10 000`, breakdown = 0 | Mismatch banner with "currently shows R 10 000" | ✅ |
| E-08 | Component | Basic | `currentValue = 2 500`; type R 2 500 food | Mismatch banner disappears once totals align | ✅ |
| E-09 | Component | Basic | `currentValue = 7 500`; click "Load into Other" | Other field = 7 500; total = R 7 500 | ✅ |
| E-10 | Component | Basic | Type values; click "Cancel" | `onApply` never called | ✅ |

---

## 13. Loan Simulator Form
**File:** `loan-simulator-form.test.tsx` · **Component:** `LoanSimulatorForm`

| ID | Type | Mode | Input Conditions | Expected UI / Behaviour | Status |
|---|---|---|---|---|---|
| F-01 | Component | Basic | Form renders | All 5 basic fields present | ✅ |
| F-02 | Component | Basic | Default state | Advanced sections (Household, Dwelling, etc.) absent | ✅ |
| F-03 | Component | Advanced | Click "Advanced" toggle | 5 extra sections + rent field revealed | ✅ |
| F-04 | Component | Both | Toggle from basic → advanced | Expense field label changes to "Other Monthly Expenses" | ✅ |
| F-05 | Integration | Both | Submit → switch mode | `onResults(null, "advanced")` called — results cleared | ✅ |
| F-06 | Component | Basic | Submit empty form | Validation errors shown; `onResults` not called | ✅ |
| F-07 | Integration | Basic | Fill all fields; 36-month term | `onResults` called with correct values; `isAffordable = true` | ✅ |
| F-08 | Integration | Advanced | Fill all fields including rent | Result has `riskScore`, `newDsi`, `livingExpenses = 11 000` | ✅ |

---

## 14. Button Component
**File:** `button.test.tsx` · **Component:** `Button`

| ID | Type | Props | Expected UI | Status |
|---|---|---|---|---|
| B-01 | Component | Default variant | Button rendered with label | ✅ |
| B-02 | Component | `variant="ghost"` | Button rendered | ✅ |
| B-03 | Component | `size="lg"` | Has class `h-10` | ✅ |
| B-04 | Component | `size="icon"` | Has class `size-8` | ✅ |
| B-05 | Component | `onClick` handler | Handler fires once on click | ✅ |
| B-06 | Component | `disabled` prop | Button is disabled | ✅ |
| B-07 | Component | Custom children | Children text rendered | ✅ |

---

## 15. Theme Toggle Component
**File:** `theme-toggle.test.tsx` · **Component:** `ThemeToggle`

| ID | Type | Initial Theme | Action | Expected Outcome | Status |
|---|---|---|---|---|---|
| TH-01 | Component | Light | Render | Button with `aria-label="Toggle theme"` present | ✅ |
| TH-02 | Component | Light | Render | Button has `cursor-pointer` class | ✅ |
| TH-03 | Component | Light | Click | `<html>` receives `dark` class | ✅ |
| TH-04 | Component | Dark | Click | `<html>` loses `dark` class | ✅ |
| TH-05 | Component | Light | Click | `localStorage["theme"]` set to `"dark"` | ✅ |

---

## 16. Navigation Bar Component
**File:** `nav-bar.test.tsx` · **Component:** `NavBar`

| ID | Type | Initial Theme | Action | Expected Outcome | Status |
|---|---|---|---|---|---|
| N-01 | Component | Light | Render | Burger button with `aria-label="Toggle menu"` present | ✅ |
| N-02 | Component | Light | Render | More than one `<a>` nav link present | ✅ |
| N-03 | Component | Light | Click burger | `aria-expanded = "true"` on burger button | ✅ |
| N-04 | Component | Light | Click burger twice | `aria-expanded = "false"` on burger button | ✅ |
| N-05 | Component | Light vs Dark | Render both | Light logo `src` ≠ Dark logo `src` | ✅ |

---

## 17. Page Theme Template
**File:** `page-theme.test.tsx` · **Component:** `PageTheme`

| ID | Type | Props | Expected UI | Status |
|---|---|---|---|---|
| PT-01 | Component | `children` element | Children rendered in DOM | ✅ |
| PT-02 | Component | Default | Wrapper has `bg-linear-to-br from-capitec-blue` classes | ✅ |
| PT-03 | Component | Default | Exactly 2 elements with `blur-3xl` class | ✅ |
| PT-04 | Component | Default | At least one element with an `opacity-*` class | ✅ |
| PT-05 | Component | `className="my-custom-class"` | Element with that class present | ✅ |
| PT-06 | Component | Default | Wrapper has `min-h-[calc(100vh-56px)]` | ✅ |

---

## 18. Contact Form Page
**File:** `contact-form.test.tsx` · **Component:** `ContactPage`  
**Note:** `sendContactMessage` is mocked to resolve immediately (avoids 2-second real delay).

| ID | Type | Input Conditions | Action | Expected UI / Behaviour | Status |
|---|---|---|---|---|---|
| CF-01 | Component | Render | — | `#name`, `#email`, `#message` fields all present | ✅ |
| CF-02 | Component | Empty form | Submit | "Message sent!" absent — no submission | ✅ |
| CF-03 | Integration | Valid: name, email, message | Submit | "Message sent!" shown | ✅ |
| CF-04 | Integration | Valid fields | Submit | "We'll get back to you within 24 hours" shown | ✅ |
| CF-05 | Integration | Submitted state | Click "Send another message" | All three fields reset to empty | ✅ |
| CF-06 | Component | Render | — | All 4 contact detail cards visible | ✅ |

---

## Summary by Category

| Category | Tests | Type Breakdown | Files |
|---|---|---|---|
| DTI Tier Boundaries | 8 | 8 Unit | `loan-tiers-limits.test.ts` |
| Risk Tier Labels | 4 | 4 Unit | `loan-tiers-limits.test.ts` |
| Interest Rates per Tier | 4 | 4 Unit | `loan-tiers-limits.test.ts` |
| Score-Based Tier Boundaries | 8 | 8 Unit | `loan-tiers-limits.test.ts` |
| Max Loan — Basic Mode | 5 | 5 Unit | `loan-tiers-limits.test.ts` |
| Max Loan — Advanced Mode | 4 | 4 Unit | `loan-tiers-limits.test.ts` |
| Affordability Flag | 2 | 2 Unit | `loan-tiers-limits.test.ts` |
| Tier + Rate Integration | 4 | 4 Integration | `loan-tiers-limits.test.ts` |
| Core Calculator Functions | 31 | 31 Unit | `loan-calculator.test.ts` |
| PDF Report Generation | 5 | 5 Unit | `download-results.test.ts` |
| Results Panel UI | 9 | 9 Component | `results-panel.test.tsx` |
| Expense Breakdown Dialog | 10 | 10 Component | `expense-breakdown-dialog.test.tsx` |
| Loan Simulator Form | 8 | 5 Component · 3 Integration | `loan-simulator-form.test.tsx` |
| Button | 7 | 7 Component | `button.test.tsx` |
| Theme Toggle | 5 | 5 Component | `theme-toggle.test.tsx` |
| Navigation Bar | 5 | 5 Component | `nav-bar.test.tsx` |
| Page Theme | 6 | 6 Component | `page-theme.test.tsx` |
| Contact Form | 6 | 4 Component · 2 Integration | `contact-form.test.tsx` |
| **Total** | **125** | **91 Unit · 27 Component · 7 Integration** | **11 files** |
