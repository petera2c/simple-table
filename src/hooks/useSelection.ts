import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import Cell from "../types/Cell";
import VisibleRow from "../types/VisibleRow";

const createSetString = ({ rowIndex, colIndex, rowId }: Cell) => `${rowIndex}-${colIndex}-${rowId}`;

const useSelection = ({
  selectableCells,
  headers,
  visibleRows,
}: {
  selectableCells: boolean;
  headers: HeaderObject[];
  visibleRows: VisibleRow[];
}) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [initialFocusedCell, setInitialFocusedCell] = useState<Cell | null>(null);
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  const copyToClipboard = useCallback(() => {
    const rowsText = Array.from(selectedCells).reduce((acc, cellKey) => {
      const [row, col] = cellKey.split("-").map(Number);
      if (!acc[row]) acc[row] = [];
      acc[row][col] = visibleRows[row].row.rowData[headers[col].accessor];
      return acc;
    }, {} as { [key: number]: { [key: number]: any } });

    const text = Object.values(rowsText)
      .map((row) => Object.values(row).join("\t"))
      .join("\n");

    if (selectedCells.size > 0) {
      navigator.clipboard.writeText(text);
    }
  }, [headers, selectedCells, visibleRows]);

  // Select cells from start to end coordinates
  const selectCellRange = useCallback(
    (startCell: Cell, endCell: Cell) => {
      const newSelectedCells = new Set<string>();
      const minRow = Math.min(startCell.rowIndex, endCell.rowIndex);
      const maxRow = Math.max(startCell.rowIndex, endCell.rowIndex);
      const minCol = Math.min(startCell.colIndex, endCell.colIndex);
      const maxCol = Math.max(startCell.colIndex, endCell.colIndex);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          // Check if the row exists in the visible rows
          if (row >= 0 && row < visibleRows.length) {
            const rowId = visibleRows[row].row.rowMeta.rowId;
            newSelectedCells.add(createSetString({ colIndex: col, rowIndex: row, rowId }));
          }
        }
      }

      setSelectedCells(newSelectedCells);
    },
    [visibleRows]
  );

  // Select a single cell
  const selectSingleCell = useCallback(
    (cell: Cell) => {
      if (
        cell.rowIndex >= 0 &&
        cell.rowIndex < visibleRows.length &&
        cell.colIndex >= 0 &&
        cell.colIndex < headers.length
      ) {
        const cellId = createSetString(cell);
        setSelectedCells(new Set([cellId]));
        setInitialFocusedCell(cell);
      }
    },
    [headers.length, visibleRows.length]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectableCells) return;

      // We will navigate based on the initial focused cell
      if (!initialFocusedCell) return;
      const { rowIndex, colIndex, rowId } = initialFocusedCell;

      // Copy functionality
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        copyToClipboard();
        return;
      }

      // Handle keyboard navigation - only show one cell at a time
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (rowIndex > 0) {
          const newCell = {
            rowIndex: rowIndex - 1,
            colIndex,
            rowId: visibleRows[rowIndex - 1].row.rowMeta.rowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (rowIndex < visibleRows.length - 1) {
          const newCell = {
            rowIndex: rowIndex + 1,
            colIndex,
            rowId: visibleRows[rowIndex + 1].row.rowMeta.rowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        if (colIndex > 0) {
          const newCell = {
            rowIndex,
            colIndex: colIndex - 1,
            rowId: visibleRows[rowIndex].row.rowMeta.rowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        if (colIndex < headers.length - 1) {
          const newCell = {
            rowIndex,
            colIndex: colIndex + 1,
            rowId: visibleRows[rowIndex].row.rowMeta.rowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "Escape") {
        // Clear selection
        setSelectedCells(new Set());
        startCell.current = null;
        setInitialFocusedCell(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    copyToClipboard,
    headers.length,
    initialFocusedCell,
    selectCellRange,
    selectSingleCell,
    selectableCells,
    visibleRows,
  ]);

  const handleMouseDown = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    startCell.current = { rowIndex, colIndex, rowId };

    const cellId = createSetString({ colIndex, rowIndex, rowId });
    setSelectedCells(new Set([cellId]));
    setInitialFocusedCell({ rowIndex, colIndex, rowId });
  };

  const handleMouseOver = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    if (isSelecting.current && startCell.current) {
      const newSelectedCells = new Set<string>();
      const startRow = Math.min(startCell.current.rowIndex, rowIndex);
      const endRow = Math.max(startCell.current.rowIndex, rowIndex);
      const startCol = Math.min(startCell.current.colIndex, colIndex);
      const endCol = Math.max(startCell.current.colIndex, colIndex);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          // Ensure the row exists
          if (row >= 0 && row < visibleRows.length) {
            const rowId = visibleRows[row].row.rowMeta.rowId;
            newSelectedCells.add(createSetString({ colIndex: col, rowIndex: row, rowId }));
          }
        }
      }

      setSelectedCells(newSelectedCells);
      // Initial focused cell remains the one where the drag started
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
  };

  const isSelected = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const hasString = createSetString({ colIndex, rowIndex, rowId });
      return selectedCells.has(hasString);
    },
    [selectedCells]
  );

  const getBorderClass = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const classes = [];
      const topRowId = visibleRows[rowIndex - 1]?.row?.rowMeta?.rowId;
      const bottomRowId = visibleRows[rowIndex + 1]?.row?.rowMeta?.rowId;

      const topCell = { colIndex, rowIndex: rowIndex - 1, rowId: topRowId };
      const bottomCell = { colIndex, rowIndex: rowIndex + 1, rowId: bottomRowId };
      const leftCell = { colIndex: colIndex - 1, rowIndex, rowId };
      const rightCell = { colIndex: colIndex + 1, rowIndex, rowId };

      if (!isSelected(topCell)) classes.push("st-selected-top-border");
      if (!isSelected(bottomCell)) classes.push("st-selected-bottom-border");
      if (!isSelected(leftCell)) classes.push("st-selected-left-border");
      if (!isSelected(rightCell)) classes.push("st-selected-right-border");
      return classes.join(" ");
    },
    [isSelected, visibleRows]
  );

  const isInitialFocusedCell = useMemo(() => {
    if (!initialFocusedCell) return () => false;
    return ({ rowIndex, colIndex, rowId }: Cell) =>
      rowIndex === initialFocusedCell.rowIndex &&
      colIndex === initialFocusedCell.colIndex &&
      rowId === initialFocusedCell.rowId;
  }, [initialFocusedCell, visibleRows]);

  return {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isInitialFocusedCell,
    isSelected,
    selectedCells,
    setSelectedCells,
  };
};

export default useSelection;
