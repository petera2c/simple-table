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
import { bytesToMB, tailDrift } from "./stats";

/**
 * Sort/filter churn scenario. Repeatedly toggling sort and applying/clearing a
 * quick filter while updating cells forces full re-renders (the manager
 * subscribe -> render path) on top of the incremental updateData path. Caches
 * (RenderOrchestrator / SectionRenderer) and the cell registry are exercised
 * heavily.
 *
 * We assert on the *steady-state* drift (averaged second vs first half of the
 * trailing rounds) rather than the whole-series slope: a healthy table reaches
 * a stable working set after a few rounds and then stays flat. A one-time ramp
 * that saturates (bounded accumulation) is acceptable here; only *sustained*
 * round-over-round growth in the tail indicates a churn-driven leak (e.g. a
 * cache/registry that never stops growing). Averaging both tail halves keeps
 * the check robust to single-sample GC/measurement noise.
 */

const ROUNDS = 20;
const ROWS = 3000;
const UPDATES_PER_ROUND = 2000;
/** Fraction of trailing rounds treated as steady state. */
const TAIL_FRACTION = 0.5;
const DETACHED_TAIL_DRIFT_BUDGET = 500; // detached nodes gained across the steady-state window
const HEAP_TAIL_DRIFT_BUDGET_MB = 4; // MB gained across the steady-state window

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

  const detachedTailDrift = tailDrift(detachedSeries, TAIL_FRACTION);
  const heapTailDriftMB = bytesToMB(tailDrift(heapSeries, TAIL_FRACTION));

  if (
    firstSample &&
    lastSample &&
    (detachedTailDrift > DETACHED_TAIL_DRIFT_BUDGET || heapTailDriftMB > HEAP_TAIL_DRIFT_BUDGET_MB)
  ) {
    await attachDiagnostics(cdp, testInfo, "sort-filter", firstSample, lastSample);
  }

  expect(
    detachedTailDrift,
    `steady-state detached DOM-node drift over sort/filter rounds (series: ${detachedSeries.join(", ")})`,
  ).toBeLessThanOrEqual(DETACHED_TAIL_DRIFT_BUDGET);
  expect(heapTailDriftMB, "steady-state heap (MB) drift over sort/filter rounds").toBeLessThanOrEqual(
    HEAP_TAIL_DRIFT_BUDGET_MB,
  );

  await unmount(page);
});
