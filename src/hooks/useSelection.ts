import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import HeaderObject from "../types/HeaderObject";
import type TableRowType from "../types/TableRow";
import Cell from "../types/Cell";
import { findLeafHeaders } from "../utils/headerWidthUtils";
import { getRowId } from "../utils/rowUtils";

export const createSetString = ({ rowIndex, colIndex, rowId }: Cell) =>
  `${rowIndex}-${colIndex}-${rowId}`;

interface UseSelectionProps {
  selectableCells: boolean;
  headers: HeaderObject[];
  visibleRows: TableRowType[];
  rowIdAccessor: string;
}

const useSelection = ({
  selectableCells,
  headers,
  visibleRows,
  rowIdAccessor,
}: UseSelectionProps) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());
  const [lastSelectedColumnIndex, setLastSelectedColumnIndex] = useState<number | null>(null);
  const [initialFocusedCell, setInitialFocusedCell] = useState<Cell | null>(null);
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  // Get flattened leaf headers (actual navigable columns) for proper boundary checking
  const leafHeaders = useMemo(() => {
    return headers.flatMap(findLeafHeaders);
  }, [headers]);

  const copyToClipboard = useCallback(() => {
    // Use the already flattened leaf headers
    const flattenedLeafHeaders = leafHeaders.filter((header) => !header.hide);

    // Create a mapping of column indices to accessors for quick lookup
    // Example: {0: "name", 1: "age", 2: "email"}
    const colIndexToAccessor = new Map<number, string>();
    flattenedLeafHeaders.forEach((header, index) => {
      colIndexToAccessor.set(index, header.accessor);
    });

    // Convert selectedCells (Set of "row-col-depth" strings) to a text format suitable for clipboard
    // Example: selectedCells = new Set(["0-0-0", "0-1-0", "1-0-0"])
    const rowsText = Array.from(selectedCells).reduce((acc, cellKey) => {
      // Parse the row and column indices from the cell key
      // Example: "0-2-1" → row=0, col=2 (depth is ignored)
      const [row, col] = cellKey.split("-").map(Number);

      // Initialize row array if this is the first cell in this row
      // Example: if row=2 and acc={0:[...], 1:[...]}, then create acc[2]=[]
      if (!acc[row]) acc[row] = [];

      // Get the accessor for this column using our mapping
      // Example: for col=2, might get accessor="email"
      const accessor = colIndexToAccessor.get(col);

      if (accessor && visibleRows[row]?.row) {
        // Use the accessor to get the cell value directly from the row
        // Example: if accessor="name", get row.name
        acc[row][col] = visibleRows[row].row[accessor];
      } else {
        // If no accessor found (shouldn't happen), use empty string
        acc[row][col] = "";
      }

      return acc;
    }, {} as { [key: number]: { [key: number]: any } });

    // Convert the structured data to a tab-separated string
    // Example: {0: ["John", 25], 1: ["Mary", 30]} → "John\t25\nMary\t30"
    const text = Object.values(rowsText)
      .map((row) => Object.values(row).join("\t"))
      .join("\n");

    if (selectedCells.size > 0) {
      navigator.clipboard.writeText(text);
    }
  }, [leafHeaders, selectedCells, visibleRows]);

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
            const rowId = getRowId(visibleRows[row].row, row, rowIdAccessor);
            newSelectedCells.add(createSetString({ colIndex: col, rowIndex: row, rowId }));
          }
        }
      }

      // Clear column selections when selecting cells
      setSelectedColumns(new Set());
      setLastSelectedColumnIndex(null);

      setSelectedCells(newSelectedCells);
    },
    [visibleRows, rowIdAccessor, setSelectedColumns, setLastSelectedColumnIndex, setSelectedCells]
  );

  // Select a single cell
  const selectSingleCell = useCallback(
    (cell: Cell) => {
      if (
        cell.rowIndex >= 0 &&
        cell.rowIndex < visibleRows.length &&
        cell.colIndex >= 0 &&
        cell.colIndex < leafHeaders.length
      ) {
        const cellId = createSetString(cell);

        // Clear column selections when selecting a single cell
        setSelectedColumns(new Set());
        setLastSelectedColumnIndex(null);

        setSelectedCells(new Set([cellId]));
        setInitialFocusedCell(cell);
      }
    },
    [
      leafHeaders.length,
      visibleRows.length,
      setSelectedColumns,
      setLastSelectedColumnIndex,
      setSelectedCells,
      setInitialFocusedCell,
    ]
  );

  // Helper to select columns and update last selected index
  const selectColumns = useCallback(
    (columnIndices: number[], isShiftKey = false) => {
      // Clear cell selections when selecting columns
      setSelectedCells(new Set());
      setInitialFocusedCell(null);

      setSelectedColumns((prev) => {
        const newSelection = new Set(isShiftKey ? prev : []);
        columnIndices.forEach((idx) => newSelection.add(idx));
        return newSelection;
      });

      // Update last selected column if applicable
      if (columnIndices.length > 0) {
        setLastSelectedColumnIndex(columnIndices[columnIndices.length - 1]);
      }
    },
    [setSelectedCells, setInitialFocusedCell, setSelectedColumns, setLastSelectedColumnIndex]
  );

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

      // Check if the visible rows have changed
      // If the rowId has changed, and we can't find the rowId in the visible rows, do nothing
      // If the rowId has changed, and we can find the rowId in the visible rows, update the rowIndex
      const currentRowId = getRowId(visibleRows[rowIndex]?.row, rowIndex, rowIdAccessor);
      if (currentRowId !== rowId) {
        const currentRowIndex = visibleRows.findIndex(
          (visibleRow, index) => getRowId(visibleRow.row, index, rowIdAccessor) === rowId
        );
        if (currentRowIndex !== -1) {
          rowIndex = currentRowIndex;
        } else return;
      }

      // Handle keyboard navigation - only show one cell at a time
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (rowIndex > 0) {
          const newRowId = getRowId(visibleRows[rowIndex - 1].row, rowIndex - 1, rowIdAccessor);
          const newCell = {
            rowIndex: rowIndex - 1,
            colIndex,
            rowId: newRowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (rowIndex < visibleRows.length - 1) {
          const newRowId = getRowId(visibleRows[rowIndex + 1].row, rowIndex + 1, rowIdAccessor);
          const newCell = {
            rowIndex: rowIndex + 1,
            colIndex,
            rowId: newRowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)) {
        event.preventDefault();
        if (colIndex > 0) {
          const newRowId = getRowId(visibleRows[rowIndex].row, rowIndex, rowIdAccessor);
          const newCell = {
            rowIndex,
            colIndex: colIndex - 1,
            rowId: newRowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        if (colIndex < leafHeaders.length - 1) {
          const newRowId = getRowId(visibleRows[rowIndex].row, rowIndex, rowIdAccessor);
          const newCell = {
            rowIndex,
            colIndex: colIndex + 1,
            rowId: newRowId,
          };
          selectSingleCell(newCell);
        }
      } else if (event.key === "Escape") {
        // Clear all selections
        setSelectedCells(new Set());
        setSelectedColumns(new Set());
        setLastSelectedColumnIndex(null);
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
    leafHeaders.length,
    initialFocusedCell,
    rowIdAccessor,
    selectCellRange,
    selectSingleCell,
    selectableCells,
    visibleRows,
  ]);

  const handleMouseDown = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    startCell.current = { rowIndex, colIndex, rowId };

    // Defer state updates to allow the current event cycle to complete
    // This prevents interference with useHandleOutsideClick
    setTimeout(() => {
      // When directly selecting cells, clear any selected columns
      setSelectedColumns(new Set());
      setLastSelectedColumnIndex(null);
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      setSelectedCells(new Set([cellId]));
      setInitialFocusedCell({ rowIndex, colIndex, rowId });
    }, 0);
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
            const rowId = getRowId(visibleRows[row].row, row, rowIdAccessor);
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
      // Check if the cell is in the selectedCells set
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      const isCellSelected = selectedCells.has(cellId);

      // Also check if the column is in the selectedColumns set
      const isColumnSelected = selectedColumns.has(colIndex);

      // Return true if either the cell or its column is selected
      return isCellSelected || isColumnSelected;
    },
    [selectedCells, selectedColumns]
  );

  const getBorderClass = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const classes = [];
      const topRowId = visibleRows[rowIndex - 1]
        ? getRowId(visibleRows[rowIndex - 1].row, rowIndex - 1, rowIdAccessor)
        : null;
      const bottomRowId = visibleRows[rowIndex + 1]
        ? getRowId(visibleRows[rowIndex + 1].row, rowIndex + 1, rowIdAccessor)
        : null;

      const topCell =
        topRowId !== null ? { colIndex, rowIndex: rowIndex - 1, rowId: topRowId } : null;
      const bottomCell =
        bottomRowId !== null ? { colIndex, rowIndex: rowIndex + 1, rowId: bottomRowId } : null;
      const leftCell = { colIndex: colIndex - 1, rowIndex, rowId };
      const rightCell = { colIndex: colIndex + 1, rowIndex, rowId };

      // Check if neighboring cells are selected
      if (!topCell || !isSelected(topCell) || (selectedColumns.has(colIndex) && rowIndex === 0))
        classes.push("st-selected-top-border");
      if (
        !bottomCell ||
        !isSelected(bottomCell) ||
        (selectedColumns.has(colIndex) && rowIndex === visibleRows.length - 1)
      )
        classes.push("st-selected-bottom-border");
      if (!isSelected(leftCell)) classes.push("st-selected-left-border");
      if (!isSelected(rightCell)) classes.push("st-selected-right-border");

      return classes.join(" ");
    },
    [isSelected, visibleRows, selectedColumns, rowIdAccessor]
  );

  const isInitialFocusedCell = useMemo(() => {
    if (!initialFocusedCell) return () => false;
    return ({ rowIndex, colIndex, rowId }: Cell) =>
      rowIndex === initialFocusedCell.rowIndex &&
      colIndex === initialFocusedCell.colIndex &&
      rowId === initialFocusedCell.rowId;
  }, [initialFocusedCell]);

  return {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isInitialFocusedCell,
    isSelected,
    lastSelectedColumnIndex,
    selectColumns,
    selectedCells,
    selectedColumns,
    setInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
  };
};

export default useSelection;
