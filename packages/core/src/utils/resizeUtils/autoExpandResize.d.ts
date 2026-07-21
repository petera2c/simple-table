import type HeaderObject from "../../types/HeaderObject";
import type { Pinned } from "../../types/Pinned";
/**
 * Handle resize with autoExpandColumns enabled.
 *
 * Neighbors compensate a growing column only down to their shrink floor (their
 * natural width — declared, content-measured, or user-set). Once all
 * neighbors are at their floor, the main section keeps growing past the
 * container width and overflows into horizontal scroll instead of blocking
 * the drag. Pinned sections cannot scroll their own content, so their growth
 * stays capped by the neighbors' available surplus (plus the pinned-width
 * policy cap).
 */
export declare const handleResizeWithAutoExpand: ({ childrenToResize, collapsedHeaders, containerWidth, delta, headers, initialWidthsMap, isParentResize, resizedHeader, reverse, rootPinned, sectionHeaders, sectionWidth, sectionViewportWidth, shrinkFloors, startWidth, }: {
    childrenToResize?: HeaderObject[];
    collapsedHeaders?: Set<string>;
    containerWidth: number;
    delta: number;
    headers: HeaderObject[];
    initialWidthsMap: Map<string, number>;
    isParentResize?: boolean;
    resizedHeader: HeaderObject;
    reverse: boolean;
    rootPinned: Pinned | undefined;
    sectionHeaders: HeaderObject[];
    sectionWidth: number;
    /** Visible viewport width of the section (main: container minus pinned). 0 when unknown. */
    sectionViewportWidth?: number;
    /** Accessor -> natural width; the shrink floor for compensating neighbors. */
    shrinkFloors?: Map<string, number>;
    startWidth: number;
}) => void;
