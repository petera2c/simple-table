import { resolve } from "path";
import { defineConfig } from "vitest/config";

// Test the adapter against the core *source* (not the built dist) so tests run
// without a prior build step. Mirrors the path alias in tsconfig.json.
export default defineConfig({
  resolve: {
    alias: {
      "simple-table-core": resolve(__dirname, "../core/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "src/__tests__/**/*.{test,spec}.{ts,tsx}",
      "../core/src/__tests__/autoExpandResizePinned.test.ts",
      "../core/src/__tests__/columnOwnership.test.ts",
      "../core/src/__tests__/headerCellReuse.test.ts",
      "../core/src/__tests__/columnEditorLabelReuse.test.ts",
      "../core/src/__tests__/livePropDom.test.ts",
      "../core/src/__tests__/tableEmptyStateRenderer.test.ts",
      "../core/src/__tests__/columnPropReuse.test.ts",
      "../core/src/__tests__/parkAndStagger.test.ts",
      "../core/src/__tests__/rowFlattenPatch.test.ts",
      "../core/src/__tests__/rowGroupToggleReuse.test.ts",
      "../core/src/__tests__/rowGroupCustomCellReuse.test.ts",
      "../core/src/__tests__/rowGroupEditSelectScroll.test.ts",
    ],
    // The vanilla core imports a CSS bundle on load. We assert on DOM classes,
    // not computed colors, so CSS processing is unnecessary here.
    css: false,
    setupFiles: ["./vitest.setup.ts"],
  },
});
