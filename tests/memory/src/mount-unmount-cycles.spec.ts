import { test, expect } from "@playwright/test";
import { openCdp, type MemorySample } from "./cdp";
import {
  attachDiagnostics,
  burst,
  gotoHarness,
  mount,
  sample,
  scrollSweep,
  unmount,
} from "./driver";
import { bytesToMB, regressionSlope } from "./stats";

/**
 * Teardown scenario: repeatedly mount a React table, drive updates + a scroll
 * sweep, then unmount (which triggers the adapter cleanup -> instance.destroy()).
 * After each cycle we force GC and measure. A healthy teardown returns to the
 * baseline every cycle, so the per-cycle detached-node and heap series should be
 * flat (slope ~0).
 *
 * EXPECTED TO FAIL against current source: destroy() does not clear the
 * instance `cellRegistry`, and the module-level `rowCellsMap` retains detached
 * cell elements across instances, so detached nodes accumulate cycle over cycle.
 */

const CYCLES = 6;
const ROWS = 1200;
const UPDATES_PER_CYCLE = 1500;
const DETACHED_SLOPE_BUDGET = 25; // retained detached nodes added per cycle (healthy teardown ~= 0)
const HEAP_SLOPE_BUDGET_MB = 1.5; // MB added per cycle

test("repeated React mount/update/unmount returns to baseline", async ({ page }, testInfo) => {
  const cdp = await openCdp(page);
  await gotoHarness(page);

  const detachedSeries: number[] = [];
  const heapSeries: number[] = [];
  let firstSample: MemorySample | null = null;
  let lastSample: MemorySample | null = null;

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    await mount(page, { target: "react", rows: ROWS, height: 400 });
    await burst(page, UPDATES_PER_CYCLE);
    await scrollSweep(page, { steps: 4, updatesPerStep: 150 });
    await unmount(page);

    const measurement = await sample(cdp);
    detachedSeries.push(measurement.detachedElements);
    heapSeries.push(measurement.usedHeapBytes);
    if (cycle === 0) firstSample = measurement;
    lastSample = measurement;
  }

  const detachedSlope = regressionSlope(detachedSeries);
  const heapSlopeMB = bytesToMB(regressionSlope(heapSeries));

  if (
    firstSample &&
    lastSample &&
    (detachedSlope > DETACHED_SLOPE_BUDGET || heapSlopeMB > HEAP_SLOPE_BUDGET_MB)
  ) {
    await attachDiagnostics(cdp, testInfo, "mount-unmount", firstSample, lastSample);
  }

  expect(
    detachedSlope,
    `detached DOM nodes added per mount/unmount cycle (series: ${detachedSeries.join(", ")})`,
  ).toBeLessThanOrEqual(DETACHED_SLOPE_BUDGET);

  expect(heapSlopeMB, "heap (MB) added per mount/unmount cycle").toBeLessThanOrEqual(
    HEAP_SLOPE_BUDGET_MB,
  );
});
