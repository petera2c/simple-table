import { test, expect } from "@playwright/test";
import { openCdp } from "./cdp";
import {
  attachDiagnostics,
  cellRegistrySize,
  gotoHarness,
  mount,
  sample,
  scrollSweep,
  unmount,
  visibleRowCount,
} from "./driver";
import { bytesToMB } from "./stats";

/**
 * Virtualization eviction scenario. We sweep through a large dataset while
 * updating cells, then return to the top. Because cells that scroll out of the
 * viewport are removed from the DOM but their `cellRegistry` entries (closures
 * over the now-detached cell elements) are never deleted, both the registry and
 * the count of retained detached DOM nodes grow with the number of rows ever
 * rendered.
 *
 * EXPECTED TO FAIL against current source - the assertions encode the desired
 * bounded behavior. They should pass once cell removal also evicts the registry
 * entry (see bodyCellRenderer.ts cell-removal path + SimpleTableVanilla.destroy).
 */

const ROWS = 5000;
const COLUMNS = 9;
const SWEEP_STEPS = 40;
const UPDATES_PER_STEP = 300;

test(`scrolling a large list keeps cellRegistry + detached nodes bounded`, async ({
  page,
}, testInfo) => {
  const cdp = await openCdp(page);
  await gotoHarness(page);

  // Core target so we can read the internal cellRegistry size (white-box).
  await mount(page, { target: "core", rows: ROWS, height: 400 });

  const visibleCells = (await visibleRowCount(page)) * COLUMNS;
  const baseline = await sample(cdp);

  await scrollSweep(page, { steps: SWEEP_STEPS, updatesPerStep: UPDATES_PER_STEP });

  const after = await sample(cdp);
  const registryAfter = await cellRegistrySize(page);
  const detachedDelta = after.detachedElements - baseline.detachedElements;
  const heapDeltaMB = bytesToMB(after.usedHeapBytes - baseline.usedHeapBytes);

  // Bound: the registry should track roughly the visible window (plus a generous
  // reuse buffer), NOT every cell ever scrolled through (~ROWS * COLUMNS).
  const registryBound = visibleCells * 4;
  const detachedBound = visibleCells * 2;

  if (registryAfter > registryBound || detachedDelta > detachedBound) {
    await attachDiagnostics(cdp, testInfo, "scroll-core", baseline, after);
  }

  expect(
    registryAfter,
    `cellRegistry size after sweeping ${ROWS} rows (visible cells ~${visibleCells})`,
  ).toBeLessThanOrEqual(registryBound);

  expect(detachedDelta, "retained detached DOM nodes after scroll sweep").toBeLessThanOrEqual(
    detachedBound,
  );

  // Sanity: heap should not balloon either. Looser bound; the structural signals
  // above are the primary assertions.
  expect(heapDeltaMB, "heap growth (MB) after scroll sweep").toBeLessThanOrEqual(40);

  await unmount(page);
});
