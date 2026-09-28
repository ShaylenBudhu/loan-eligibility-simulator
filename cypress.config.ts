import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/loan-eligibility-simulator",
    setupNodeEvents(_on, _config) {},
  },
});
