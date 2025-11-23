import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import TableRow from "../types/TableRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count - now just the array length
export const getTotalRowCount = (tableRows: TableRow[]): number => {
  return tableRows.length;
};

// Get visible rows with pixel-based overscan
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
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;

  // Convert row buffer to pixels (this is the base overscan)
  const baseOverscanPixels = bufferRowCount * rowHeightWithSeparator;

  // Asymmetric pixel-based overscan based on scroll direction
  // This preloads more content in the direction of motion for smoother scrolling
  let topOverscanPixels = baseOverscanPixels;
  let bottomOverscanPixels = baseOverscanPixels;

  if (scrollDirection === "down") {
    // Scrolling down: render more pixels below, fewer above
    topOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1); // 10% above
    bottomOverscanPixels = baseOverscanPixels * 0.9; // 90% below
  } else if (scrollDirection === "up") {
    // Scrolling up: render more pixels above, fewer below
    topOverscanPixels = baseOverscanPixels * 0.9; // 90% above
    bottomOverscanPixels = Math.max(rowHeightWithSeparator, baseOverscanPixels * 0.1); // 10% below
  }

  // Calculate visible range with pixel-based overscan
  const startOffset = Math.max(0, scrollTop - topOverscanPixels);
  const endOffset = scrollTop + contentHeight + bottomOverscanPixels;

  const startIndex = Math.max(0, Math.floor(startOffset / rowHeightWithSeparator));
  const endIndex = Math.min(tableRows.length, Math.ceil(endOffset / rowHeightWithSeparator));

  // Simple slice - all the complex logic is now in flattenRowsWithGrouping
  const inViewRows = tableRows.slice(startIndex, endIndex);

  return inViewRows;
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
