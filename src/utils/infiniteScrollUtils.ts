import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import TableRow from "../types/TableRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count - now just the array length
export const getTotalRowCount = <T>(tableRows: TableRow<T>[]): number => {
  return tableRows.length;
};

// Get visible rows with simple array slicing
export const getVisibleRows = <T>({
  bufferRowCount,
  contentHeight,
  rowHeight,
  scrollTop,
  tableRows,
}: {
  bufferRowCount: number;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  tableRows: TableRow<T>[];
}): TableRow<T>[] => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;

  // Calculate start and end indices directly
  const startOffset = Math.max(0, scrollTop - rowHeightWithSeparator * bufferRowCount);
  const endOffset = scrollTop + contentHeight + rowHeightWithSeparator * bufferRowCount;

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
