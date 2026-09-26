import { defineConfig } from "cypress";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {},
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react(), tailwindcss()],
        resolve: {
          alias: {
            "@": new URL("src", import.meta.url).pathname,
          },
        },
      },
    },
  },
});
