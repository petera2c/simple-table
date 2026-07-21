import TableRow from "../types/TableRow";
import { CustomTheme } from "../types/CustomTheme";
import { Accessor } from "../types/HeaderObject";
/**
 * Sorted array of [position, extraHeight] tuples for nested grids
 * Position: the row index in flattened array
 * ExtraHeight: additional height beyond standard rowHeight (in pixels)
 * Array is kept sorted by position for efficient binary search
 */
export type HeightOffsets = Array<[number, number]>;
/**
 * Precomputed cumulative height data structure for O(1) row position lookups
 * and O(log n) viewport calculations
 */
export interface CumulativeHeightMap {
    /** Array where index i contains the top pixel position of row i */
    rowTopPositions: number[];
    /** Total height of all rows combined */
    totalHeight: number;
}
/**
 * Build a cumulative height map for efficient viewport calculations
 * This precomputes the top position of every row, enabling:
 * - O(1) lookup of row top position
 * - O(log n) binary search to find rows in viewport
 *
 * @param rowCount - Total number of rows
 * @param rowHeight - Standard height of each row
 * @param heightOffsets - Array of [position, extraHeight] for variable-height rows
 * @param customTheme - Theme configuration for separator width
 * @returns Cumulative height map with row positions
 */
export declare const buildCumulativeHeightMap: (rowCount: number, rowHeight: number, heightOffsets: HeightOffsets | undefined, customTheme: CustomTheme) => CumulativeHeightMap;
/**
 * Find the row index at a given scroll position using binary search
 * Returns the index of the row that contains or is closest to the scroll position
 *
 * @param scrollTop - The scroll position in pixels
 * @param heightMap - Precomputed cumulative height map
 * @returns Row index at the scroll position
 */
export declare const findRowAtScrollPosition: (scrollTop: number, heightMap: CumulativeHeightMap) => number;
/**
 * Calculate cumulative extra height from nested grids above a given position
 * Uses binary search for O(log n) performance
 * @param position - The row position to calculate height for
 * @param heightOffsets - Sorted array of [position, extraHeight] tuples
 * @returns Total extra height from all nested grids above this position
 */
export declare const getCumulativeExtraHeight: (position: number, heightOffsets?: HeightOffsets) => number;
export declare const getTotalRowCount: (tableRows: TableRow[]) => number;
/**
 * Calculate the total height of all rows including nested grids with extra heights
 * @param totalRowCount - Total number of rows
 * @param rowHeight - Standard height of each row
 * @param heightOffsets - Array of [position, extraHeight] tuples for rows with non-standard heights
 * @param customTheme - Custom theme configuration for separator width
 * @returns Total height in pixels
 */
export declare const calculateTotalHeight: (totalRowCount: number, rowHeight: number, heightOffsets: HeightOffsets | undefined, customTheme: CustomTheme) => number;
/**
 * Viewport range calculation result containing start/end indices and the actual rows
 */
export interface ViewportRange {
    startIndex: number;
    endIndex: number;
    rows: TableRow[];
}
/**
 * Complete viewport calculations with multiple strategies
 * Provides three different ways to calculate visible rows for different use cases
 */
export interface ViewportCalculations {
    /** Rows to render in the DOM (includes overscan buffer for smooth scrolling) */
    rendered: ViewportRange;
    /** Rows that are completely visible within the viewport boundaries */
    fullyVisible: ViewportRange;
    /** Rows that are at least partially visible in the viewport */
    partiallyVisible: ViewportRange;
}
/**
 * Calculate all viewport ranges for virtual scrolling with variable-height row support
 * Returns three different viewport calculations:
 * - rendered: What should be in the DOM (includes overscan buffer)
 * - fullyVisible: Rows completely visible (useful for scroll-to-view logic)
 * - partiallyVisible: Rows at least partially visible (useful for scroll boundaries)
 *
 * This function now supports variable-height rows by using a cumulative height map
 * for O(log n) viewport calculations instead of assuming fixed row heights.
 */
export declare const getViewportCalculations: ({ bufferRowCount, contentHeight, rowHeight, scrollTop, tableRows, scrollDirection, heightMap, }: {
    bufferRowCount: number;
    contentHeight: number;
    rowHeight: number;
    scrollTop: number;
    tableRows: TableRow[];
    scrollDirection?: "up" | "down" | "none";
    heightMap?: CumulativeHeightMap;
}) => {
    rendered: {
        startIndex: number;
        endIndex: number;
        rows: TableRow[];
    };
    fullyVisible: {
        startIndex: number;
        endIndex: number;
        rows: TableRow[];
    };
    partiallyVisible: {
        startIndex: number;
        endIndex: number;
        rows: TableRow[];
    };
};
/**
 * Get visible rows with pixel-based overscan
 * Uses the viewport calculations internally and returns the rendered rows
 * Maintains backward compatibility with existing code
 */
export declare const getVisibleRows: ({ bufferRowCount, contentHeight, rowHeight, scrollTop, tableRows, scrollDirection, heightMap, }: {
    bufferRowCount: number;
    contentHeight: number;
    rowHeight: number;
    scrollTop: number;
    tableRows: TableRow[];
    scrollDirection?: "up" | "down" | "none";
    heightMap?: CumulativeHeightMap;
}) => TableRow[];
export declare const calculateSeparatorTopPosition: ({ position, rowHeight, heightOffsets, customTheme, }: {
    position: number;
    rowHeight: number;
    heightOffsets?: HeightOffsets;
    customTheme: CustomTheme;
}) => number;
export declare const calculateRowTopPosition: ({ position, rowHeight, heightOffsets, customTheme, }: {
    position: number;
    rowHeight: number;
    heightOffsets?: HeightOffsets;
    customTheme: CustomTheme;
}) => number;
export declare const getStickyParents: (allTableRows: TableRow[], renderedRows: TableRow[], fullyVisibleRows: TableRow[], partiallyVisibleRows: TableRow[], rowGrouping: Accessor[]) => {
    stickyParents: TableRow[];
    regularRows: TableRow[];
};
