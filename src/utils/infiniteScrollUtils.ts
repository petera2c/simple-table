import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import TableRow from "../types/TableRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count - now just the array length
export const getTotalRowCount = (tableRows: TableRow[]): number => {
  return tableRows.length;
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
 * Calculate all viewport ranges for virtual scrolling
 * Returns three different viewport calculations:
 * - rendered: What should be in the DOM (includes overscan buffer)
 * - fullyVisible: Rows completely visible (useful for scroll-to-view logic)
 * - partiallyVisible: Rows at least partially visible (useful for scroll boundaries)
 */
export const getViewportCalculations = ({
  bufferRowCount,
  contentHeight,
  rowHeight,
  scrollTop,
  tableRows,
  scrollDirection = "none",
}: {
  bufferRowCount: number;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  tableRows: TableRow[];
  scrollDirection?: "up" | "down" | "none";
}): ViewportCalculations => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;

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
}: {
  bufferRowCount: number;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  tableRows: TableRow[];
  scrollDirection?: "up" | "down" | "none";
}): TableRow[] => {
  const calculations = getViewportCalculations({
    bufferRowCount,
    contentHeight,
    rowHeight,
    scrollTop,
    tableRows,
    scrollDirection,
  });

  return calculations.rendered.rows;
};

export const calculateSeparatorTopPosition = ({
  position,
  rowHeight,
}: {
  position: number;
  rowHeight: number;
}) => {
  return position * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;
};

export const calculateRowTopPosition = ({
  position,
  rowHeight,
}: {
  position: number;
  rowHeight: number;
}) => {
  return position * (rowHeight + ROW_SEPARATOR_WIDTH);
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
