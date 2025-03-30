import Row from "../types/Row";
import VisibleRow from "../types/VisibleRow";

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
const getVisibleRows = ({
  bufferRowCount,
  containerHeight,
  rowHeight,
  rows,
  scrollTop,
}: {
  bufferRowCount: number;
  containerHeight: number;
  rowHeight: number;
  rows: Row[];
  scrollTop: number;
}): VisibleRow[] => {
  const visibleRows: VisibleRow[] = [];
  let currentPosition = 0;
  const startOffset = Math.max(0, scrollTop - rowHeight * bufferRowCount);
  const endOffset = scrollTop + containerHeight + rowHeight * bufferRowCount;

  const traverseRows = (rowList: Row[], depth: number) => {
    for (const row of rowList) {
      const rowTop = currentPosition * rowHeight;
      if (rowTop >= endOffset) break;

      if (rowTop + rowHeight > startOffset) {
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

  traverseRows(rows, 0);
  return visibleRows;
};

export default getVisibleRows;
