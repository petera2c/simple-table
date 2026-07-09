import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
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
    setupFiles: ["./vitest.setup.ts"],
  },
});
