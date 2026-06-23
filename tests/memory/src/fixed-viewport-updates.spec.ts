import { test, expect } from "@playwright/test";
import type { MountTarget } from "../harness/types";
import { openCdp } from "./cdp";
import {
  attachDiagnostics,
  burst,
  cellRegistrySize,
  gotoHarness,
  mount,
  sample,
  unmount,
  visibleRowCount,
} from "./driver";
import { bytesToMB } from "./stats";

/**
 * Baseline / happy-path scenario: high-frequency `updateData` on a *static*
 * viewport (no scrolling). Only the visible cells are ever registered and
 * patched in place, so heap and detached-node counts should stay flat. This
 * guards against regressions on the core stock-quote path and should pass today.
 */

const TOTAL_UPDATES = 25_000;
const HEAP_BUDGET_MB = 8;
const DETACHED_DELTA_BUDGET = 50;

const targets: MountTarget[] = ["core", "react"];

for (const target of targets) {
  test(`fixed viewport, ${TOTAL_UPDATES} updates stays flat (${target})`, async ({
    page,
  }, testInfo) => {
    const cdp = await openCdp(page);
    await gotoHarness(page);

    await mount(page, { target, rows: 2000, height: 400 });
    // Warm up so first-render allocations and caches are established before baseline.
    await burst(page, 2000);

    const baseline = await sample(cdp);
    const visibleCells = (await visibleRowCount(page)) * 9; // 9 columns in the dataset
    const registryAtBaseline = await cellRegistrySize(page);

    await burst(page, TOTAL_UPDATES);

    const after = await sample(cdp);
    const heapDeltaMB = bytesToMB(after.usedHeapBytes - baseline.usedHeapBytes);
    const detachedDelta = after.detachedElements - baseline.detachedElements;

    if (heapDeltaMB > HEAP_BUDGET_MB || detachedDelta > DETACHED_DELTA_BUDGET) {
      await attachDiagnostics(cdp, testInfo, `fixed-${target}`, baseline, after);
    }

    expect(detachedDelta, "retained detached DOM nodes after updates").toBeLessThanOrEqual(
      DETACHED_DELTA_BUDGET,
    );
    expect(heapDeltaMB, "heap growth (MB) after updates").toBeLessThanOrEqual(HEAP_BUDGET_MB);

    // White-box (core only): the registry must not grow when nothing scrolls.
    if (registryAtBaseline >= 0) {
      const registryAfter = await cellRegistrySize(page);
      expect(registryAfter, "cellRegistry size on a static viewport").toBeLessThanOrEqual(
        Math.max(registryAtBaseline, visibleCells) + 9,
      );
    }

    await unmount(page);
  });
}
