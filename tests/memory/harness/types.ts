export type MountTarget = "core" | "react";

export interface MountOptions {
  target: MountTarget;
  /** Number of rows in the dataset. Defaults to 2000 (large enough to virtualize). */
  rows?: number;
  /** Viewport height in px. Defaults to 400 so only a slice of rows is rendered. */
  height?: number;
  /** Enable the per-update flash animation (exercises the flash setTimeout path). */
  cellUpdateFlash?: boolean;
  /** React only: attach a custom React component cell renderer to a column (exercises PortalBridge churn). */
  customRenderer?: boolean;
}

export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

/**
 * Imperative test surface exposed on `window.__leak` by the harness. Driven from
 * Playwright specs via `page.evaluate`. All async methods resolve once the table
 * has settled (microtask flush + a couple of animation frames) so measurements
 * taken afterwards are stable.
 */
export interface LeakHarness {
  mount(options: MountOptions): Promise<void>;
  unmount(): Promise<void>;
  /** Whether a target is currently mounted, and which one. */
  state(): { target: MountTarget | null; rows: number };
  /**
   * Run `totalUpdates` `updateData` calls distributed across currently visible
   * rows (the stock-quote workload). Returns the number of calls actually made.
   */
  burst(totalUpdates: number): Promise<number>;
  scrollBy(px: number): Promise<void>;
  scrollTo(px: number): Promise<void>;
  getScrollMetrics(): ScrollMetrics;
  visibleRowCount(): number;
  /**
   * White-box read of the vanilla engine's internal `cellRegistry` Map size.
   * Available for the `core` target only; returns -1 otherwise.
   */
  cellRegistrySize(): number;
  /** Toggle sort on an accessor (used by the sort/filter churn scenario). */
  toggleSort(accessor: string): Promise<void>;
  /** Apply or clear a quick filter (used by the sort/filter churn scenario). */
  setQuickFilter(text: string): void;
}

declare global {
  interface Window {
    __leak: LeakHarness;
  }
}
