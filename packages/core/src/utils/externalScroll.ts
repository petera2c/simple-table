/**
 * Helpers for the "external scroll parent" virtualization mode.
 *
 * When a consumer supplies `scrollParent` and the table has neither `height`
 * nor `maxHeight`, the table grows to its natural height inside the parent
 * and we look at the parent's scroll position / viewport to drive
 * virtualization and `onLoadMore`.
 */

export type ScrollParentValue =
  | HTMLElement
  | "window"
  | (() => HTMLElement | null)
  | undefined
  | null;

export type ResolvedScrollParent = HTMLElement | Window | null;

export interface ExternalScrollMetrics {
  /** Scroll offset translated into the table's own coordinate space, clamped to [0, tableTotalHeight]. */
  relativeScrollTop: number;
  /** Height of the table portion that is actually visible inside the parent viewport, in pixels. */
  visibleViewportHeight: number;
  /** Distance in pixels from the current visible-bottom edge to the table's bottom edge. */
  distanceFromTableBottom: number;
  /** Full pixel height of the table root element. */
  tableTotalHeight: number;
  /** Width of the parent viewport, in pixels. */
  viewportWidth: number;
}

/**
 * Resolve a `scrollParent` config value to a usable element or window reference.
 * Returns `null` if the value cannot be resolved this tick (e.g. a ref that
 * has not yet been attached). Never throws.
 */
export const resolveScrollParent = (value: ScrollParentValue): ResolvedScrollParent => {
  if (value == null) return null;

  if (typeof value === "function") {
    try {
      const resolved = value();
      return resolved ?? null;
    } catch {
      return null;
    }
  }

  if (value === "window") {
    return typeof window !== "undefined" ? window : null;
  }

  if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
    return value;
  }

  // Fallback: anything truthy with addEventListener (defensive against DOM proxies in SSR/tests).
  if (typeof (value as { addEventListener?: unknown }).addEventListener === "function") {
    return value as HTMLElement;
  }

  return null;
};

/**
 * Returns true if external scroll mode should be active for the given props.
 * External mode is only enabled when no explicit height constraint is set;
 * `height` / `maxHeight` always win.
 */
export const isExternalScrollActive = (
  scrollParent: ScrollParentValue,
  height: string | number | undefined,
  maxHeight: string | number | undefined,
): boolean => {
  if (height !== undefined && height !== null && height !== "") return false;
  if (maxHeight !== undefined && maxHeight !== null && maxHeight !== "") return false;
  return resolveScrollParent(scrollParent) !== null;
};

interface ViewportRect {
  top: number;
  bottom: number;
  height: number;
  width: number;
}

const getViewportRectFromParent = (parent: ResolvedScrollParent): ViewportRect | null => {
  if (!parent) return null;

  if (typeof Window !== "undefined" && parent instanceof Window) {
    const height = parent.innerHeight;
    return {
      top: 0,
      bottom: height,
      height,
      width: parent.innerWidth,
    };
  }

  const el = parent as HTMLElement;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
    height: rect.height,
    width: rect.width,
  };
};

/**
 * Height of the browser window's own viewport. Used as an upper bound on how
 * much of the table can ever be visible at once: regardless of how tall the
 * scroll parent is, the user can only physically see one window's worth of it.
 * Returns `+Infinity` when `window` is unavailable (SSR / non-DOM test runs) so
 * the clamp becomes a no-op there.
 */
const getWindowViewportHeight = (): number =>
  typeof window !== "undefined" && window.innerHeight > 0
    ? window.innerHeight
    : Number.POSITIVE_INFINITY;

const getScrollTopFromParent = (parent: ResolvedScrollParent): number => {
  if (!parent) return 0;
  if (typeof Window !== "undefined" && parent instanceof Window) {
    return parent.scrollY || parent.pageYOffset || 0;
  }
  return (parent as HTMLElement).scrollTop;
};

/**
 * Compute scroll metrics translated into the table's coordinate space.
 *
 * The math: position the table's bounding rect within the parent's viewport rect,
 * then intersect with the visible band of the parent. The intersection's top edge
 * (relative to the table) is the effective `scrollTop` for virtualization, and the
 * intersection's height is the effective `clientHeight`.
 */
export const getExternalScrollMetrics = (
  parent: ResolvedScrollParent,
  tableRoot: HTMLElement | null,
): ExternalScrollMetrics | null => {
  if (!parent || !tableRoot) return null;

  const viewport = getViewportRectFromParent(parent);
  if (!viewport) return null;

  const tableRect = tableRoot.getBoundingClientRect();
  const tableTotalHeight = tableRect.height;

  if (tableTotalHeight <= 0) {
    return {
      relativeScrollTop: 0,
      visibleViewportHeight: 0,
      distanceFromTableBottom: Number.POSITIVE_INFINITY,
      tableTotalHeight: 0,
      viewportWidth: viewport.width,
    };
  }

  const intersectionTop = Math.max(viewport.top, tableRect.top);
  const intersectionBottom = Math.min(viewport.bottom, tableRect.bottom);
  // Clamp to the window's own viewport height. If the resolved scroll parent is
  // accidentally unbounded (e.g. it grew to the table's full content height
  // because nothing constrained it), the table∩parent intersection would be the
  // entire table — disabling virtualization and rendering every row at once.
  // The user can never see more than one window's worth, so cap the visible band
  // there. For a window parent (or any parent shorter than the window) this is a
  // no-op; it only kicks in to prevent a runaway all-rows render.
  const visibleViewportHeight = Math.min(
    Math.max(0, intersectionBottom - intersectionTop),
    getWindowViewportHeight(),
  );

  const rawRelativeScrollTop = viewport.top - tableRect.top;
  const relativeScrollTop = Math.max(
    0,
    Math.min(rawRelativeScrollTop, Math.max(0, tableTotalHeight - visibleViewportHeight)),
  );

  const distanceFromTableBottom = tableRect.bottom - viewport.bottom;

  return {
    relativeScrollTop,
    visibleViewportHeight,
    distanceFromTableBottom,
    tableTotalHeight,
    viewportWidth: viewport.width,
  };
};

/**
 * Returns the raw scroll-top of the parent (used for direction tracking only).
 */
export const getParentScrollTop = (parent: ResolvedScrollParent): number =>
  getScrollTopFromParent(parent);

/**
 * Height of the parent's own viewport (window.innerHeight, or the element's
 * border-box height), independent of where the table sits inside it.
 *
 * Used as a provisional virtualization viewport before the table has been laid
 * out: at that point the table∩viewport intersection is 0, which would disable
 * virtualization and render every row at once. Seeding with the parent viewport
 * keeps virtualization active on the first paint; a later precise recompute
 * refines it. Returns 0 when the parent can't be measured.
 */
export const getParentViewportHeight = (parent: ResolvedScrollParent): number => {
  const rect = getViewportRectFromParent(parent);
  if (!rect) return 0;
  // Same safety cap as getExternalScrollMetrics: never seed a viewport taller
  // than the window, so an unbounded parent can't make the first paint render
  // every row.
  return Math.min(rect.height, getWindowViewportHeight());
};
