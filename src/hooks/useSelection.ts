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
  const [focusedCell, setFocusedCell] = useState<Cell | null>(null);
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

  // Get the cell ID that should receive focus
  const getFocusableCellId = useCallback((rowIndex: number, colIndex: number) => {
    return `cell-${rowIndex}-${colIndex}`;
  }, []);

  // Focus a specific cell by coordinates
  const focusCell = useCallback(
    ({ rowIndex, colIndex, rowId }: Cell) => {
      if (!selectableCells) return;

      // Ensure valid bounds
      if (rowIndex < 0 || rowIndex >= visibleRows.length) return;
      if (colIndex < 0 || colIndex >= headers.length) return;

      // Get the cell element
      const cellId = getFocusableCellId(rowIndex, colIndex);
      const cellElement = document.getElementById(cellId);

      if (cellElement) {
        cellElement.tabIndex = 0;
        cellElement.focus();
        setFocusedCell({ rowIndex, colIndex, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
      }
    },
    [getFocusableCellId, headers.length, selectableCells, visibleRows]
  );

  // Select cells from start to end coordinates
  const selectCellRange = useCallback((startCell: Cell, endCell: Cell) => {
    const newSelectedCells = new Set<string>();
    const minRow = Math.min(startCell.rowIndex, endCell.rowIndex);
    const maxRow = Math.max(startCell.rowIndex, endCell.rowIndex);
    const minCol = Math.min(startCell.colIndex, endCell.colIndex);
    const maxCol = Math.max(startCell.colIndex, endCell.colIndex);

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
      const { rowIndex, colIndex } = navCell;

      // Copy functionality
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        copyToClipboard();
        return;
      }

      // Handle keyboard navigation
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (rowIndex > 0) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${rowIndex - 1}-${colIndex}`]));
          setInitialFocusedCell({
            rowIndex: rowIndex - 1,
            colIndex,
            rowId: visibleRows[rowIndex - 1].row.rowMeta.rowId,
          });
          focusCell({ rowIndex: rowIndex - 1, colIndex, rowId: visibleRows[rowIndex - 1].row.rowMeta.rowId });
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (rowIndex < visibleRows.length - 1) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${rowIndex + 1}-${colIndex}`]));
          setInitialFocusedCell({
            rowIndex: rowIndex + 1,
            colIndex,
            rowId: visibleRows[rowIndex + 1].row.rowMeta.rowId,
          });
          focusCell({ rowIndex: rowIndex + 1, colIndex, rowId: visibleRows[rowIndex + 1].row.rowMeta.rowId });
        }
      } else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        if (colIndex > 0) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${rowIndex}-${colIndex - 1}`]));
          setInitialFocusedCell({ rowIndex, colIndex: colIndex - 1, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
          focusCell({ rowIndex, colIndex: colIndex - 1, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
        }
      } else if (event.key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        if (colIndex < headers.length - 1) {
          // Just move focus
          startCell.current = null;
          setSelectedCells(new Set([`${rowIndex}-${colIndex + 1}`]));
          setInitialFocusedCell({ rowIndex, colIndex: colIndex + 1, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
          focusCell({ rowIndex, colIndex: colIndex + 1, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
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
  }, [copyToClipboard, focusCell, focusedCell, headers.length, initialFocusedCell, selectCellRange, selectableCells]);

  const handleMouseDown = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    startCell.current = { rowIndex, colIndex, rowId };
    setSelectedCells(new Set([createSetString({ colIndex, rowIndex, rowId })]));
    setFocusedCell({ rowIndex, colIndex, rowId });
    setInitialFocusedCell({ rowIndex, colIndex, rowId });

    // Focus the cell
    focusCell({ rowIndex, colIndex, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
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
          newSelectedCells.add(
            createSetString({ colIndex: col, rowIndex: row, rowId: visibleRows[row].row.rowMeta.rowId })
          );
        }
      }
      setSelectedCells(newSelectedCells);
      setFocusedCell({ rowIndex, colIndex, rowId: visibleRows[rowIndex].row.rowMeta.rowId });
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
    [isSelected]
  );

  const isTopLeftCell = useMemo(() => {
    const minRow = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[0])));
    const minCol = Math.min(...Array.from(selectedCells).map((cell) => parseInt(cell.split("-")[1])));
    return ({ rowIndex, colIndex, rowId }: Cell) =>
      rowIndex === minRow && colIndex === minCol && rowId === visibleRows[minRow].row.rowMeta.rowId;
  }, [selectedCells, visibleRows]);

  return {
    focusCell,
    focusedCell,
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    initialFocusedCell,
    isSelected,
    isTopLeftCell,
    selectedCells,
    setSelectedCells,
  };
};

export default useSelection;
