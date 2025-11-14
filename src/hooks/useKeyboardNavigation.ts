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
            // Skip selection column (always at index 0 when enabled)
            if (enableRowSelection && col === 0) {
              continue;
            }
            const rowId = getRowId({ row: tableRows[row].row, rowIdAccessor });
            newSelectedCells.add(`${row}-${col}-${rowId}`);
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
      const currentRowId = getRowId({ row: tableRows[rowIndex]?.row, rowIdAccessor });
      if (currentRowId !== rowId) {
        const currentRowIndex = tableRows.findIndex(
          (visibleRow) => getRowId({ row: visibleRow.row, rowIdAccessor }) === rowId
        );
        if (currentRowIndex !== -1) {
          rowIndex = currentRowIndex;
        } else return;
      }

      // Helper function to check if a column is a selection column
      // Selection column is always at index 0 when enableRowSelection is true
      const isSelectionColumn = (colIndex: number): boolean => {
        return enableRowSelection && colIndex === 0;
      };

      // Helper function to find the next non-selection column to the right
      const findNextSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col < leafHeaders.length && isSelectionColumn(col)) {
          col++;
        }
        return col < leafHeaders.length ? col : -1;
      };

      // Helper function to find the next non-selection column to the left
      const findPrevSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col >= 0 && isSelectionColumn(col)) {
          col--;
        }
        return col;
      };

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
          targetCol = 0;
          // Skip selection column when going left
          targetCol = findNextSelectableColumn(targetCol);
          if (targetCol === -1) targetCol = 0;
        } else if (direction === "right") {
          targetCol = leafHeaders.length - 1;
          // Skip selection column when going right
          targetCol = findPrevSelectableColumn(targetCol);
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
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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

          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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

          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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
      // Helper to skip selection column (always at index 0 when enabled)
      const isSelectionColumn = (col: number) => enableRowSelection && col === 0;
      const findPrevSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col >= 0 && isSelectionColumn(col)) {
          col--;
        }
        return col;
      };

      if (event.shiftKey && event.key === "ArrowLeft") {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetCol = colIndex - 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "left");
          targetCol = edge.colIndex;
        }

        // Skip selection column
        targetCol = findPrevSelectableColumn(targetCol);

        if (targetCol >= 0) {
          const newRowId = getRowId({ row: tableRows[rowIndex].row, rowIdAccessor });
          const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (colIndex > 0) {
          let targetCol = colIndex - 1;

          if ((event.ctrlKey || event.metaKey) && event.key === "ArrowLeft") {
            const edge = findEdgeInDirection(rowIndex, colIndex, "left");
            targetCol = edge.colIndex;
          }

          // Skip selection column
          targetCol = findPrevSelectableColumn(targetCol);

          if (targetCol >= 0) {
            const newRowId = getRowId({ row: tableRows[rowIndex].row, rowIdAccessor });
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
      // Helper to skip selection column (always at index 0 when enabled)
      const isSelectionColumn = (col: number) => enableRowSelection && col === 0;
      const findNextSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col < leafHeaders.length && isSelectionColumn(col)) {
          col++;
        }
        return col < leafHeaders.length ? col : -1;
      };

      if (event.shiftKey && event.key === "ArrowRight") {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetCol = colIndex + 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = findEdgeInDirection(rowIndex, colIndex, "right");
          targetCol = edge.colIndex;
        }

        // Skip selection column
        targetCol = findNextSelectableColumn(targetCol);

        if (targetCol >= 0 && targetCol < leafHeaders.length) {
          const newRowId = getRowId({ row: tableRows[rowIndex].row, rowIdAccessor });
          const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        if (colIndex < leafHeaders.length - 1) {
          let targetCol = colIndex + 1;

          if ((event.ctrlKey || event.metaKey) && event.key === "ArrowRight") {
            const edge = findEdgeInDirection(rowIndex, colIndex, "right");
            targetCol = edge.colIndex;
          }

          // Skip selection column
          targetCol = findNextSelectableColumn(targetCol);

          if (targetCol >= 0 && targetCol < leafHeaders.length) {
            const newRowId = getRowId({ row: tableRows[rowIndex].row, rowIdAccessor });
            const newCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
            selectSingleCell(newCell);
            startCell.current = null;
          }
        }
      }
    };

    const handleHome = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      // Helper to skip selection column (always at index 0 when enabled)
      const isSelectionColumn = (col: number) => enableRowSelection && col === 0;
      const findNextSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col < leafHeaders.length && isSelectionColumn(col)) {
          col++;
        }
        return col < leafHeaders.length ? col : -1;
      };

      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex;
        let targetCol = 0;

        if (event.ctrlKey || event.metaKey) {
          targetRow = 0;
        }

        // Skip selection column
        targetCol = findNextSelectableColumn(targetCol);

        if (targetCol >= 0) {
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
          const endCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        let targetRow = rowIndex;
        let targetCol = 0;

        if (event.ctrlKey || event.metaKey) {
          targetRow = 0;
        }

        // Skip selection column
        targetCol = findNextSelectableColumn(targetCol);

        if (targetCol >= 0) {
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
          const newCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
          selectSingleCell(newCell);
          startCell.current = null;
        }
      }
    };

    const handleEnd = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      // Helper to skip selection column (always at index 0 when enabled)
      const isSelectionColumn = (col: number) => enableRowSelection && col === 0;
      const findPrevSelectableColumn = (startCol: number): number => {
        let col = startCol;
        while (col >= 0 && isSelectionColumn(col)) {
          col--;
        }
        return col;
      };

      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        let targetRow = rowIndex;
        let targetCol = leafHeaders.length - 1;

        if (event.ctrlKey || event.metaKey) {
          targetRow = tableRows.length - 1;
        }

        // Skip selection column
        targetCol = findPrevSelectableColumn(targetCol);

        if (targetCol >= 0) {
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
          const endCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
          selectCellRange(startCell.current, endCell);
        }
      } else {
        let targetRow = rowIndex;
        let targetCol = leafHeaders.length - 1;

        if (event.ctrlKey || event.metaKey) {
          targetRow = tableRows.length - 1;
        }

        // Skip selection column
        targetCol = findPrevSelectableColumn(targetCol);

        if (targetCol >= 0) {
          const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
          const newCell = { rowIndex: targetRow, colIndex: targetCol, rowId: newRowId };
          selectSingleCell(newCell);
          startCell.current = null;
        }
      }
    };

    const handlePageUp = (event: KeyboardEvent, rowIndex: number, colIndex: number) => {
      const pageSize = 10;
      let targetRow = Math.max(0, rowIndex - pageSize);

      if (event.shiftKey) {
        if (!startCell.current) {
          startCell.current = initialFocusedCell!;
        }

        const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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

        const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        selectCellRange(startCell.current, endCell);
      } else {
        const newRowId = getRowId({ row: tableRows[targetRow].row, rowIdAccessor });
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
  ]);
};
