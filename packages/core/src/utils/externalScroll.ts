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
  const visibleViewportHeight = Math.max(0, intersectionBottom - intersectionTop);

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
