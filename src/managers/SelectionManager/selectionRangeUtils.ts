import type Cell from "../../types/Cell";
import type TableRowType from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";
import { createSetString } from "./types";

/**
 * Compute the set of cell IDs for a selection range.
 * Resolves rowId to current row index (for virtualized/sorted tables) then fills the rectangle.
 */
export function computeSelectionRange(
  startCell: Cell,
  endCell: Cell,
  tableRows: TableRowType[],
  enableRowSelection: boolean,
): Set<string> {
  const newSelectedCells = new Set<string>();

  const rowIdToIndexMap = new Map<string, number>();
  tableRows.forEach((tableRow, index) => {
    const rowId = rowIdToString(tableRow.rowId);
    rowIdToIndexMap.set(rowId, index);
  });

  const startRowCurrentIndex = rowIdToIndexMap.get(String(startCell.rowId));
  const endRowCurrentIndex = rowIdToIndexMap.get(String(endCell.rowId));

  const startRow =
    startRowCurrentIndex !== undefined
      ? startRowCurrentIndex
      : startCell.rowIndex;
  const endRow =
    endRowCurrentIndex !== undefined ? endRowCurrentIndex : endCell.rowIndex;

  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minCol = Math.min(startCell.colIndex, endCell.colIndex);
  const maxCol = Math.max(startCell.colIndex, endCell.colIndex);

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (row >= 0 && row < tableRows.length) {
        if (enableRowSelection && col === 0) {
          continue;
        }
        const tableRow = tableRows[row];
        const rowId = rowIdToString(tableRow.rowId);
        newSelectedCells.add(
          createSetString({ colIndex: col, rowIndex: row, rowId }),
        );
      }
    }
  }

  return newSelectedCells;
}
