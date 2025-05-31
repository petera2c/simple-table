import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import Row from "../types/Row";
import VisibleRow from "../types/VisibleRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count for flat rows (since we now use flattened data)
export const getTotalRowCount = (rows: Row[]): number => {
  return rows.length;
};

// Get visible rows with their absolute positions
export const getVisibleRows = ({
  bufferRowCount,
  contentHeight,
  flattenedRows,
  rowHeight,
  scrollTop,
}: {
  bufferRowCount: number;
  contentHeight: number;
  flattenedRows: Row[];
  rowHeight: number;
  scrollTop: number;
}): VisibleRow[] => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;
  const visibleRows: VisibleRow[] = [];
  const startOffset = Math.max(0, scrollTop - rowHeightWithSeparator * bufferRowCount);
  const endOffset = scrollTop + contentHeight + rowHeightWithSeparator * bufferRowCount;

  for (let i = 0; i < flattenedRows.length; i++) {
    const row = flattenedRows[i];
    const rowTop = i * rowHeightWithSeparator;

    if (rowTop >= endOffset) break;

    if (rowTop + rowHeightWithSeparator > startOffset) {
      visibleRows.push({
        row,
        depth: 0, // With flattened structure, all rows are at depth 0
        position: i,
        isLastGroupRow: false, // Will be determined by grouping logic elsewhere
      });
    }
  }

  return visibleRows;
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
