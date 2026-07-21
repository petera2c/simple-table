import HeaderObject, { Accessor } from "../types/HeaderObject";
/**
 * Find the parent header that contains the given child header
 * Optimized using flattenAllHeaders for better performance
 */
export declare const findParentHeader: (headers: HeaderObject[], childAccessor: Accessor) => HeaderObject | null;
/**
 * Check if a header should be hidden based on its parent's collapsed state
 */
export declare const shouldHideWhenParentCollapsed: (header: HeaderObject, headers: HeaderObject[], collapsedHeaders: Set<Accessor>) => boolean;
/**
 * Get all child headers of a parent header (recursively)
 * Uses flattenAllHeaders for consistency and better performance
 */
export declare const getAllChildHeaders: (header: HeaderObject) => HeaderObject[];
/**
 * Check if a header has collapsible children
 */
export declare const hasCollapsibleChildren: (header: HeaderObject) => boolean;
/**
 * Number of visible leaf (bottom-level) columns a header spans, for
 * `aria-colspan` on grouped/nested header cells. Leaf headers that are hidden
 * (`hide`) or suppressed by their parent's collapsed state are excluded so the
 * announced span matches the columns actually rendered. Leaf headers return 1.
 */
export declare const getHeaderColspan: (header: HeaderObject, rootHeaders: HeaderObject[], collapsedHeaders: Set<Accessor>) => number;
/**
 * Get all leaf (bottom-level) headers that should be visible when a parent is collapsed
 * Uses flattenHeaders for consistent leaf detection
 */
export declare const getVisibleLeafHeadersWhenCollapsed: (header: HeaderObject) => HeaderObject[];
