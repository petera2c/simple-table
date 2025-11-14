import { useState, useRef, useCallback, useMemo } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import type TableRowType from "../types/TableRow";
import Cell from "../types/Cell";
import { findLeafHeaders } from "../utils/headerWidthUtils";
import { getRowId } from "../utils/rowUtils";
import { scrollCellIntoView } from "../utils/cellScrollUtils";
import {
  copySelectedCellsToClipboard,
  pasteClipboardDataToCells,
  deleteSelectedCellsContent,
} from "../utils/cellClipboardUtils";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

export const createSetString = ({ rowIndex, colIndex, rowId }: Cell) =>
  `${rowIndex}-${colIndex}-${rowId}`;

interface UseSelectionProps {
  selectableCells: boolean;
  headers: HeaderObject[];
  tableRows: TableRowType[];
  rowIdAccessor: Accessor;
  onCellEdit?: (props: any) => void;
  cellRegistry?: Map<string, any>;
  collapsedHeaders?: Set<Accessor>;
  rowHeight: number;
  enableRowSelection?: boolean;
}

const useSelection = ({
  selectableCells,
  headers,
  tableRows,
  rowIdAccessor,
  onCellEdit,
  cellRegistry,
  collapsedHeaders,
  rowHeight,
  enableRowSelection = false,
}: UseSelectionProps) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());
  const [lastSelectedColumnIndex, setLastSelectedColumnIndex] = useState<number | null>(null);
  const [initialFocusedCell, setInitialFocusedCell] = useState<Cell | null>(null);
  const [copyFlashCells, setCopyFlashCells] = useState<Set<string>>(new Set());
  const [warningFlashCells, setWarningFlashCells] = useState<Set<string>>(new Set());
  const [isSelectingState, setIsSelectingState] = useState(false);
  const isSelecting = useRef(false);
  const startCell = useRef<Cell | null>(null);

  // Derived state for efficient lookups
  const columnsWithSelectedCells = useMemo(() => {
    const columns = new Set<number>();

    selectedCells.forEach((cellId) => {
      const parts = cellId.split("-");
      if (parts.length >= 2) {
        const colIndex = parseInt(parts[1], 10);
        if (!isNaN(colIndex)) {
          columns.add(colIndex);
        }
      }
    });

    selectedColumns.forEach((colIndex) => {
      columns.add(colIndex);
    });

    return columns;
  }, [selectedCells, selectedColumns]);

  const rowsWithSelectedCells = useMemo(() => {
    const rows = new Set<string>();

    selectedCells.forEach((cellId) => {
      const parts = cellId.split("-");
      if (parts.length >= 3) {
        const rowId = parts.slice(2).join("-");
        rows.add(rowId);
      }
    });

    if (selectedColumns.size > 0) {
      tableRows.forEach((tableRow) => {
        const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
        rows.add(String(rowId));
      });
    }

    return rows;
  }, [selectedCells, selectedColumns, tableRows, rowIdAccessor]);

  // Get flattened leaf headers
  const leafHeaders = useMemo(() => {
    return headers.flatMap((header) => findLeafHeaders(header, collapsedHeaders));
  }, [headers, collapsedHeaders]);

  // Clipboard operations
  const copyToClipboard = useCallback(() => {
    if (selectedCells.size === 0) return;

    const text = copySelectedCellsToClipboard(selectedCells, leafHeaders, tableRows);
    navigator.clipboard.writeText(text);

    // Trigger copy flash effect
    setCopyFlashCells(new Set(selectedCells));
    setTimeout(() => setCopyFlashCells(new Set()), 800);
  }, [selectedCells, leafHeaders, tableRows]);

  const pasteFromClipboard = useCallback(async () => {
    if (!initialFocusedCell) return;

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) return;

      const { updatedCells, warningCells } = pasteClipboardDataToCells(
        clipboardText,
        initialFocusedCell,
        leafHeaders,
        tableRows,
        rowIdAccessor,
        onCellEdit,
        cellRegistry
      );

      if (updatedCells.size > 0) {
        setCopyFlashCells(updatedCells);
        setTimeout(() => setCopyFlashCells(new Set()), 800);
      }

      if (warningCells.size > 0) {
        setWarningFlashCells(warningCells);
        setTimeout(() => setWarningFlashCells(new Set()), 800);
      }
    } catch (error) {
      console.warn("Failed to paste from clipboard:", error);
    }
  }, [initialFocusedCell, leafHeaders, tableRows, rowIdAccessor, onCellEdit, cellRegistry]);

  const deleteSelectedCells = useCallback(() => {
    if (selectedCells.size === 0) return;

    const { deletedCells, warningCells } = deleteSelectedCellsContent(
      selectedCells,
      leafHeaders,
      tableRows,
      rowIdAccessor,
      onCellEdit,
      cellRegistry
    );

    if (deletedCells.size > 0) {
      setCopyFlashCells(deletedCells);
      setTimeout(() => setCopyFlashCells(new Set()), 800);
    }

    if (warningCells.size > 0) {
      setWarningFlashCells(warningCells);
      setTimeout(() => setWarningFlashCells(new Set()), 800);
    }
  }, [selectedCells, leafHeaders, tableRows, rowIdAccessor, onCellEdit, cellRegistry]);

  // Selection operations
  const selectCellRange = useCallback(
    (startCell: Cell, endCell: Cell) => {
      const newSelectedCells = new Set<string>();
      const minRow = Math.min(startCell.rowIndex, endCell.rowIndex);
      const maxRow = Math.max(startCell.rowIndex, endCell.rowIndex);
      const minCol = Math.min(startCell.colIndex, endCell.colIndex);
      const maxCol = Math.max(startCell.colIndex, endCell.colIndex);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          if (row >= 0 && row < tableRows.length) {
            // Skip selection column (always at index 0 when enabled)
            if (enableRowSelection && col === 0) {
              continue;
            }
            const rowId = getRowId({ row: tableRows[row].row, rowIdAccessor });
            newSelectedCells.add(createSetString({ colIndex: col, rowIndex: row, rowId }));
          }
        }
      }

      setSelectedColumns(new Set());
      setLastSelectedColumnIndex(null);
      setSelectedCells(newSelectedCells);
      setInitialFocusedCell(endCell);

      // Scroll the end cell into view
      setTimeout(() => scrollCellIntoView(endCell, rowHeight), 0);
    },
    [tableRows, rowIdAccessor, rowHeight, enableRowSelection]
  );

  const selectSingleCell = useCallback(
    (cell: Cell) => {
      // Maximum valid colIndex: if selection enabled, it's leafHeaders.length, otherwise leafHeaders.length - 1
      const maxColIndex = enableRowSelection ? leafHeaders.length : leafHeaders.length - 1;

      if (
        cell.rowIndex >= 0 &&
        cell.rowIndex < tableRows.length &&
        cell.colIndex >= 0 &&
        cell.colIndex <= maxColIndex
      ) {
        const cellId = createSetString(cell);

        setSelectedColumns(new Set());
        setLastSelectedColumnIndex(null);
        setSelectedCells(new Set([cellId]));
        setInitialFocusedCell(cell);

        // Scroll the cell into view
        setTimeout(() => scrollCellIntoView(cell, rowHeight), 0);
      }
    },
    [leafHeaders.length, tableRows.length, rowHeight, enableRowSelection]
  );

  const selectColumns = useCallback((columnIndices: number[], isShiftKey = false) => {
    setSelectedCells(new Set());
    setInitialFocusedCell(null);

    setSelectedColumns((prev) => {
      const newSelection = new Set(isShiftKey ? prev : []);
      columnIndices.forEach((idx) => newSelection.add(idx));
      return newSelection;
    });

    if (columnIndices.length > 0) {
      setLastSelectedColumnIndex(columnIndices[columnIndices.length - 1]);
    }
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
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
  });

  // Mouse selection helpers
  const updateSelectionRange = useCallback(
    (startCell: Cell, endCell: Cell) => {
      const newSelectedCells = new Set<string>();

      const rowIdToIndexMap = new Map<string, number>();
      tableRows.forEach((tableRow, index) => {
        const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
        rowIdToIndexMap.set(String(rowId), index);
      });

      const startRowCurrentIndex = rowIdToIndexMap.get(String(startCell.rowId));
      const endRowCurrentIndex = rowIdToIndexMap.get(String(endCell.rowId));

      const startRow =
        startRowCurrentIndex !== undefined ? startRowCurrentIndex : startCell.rowIndex;
      const endRow = endRowCurrentIndex !== undefined ? endRowCurrentIndex : endCell.rowIndex;

      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCell.colIndex, endCell.colIndex);
      const maxCol = Math.max(startCell.colIndex, endCell.colIndex);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          if (row >= 0 && row < tableRows.length) {
            // Skip selection column (always at index 0 when enabled)
            if (enableRowSelection && col === 0) {
              continue;
            }
            const rowId = getRowId({ row: tableRows[row].row, rowIdAccessor });
            newSelectedCells.add(createSetString({ colIndex: col, rowIndex: row, rowId }));
          }
        }
      }

      setSelectedCells(newSelectedCells);
    },
    [tableRows, rowIdAccessor, enableRowSelection]
  );

  const calculateNearestCell = useCallback((clientX: number, clientY: number): Cell | null => {
    const tableContainer = document.querySelector(".st-body-container");
    if (!tableContainer) return null;

    const rect = tableContainer.getBoundingClientRect();
    const cells = Array.from(
      document.querySelectorAll(".st-cell[data-row-index][data-col-index]:not(.st-selection-cell)")
    );

    if (cells.length === 0) return null;

    const clampedX = Math.max(rect.left, Math.min(rect.right, clientX));
    const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));

    let closestCell: HTMLElement | null = null;
    let minDistance = Infinity;

    cells.forEach((cell) => {
      if (!(cell instanceof HTMLElement)) return;
      const htmlCell = cell as HTMLElement;

      const cellRect = htmlCell.getBoundingClientRect();
      const cellCenterX = cellRect.left + cellRect.width / 2;
      const cellCenterY = cellRect.top + cellRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(cellCenterX - clampedX, 2) + Math.pow(cellCenterY - clampedY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestCell = htmlCell;
      }
    });

    if (closestCell !== null) {
      const cellElement: HTMLElement = closestCell;
      const rowIndex = parseInt(cellElement.getAttribute("data-row-index") || "-1", 10);
      const colIndex = parseInt(cellElement.getAttribute("data-col-index") || "-1", 10);
      const rowId = cellElement.getAttribute("data-row-id");

      if (rowIndex >= 0 && colIndex >= 0 && rowId !== null) {
        return { rowIndex, colIndex, rowId };
      }
    }

    return null;
  }, []);

  const getCellFromMousePosition = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const element = document.elementFromPoint(clientX, clientY);
      if (!element) return null;

      const cellElement = element.closest(".st-cell");

      if (cellElement instanceof HTMLElement) {
        const rowIndex = parseInt(cellElement.getAttribute("data-row-index") || "-1", 10);
        const colIndex = parseInt(cellElement.getAttribute("data-col-index") || "-1", 10);
        const rowId = cellElement.getAttribute("data-row-id");

        if (rowIndex >= 0 && colIndex >= 0 && rowId !== null) {
          return { rowIndex, colIndex, rowId };
        }
      }

      return calculateNearestCell(clientX, clientY);
    },
    [calculateNearestCell]
  );

  const handleAutoScroll = useCallback((clientX: number, clientY: number) => {
    const tableContainer = document.querySelector(".st-body-container");
    if (!tableContainer) return;

    const rect = tableContainer.getBoundingClientRect();
    const scrollMargin = 50;
    const scrollSpeed = 10;

    if (clientY < rect.top + scrollMargin) {
      const distance = Math.max(0, rect.top - clientY);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      tableContainer.scrollTop -= scrollSpeed * speedMultiplier;
    } else if (clientY > rect.bottom - scrollMargin) {
      const distance = Math.max(0, clientY - rect.bottom);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      tableContainer.scrollTop += scrollSpeed * speedMultiplier;
    }

    const mainBody = document.querySelector(".st-body-main");
    if (mainBody) {
      if (clientX < rect.left + scrollMargin) {
        const distance = Math.max(0, rect.left - clientX);
        const speedMultiplier = Math.min(3, 1 + distance / 100);
        mainBody.scrollLeft -= scrollSpeed * speedMultiplier;
      } else if (clientX > rect.right - scrollMargin) {
        const distance = Math.max(0, clientX - rect.right);
        const speedMultiplier = Math.min(3, 1 + distance / 100);
        mainBody.scrollLeft += scrollSpeed * speedMultiplier;
      }
    }
  }, []);

  const handleMouseDown = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    isSelecting.current = true;
    setIsSelectingState(true);
    startCell.current = { rowIndex, colIndex, rowId };

    setTimeout(() => {
      setSelectedColumns(new Set());
      setLastSelectedColumnIndex(null);
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      setSelectedCells(new Set([cellId]));
      setInitialFocusedCell({ rowIndex, colIndex, rowId });
    }, 0);

    let currentMouseX: number | null = null;
    let currentMouseY: number | null = null;
    let scrollAnimationFrame: number | null = null;
    let lastSelectionUpdate = 0;
    const selectionThrottleMs = 16;

    const continuousScroll = () => {
      if (!isSelecting.current || !startCell.current) {
        if (scrollAnimationFrame !== null) {
          cancelAnimationFrame(scrollAnimationFrame);
          scrollAnimationFrame = null;
        }
        return;
      }

      // Only process if mouse position has been captured
      if (currentMouseX !== null && currentMouseY !== null) {
        handleAutoScroll(currentMouseX, currentMouseY);

        const now = Date.now();
        if (now - lastSelectionUpdate >= selectionThrottleMs) {
          const cellAtPosition = getCellFromMousePosition(currentMouseX, currentMouseY);
          if (cellAtPosition) {
            updateSelectionRange(startCell.current, cellAtPosition);
          }
          lastSelectionUpdate = now;
        }
      }

      scrollAnimationFrame = requestAnimationFrame(continuousScroll);
    };

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isSelecting.current || !startCell.current) return;

      currentMouseX = event.clientX;
      currentMouseY = event.clientY;
    };

    const handleGlobalMouseUp = () => {
      isSelecting.current = false;
      setIsSelectingState(false);

      if (scrollAnimationFrame !== null) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
      }

      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    scrollAnimationFrame = requestAnimationFrame(continuousScroll);
  };

  const handleMouseOver = ({ colIndex, rowIndex, rowId }: Cell) => {
    if (!selectableCells) return;
    if (isSelecting.current && startCell.current) {
      updateSelectionRange(startCell.current, { colIndex, rowIndex, rowId });
    }
  };

  const isSelected = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      const isCellSelected = selectedCells.has(cellId);
      const isColumnSelected = selectedColumns.has(colIndex);

      return isCellSelected || isColumnSelected;
    },
    [selectedCells, selectedColumns]
  );

  const getBorderClass = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      if (isSelectingState) {
        return "";
      }

      const classes = [];
      const topRowId = tableRows[rowIndex - 1]
        ? getRowId({ row: tableRows[rowIndex - 1].row, rowIdAccessor })
        : null;
      const bottomRowId = tableRows[rowIndex + 1]
        ? getRowId({ row: tableRows[rowIndex + 1].row, rowIdAccessor })
        : null;

      const topCell =
        topRowId !== null ? { colIndex, rowIndex: rowIndex - 1, rowId: topRowId } : null;
      const bottomCell =
        bottomRowId !== null ? { colIndex, rowIndex: rowIndex + 1, rowId: bottomRowId } : null;
      const leftCell = { colIndex: colIndex - 1, rowIndex, rowId };
      const rightCell = { colIndex: colIndex + 1, rowIndex, rowId };

      if (!topCell || !isSelected(topCell) || (selectedColumns.has(colIndex) && rowIndex === 0))
        classes.push("st-selected-top-border");
      if (
        !bottomCell ||
        !isSelected(bottomCell) ||
        (selectedColumns.has(colIndex) && rowIndex === tableRows.length - 1)
      )
        classes.push("st-selected-bottom-border");
      if (!isSelected(leftCell)) classes.push("st-selected-left-border");
      if (!isSelected(rightCell)) classes.push("st-selected-right-border");

      return classes.join(" ");
    },
    [isSelectingState, isSelected, tableRows, selectedColumns, rowIdAccessor]
  );

  const isInitialFocusedCell = useMemo(() => {
    if (!initialFocusedCell) return () => false;
    return ({ rowIndex, colIndex, rowId }: Cell) =>
      rowIndex === initialFocusedCell.rowIndex &&
      colIndex === initialFocusedCell.colIndex &&
      rowId === initialFocusedCell.rowId;
  }, [initialFocusedCell]);

  const isCopyFlashing = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      return copyFlashCells.has(cellId);
    },
    [copyFlashCells]
  );

  const isWarningFlashing = useCallback(
    ({ colIndex, rowIndex, rowId }: Cell) => {
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      return warningFlashCells.has(cellId);
    },
    [warningFlashCells]
  );

  return {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    isCopyFlashing,
    isWarningFlashing,
    isInitialFocusedCell,
    isSelected,
    lastSelectedColumnIndex,
    pasteFromClipboard,
    selectColumns,
    selectedCells,
    selectedColumns,
    setInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
    deleteSelectedCells,
    columnsWithSelectedCells,
    rowsWithSelectedCells,
  };
};

export default useSelection;
