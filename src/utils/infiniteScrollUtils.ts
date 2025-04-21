import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import Row from "../types/Row";
import VisibleRow from "../types/VisibleRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count recursively
export const getTotalRowCount = (rows: Row[]): number => {
  let count = 0;
  const countRows = (rowList: Row[]) => {
    rowList.forEach((row) => {
      count += 1;
      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        countRows(row.rowMeta.children);
      }
    });
  };
  countRows(rows);
  return count;
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
  let currentPosition = 0;
  const startOffset = Math.max(0, scrollTop - rowHeightWithSeparator * bufferRowCount);
  const endOffset = scrollTop + contentHeight + rowHeightWithSeparator * bufferRowCount;

  const traverseRows = (rowList: Row[], depth: number) => {
    for (const row of rowList) {
      const rowTop = currentPosition * rowHeightWithSeparator;
      if (rowTop >= endOffset) break;

      if (rowTop + rowHeightWithSeparator > startOffset) {
        visibleRows.push({
          row,
          depth,
          position: currentPosition,
          isLastGroupRow: Boolean(row.rowMeta.children?.length) && depth > 1,
        });
      }

      currentPosition += 1;

      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        traverseRows(row.rowMeta.children, depth + 1);
      }
    }
  };

  traverseRows(flattenedRows, 0);
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
