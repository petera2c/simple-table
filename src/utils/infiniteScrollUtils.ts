import TableRow from "../types/TableRow";
import { CustomTheme } from "../types/CustomTheme";

const SEPARATOR_HEIGHT = 1;

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
export const buildCumulativeHeightMap = (
  rowCount: number,
  rowHeight: number,
  heightOffsets: HeightOffsets | undefined,
  customTheme: CustomTheme
): CumulativeHeightMap => {
  const rowHeightWithSeparator = rowHeight + customTheme.rowSeparatorWidth;
  const rowTopPositions: number[] = new Array(rowCount);
  
  // Create a map for quick lookup of extra heights
  const extraHeightMap = new Map<number, number>();
  if (heightOffsets) {
    heightOffsets.forEach(([position, extraHeight]) => {
      extraHeightMap.set(position, extraHeight);
    });
  }
  
  let cumulativeHeight = 0;
  
  for (let i = 0; i < rowCount; i++) {
    rowTopPositions[i] = cumulativeHeight;
    
    // Add standard row height + separator
    cumulativeHeight += rowHeightWithSeparator;
    
    // Add any extra height for this specific row (e.g., nested grid)
    const extraHeight = extraHeightMap.get(i);
    if (extraHeight !== undefined) {
      cumulativeHeight += extraHeight;
    }
  }
  
  return {
    rowTopPositions,
    totalHeight: cumulativeHeight - customTheme.rowSeparatorWidth, // Remove last separator
  };
};

/**
 * Find the row index at a given scroll position using binary search
 * Returns the index of the row that contains or is closest to the scroll position
 * 
 * @param scrollTop - The scroll position in pixels
 * @param heightMap - Precomputed cumulative height map
 * @returns Row index at the scroll position
 */
export const findRowAtScrollPosition = (
  scrollTop: number,
  heightMap: CumulativeHeightMap
): number => {
  const { rowTopPositions } = heightMap;
  
  if (rowTopPositions.length === 0) return 0;
  if (scrollTop <= 0) return 0;
  if (scrollTop >= heightMap.totalHeight) return rowTopPositions.length - 1;
  
  // Binary search to find the row at this scroll position
  let left = 0;
  let right = rowTopPositions.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    
    if (rowTopPositions[mid] <= scrollTop) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  
  return left;
};

/**
 * Calculate cumulative extra height from nested grids above a given position
 * Uses binary search for O(log n) performance
 * @param position - The row position to calculate height for
 * @param heightOffsets - Sorted array of [position, extraHeight] tuples
 * @returns Total extra height from all nested grids above this position
 */
export const getCumulativeExtraHeight = (
  position: number,
  heightOffsets?: HeightOffsets
): number => {
  if (!heightOffsets || heightOffsets.length === 0) {
    return 0;
  }

  let extraHeight = 0;
  
  // Binary search to find the insertion point
  // All items before this point have position < target position
  let left = 0;
  let right = heightOffsets.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (heightOffsets[mid][0] < position) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  // Sum all extra heights before this position
  for (let i = 0; i < left; i++) {
    extraHeight += heightOffsets[i][1];
  }
  
  return extraHeight;
};

// Calculate total row count - now just the array length
export const getTotalRowCount = (tableRows: TableRow[]): number => {
  return tableRows.length;
};

/**
 * Calculate the total height of all rows including nested grids with extra heights
 * @param totalRowCount - Total number of rows
 * @param rowHeight - Standard height of each row
 * @param heightOffsets - Array of [position, extraHeight] tuples for rows with non-standard heights
 * @param customTheme - Custom theme configuration for separator width
 * @returns Total height in pixels
 */
export const calculateTotalHeight = (
  totalRowCount: number,
  rowHeight: number,
  heightOffsets: HeightOffsets | undefined,
  customTheme: CustomTheme
): number => {
  // Calculate base height assuming all rows are standard height
  const baseHeight = totalRowCount * (rowHeight + customTheme.rowSeparatorWidth) - customTheme.rowSeparatorWidth;
  
  // Add all the extra heights from nested grids
  const extraHeight = heightOffsets?.reduce((sum, [_, extra]) => sum + extra, 0) || 0;
  
  return baseHeight + extraHeight;
};

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
export const getViewportCalculations = ({
  bufferRowCount,
  contentHeight,
  rowHeight,
  scrollTop,
  tableRows,
  scrollDirection = "none",
  heightMap,
}: {
  bufferRowCount: number;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  tableRows: TableRow[];
  scrollDirection?: "up" | "down" | "none";
  heightMap?: CumulativeHeightMap;
}): ViewportCalculations => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;

  // If no height map provided, fall back to fixed-height calculation
  if (!heightMap) {
    // 1. RENDERED: Rows to render with overscan buffer
    const baseOverscanPixels = bufferRowCount * rowHeightWithSeparator;
    let topOverscanPixels = baseOverscanPixels;
    let bottomOverscanPixels = baseOverscanPixels;

    // Asymmetric overscan based on scroll direction
    if (scrollDirection === "down") {
      topOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1);
      bottomOverscanPixels = baseOverscanPixels * 0.9;
    } else if (scrollDirection === "up") {
      topOverscanPixels = baseOverscanPixels * 0.9;
      bottomOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1);
    }

    const renderedStartOffset = Math.max(0, scrollTop - topOverscanPixels);
    const renderedEndOffset = scrollTop + contentHeight + bottomOverscanPixels;
    const renderedStartIndex = Math.max(0, Math.floor(renderedStartOffset / rowHeightWithSeparator));
    const renderedEndIndex = Math.min(
      tableRows.length,
      Math.ceil(renderedEndOffset / rowHeightWithSeparator)
    );

    // 2. FULLY VISIBLE: Rows completely visible in viewport
    const fullyVisibleStartOffset = scrollTop;
    const fullyVisibleEndOffset = scrollTop + contentHeight;
    const fullyVisibleStartIndex = Math.max(
      0,
      Math.ceil(fullyVisibleStartOffset / rowHeightWithSeparator)
    );
    const fullyVisibleEndIndex = Math.min(
      tableRows.length,
      Math.floor(fullyVisibleEndOffset / rowHeightWithSeparator)
    );

    // 3. PARTIALLY VISIBLE: Rows at least partially visible
    const partiallyVisibleStartOffset = scrollTop;
    const partiallyVisibleEndOffset = scrollTop + contentHeight;
    const partiallyVisibleStartIndex = Math.max(
      0,
      Math.floor(partiallyVisibleStartOffset / rowHeightWithSeparator)
    );
    const partiallyVisibleEndIndex = Math.min(
      tableRows.length,
      Math.ceil(partiallyVisibleEndOffset / rowHeightWithSeparator)
    );

    return {
      rendered: {
        startIndex: renderedStartIndex,
        endIndex: renderedEndIndex,
        rows: tableRows.slice(renderedStartIndex, renderedEndIndex),
      },
      fullyVisible: {
        startIndex: fullyVisibleStartIndex,
        endIndex: fullyVisibleEndIndex,
        rows: tableRows.slice(fullyVisibleStartIndex, fullyVisibleEndIndex),
      },
      partiallyVisible: {
        startIndex: partiallyVisibleStartIndex,
        endIndex: partiallyVisibleEndIndex,
        rows: tableRows.slice(partiallyVisibleStartIndex, partiallyVisibleEndIndex),
      },
    };
  }

  // Variable-height calculation using cumulative height map
  const { rowTopPositions } = heightMap;
  
  // 1. RENDERED: Rows to render with overscan buffer
  const baseOverscanPixels = bufferRowCount * rowHeightWithSeparator;
  let topOverscanPixels = baseOverscanPixels;
  let bottomOverscanPixels = baseOverscanPixels;

  // Asymmetric overscan based on scroll direction
  if (scrollDirection === "down") {
    topOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1);
    bottomOverscanPixels = baseOverscanPixels * 0.9;
  } else if (scrollDirection === "up") {
    topOverscanPixels = baseOverscanPixels * 0.9;
    bottomOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1);
  }

  const renderedStartOffset = Math.max(0, scrollTop - topOverscanPixels);
  const renderedEndOffset = scrollTop + contentHeight + bottomOverscanPixels;
  
  // Use binary search to find start/end indices based on actual row positions
  const renderedStartIndex = findRowAtScrollPosition(renderedStartOffset, heightMap);
  let renderedEndIndex = findRowAtScrollPosition(renderedEndOffset, heightMap) + 1; // +1 to include the row
  renderedEndIndex = Math.min(tableRows.length, renderedEndIndex);

  // 2. FULLY VISIBLE: Rows completely visible in viewport
  const fullyVisibleStartOffset = scrollTop;
  const fullyVisibleEndOffset = scrollTop + contentHeight;
  
  // Find first row that starts at or after viewport top
  let fullyVisibleStartIndex = findRowAtScrollPosition(fullyVisibleStartOffset, heightMap);
  // If this row starts before viewport, move to next row
  if (rowTopPositions[fullyVisibleStartIndex] < fullyVisibleStartOffset) {
    fullyVisibleStartIndex = Math.min(fullyVisibleStartIndex + 1, tableRows.length);
  }
  
  // Find last row that ends before viewport bottom
  let fullyVisibleEndIndex = findRowAtScrollPosition(fullyVisibleEndOffset, heightMap);
  // The row at this position might extend past viewport, so we need to check
  fullyVisibleEndIndex = Math.min(tableRows.length, fullyVisibleEndIndex);

  // 3. PARTIALLY VISIBLE: Rows at least partially visible
  const partiallyVisibleStartOffset = scrollTop;
  const partiallyVisibleEndOffset = scrollTop + contentHeight;
  
  const partiallyVisibleStartIndex = findRowAtScrollPosition(partiallyVisibleStartOffset, heightMap);
  let partiallyVisibleEndIndex = findRowAtScrollPosition(partiallyVisibleEndOffset, heightMap) + 1;
  partiallyVisibleEndIndex = Math.min(tableRows.length, partiallyVisibleEndIndex);

  return {
    rendered: {
      startIndex: renderedStartIndex,
      endIndex: renderedEndIndex,
      rows: tableRows.slice(renderedStartIndex, renderedEndIndex),
    },
    fullyVisible: {
      startIndex: fullyVisibleStartIndex,
      endIndex: fullyVisibleEndIndex,
      rows: tableRows.slice(fullyVisibleStartIndex, fullyVisibleEndIndex),
    },
    partiallyVisible: {
      startIndex: partiallyVisibleStartIndex,
      endIndex: partiallyVisibleEndIndex,
      rows: tableRows.slice(partiallyVisibleStartIndex, partiallyVisibleEndIndex),
    },
  };
};

/**
 * Get visible rows with pixel-based overscan
 * Uses the viewport calculations internally and returns the rendered rows
 * Maintains backward compatibility with existing code
 */
export const getVisibleRows = ({
  bufferRowCount,
  contentHeight,
  rowHeight,
  scrollTop,
  tableRows,
  scrollDirection,
  heightMap,
}: {
  bufferRowCount: number;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  tableRows: TableRow[];
  scrollDirection?: "up" | "down" | "none";
  heightMap?: CumulativeHeightMap;
}): TableRow[] => {
  const calculations = getViewportCalculations({
    bufferRowCount,
    contentHeight,
    rowHeight,
    scrollTop,
    tableRows,
    scrollDirection,
    heightMap,
  });

  return calculations.rendered.rows;
};

export const calculateSeparatorTopPosition = ({
  position,
  rowHeight,
  heightOffsets,
  customTheme,
}: {
  position: number;
  rowHeight: number;
  heightOffsets?: HeightOffsets;
  customTheme: CustomTheme;
}) => {
  // Base calculation
  const baseHeight = position * (rowHeight + customTheme.rowSeparatorWidth) - customTheme.rowSeparatorWidth;
  
  // Add extra height from nested grids above this position
  const extraHeight = getCumulativeExtraHeight(position, heightOffsets);
  
  return baseHeight + extraHeight;
};

export const calculateRowTopPosition = ({
  position,
  rowHeight,
  heightOffsets,
  customTheme,
}: {
  position: number;
  rowHeight: number;
  heightOffsets?: HeightOffsets;
  customTheme: CustomTheme;
}) => {
  // Base calculation
  const baseHeight = position * (rowHeight + customTheme.rowSeparatorWidth);
  
  // Add extra height from nested grids above this position
  const extraHeight = getCumulativeExtraHeight(position, heightOffsets);
  
  return baseHeight + extraHeight;
};

/**
 * Result of separating sticky parents from regular rendered rows
 */
export interface StickyParentsResult {
  /** Parent rows that should be rendered as sticky at the top */
  stickyParents: TableRow[];
  /** Regular rows to render normally (with sticky parents removed if they were in the rendered range) */
  regularRows: TableRow[];
}

/**
 * Separate sticky parent rows from regular rendered rows for row grouping
 *
 * When scrolling through nested/grouped rows, parent rows that are scrolled out of view
 * should be "pinned" at the top to provide context. This function:
 * 1. Identifies which parent rows should be sticky (those not fully visible)
 * 2. Removes them from the regular rendered rows if present (to avoid duplication)
 * 3. Adds any sticky parents that are above the rendered range
 *
 * @param allTableRows - Complete flattened array of all table rows
 * @param renderedRows - Rows currently in the rendered range (includes overscan)
 * @param fullyVisibleStartIndex - Index of first fully visible row in viewport
 * @param renderedStartIndex - Index of first rendered row (includes overscan buffer)
 * @returns Object with stickyParents and regularRows arrays
 */
export const getStickyParents = (
  allTableRows: TableRow[],
  renderedRows: TableRow[],
  fullyVisibleStartIndex: number,
  renderedStartIndex: number
): StickyParentsResult => {
  // Get the first fully visible row to determine which parents should be sticky
  const firstFullyVisibleRow = allTableRows[fullyVisibleStartIndex];

  // If no row is visible or the row has no parents, return early
  if (!firstFullyVisibleRow?.parentIndices || firstFullyVisibleRow.parentIndices.length === 0) {
    return {
      stickyParents: [],
      regularRows: renderedRows,
    };
  }

  // Get indices of parents that should be sticky
  // A parent should be sticky if it's not fully visible (index < fullyVisibleStartIndex)
  const stickyParentIndicesSet = new Set(
    firstFullyVisibleRow.parentIndices.filter((parentIdx) => parentIdx < fullyVisibleStartIndex)
  );

  // If no parents need to be sticky, return early
  if (stickyParentIndicesSet.size === 0) {
    return {
      stickyParents: [],
      regularRows: renderedRows,
    };
  }

  // Separate rendered rows into sticky parents and regular rows
  const stickyParents: TableRow[] = [];
  const regularRows: TableRow[] = [];

  renderedRows.forEach((row, idx) => {
    const actualIndex = renderedStartIndex + idx;

    if (stickyParentIndicesSet.has(actualIndex)) {
      // This row is a sticky parent - add to sticky array
      stickyParents.push(row);
    } else {
      // This is a regular row - keep it in regular array
      regularRows.push(row);
    }
  });

  // Add any sticky parents that weren't in the rendered range (above overscan buffer)
  firstFullyVisibleRow.parentIndices.forEach((parentIdx) => {
    if (parentIdx < renderedStartIndex) {
      stickyParents.push(allTableRows[parentIdx]);
    }
  });

  // Sort sticky parents by depth (shallowest first) to maintain hierarchy order
  stickyParents.sort((a, b) => a.depth - b.depth);

  return { stickyParents, regularRows };
};
