/* eslint-disable */
/**
 * Regression for blank rows after container resize + vertical scroll-back.
 *
 * After the container-resize coalesce work, TableBody defers updating
 * `columnViewport.width` until resize activity settles. The bug: when a
 * ResizeObserver tick arrived while a horizontal-scroll rAF was already
 * pending, the observer callback returned early and never called
 * `scheduleWidthSettle`. Width stayed permanently stale (often too narrow),
 * so rows recycled after scrolling back up rendered with a culled column
 * window — blank until another resize remounted them.
 */
import {
  createColumnViewportWidthScheduler,
  shouldScheduleColumnViewportWidthSettle,
} from "../src/utils/columnViewportWidth";

declare const describe: (name: string, fn: () => void) => void;
declare const test: (name: string, fn: () => void) => void;
declare const expect: (actual: unknown) => any;
declare const jest: {
  fn: <T extends (...args: any[]) => any>(impl?: T) => any;
  useFakeTimers: () => void;
  useRealTimers: () => void;
  advanceTimersByTime: (ms: number) => void;
};

describe("shouldScheduleColumnViewportWidthSettle", () => {
  test("still schedules settle when a horizontal-scroll rAF is pending (the blank-row regression)", () => {
    // Pre-fix TableBody did: if (hScrollRafRef.current !== null) return;
    // which is equivalent to shouldSchedule(... pending=true) === false.
    expect(shouldScheduleColumnViewportWidthSettle(true)).toBe(true);
  });

  test("schedules settle when no rAF is pending", () => {
    expect(shouldScheduleColumnViewportWidthSettle(false)).toBe(true);
  });
});

describe("createColumnViewportWidthScheduler", () => {
  test("arms settle even when the immediate resize pass is skipped", () => {
    jest.useFakeTimers();
    const measureSettledWidth = jest.fn();
    const scheduler = createColumnViewportWidthScheduler({
      measureSettledWidth,
      settleMs: 150,
    });

    scheduler.onResizeObserved(true); // h-scroll rAF pending

    expect(scheduler.hasPendingSettle()).toBe(true);
    expect(measureSettledWidth).not.toHaveBeenCalled();

    jest.advanceTimersByTime(150);

    expect(measureSettledWidth).toHaveBeenCalledTimes(1);
    expect(scheduler.hasPendingSettle()).toBe(false);

    scheduler.destroy();
    jest.useRealTimers();
  });

  test("coalesces rapid resize ticks into a single settled measure", () => {
    jest.useFakeTimers();
    const measureSettledWidth = jest.fn();
    const scheduler = createColumnViewportWidthScheduler({
      measureSettledWidth,
      settleMs: 150,
    });

    scheduler.onResizeObserved(false);
    jest.advanceTimersByTime(50);
    scheduler.onResizeObserved(false);
    jest.advanceTimersByTime(50);
    scheduler.onResizeObserved(true);
    jest.advanceTimersByTime(50);

    expect(measureSettledWidth).not.toHaveBeenCalled();
    jest.advanceTimersByTime(150);
    expect(measureSettledWidth).toHaveBeenCalledTimes(1);

    scheduler.destroy();
    jest.useRealTimers();
  });
});
