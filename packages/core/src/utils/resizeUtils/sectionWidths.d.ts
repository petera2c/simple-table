import type HeaderObject from "../../types/HeaderObject";
/**
 * Width of the *visible* portion of the main (non-pinned) section: the container
 * width minus the pinned section widths.
 *
 * This is the viewport used for column virtualization (getVisibleBodyCells /
 * getVisibleCells) — NOT `mainWidth` from {@link recalculateAllSectionWidths},
 * which is the full *content* width (sum of all main column widths). Passing the
 * content width here makes every column count as "in viewport", disabling column
 * virtualization (all columns render). See the column-virtualization regression
 * tests.
 *
 * Returns `undefined` when the container has not been measured yet
 * (`containerWidth` 0) so callers fall back to a live `clientWidth` read instead
 * of virtualizing against a 0px viewport.
 */
export declare const getMainSectionViewportWidth: ({ containerWidth, leftWidth, rightWidth, }: {
    containerWidth: number;
    leftWidth: number;
    rightWidth: number;
}) => number | undefined;
/**
 * Recalculate widths for all sections (left, right, main)
 * Returns both constrained widths (for display) and raw content widths (for scrolling)
 */
export declare const recalculateAllSectionWidths: ({ headers, containerWidth, collapsedHeaders, }: {
    headers: HeaderObject[];
    containerWidth?: number;
    collapsedHeaders?: Set<string>;
}) => {
    leftWidth: number;
    rightWidth: number;
    mainWidth: number;
    leftContentWidth: number;
    rightContentWidth: number;
};
