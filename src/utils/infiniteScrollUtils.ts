import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import TableRow from "../types/TableRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count - now just the array length
export const getTotalRowCount = (tableRows: TableRow[]): number => {
  return tableRows.length;
};

// Get visible rows with simple array slicing
export const getVisibleRows = ({
  bufferRowCount,
  contentHeight,
  tableRows,
  rowHeight,
  scrollTop,
}: {
  bufferRowCount: number;
  contentHeight: number;
  tableRows: TableRow[];
  rowHeight: number;
  scrollTop: number;
}): TableRow[] => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;

  // Calculate start and end indices directly
  const startOffset = Math.max(0, scrollTop - rowHeightWithSeparator * bufferRowCount);
  const endOffset = scrollTop + contentHeight + rowHeightWithSeparator * bufferRowCount;

  const startIndex = Math.max(0, Math.floor(startOffset / rowHeightWithSeparator));
  const endIndex = Math.min(tableRows.length, Math.ceil(endOffset / rowHeightWithSeparator));

  // Simple slice - all the complex logic is now in flattenRowsWithGrouping
  return tableRows.slice(startIndex, endIndex);
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
