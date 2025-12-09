import { useEffect } from "react";
import Cell from "../types/Cell";
import HeaderObject from "../types/HeaderObject";
import type TableRowType from "../types/TableRow";
import { Accessor } from "../types/HeaderObject";
import { getRowId } from "../utils/rowUtils";

interface UseKeyboardNavigationProps {
  selectableCells: boolean;
  initialFocusedCell: Cell | null;
  tableRows: TableRowType[];
  leafHeaders: HeaderObject[];
  rowIdAccessor: Accessor;
  selectSingleCell: (cell: Cell) => void;
  selectCellRange: (startCell: Cell, endCell: Cell) => void;
  setSelectedCells: (cells: Set<string>) => void;
  setSelectedColumns: (columns: Set<number>) => void;
  setLastSelectedColumnIndex: (index: number | null) => void;
  copyToClipboard: () => void;
  pasteFromClipboard: () => void;
  deleteSelectedCells: () => void;
  startCell: React.MutableRefObject<Cell | null>;
  enableRowSelection?: boolean;
}

/**
 * Hook that handles keyboard navigation for cell selection
 */
export const useKeyboardNavigation = ({
  selectableCells,
  initialFocusedCell,
  tableRows,
  leafHeaders,
  rowIdAccessor,
  selectSingleCell,
  selectCellRange,
  setSelectedCells,
  setSelectedColumns,
  setLastSelectedColumnIndex,
  copyToClipboard,
  pasteFromClipboard,
  deleteSelectedCells,
  startCell,
  enableRowSelection = false,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectableCells) return;

      // We will navigate based on the initial focused cell
      if (!initialFocusedCell) return;
      let { rowIndex, colIndex, rowId } = initialFocusedCell;

      // Copy functionality
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        copyToClipboard();
        return;
      }

      // Paste functionality
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        event.preventDefault();
        pasteFromClipboard();
        return;
      }

      // Select All functionality (Ctrl/Cmd + A)
      if ((event.ctrlKey || event.metaKey) && event.key === "a") {
        event.preventDefault();
        const newSelectedCells = new Set<string>();
        for (let row = 0; row < tableRows.length; row++) {
          for (let col = 0; col < leafHeaders.length; col++) {
            // leafHeaders doesn't include selection column, so we need to offset colIndex by 1 when selection is enabled
            const colIndex = enableRowSelection ? col + 1 : col;
            const tableRow = tableRows[row];
            const rowId = getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            });
            newSelectedCells.add(`${row}-${colIndex}-${rowId}`);
          }
        }
        setSelectedCells(newSelectedCells);
        setSelectedColumns(new Set());
        setLastSelectedColumnIndex(null);
        return;
      }

      // Delete functionality
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelectedCells();
        return;
      }

      // Check if the visible rows have changed
      const currentRow = tableRows[rowIndex];
      const currentRowId = currentRow
        ? getRowId({
            row: currentRow.row,
            rowIdAccessor,
            rowPath: currentRow.rowPath,
          })
        : null;
      if (currentRowId !== rowId) {
        const currentRowIndex = tableRows.findIndex(
          (visibleRow) =>
            getRowId({
              row: visibleRow.row,
              rowIdAccessor,
              rowPath: visibleRow.rowPath,
            }) === rowId
        );
        if (currentRowIndex !== -1) {
          rowIndex = currentRowIndex;
        } else return;
      }

      // Helper function to find the edge of data in a direction
      const findEdgeInDirection = (
        startRow: number,
        startCol: number,
        direction: "up" | "down" | "left" | "right"
      ): { rowIndex: number; colIndex: number } => {
        let targetRow = startRow;
        let targetCol = startCol;

        if (direction === "up") {
          targetRow = 0;
        } else if (direction === "down") {
          targetRow = tableRows.length - 1;
        } else if (direction === "left") {
          // First data column: if selection enabled, it's at index 1, otherwise 0
          targetCol = enableRowSelection ? 1 : 0;
        } else if (direction === "right") {
          // Last data column: leafHeaders.length gives us the count of data columns
          // If selection enabled, indices are offset by 1, so last column is at leafHeaders.length
          // If selection disabled, last column is at leafHeaders.length - 1
          targetCol = enableRowSelection ? leafHeaders.length : leafHeaders.length - 1;
        }

        return { rowIndex: targetRow, colIndex: targetCol };
      };

      // Handle keyboard navigation with Shift for range selection
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleArrowUp(event, rowIndex, colIndex, findEdgeInDirection);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        handleArrowDown(event, rowIndex, colIndex, findEdgeInDirection);
      } else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        handleArrowLeft(event, rowIndex, colIndex, findEdgeInDirection);
      } else if (event.key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        handleArrowRight(event, rowIndex, colIndex, findEdgeInDirection);
      } else if (event.key === "Home") {
        event.preventDefault();
        handleHome(event, rowIndex, colIndex);
      } else if (event.key === "End") {
        event.preventDefault();
        handleEnd(event, rowIndex, colIndex);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        handlePageUp(event, rowIndex, colIndex);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        handlePageDown(event, rowIndex, colIndex);
      } else if (event.key === "Escape") {
        setSelectedCells(new Set());
        setSelectedColumns(new Set());
        setLastSelectedColumnIndex(null);
        startCell.current = null;
      }
    };

    const handleArrowUp = (
      event: KeyboardEvent,
      rowIndex: number,
      colIndex: number,
      findEdgeInDirection: Function
    ) => {
      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex - 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "up");
          targetRow = edge.rowIndex;
        }

        if (targetRow >= 0) {
          const targetTableRow = tableRows[targetRow];
          const newRowId = getRowId({
            row: targetTableRow.row,
            rowIdAccessor,
            rowPath: targetTableRow.rowPath,
          });
          const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (rowIndex > 0) {
          let targetRow = rowIndex - 1;

          if (event.ctrlKey || event.metaKey) {
            const edge = findEdgeInDirection(rowIndex, colIndex, "up");
            targetRow = edge.rowIndex;
          }

          const targetTableRow = tableRows[targetRow];
          const newRowId = getRowId({
            row: targetTableRow.row,
            rowIdAccessor,
            rowPath: targetTableRow.rowPath,
          });
          const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
          selectSingleCell(newCell);
          startCell.current = null;
        }
      }
    };

    const handleArrowDown = (
      event: KeyboardEvent,
      rowIndex: number,
      colIndex: number,
      findEdgeInDirection: Function
    ) => {
      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex + 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "down");
          targetRow = edge.rowIndex;
        }

        if (targetRow < tableRows.length) {
          const targetTableRow = tableRows[targetRow];
          const newRowId = getRowId({
            row: targetTableRow.row,
            rowIdAccessor,
            rowPath: targetTableRow.rowPath,
          });
          const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (rowIndex < tableRows.length - 1) {
          let targetRow = rowIndex + 1;

          if (event.ctrlKey || event.metaKey) {
            const edge = findEdgeInDirection(rowIndex, colIndex, "down");
            targetRow = edge.rowIndex;
          }

          const targetTableRow = tableRows[targetRow];
          const newRowId = getRowId({
            row: targetTableRow.row,
            rowIdAccessor,
            rowPath: targetTableRow.rowPath,
          });
          const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
          selectSingleCell(newCell);
          startCell.current = null;
        }
      }
    };

    const handleArrowLeft = (
      event: KeyboardEvent,
      rowIndex: number,
      colIndex: number,
      findEdgeInDirection: Function
    ) => {
      if (event.shiftKey && event.key === "ArrowLeft") {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetCol = colIndex - 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "left");
          targetCol = edge.colIndex;
        } else {
          // For regular arrow left, skip selection column if we land on it
          if (enableRowSelection && targetCol === 0) {
            return; // Can't go further left
          }
        }

        if (targetCol >= 0) {
          const currentTableRow = tableRows[rowIndex];
          const newRowId = getRowId({
            row: currentTableRow.row,
            rowIdAccessor,
            rowPath: currentTableRow.rowPath,
          });
          const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (colIndex > 0) {
          let targetCol = colIndex - 1;

          if ((event.ctrlKey || event.metaKey) && event.key === "ArrowLeft") {
            const edge = findEdgeInDirection(rowIndex, colIndex, "left");
            targetCol = edge.colIndex;
          } else {
            // For regular arrow left, skip selection column if we land on it
            if (enableRowSelection && targetCol === 0) {
              return; // Can't go further left
            }
          }

          if (targetCol >= 0) {
            const currentTableRow = tableRows[rowIndex];
            const newRowId = getRowId({
              row: currentTableRow.row,
              rowIdAccessor,
              rowPath: currentTableRow.rowPath,
            });
            const newCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
            selectSingleCell(newCell);
            startCell.current = null;
          }
        }
      }
    };

    const handleArrowRight = (
      event: KeyboardEvent,
      rowIndex: number,
      colIndex: number,
      findEdgeInDirection: Function
    ) => {
      // Calculate the maximum valid colIndex (accounts for selection column offset)
      const maxColIndex = enableRowSelection ? leafHeaders.length : leafHeaders.length - 1;

      if (event.shiftKey && event.key === "ArrowRight") {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetCol = colIndex + 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "right");
          targetCol = edge.colIndex;
        }

        if (targetCol <= maxColIndex) {
          const currentTableRow = tableRows[rowIndex];
          const newRowId = getRowId({
            row: currentTableRow.row,
            rowIdAccessor,
            rowPath: currentTableRow.rowPath,
          });
          const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (colIndex < maxColIndex) {
          let targetCol = colIndex + 1;

          if ((event.ctrlKey || event.metaKey) && event.key === "ArrowRight") {
            const edge = findEdgeInDirection(rowIndex, colIndex, "right");
            targetCol = edge.colIndex;
          }

          if (targetCol <= maxColIndex) {
            const currentTableRow = tableRows[rowIndex];
            const newRowId = getRowId({
              row: currentTableRow.row,
              rowIdAccessor,
              rowPath: currentTableRow.rowPath,
            });
            const newCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
            selectSingleCell(newCell);
            startCell.current = null;
          }
        }
      }
    };

    const handleHome = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex;
        // First data column: if selection enabled, it's at index 1, otherwise 0
        const targetCol = enableRowSelection ? 1 : 0;

        if (event.ctrlKey || event.metaKey) {
          targetRow = 0;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const endCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        let targetRow = rowIndex;
        // First data column: if selection enabled, it's at index 1, otherwise 0
        const targetCol = enableRowSelection ? 1 : 0;

        if (event.ctrlKey || event.metaKey) {
          targetRow = 0;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const newCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
        selectSingleCell(newCell);
        startCell.current = null;
      }
    };

    const handleEnd = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex;
        // Last data column: if selection enabled, it's at leafHeaders.length, otherwise leafHeaders.length - 1
        const targetCol = enableRowSelection ? leafHeaders.length : leafHeaders.length - 1;

        if (event.ctrlKey || event.metaKey) {
          targetRow = tableRows.length - 1;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const endCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        let targetRow = rowIndex;
        // Last data column: if selection enabled, it's at leafHeaders.length, otherwise leafHeaders.length - 1
        const targetCol = enableRowSelection ? leafHeaders.length : leafHeaders.length - 1;

        if (event.ctrlKey || event.metaKey) {
          targetRow = tableRows.length - 1;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const newCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
        selectSingleCell(newCell);
        startCell.current = null;
      }
    };

    const handlePageUp = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      const pageSize = 10;
      let targetRow = Math.max(0, rowIndex - pageSize);

      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectSingleCell(newCell);
        startCell.current = null;
      }
    };

    const handlePageDown = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      const pageSize = 10;
      let targetRow = Math.min(tableRows.length - 1, rowIndex + pageSize);

      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        const targetTableRow = tableRows[targetRow];
        const newRowId = getRowId({
          row: targetTableRow.row,
          rowIdAccessor,
          rowPath: targetTableRow.rowPath,
        });
        const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectSingleCell(newCell);
        startCell.current = null;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectableCells,
    initialFocusedCell,
    tableRows,
    leafHeaders,
    rowIdAccessor,
    selectSingleCell,
    selectCellRange,
    setSelectedCells,
    setSelectedColumns,
    setLastSelectedColumnIndex,
    copyToClipboard,
    pasteFromClipboard,
    deleteSelectedCells,
    startCell,
    enableRowSelection,
  ]);
};
