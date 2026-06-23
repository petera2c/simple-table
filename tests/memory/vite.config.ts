import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serve the harness against the package *source* (not built dist) so the suite
// exercises exactly what ships and needs no prior build step. Mirrors the alias
// used by the React adapter's vitest config (packages/react/vitest.config.ts).
export default defineConfig({
  root: resolve(__dirname, "harness"),
  plugins: [react()],
  resolve: {
    alias: {
      "simple-table-core": resolve(__dirname, "../../packages/core/src/index.ts"),
      "@simple-table/react": resolve(__dirname, "../../packages/react/src/index.ts"),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
  },
});
