import { test, expect } from "@playwright/test";
import { openCdp } from "./cdp";
import { attachDiagnostics, burst, gotoHarness, mount, sample, unmount } from "./driver";
import { bytesToMB } from "./stats";

/**
 * React custom-renderer (PortalBridge) churn scenario. With a React component
 * cell renderer on the price column, each `updateData` re-renders the cell:
 * the old portal container is detached and a new one registered. PortalBridge
 * prunes detached containers via a MutationObserver, so retained detached nodes
 * and heap should stay bounded under sustained updates.
 *
 * This asserts the bridge's pruning keeps up; a regression in the prune path or
 * the monotonic `nextId` accounting would surface as growth here.
 */

const TOTAL_UPDATES = 15_000;
const HEAP_BUDGET_MB = 12;
const DETACHED_DELTA_BUDGET = 150;

test("React custom cell renderer keeps portals bounded under updates", async ({
  page,
}, testInfo) => {
  const cdp = await openCdp(page);
  await gotoHarness(page);

  await mount(page, { target: "react", rows: 2000, height: 400, customRenderer: true });
  await burst(page, 1500);

  const baseline = await sample(cdp);

  await burst(page, TOTAL_UPDATES);

  const after = await sample(cdp);
  const heapDeltaMB = bytesToMB(after.usedHeapBytes - baseline.usedHeapBytes);
  const detachedDelta = after.detachedElements - baseline.detachedElements;

  if (heapDeltaMB > HEAP_BUDGET_MB || detachedDelta > DETACHED_DELTA_BUDGET) {
    await attachDiagnostics(cdp, testInfo, "portals", baseline, after);
  }

  expect(detachedDelta, "retained detached nodes after portal churn").toBeLessThanOrEqual(
    DETACHED_DELTA_BUDGET,
  );
  expect(heapDeltaMB, "heap growth (MB) after portal churn").toBeLessThanOrEqual(HEAP_BUDGET_MB);

  await unmount(page);
});
