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
  tableRows,
}: {
  position: number;
  rowHeight: number;
  tableRows?: TableRow[];
}) => {
  // If we have tableRows, calculate cumulative height accounting for nested grids
  if (tableRows) {
    let cumulativeHeight = 0;
    for (let i = 0; i < position && i < tableRows.length; i++) {
      const row = tableRows[i];
      // Use nested grid height if present, otherwise use standard row height
      const currentRowHeight = row.nestedGrid?.calculatedHeight || rowHeight;
      cumulativeHeight += currentRowHeight + ROW_SEPARATOR_WIDTH;
    }
    return cumulativeHeight - ROW_SEPARATOR_WIDTH;
  }
  
  // Fallback to simple calculation if tableRows not provided
  return position * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;
};

export const calculateRowTopPosition = ({
  position,
  rowHeight,
  tableRows,
}: {
  position: number;
  rowHeight: number;
  tableRows?: TableRow[];
}) => {
  // If we have tableRows, calculate cumulative height accounting for nested grids
  if (tableRows) {
    let cumulativeHeight = 0;
    for (let i = 0; i < position && i < tableRows.length; i++) {
      const row = tableRows[i];
      // Use nested grid height if present, otherwise use standard row height
      const currentRowHeight = row.nestedGrid?.calculatedHeight || rowHeight;
      cumulativeHeight += currentRowHeight + ROW_SEPARATOR_WIDTH;
    }
    return cumulativeHeight;
  }
  
  // Fallback to simple calculation if tableRows not provided
  return position * (rowHeight + ROW_SEPARATOR_WIDTH);
};
