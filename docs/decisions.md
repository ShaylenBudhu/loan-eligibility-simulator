# Project Architecture Decision Record (ADR)

> This document records the key technology and tooling decisions made for this assignment project, along with the reasoning behind each choice.

---

## ADR-001: Application Type — Single Page Application (SPA)

**Decision:** Build as a SPA rather than a server-rendered app.

**Reasoning:**
- No requirement for SEO or server-side rendering
- Simpler deployment — output is just static files (HTML, CSS, JS)
- Faster development iteration for an assignment scope

**Alternatives considered:**
- Next.js (SSR/SSG) — overkill without a SEO or data-fetching requirement
- Remix — better suited for full-stack form-heavy apps

---

## ADR-002: Framework — React

**Decision:** Use React as the UI framework.

**Reasoning:**
- Assignment explicitly allows React templates
- Large ecosystem, strong community support
- Most widely used framework — widely understood by assessors

---

## ADR-003: Bundler / Project Scaffold — Vite

**Decision:** Use Vite as the build tool and dev server.

**What a build tool does:**
Browsers cannot run TypeScript, JSX, or ES module imports directly. A build tool handles three jobs:
1. **Transform** — converts TS/JSX to plain JavaScript
2. **Bundle** — combines many source files into fewer output files
3. **Optimise** — minifies code and removes unused exports (tree-shaking)

It also provides a **dev server** with hot reload during development.

**Bundler research — three options considered:**

### Webpack (2012)
The original industry standard, still widely used but no longer the first choice for new projects.

| Strength | Weakness |
|---|---|
| Mature, battle-tested | Slow cold starts — processes entire codebase upfront |
| Huge plugin ecosystem | Complex configuration |
| Still actively maintained (v5) | Written in JavaScript — single-threaded, memory hungry |

Webpack is not obsolete — large enterprises and legacy codebases still rely on it. It's simply no longer the right default for a new project started today.

### Vite (2020) ✅ Selected
Created by Evan You (Vue.js author). Rethought the dev server from scratch.

- **Development:** serves files as native ES modules — no bundling, only transforms what the browser requests. Starts in milliseconds regardless of project size.
- **Production:** uses Rollup to produce an optimised bundle
- Minimal config, excellent React/TypeScript support
- Mature ecosystem with broad community adoption

### Rsbuild (2023)
Created by ByteDance, built on Rspack — a Rust-based reimplementation of Webpack.

- Very fast due to Rust's multi-threading capabilities
- Near drop-in compatible with Webpack config — best suited for **migrating existing Webpack projects**
- Newer, smaller ecosystem compared to Vite
- Not the right fit for a greenfield project

**Bundler evolution timeline:**
```
2012  Webpack      — became the industry standard
2016  CRA          — wrapped Webpack; officially deprecated 2023
2020  Vite         — rethought dev speed; now the new standard
2023  Rsbuild      — Rust-powered, targets Webpack migration use cases
```

**Why Vite was chosen:**
- Best fit for a new SPA with no legacy constraints
- Fastest developer experience of the three
- Most tutorials, templates, and community resources available
- Create React App (the previous default) is officially deprecated

**Bootstrap command:**
```bash
pnpm create vite my-app --template react-ts
```

---

## ADR-004: Package Manager — pnpm

**Decision:** Use pnpm as the package manager.

**What a package manager does:**
When building with React, shadcn, Tailwind etc. you rely on third-party code (packages). A package manager:
- Downloads packages from the npm registry (npmjs.com)
- Tracks which versions your project uses (`package.json`)
- Locks versions so builds are reproducible (`pnpm-lock.yaml`)
- Manages nested dependencies (packages that depend on other packages)

**Package manager research — four options considered:**

### npm (2010)
The original, ships automatically with Node.js.

- Pre-installed — no extra setup needed
- Slowest of the four
- Copies packages per project — high disk usage across multiple projects
- Initially selected, then switched to pnpm (see migration note below)

### Yarn (2016)
Created by Facebook to fix npm's early speed and reliability problems.

- Introduced the lockfile concept, which npm later adopted
- npm has largely caught up in speed, reducing Yarn's advantage for new projects
- Yarn v2+ (Berry) is a significant rewrite — more opinionated

### Bun (2023)
Written in Zig (a systems language like Rust). Not just a package manager — also a runtime, bundler, and test runner.

- Dramatically faster installs
- Still maturing — occasional compatibility issues
- Runtime replacement adds risk for a production-grade project

### pnpm (2017) ✅ Selected
Stands for "performant npm". Uses a **global content-addressable store** — downloads each package version once and hard-links it into projects rather than copying.

```
npm/Yarn:                    pnpm:
─────────────────────        ─────────────────────
project-a/node_modules/      ~/.pnpm-store/
  react/  ← copy             └── react@18.x  ← one copy

project-b/node_modules/      project-a/node_modules/
  react/  ← copy               react  → (hard link)

project-c/node_modules/      project-b/node_modules/
  react/  ← copy               react  → (hard link)
```

**Speed comparison (rough):**
```
Bun      ██░░░░░░░░  ~0.5s
pnpm     ████░░░░░░  ~3s
Yarn     ███████░░░  ~6s
npm      ████████░░  ~8s
```

**Why pnpm was chosen:**
- Faster installs than npm — noticeably better developer experience
- Saves disk space across multiple projects — better long-term as more projects are created
- Strict dependency resolution — only allows importing packages explicitly listed in `package.json`
- Low migration overhead — mostly a drop-in replacement for npm
- `package.json` format unchanged — no source code changes needed

**Migration from npm:**
```bash
rm package-lock.json
rm -rf node_modules
npm install -g pnpm
pnpm install
```

**Common commands:**
```bash
pnpm install          # install all dependencies
pnpm add react        # add a new package
pnpm dev              # start dev server
pnpm build            # production build
```

---

## ADR-005: Language — TypeScript

**Decision:** Use TypeScript over plain JavaScript.

**Reasoning:**
- Catches type errors at compile time, not runtime
- Improves code readability and self-documentation
- Expected in production-grade projects
- Better IDE support (autocomplete, refactoring)

---

## ADR-006: Linter & Formatter — Biome

**Decision:** Use Biome as the combined linter and formatter.

**What a linter does:**
Checks your code for errors, bad patterns, and style issues before you run it — catches problems at write time rather than runtime.

**What a formatter does:**
Enforces consistent code style automatically — indentation, quotes, semicolons, line length. Without one, every developer writes slightly differently.

**Linter/formatter research — three options considered:**

### ESLint (2013)
The long-standing industry standard linter for JavaScript/TypeScript.

- Ships automatically with Vite's React template
- Massive plugin ecosystem (React, TypeScript, accessibility rules)
- Written in JavaScript — slow on large codebases
- Requires a separate formatter (Prettier) — two tools, two configs

### Oxlint (2023)
Rust-based linter, 50–100x faster than ESLint.

- Designed to run **alongside** ESLint, not replace it
- Rule coverage still incomplete — not a standalone solution yet
- Best used as a fast first-pass in large monorepos

### Biome (2023) ✅ Selected
Rust-based tool that combines **linting + formatting** in one.

- Replaces both ESLint and Prettier with a single tool and single config
- Very fast due to Rust
- 97% compatible with Prettier's formatting output
- Growing rule set — covers React and TypeScript well
- Simpler setup than maintaining two separate tools

**Tool comparison:**

| | ESLint + Prettier | Oxlint | Biome |
|---|---|---|---|
| Role | Lint + format (2 tools) | Lint only | Lint + format (1 tool) |
| Speed | Slow | Very fast | Very fast |
| Rule coverage | Exhaustive | Partial | Good, growing |
| Config | Two configs | Simple | One config |
| Maturity | 10+ years | ~2 years | ~2 years |

**Why Biome was chosen:**
- Replaces two tools (ESLint + Prettier) with one — less config, less friction
- Production-grade projects benefit from consistent formatting enforced by tooling
- Fast feedback loop during development
- Demonstrates awareness of modern tooling beyond the default Vite setup

**Setup:**
```bash
pnpm add --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

---

## ADR-007: UI Component Library — shadcn/ui

**Decision:** Use shadcn/ui for UI components.

**Reasoning:**
- Components are copied into the project — full ownership and customisability
- Built on Radix UI primitives (accessible by default)
- Theming via CSS variables makes dark mode straightforward
- Pairs with Tailwind CSS which is configured automatically on init
- Production-quality look with minimal effort

**Key distinction:** shadcn is not a traditional npm package — it scaffolds component source code directly into `components/ui/`. You own and can modify each component.

**Setup commands:**
```bash
npx shadcn@latest init          # run inside an existing Vite project
npx shadcn@latest add button    # add components individually as needed
```

---

## ADR-008: Styling — Tailwind CSS

**Decision:** Use Tailwind CSS (configured automatically by shadcn init).

**Reasoning:**
- Utility-first approach speeds up styling
- No context switching between CSS files and component files
- Pairs naturally with shadcn/ui

---

## ADR-009: Deployment — TBD

**Decision:** Not yet finalised. Options evaluated:

| Option | Status | Notes |
|---|---|---|
| Vercel | Candidate | Best DX, free tier, instant Git deploys |
| Netlify | Candidate | Very similar to Vercel |
| Cloudflare Pages | Candidate | Most generous free tier, fastest CDN |
| GitHub Pages | Rejected (for now) | Org requires verified domain — blocked |
| Azure Static Web Apps | Candidate | Good if Azure infrastructure is available |

**Next step:** Confirm which platform is accessible and appropriate for assignment submission.

---

## Decision Log Summary

| # | Decision | Choice |
|---|---|---|
| 001 | App type | SPA |
| 002 | Framework | React |
| 003 | Bundler | Vite |
| 004 | Package manager | pnpm |
| 005 | Language | TypeScript |
| 006 | Linter & formatter | Biome |
| 007 | Component library | shadcn/ui |
| 008 | Styling | Tailwind CSS |
| 009 | Deployment | TBD |
