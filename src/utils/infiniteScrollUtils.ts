import { ROW_SEPARATOR_WIDTH } from "../consts/general-consts";
import Row from "../types/Row";
import VisibleRow from "../types/VisibleRow";

const SEPARATOR_HEIGHT = 1;

// Calculate total row count for flat rows (since we now use flattened data)
export const getTotalRowCount = (flattenedRowsData: FlattenedRowWithGrouping[]): number => {
  return flattenedRowsData.length;
};

// Get visible rows with their absolute positions
export const getVisibleRows = ({
  bufferRowCount,
  contentHeight,
  flattenedRowsData,
  rowHeight,
  scrollTop,
}: {
  bufferRowCount: number;
  contentHeight: number;
  flattenedRowsData: FlattenedRowWithGrouping[];
  rowHeight: number;
  scrollTop: number;
}): VisibleRow[] => {
  const rowHeightWithSeparator = rowHeight + SEPARATOR_HEIGHT;
  const visibleRows: VisibleRow[] = [];
  const startOffset = Math.max(0, scrollTop - rowHeightWithSeparator * bufferRowCount);
  const endOffset = scrollTop + contentHeight + rowHeightWithSeparator * bufferRowCount;

  for (let i = 0; i < flattenedRowsData.length; i++) {
    const { row, depth } = flattenedRowsData[i];
    const rowTop = i * rowHeightWithSeparator;

    if (rowTop >= endOffset) break;

    if (rowTop + rowHeightWithSeparator > startOffset) {
      visibleRows.push({
        row,
        depth,
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
