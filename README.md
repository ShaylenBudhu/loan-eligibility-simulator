# Loan Eligibility Simulator

A single-page application that helps users determine their loan eligibility based on income, expenses, and financial profile. Built with React 19, TypeScript, and TanStack Router.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Base UI |
| Forms | React Hook Form + Zod |
| Charts | TanStack Charts + D3 Scale |
| Animation | Motion (Framer Motion v11+) |
| PDF Export | jsPDF |
| Testing | Vitest (unit) + Cypress (E2E) |
| Linting | Biome |
| Package manager | pnpm |
| Deployment | Docker + Nginx |

---

## Prerequisites

Choose the path that matches how you want to run the app.

| Path | Requirements |
|---|---|
| Local dev | Node.js 22+, pnpm |
| Docker | Docker (no Node required) |

---

## Running locally

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the dev server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` with hot module replacement enabled.

### Other dev commands

```bash
pnpm build          # production build → dist/
pnpm preview        # serve the production build locally
pnpm lint           # run Biome linter + formatter check
```

---

## Running with Docker

> **Capitec machines:** Rancher Desktop is the standard Docker runtime. See the [Rancher Desktop](#rancher-desktop-capitec-machines) section below before running any Docker commands.

The project ships with a multi-stage `Dockerfile` that produces a minimal Nginx image — no Node.js in the final container.

### Build the image

```bash
docker build -t loan-eligibility .
```

### Run the container

```bash
docker run -p 8080:80 loan-eligibility
```

The app is now available at `http://localhost:8080`.

### What the Dockerfile does

```
Stage 1 — builder (node:22-alpine)
  pnpm install → pnpm build → /app/dist/

Stage 2 — runner (nginx:alpine)
  copies dist/ into Nginx's web root
  serves on port 80 with SPA fallback routing
```

The Nginx config routes all requests through `index.html` so that client-side routes (e.g. `/loan-simulator`, `/about`) work correctly after a hard refresh.

### Stopping the container

```bash
# find the container ID
docker ps

# stop it
docker stop <container-id>
```

### Removing the image

```bash
docker rmi loan-eligibility
```

---

## Rancher Desktop (Capitec machines)

Rancher Desktop is the standard Docker runtime replacement at Capitec. If `docker` is not installed on your machine, set this up first.

### 1. Install & configure

- Download from **Company Portal** or [rancherdesktop.io](https://rancherdesktop.io)
- During setup, select **dockerd (moby)** as the container runtime — not containerd
- Launch Rancher Desktop and wait for the status indicator to turn green

**Windows only:** if `docker` is not recognised after install, open Rancher Desktop → **Preferences → WSL Integration** and enable your Linux distribution.

### 2. Verify Docker is working

```bash
docker --version
docker compose version
```

Both commands should return version numbers. If they do, the standard Docker commands in the section above work as-is — no changes needed.

### Troubleshooting

| Problem | Fix |
|---|---|
| Network / socket errors | Rancher Desktop → **Diagnostics** tab |
| Volume path errors in Git Bash (Windows) | Run `export MSYS_NO_PATHCONV=1` before the Docker command |
| Slow or out-of-memory builds | Rancher Desktop → **Preferences → Virtual Machine** — allocate at least 4 vCPUs and 8 GB RAM |

---

## Testing

### Unit & integration tests (Vitest)

```bash
pnpm test             # run all tests once
pnpm test:watch       # watch mode
pnpm test:coverage    # with coverage report
pnpm test:ui          # Vitest browser UI
```

Tests live in `src/__tests__/` and cover components, business logic (loan calculator, tier limits), and utilities.

### End-to-end tests (Cypress)

Requires a running dev or preview server.

```bash
# start the app first
pnpm dev

# in a separate terminal
pnpm cy:open    # interactive Test Runner
pnpm cy:run     # headless (CI)
pnpm cy:e2e     # E2E suite only, headless
```

---

## Project structure

```
src/
  routes/          — file-based route definitions (TanStack Router)
  pages/           — page-level components
  components/      — shared UI components
  contexts/        — React context providers (theme)
  api/             — data fetching functions
  utils/           — pure helper functions and constants
  __tests__/       — Vitest unit & integration tests
  test/            — Vitest setup file
```

---

## Architecture decisions

See [docs/decisions.md](docs/decisions.md) for the full ADR log covering every technology choice made in this project and the reasoning behind each one.
