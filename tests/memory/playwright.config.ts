import { defineConfig, devices } from "@playwright/test";

const PORT = 5180;
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

/**
 * Memory-leak suite configuration.
 *
 * - Single worker, no parallelism: heap/GC measurements are process-global and
 *   would be polluted by concurrent pages.
 * - Generous per-test timeout: scenarios run thousands of updates plus repeated
 *   forced GC + heap snapshots.
 * - The Vite harness is started as the webServer; CDP (HeapProfiler /
 *   Runtime.queryObjects) is opened per-test from the page, no launch flags
 *   are required for deterministic GC via HeapProfiler.collectGarbage.
 */
export default defineConfig({
  testDir: "./src",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  retries: isCI ? 1 : 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: isCI ? [["github"], ["list"]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm exec vite",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
