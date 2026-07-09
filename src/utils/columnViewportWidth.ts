/**
 * Column-viewport width scheduling for TableBody.
 *
 * During animated container resizes we defer adopting a new measured width so
 * column windowing does not recompute every animation frame. A settled measure
 * must still always be scheduled — even when a ResizeObserver tick arrives
 * while a horizontal-scroll rAF is already pending.
 */

/** Quiet period after the last resize tick before publishing settled width. */
export const COLUMN_VIEWPORT_WIDTH_SETTLE_MS = 150;

/**
 * Whether a ResizeObserver tick should arm the settled-width timeout.
 *
 * Must be true even when a horizontal-scroll rAF is already pending. Returning
 * false here was the blank-row bug: width never updated after resize, so rows
 * recycled on vertical scroll-back rendered against a stale (too-narrow)
 * column window.
 */
export const shouldScheduleColumnViewportWidthSettle = (
  _hScrollRafPending: boolean,
): boolean => {
  // Intentionally ignore the pending-rAF flag — settle must always be armed.
  // Returning false when a horizontal-scroll rAF was pending left
  // columnViewport.width permanently stale after resize → blank rows on
  // vertical scroll-back until another resize remounted cells.
  return true;
};

export interface ColumnViewportWidthScheduler {
  onResizeObserved: (hScrollRafPending: boolean) => void;
  destroy: () => void;
  hasPendingSettle: () => boolean;
}

export const createColumnViewportWidthScheduler = ({
  measureSettledWidth,
  settleMs = COLUMN_VIEWPORT_WIDTH_SETTLE_MS,
}: {
  measureSettledWidth: () => void;
  settleMs?: number;
}): ColumnViewportWidthScheduler => {
  let settleTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const scheduleSettle = () => {
    if (settleTimeoutId !== null) {
      clearTimeout(settleTimeoutId);
    }
    settleTimeoutId = setTimeout(() => {
      settleTimeoutId = null;
      measureSettledWidth();
    }, settleMs);
  };

  return {
    onResizeObserved: (hScrollRafPending: boolean) => {
      if (shouldScheduleColumnViewportWidthSettle(hScrollRafPending)) {
        scheduleSettle();
      }
    },
    destroy: () => {
      if (settleTimeoutId !== null) {
        clearTimeout(settleTimeoutId);
        settleTimeoutId = null;
      }
    },
    hasPendingSettle: () => settleTimeoutId !== null,
  };
};
