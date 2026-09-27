# Coding Standards

> Conventions for the Loan Eligibility Simulator. All contributors should follow these to keep the codebase consistent.

---

## Language & Compilation

- All source files use **TypeScript** (`.ts` / `.tsx`). No plain `.js` files in `src/`.
- Target is **ES2023** with `moduleResolution: bundler` — use native ES module syntax (`import`/`export`), never `require`.
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports.
- `noUnusedLocals` and `noUnusedParameters` are enforced by the compiler. Remove unused symbols rather than suppressing the error.

---

## Project Structure — Atomic Design

The `src/` directory follows the **Atomic Design** methodology. Components are organised by complexity, each layer building on the one below it.

### Why Atomic Design (not domain-driven)

A domain-driven structure organises code by business domain first (e.g. `domains/loan/`, `domains/applicant/`), with atomic layers nested inside each domain. This works well for large applications with multiple distinct domains that each own their own data models, business logic, and UI.

This project is a **single-domain SPA** — the entire application concerns one domain (loan eligibility). Introducing domain folders around a single domain adds folder depth with no separation benefit. The layered atomic approach is the correct fit:

- Simpler navigation — one place for each type of component
- No artificial domain boundaries when there is only one domain
- Clear migration path: if a second domain is introduced (e.g. applicant profile, document upload), the structure can be promoted to `domains/loan/` and `domains/applicant/` at that point without rewriting component logic

**Rule:** Do not introduce `domains/` until the project has two or more distinct domains with separate data models and business logic.

```
src/
├── components/
│   ├── atoms/          — smallest indivisible UI units
│   ├── molecules/      — groups of atoms forming a single UI concept
│   ├── organisms/      — complex UI sections composed of molecules & atoms
│   └── templates/      — page-level layouts with no real data (slots only)
├── pages/              — assembled screens; plug real data into templates
├── hooks/              — shared custom hooks (useLoanCalculator, etc.)
├── utils/              — pure helper functions (formatCurrency, etc.)
└── types/              — shared TypeScript types and interfaces
```

### Layer definitions

| Layer | Responsibility | Examples |
|---|---|---|
| **Atoms** | Single-purpose, stateless UI primitives. Wraps or extends shadcn/ui. | `CurrencyInput`, `PercentageBadge`, `SectionLabel` |
| **Molecules** | Two or more atoms forming one self-contained UI unit. | `FormField` (label + input + error), `ResultRow` (label + value) |
| **Organisms** | A distinct section of the UI with its own internal logic. | `LoanForm`, `EligibilityResult`, `RepaymentBreakdown` |
| **Templates** | Layout shells — define structure and slot positions, no real data. | `FormPageTemplate`, `ResultPageTemplate` |
| **Pages** | Connect templates to real state and data. One file per route. | `HomePage`, `ResultPage` |

### Rules

- **Import direction is one-way downward.** Atoms must not import molecules or organisms. Molecules must not import organisms. Pages may import any layer.
- Each layer has a barrel `index.ts` — export components through it, import from the layer root (e.g. `from '@/components/atoms'`).
- Each component lives in its own folder with co-located types and any component-specific styles:
  ```
  atoms/
  └── CurrencyInput/
      ├── CurrencyInput.tsx
      ├── CurrencyInput.types.ts   ← only if props are complex
      └── index.ts                 ← re-exports CurrencyInput
  ```
- Promote a component to a higher layer only when it genuinely needs to compose lower-level pieces — do not over-categorise.

### File & naming conventions

| What | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `LoanForm.tsx` |
| Hooks | camelCase, `use` prefix | `useLoanCalculator.ts` |
| Utilities | camelCase `.ts` | `formatCurrency.ts` |
| Types / interfaces | PascalCase | `LoanApplication`, `FormFieldProps` |
| Folders | PascalCase for component folders, lowercase-hyphenated for everything else | `CurrencyInput/`, `hooks/` |

---

## Components

- Use **function components** exclusively — no class components.
- One component per file.
- Props are typed with an inline `interface` or `type` directly above the component:

```tsx
interface LoanFormProps {
  maxAmount: number
  onSubmit: (data: LoanData) => void
}
```

- Avoid default prop values via `defaultProps` — use destructuring defaults instead.
- Keep components focused: if a component needs more than ~150 lines, consider splitting it.

---

## State & Hooks

- Prefer `useState` and `useReducer` for local state; avoid global state until it is clearly needed.
- Extract repeated stateful logic into a custom hook in `src/hooks/`.
- Do not call hooks conditionally.

---

## Styling

- Use **Tailwind CSS** utility classes for layout and spacing.
- Use **shadcn/ui** components as the base for all interactive UI elements (buttons, inputs, dialogs, etc.).
- Do not mix global CSS rules with Tailwind on the same element.
- CSS variables defined in `index.css` are for design tokens only (colours, spacing scale, typography). Do not add component-specific rules there.

---

## Naming

- **Variables & functions:** camelCase (`loanAmount`, `calculateRepayment`)
- **Components & types:** PascalCase (`RepaymentSummary`, `LoanTerm`)
- **Constants:** UPPER_SNAKE_CASE for module-level values that never change (`MAX_LOAN_AMOUNT`)
- **Boolean variables:** use an `is` / `has` / `can` prefix (`isEligible`, `hasError`)

---

## Code Quality

- Run `pnpm lint` before committing (`biome check .`). All lint errors must be resolved — do not suppress rules without a comment explaining why.
- Run `pnpm build` to confirm the TypeScript compiler passes with zero errors before opening a PR.
- Write pure, side-effect-free utility functions where possible so they are easy to test.

---

## Comments

Write comments only when the **why** is non-obvious — a constraint, a known workaround, or a subtle invariant. Do not describe what the code does; well-named identifiers already do that.

---

## Imports

Order imports as follows (enforced by convention, not tooling):

1. External packages (`react`, `react-dom`, shadcn components)
2. Internal absolute aliases (if configured)
3. Relative imports (`./`, `../`)
4. Type-only imports (`import type …`)

Separate each group with a blank line.
