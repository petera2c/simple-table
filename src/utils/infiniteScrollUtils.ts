import TableRow from "../types/TableRow";
import { CustomTheme } from "../types/CustomTheme";
import { rowIdToString } from "./rowUtils";
import { Accessor } from "../types/HeaderObject";

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
  const baseHeight =
    totalRowCount * (rowHeight + customTheme.rowSeparatorWidth) - customTheme.rowSeparatorWidth;

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
}) => {
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
    const renderedStartIndex = Math.max(
      0,
      Math.floor(renderedStartOffset / rowHeightWithSeparator)
    );
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

  const partiallyVisibleStartIndex = findRowAtScrollPosition(
    partiallyVisibleStartOffset,
    heightMap
  );
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
  const baseHeight =
    position * (rowHeight + customTheme.rowSeparatorWidth) - customTheme.rowSeparatorWidth;

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

// Helper function to check if a row is a parent (has children)
const isParentRow = (row: TableRow, allTableRows: TableRow[]): boolean => {
  const rowIndex = row.position;
  const nextRow = allTableRows[rowIndex + 1];

  // A row is a parent if the next row has this row in its parentIndices
  return nextRow?.parentIndices?.includes(rowIndex) ?? false;
};

// const copyObject = (obj: Record<string, any>) => {
//   const newObj = {} as Record<string, any>;
//   for (const key in obj) {
//     if (key === "row") {
//       newObj.row = {
//         id: obj.row.id,
//         organization: obj.row.organization,
//         employees: obj.row.employees,
//       };
//     } else {
//       newObj[key] = obj[key];
//     }
//   }
//   return newObj;
// };

export const getStickyParents = (
  allTableRows: TableRow[],
  renderedRows: TableRow[],
  fullyVisibleRows: TableRow[],
  partiallyVisibleRows: TableRow[],
  rowGrouping: Accessor[]
) => {
  const result = findStickyParents({
    allTableRows,
    renderedRows,
    fullyVisibleRows,
    partiallyVisibleRows,
    partiallyVisibleRowIndex: 0,
    recursionDepth: 0,
    stickyParents: [],
    rowGrouping,
  });
  return result;
};

const findStickyParents = ({
  allTableRows,
  renderedRows,
  fullyVisibleRows,
  partiallyVisibleRows,
  partiallyVisibleRowIndex,
  recursionDepth,
  stickyParents,
  rowGrouping,
}: {
  allTableRows: TableRow[];
  renderedRows: TableRow[];
  fullyVisibleRows: TableRow[];
  partiallyVisibleRows: TableRow[];
  partiallyVisibleRowIndex: number;
  recursionDepth: number;
  stickyParents: TableRow[];
  rowGrouping: Accessor[];
}): { stickyParents: TableRow[]; regularRows: TableRow[] } => {
  // Start with the first partially visible row (more responsive for sticky parent detection)
  let firstVisibleRow = partiallyVisibleRows[partiallyVisibleRowIndex];

  // Guard: no more rows or recursion limit reached
  if (!firstVisibleRow || recursionDepth > 10) {
    return {
      stickyParents,
      regularRows: renderedRows,
    };
  }

  let addedStickParentTotal = 0;

  if (firstVisibleRow.parentIndices && firstVisibleRow.parentIndices.length > 0) {
    // Collect parent rows that are not fully visible
    for (const parentIndex of firstVisibleRow.parentIndices) {
      const parentRow = allTableRows[parentIndex];
      if (parentRow) {
        const isParentFullyVisible = fullyVisibleRows.some(
          (row) => row.position === parentRow.position
        );

        // Optimization: stop adding sticky parents if few siblings remain
        if (firstVisibleRow.rowIndexPath && firstVisibleRow.rowIndexPath.length > 0) {
          const parentRowPosition =
            firstVisibleRow.parentIndices[firstVisibleRow.parentIndices.length - 1];
          const currentParentRow = allTableRows[parentRowPosition];
          const childrenValue = currentParentRow.row[rowGrouping[currentParentRow.depth]];
          const parentChildren = Array.isArray(childrenValue) ? childrenValue : [];
          const totalSiblingsCount = parentChildren.length;

          const remainingSiblingsCount =
            totalSiblingsCount -
            firstVisibleRow.rowIndexPath[firstVisibleRow.rowIndexPath.length - 1];

          // Don't show more sticky parents than remaining siblings (the parents container is absolutely positioned and takes up space and the user can't even see the rows from this parent if there are few left)
          if (remainingSiblingsCount <= stickyParents.length) {
            break;
          }
        }

        if (
          !isParentFullyVisible &&
          !stickyParents.some((row) => rowIdToString(row.rowId) === rowIdToString(parentRow.rowId))
        ) {
          stickyParents.push(parentRow);
          addedStickParentTotal++;
        }
      }
    }

    // Sticky parents take up space, so adjust which row is actually first visible
    if (stickyParents.length > 0) {
      // If firstVisibleRow is itself a parent, it's also being pushed out
      if (isParentRow(firstVisibleRow, allTableRows)) {
        stickyParents.push(firstVisibleRow);
        addedStickParentTotal++;
      }

      // Skip ahead by sticky parent count to find actual first visible row
      partiallyVisibleRowIndex += addedStickParentTotal;
      const recalculatedFirstVisibleRow = partiallyVisibleRows[partiallyVisibleRowIndex];

      if (recalculatedFirstVisibleRow) {
        firstVisibleRow = recalculatedFirstVisibleRow;
      }
    }
  } else if (isParentRow(firstVisibleRow, allTableRows)) {
    // No parent indices but is a parent itself (top-level parent)
    stickyParents.push(firstVisibleRow);
    partiallyVisibleRowIndex++;
    return findStickyParents({
      allTableRows,
      renderedRows,
      fullyVisibleRows,
      partiallyVisibleRows,
      partiallyVisibleRowIndex,
      recursionDepth: recursionDepth + 1,
      stickyParents,
      rowGrouping,
    });
  }

  // Recurse if the (possibly recalculated) first visible row is itself a parent
  if (isParentRow(firstVisibleRow, allTableRows)) {
    return findStickyParents({
      allTableRows,
      renderedRows,
      fullyVisibleRows,
      partiallyVisibleRows,
      partiallyVisibleRowIndex,
      recursionDepth: recursionDepth + 1,
      stickyParents,
      rowGrouping,
    });
  } else {
    return {
      stickyParents,
      regularRows: renderedRows,
    };
  }
};
