import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  // Vitest runs in Node and would otherwise pick Svelte's server/`default`
  // export where `mount` is unavailable — force the browser client entry.
  resolve: {
    conditions: ["browser"],
    alias: {
      "simple-table-core": resolve(__dirname, "../core/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: ["./vitest.setup.ts"],
  },
});
