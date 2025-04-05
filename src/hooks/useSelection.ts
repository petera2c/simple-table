import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import Cell from "../types/Cell";

export type MouseDownProps = {
  rowIndex: number;
  colIndex: number;
};

const useSelection = ({
  selectableCells,
  headers,
  rows,
}: {
  selectableCells: boolean;
  headers: HeaderObject[];
  rows: { [key: string]: any }[];
}) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [focusedCell, setFocusedCell] = useState<Cell | null>(null);
  const [initialFocusedCell, setInitialFocusedCell] = useState<Cell | null>(null);
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  const copyToClipboard = useCallback(() => {
    const rowsText = Array.from(selectedCells).reduce((acc, cellKey) => {
      const [row, col] = cellKey.split("-").map(Number);
      if (!acc[row]) acc[row] = [];
      acc[row][col] = rows[row][headers[col].accessor];
      return acc;
    }, {} as { [key: number]: { [key: number]: any } });

    const text = Object.values(rowsText)
      .map((row) => Object.values(row).join("\t"))
      .join("\n");

    if (selectedCells.size > 0) {
      navigator.clipboard.writeText(text);
    }
  }, [selectedCells, rows, headers]);

  // Get the cell ID that should receive focus
  const getFocusableCellId = useCallback((rowIndex: number, colIndex: number) => {
    return `cell-${rowIndex}-${colIndex}`;
  }, []);

  // Focus a specific cell by coordinates
  const focusCell = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (!selectableCells) return;

      // Ensure valid bounds
      if (rowIndex < 0 || rowIndex >= rows.length) return;
      if (colIndex < 0 || colIndex >= headers.length) return;

      // Get the cell element
      const cellId = getFocusableCellId(rowIndex, colIndex);
      const cellElement = document.getElementById(cellId);

      if (cellElement) {
        cellElement.tabIndex = 0;
        cellElement.focus();
        setFocusedCell({ row: rowIndex, col: colIndex });
      }
    },
    [getFocusableCellId, headers.length, rows.length, selectableCells]
  );

  // Select cells from start to end coordinates
  const selectCellRange = useCallback((startRow: number, startCol: number, endRow: number, endCol: number) => {
    const newSelectedCells = new Set<string>();
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        newSelectedCells.add(`${row}-${col}`);
      }
    }

    setSelectedCells(newSelectedCells);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard if cells aren't selectable
      if (!selectableCells || !focusedCell) return;

      // We will navigate based on the initial focused cell when a range is selected
      const navCell = initialFocusedCell || focusedCell;
      const { row, col } = navCell;

      // Copy functionality
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        copyToClipboard();
        return;
      }

      // Handle keyboard navigation
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (row > 0) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${row - 1}-${col}`]));
          setInitialFocusedCell({ row: row - 1, col });
          focusCell(row - 1, col);
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (row < rows.length - 1) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${row + 1}-${col}`]));
          setInitialFocusedCell({ row: row + 1, col });
          focusCell(row + 1, col);
        }
      } else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        if (col > 0) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${row}-${col - 1}`]));
          setInitialFocusedCell({ row, col: col - 1 });
          focusCell(row, col - 1);
        }
      } else if (event.key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        if (col < headers.length - 1) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${row}-${col + 1}`]));
          setInitialFocusedCell({ row, col: col + 1 });
          focusCell(row, col + 1);
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
    focusCell,
    focusedCell,
    headers.length,
    initialFocusedCell,
    rows.length,
    selectCellRange,
    selectableCells,
  ]);

  const handleMouseDown = ({ colIndex, rowIndex }: MouseDownProps) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    startCell.current = { row: rowIndex, col: colIndex };
    setSelectedCells(new Set([`${rowIndex}-${colIndex}`]));
    setFocusedCell({ row: rowIndex, col: colIndex });
    setInitialFocusedCell({ row: rowIndex, col: colIndex });

    // Focus the cell
    focusCell(rowIndex, colIndex);
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (!selectableCells) return;
    if (isSelecting.current && startCell.current) {
      const newSelectedCells = new Set<string>();
      const startRow = Math.min(startCell.current.row, rowIndex);
      const endRow = Math.max(startCell.current.row, rowIndex);
      const startCol = Math.min(startCell.current.col, colIndex);
      const endCol = Math.max(startCell.current.col, colIndex);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          newSelectedCells.add(`${row}-${col}`);
        }
      }
      setSelectedCells(newSelectedCells);
      setFocusedCell({ row: rowIndex, col: colIndex });
      // Initial focused cell remains the one where the drag started
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
  };

  const isSelected = useCallback(
    (rowIndex: number, colIndex: number) => {
      return selectedCells.has(`${rowIndex}-${colIndex}`);
    },
    [selectedCells]
  );

  const getBorderClass = useCallback(
    (rowIndex: number, colIndex: number) => {
      const classes = [];
      if (!isSelected(rowIndex - 1, colIndex)) classes.push("st-selected-top-border");
      if (!isSelected(rowIndex + 1, colIndex)) classes.push("st-selected-bottom-border");
      if (!isSelected(rowIndex, colIndex - 1)) classes.push("st-selected-left-border");
      if (!isSelected(rowIndex, colIndex + 1)) classes.push("st-selected-right-border");
      return classes.join(" ");
    },
    [isSelected]
  );

  const isTopLeftCell = useMemo(() => {
    const minRow = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[0])));
    const minCol = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[1])));
    return (rowIndex: number, colIndex: number) => rowIndex === minRow && colIndex === minCol;
  }, [selectedCells]);

  return {
    selectedCells,
    focusedCell,
    initialFocusedCell,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
    setSelectedCells,
    focusCell,
  };
};

export default useSelection;
