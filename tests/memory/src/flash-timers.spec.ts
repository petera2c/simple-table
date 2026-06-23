import { test, expect } from "@playwright/test";
import { openCdp } from "./cdp";
import { attachDiagnostics, burst, gotoHarness, mount, sample, unmount } from "./driver";
import { bytesToMB } from "./stats";

/**
 * Flash-animation timer scenario. With `cellUpdateFlash` enabled, every cell
 * update schedules an 800ms `setTimeout` that removes the flash class. Under a
 * rapid burst these timers (and the closures they retain over the cell element)
 * pile up transiently. This is expected to be a *transient* cost: once the burst
 * stops and the timers drain, heap and detached counts should settle back.
 *
 * The test asserts the settled state, so a regression that fails to cancel /
 * drain these timers (turning the transient cost into a sustained leak) would
 * trip the budget.
 */

const TOTAL_UPDATES = 20_000;
const TIMER_DRAIN_MS = 1500; // > the 800ms flash timeout
const HEAP_BUDGET_MB = 10;
const DETACHED_DELTA_BUDGET = 100;

test("cellUpdateFlash timers drain after a burst", async ({ page }, testInfo) => {
  const cdp = await openCdp(page);
  await gotoHarness(page);

  await mount(page, { target: "core", rows: 2000, height: 400, cellUpdateFlash: true });
  await burst(page, 1000);

  const baseline = await sample(cdp);

  await burst(page, TOTAL_UPDATES);
  // Let all pending 800ms flash timers fire and release their closures.
  await page.waitForTimeout(TIMER_DRAIN_MS);

  const after = await sample(cdp);
  const heapDeltaMB = bytesToMB(after.usedHeapBytes - baseline.usedHeapBytes);
  const detachedDelta = after.detachedElements - baseline.detachedElements;

  if (heapDeltaMB > HEAP_BUDGET_MB || detachedDelta > DETACHED_DELTA_BUDGET) {
    await attachDiagnostics(cdp, testInfo, "flash-timers", baseline, after);
  }

  expect(heapDeltaMB, "heap growth (MB) after flash timers drain").toBeLessThanOrEqual(
    HEAP_BUDGET_MB,
  );
  expect(detachedDelta, "retained detached nodes after flash timers drain").toBeLessThanOrEqual(
    DETACHED_DELTA_BUDGET,
  );

  await unmount(page);
});
