/**
 * Find the edge of data in a direction (pure helper for keyboard navigation).
 */
export function findEdgeInDirection(
  tableRowsLength: number,
  leafHeadersLength: number,
  enableRowSelection: boolean,
  startRow: number,
  startCol: number,
  direction: "up" | "down" | "left" | "right",
): { rowIndex: number; colIndex: number } {
  let targetRow = startRow;
  let targetCol = startCol;

  if (direction === "up") {
    targetRow = 0;
  } else if (direction === "down") {
    targetRow = tableRowsLength - 1;
  } else if (direction === "left") {
    targetCol = enableRowSelection ? 1 : 0;
  } else if (direction === "right") {
    targetCol = enableRowSelection ? leafHeadersLength : leafHeadersLength - 1;
  }

  return { rowIndex: targetRow, colIndex: targetCol };
}
