import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Both workspace packages are aliased directly to their TypeScript source.
 * This means Vite processes the source files natively — no separate build
 * step is needed. Any save in packages/react/src or packages/core/src
 * triggers instant HMR in the playground with no rebuild lag.
 *
 * Vite also handles CSS imports from core source natively, so styles are
 * injected automatically without needing a separate CSS import.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "simple-table-react": path.resolve(__dirname, "../react/src/index.ts"),
      "simple-table-core": path.resolve(__dirname, "../core/src/index.ts"),
    },
  },
});
