/** Quiet period after the last ResizeObserver tick before publishing a settled value. */
export const CONTAINER_RESIZE_SETTLE_MS = 150;

export interface SettledResizePublisher {
  /** Queue a value for publication after {@link CONTAINER_RESIZE_SETTLE_MS}. */
  notify: (value: number) => void;
  /** Read from DOM on the next animation frame, then queue for settled publication. */
  notifyFromObserver: (read: () => number) => void;
  /** Publish immediately, cancelling any pending settled notification. */
  publishImmediately: (value: number) => void;
  destroy: () => void;
}

/**
 * Coalesce a stream of resize measurements into a single publication once layout
 * stops changing (e.g. after a nav expand/collapse CSS transition ends).
 */
export const createSettledResizePublisher = (
  publish: (value: number) => void,
  settleMs: number = CONTAINER_RESIZE_SETTLE_MS,
): SettledResizePublisher => {
  let pending: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let rafId: number | null = null;

  const flush = () => {
    if (pending === null) return;
    const value = pending;
    pending = null;
    publish(value);
  };

  const schedule = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      flush();
    }, settleMs);
  };

  return {
    notify: (value: number) => {
      pending = value;
      schedule();
    },
    notifyFromObserver: (read: () => number) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        pending = read();
        schedule();
      });
    },
    publishImmediately: (value: number) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      pending = null;
      publish(value);
    },
    destroy: () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pending = null;
    },
  };
};

/** Optional perf hook used by the container-resize Storybook benchmark. */
export const recordContainerWidthStateUpdate = (): void => {
  const perf = (window as Window & { __containerResizePerf?: { containerWidthStateUpdates?: number } })
    .__containerResizePerf;
  if (perf) {
    perf.containerWidthStateUpdates = (perf.containerWidthStateUpdates ?? 0) + 1;
    window.dispatchEvent(new CustomEvent("st-container-width-update"));
  }
};
