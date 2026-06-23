import { test, expect } from "@playwright/test";
import { openCdp, type MemorySample } from "./cdp";
import {
  attachDiagnostics,
  burst,
  gotoHarness,
  mount,
  sample,
  setQuickFilter,
  toggleSort,
  unmount,
} from "./driver";
import { bytesToMB, regressionSlope } from "./stats";

/**
 * Sort/filter churn scenario. Repeatedly toggling sort and applying/clearing a
 * quick filter while updating cells forces full re-renders (the manager
 * subscribe -> render path) on top of the incremental updateData path. Caches
 * (RenderOrchestrator / SectionRenderer) and the cell registry are exercised
 * heavily. The per-round heap + detached series should be flat (slope ~0); a
 * cache or registry that fails to invalidate would trend upward.
 */

const ROUNDS = 20;
const ROWS = 3000;
const UPDATES_PER_ROUND = 2000;
const DETACHED_SLOPE_BUDGET = 8; // detached nodes added per round
const HEAP_SLOPE_BUDGET_MB = 1.5; // MB added per round

test("sort + filter churn during updates does not accumulate", async ({ page }, testInfo) => {
  const cdp = await openCdp(page);
  await gotoHarness(page);

  await mount(page, { target: "core", rows: ROWS, height: 400 });
  await burst(page, 1000);

  const detachedSeries: number[] = [];
  const heapSeries: number[] = [];
  let firstSample: MemorySample | null = null;
  let lastSample: MemorySample | null = null;

  for (let round = 0; round < ROUNDS; round++) {
    await burst(page, UPDATES_PER_ROUND);
    await toggleSort(page, round % 2 === 0 ? "price" : "volume");
    await setQuickFilter(page, round % 3 === 0 ? "A" : "");
    await burst(page, UPDATES_PER_ROUND);
    await setQuickFilter(page, "");

    const measurement = await sample(cdp);
    detachedSeries.push(measurement.detachedElements);
    heapSeries.push(measurement.usedHeapBytes);
    if (round === 0) firstSample = measurement;
    lastSample = measurement;
  }

  const detachedSlope = regressionSlope(detachedSeries);
  const heapSlopeMB = bytesToMB(regressionSlope(heapSeries));

  if (
    firstSample &&
    lastSample &&
    (detachedSlope > DETACHED_SLOPE_BUDGET || heapSlopeMB > HEAP_SLOPE_BUDGET_MB)
  ) {
    await attachDiagnostics(cdp, testInfo, "sort-filter", firstSample, lastSample);
  }

  expect(
    detachedSlope,
    `detached DOM nodes added per sort/filter round (series: ${detachedSeries.join(", ")})`,
  ).toBeLessThanOrEqual(DETACHED_SLOPE_BUDGET);
  expect(heapSlopeMB, "heap (MB) added per sort/filter round").toBeLessThanOrEqual(
    HEAP_SLOPE_BUDGET_MB,
  );

  await unmount(page);
});
