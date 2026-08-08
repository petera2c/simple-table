import { resolve } from "path";
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "simple-table-core": resolve(__dirname, "../core/src/index.ts"),
    },
    // Force the browser/client Solid builds — without this, vitest/node
    // resolves solid-js/web to the server entry and render() throws.
    conditions: ["browser", "development"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    // Include jest-dom in the list so vite-plugin-solid does not replace
    // setupFiles with only that import (which would drop ResizeObserver stubs).
    setupFiles: ["./vitest.setup.ts", "@testing-library/jest-dom/vitest"],
  },
});
