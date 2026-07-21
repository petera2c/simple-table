/**
 * Helpers for the "external scroll parent" virtualization mode.
 *
 * When a consumer supplies `scrollParent` and the table has neither `height`
 * nor `maxHeight`, the table grows to its natural height inside the parent
 * and we look at the parent's scroll position / viewport to drive
 * virtualization and `onLoadMore`.
 */
export type ScrollParentValue = HTMLElement | "window" | (() => HTMLElement | null) | undefined | null;
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
export declare const resolveScrollParent: (value: ScrollParentValue) => ResolvedScrollParent;
/**
 * Returns true if external scroll mode should be active for the given props.
 * External mode is only enabled when no explicit height constraint is set;
 * `height` / `maxHeight` always win.
 */
export declare const isExternalScrollActive: (scrollParent: ScrollParentValue, height: string | number | undefined, maxHeight: string | number | undefined) => boolean;
/**
 * Compute scroll metrics translated into the table's coordinate space.
 *
 * The math: position the table's bounding rect within the parent's viewport rect,
 * then intersect with the visible band of the parent. The intersection's top edge
 * (relative to the table) is the effective `scrollTop` for virtualization, and the
 * intersection's height is the effective `clientHeight`.
 */
export declare const getExternalScrollMetrics: (parent: ResolvedScrollParent, tableRoot: HTMLElement | null) => ExternalScrollMetrics | null;
/**
 * Returns the raw scroll-top of the parent (used for direction tracking only).
 */
export declare const getParentScrollTop: (parent: ResolvedScrollParent) => number;
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
export declare const getParentViewportHeight: (parent: ResolvedScrollParent) => number;
