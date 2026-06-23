import type { Page, TestInfo } from "@playwright/test";
import type { MountOptions, ScrollMetrics } from "../harness/types";
import { sample, takeHeapSnapshotCounts, type MemorySample } from "./cdp";
import type { CDPSession } from "@playwright/test";
import { bytesToMB } from "./stats";

/**
 * Thin, typed wrappers around the in-page `window.__leak` harness. Keeping the
 * `page.evaluate` plumbing here lets the specs read as scenario scripts.
 */

export async function gotoHarness(page: Page): Promise<void> {
  // Surface in-page failures (uncaught errors, renderer crashes, console
  // errors) in the test output; these otherwise manifest only as opaque
  // "execution context destroyed" errors on the next page.evaluate.
  page.on("pageerror", (err) => console.error(`[page error] ${err.message}`));
  page.on("crash", () => console.error("[page crash] renderer process crashed"));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error(`[console.error] ${msg.text()}`);
  });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__leak !== "undefined");
}

export function mount(page: Page, options: MountOptions): Promise<void> {
  return page.evaluate((opts) => window.__leak.mount(opts), options);
}

export function unmount(page: Page): Promise<void> {
  return page.evaluate(() => window.__leak.unmount());
}

export function burst(page: Page, totalUpdates: number): Promise<number> {
  return page.evaluate((n) => window.__leak.burst(n), totalUpdates);
}

export function scrollBy(page: Page, px: number): Promise<void> {
  return page.evaluate((p) => window.__leak.scrollBy(p), px);
}

export function scrollTo(page: Page, px: number): Promise<void> {
  return page.evaluate((p) => window.__leak.scrollTo(p), px);
}

export function getScrollMetrics(page: Page): Promise<ScrollMetrics> {
  return page.evaluate(() => window.__leak.getScrollMetrics());
}

export function visibleRowCount(page: Page): Promise<number> {
  return page.evaluate(() => window.__leak.visibleRowCount());
}

export function cellRegistrySize(page: Page): Promise<number> {
  return page.evaluate(() => window.__leak.cellRegistrySize());
}

export function toggleSort(page: Page, accessor: string): Promise<void> {
  return page.evaluate((a) => window.__leak.toggleSort(a), accessor);
}

export function setQuickFilter(page: Page, text: string): Promise<void> {
  return page.evaluate((t) => window.__leak.setQuickFilter(t), text);
}

/**
 * Scroll through the whole virtualized list and back, optionally running an
 * update burst at each step. Exercises virtualization cell eviction.
 */
export async function scrollSweep(
  page: Page,
  opts: { steps: number; updatesPerStep?: number },
): Promise<void> {
  const { scrollHeight, clientHeight } = await getScrollMetrics(page);
  const maxScroll = Math.max(0, scrollHeight - clientHeight);
  const step = opts.steps > 0 ? maxScroll / opts.steps : maxScroll;

  for (let i = 1; i <= opts.steps; i++) {
    await scrollTo(page, Math.min(maxScroll, step * i));
    if (opts.updatesPerStep) await burst(page, opts.updatesPerStep);
  }
  // Return to the top so subsequent measurements share a comparable viewport.
  await scrollTo(page, 0);
}

/**
 * Attach a memory sample (and a heap-snapshot detached-node count) to the test
 * report. Call on assertion failure to make leaks diagnosable from CI artifacts.
 */
export async function attachDiagnostics(
  cdp: CDPSession,
  testInfo: TestInfo,
  label: string,
  baseline: MemorySample,
  after: MemorySample,
): Promise<void> {
  const snapshotCounts = await takeHeapSnapshotCounts(cdp).catch(() => null);
  const report = {
    label,
    baseline: { heapMB: bytesToMB(baseline.usedHeapBytes), detached: baseline.detachedElements },
    after: { heapMB: bytesToMB(after.usedHeapBytes), detached: after.detachedElements },
    deltaHeapMB: bytesToMB(after.usedHeapBytes - baseline.usedHeapBytes),
    deltaDetached: after.detachedElements - baseline.detachedElements,
    heapSnapshot: snapshotCounts,
  };
  await testInfo.attach(`memory-${label}.json`, {
    body: JSON.stringify(report, null, 2),
    contentType: "application/json",
  });
}

export { sample };
export type { MemorySample };
