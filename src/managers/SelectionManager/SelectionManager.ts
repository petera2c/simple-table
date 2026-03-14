import type Cell from "../../types/Cell";
import type HeaderObject from "../../types/HeaderObject";
import type TableRowType from "../../types/TableRow";
import { findLeafHeaders } from "../../utils/headerWidthUtils";
import { rowIdToString } from "../../utils/rowUtils";
import { scrollCellIntoView } from "../../utils/cellScrollUtils";
import {
  copySelectedCellsToClipboard,
  pasteClipboardDataToCells,
  deleteSelectedCellsContent,
} from "../../utils/cellClipboardUtils";
import { createSetString, type SelectionManagerConfig } from "./types";
import { findEdgeInDirection as findEdgeInDirectionUtil } from "./keyboardUtils";
import { computeSelectionRange } from "./selectionRangeUtils";
import {
  getCellFromMousePosition as getCellFromMousePositionUtil,
  handleAutoScroll as handleAutoScrollUtil,
  calculateNearestCell as calculateNearestCellUtil,
} from "./mouseUtils";

export type { SelectionManagerConfig } from "./types";
export { createSetString } from "./types";

export class SelectionManager {
  // Configuration
  private config: SelectionManagerConfig;

  // Internal state
  private selectedCells: Set<string> = new Set();
  private selectedColumns: Set<number> = new Set();
  private lastSelectedColumnIndex: number | null = null;
  private initialFocusedCell: Cell | null = null;
  private copyFlashCells: Set<string> = new Set();
  private warningFlashCells: Set<string> = new Set();
  private isSelecting: boolean = false;
  private startCell: Cell | null = null;

  // Event handlers that need to be cleaned up
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  // Mouse interaction state
  private currentMouseX: number | null = null;
  private currentMouseY: number | null = null;
  private scrollAnimationFrame: number | null = null;
  private lastSelectionUpdate: number = 0;
  private selectionThrottleMs: number = 16;
  private globalMouseMoveHandler: ((event: MouseEvent) => void) | null = null;
  private globalMouseUpHandler: (() => void) | null = null;

  // Cached derived state
  private columnsWithSelectedCells: Set<number> = new Set();
  private rowsWithSelectedCells: Set<string> = new Set();
  private leafHeaders: HeaderObject[] = [];

  constructor(config: SelectionManagerConfig) {
    this.config = config;
    this.updateDerivedState();
    this.setupKeyboardNavigation();
  }

  /**
   * Update configuration when props change
   */
  updateConfig(config: Partial<SelectionManagerConfig>): void {
    this.config = { ...this.config, ...config };
    this.updateDerivedState();
  }

  /**
   * Update derived state based on current selections
   */
  private updateDerivedState(): void {
    // Update leaf headers
    this.leafHeaders = this.config.headers.flatMap((header) =>
      findLeafHeaders(header, this.config.collapsedHeaders),
    );

    // Update columns with selected cells
    this.columnsWithSelectedCells = new Set<number>();
    this.selectedCells.forEach((cellId) => {
      const parts = cellId.split("-");
      if (parts.length >= 2) {
        const colIndex = parseInt(parts[1], 10);
        if (!isNaN(colIndex)) {
          this.columnsWithSelectedCells.add(colIndex);
        }
      }
    });
    this.selectedColumns.forEach((colIndex) => {
      this.columnsWithSelectedCells.add(colIndex);
    });

    // Update rows with selected cells
    this.rowsWithSelectedCells = new Set<string>();
    this.selectedCells.forEach((cellId) => {
      const parts = cellId.split("-");
      if (parts.length >= 3) {
        const rowId = parts.slice(2).join("-");
        this.rowsWithSelectedCells.add(rowId);
      }
    });
    if (this.selectedColumns.size > 0) {
      this.config.tableRows.forEach((tableRow) => {
        const rowId = rowIdToString(tableRow.rowId);
        this.rowsWithSelectedCells.add(rowId);
      });
    }
  }

  /**
   * Setup keyboard navigation event listener
   */
  private setupKeyboardNavigation(): void {
    this.keydownHandler = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.keydownHandler);
  }

  /**
   * Clean up event listeners and resources
   */
  destroy(): void {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }

    // Clean up mouse handlers if they exist
    if (this.globalMouseMoveHandler) {
      document.removeEventListener("mousemove", this.globalMouseMoveHandler);
      this.globalMouseMoveHandler = null;
    }
    if (this.globalMouseUpHandler) {
      document.removeEventListener("mouseup", this.globalMouseUpHandler);
      this.globalMouseUpHandler = null;
    }

    // Cancel any pending animation frames
    if (this.scrollAnimationFrame !== null) {
      cancelAnimationFrame(this.scrollAnimationFrame);
      this.scrollAnimationFrame = null;
    }
  }

  /**
   * Handle keyboard events for navigation and clipboard operations
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.config.selectableCells) return;
    if (!this.initialFocusedCell) return;
    if (this.selectedCells.size === 0) return;

    // Don't intercept if user is typing in a form element
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement ||
      activeElement?.getAttribute("contenteditable") === "true"
    ) {
      return;
    }

    // Copy functionality
    if ((event.ctrlKey || event.metaKey) && event.key === "c") {
      this.copyToClipboard();
      return;
    }

    // Paste functionality
    if ((event.ctrlKey || event.metaKey) && event.key === "v") {
      event.preventDefault();
      this.pasteFromClipboard();
      return;
    }

    // Select All functionality
    if ((event.ctrlKey || event.metaKey) && event.key === "a") {
      event.preventDefault();
      this.selectAll();
      return;
    }

    // Delete functionality
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      this.deleteSelectedCells();
      return;
    }

    // Escape to clear selection
    if (event.key === "Escape") {
      this.clearSelection();
      return;
    }

    // Arrow key navigation and other keys handled in separate methods
    this.handleNavigationKeys(event);
  }

  /**
   * Handle navigation keys (arrows, home, end, page up/down)
   */
  private handleNavigationKeys(event: KeyboardEvent): void {
    if (!this.initialFocusedCell) return;

    let { rowIndex, colIndex, rowId } = this.initialFocusedCell;

    // Check if the visible rows have changed
    const currentRow = this.config.tableRows[rowIndex];
    const currentRowId = currentRow ? rowIdToString(currentRow.rowId) : null;
    if (currentRowId !== rowId) {
      const currentRowIndex = this.config.tableRows.findIndex(
        (visibleRow) => rowIdToString(visibleRow.rowId) === rowId,
      );
      if (currentRowIndex !== -1) {
        rowIndex = currentRowIndex;
      } else return;
    }

    // Handle keyboard navigation
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.handleArrowUp(event, rowIndex, colIndex);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.handleArrowDown(event, rowIndex, colIndex);
    } else if (
      event.key === "ArrowLeft" ||
      (event.key === "Tab" && event.shiftKey)
    ) {
      event.preventDefault();
      this.handleArrowLeft(event, rowIndex, colIndex);
    } else if (event.key === "ArrowRight" || event.key === "Tab") {
      event.preventDefault();
      this.handleArrowRight(event, rowIndex, colIndex);
    } else if (event.key === "Home") {
      event.preventDefault();
      this.handleHome(event, rowIndex, colIndex);
    } else if (event.key === "End") {
      event.preventDefault();
      this.handleEnd(event, rowIndex, colIndex);
    } else if (event.key === "PageUp") {
      event.preventDefault();
      this.handlePageUp(event, rowIndex, colIndex);
    } else if (event.key === "PageDown") {
      event.preventDefault();
      this.handlePageDown(event, rowIndex, colIndex);
    }
  }

  /**
   * Helper function to find the edge of data in a direction
   */
  private findEdgeInDirection(
    startRow: number,
    startCol: number,
    direction: "up" | "down" | "left" | "right",
  ): { rowIndex: number; colIndex: number } {
    return findEdgeInDirectionUtil(
      this.config.tableRows.length,
      this.leafHeaders.length,
      !!this.config.enableRowSelection,
      startRow,
      startCol,
      direction,
    );
  }

  /**
   * Handle arrow up key
   */
  private handleArrowUp(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetRow = rowIndex - 1;

      if (event.ctrlKey || event.metaKey) {
        const edge = this.findEdgeInDirection(rowIndex, colIndex, "up");
        targetRow = edge.rowIndex;
      }

      if (targetRow >= 0) {
        const targetTableRow = this.config.tableRows[targetRow];
        const newRowId = rowIdToString(targetTableRow.rowId);
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        this.selectCellRange(this.startCell, endCell);
      }
    } else {
      if (rowIndex > 0) {
        let targetRow = rowIndex - 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = this.findEdgeInDirection(rowIndex, colIndex, "up");
          targetRow = edge.rowIndex;
        }

        const targetTableRow = this.config.tableRows[targetRow];
        const newRowId = rowIdToString(targetTableRow.rowId);
        const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        this.selectSingleCell(newCell);
        this.startCell = null;
      }
    }
  }

  /**
   * Handle arrow down key
   */
  private handleArrowDown(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetRow = rowIndex + 1;

      if (event.ctrlKey || event.metaKey) {
        const edge = this.findEdgeInDirection(rowIndex, colIndex, "down");
        targetRow = edge.rowIndex;
      }

      if (targetRow < this.config.tableRows.length) {
        const targetTableRow = this.config.tableRows[targetRow];
        const newRowId = rowIdToString(targetTableRow.rowId);
        const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        this.selectCellRange(this.startCell, endCell);
      }
    } else {
      if (rowIndex < this.config.tableRows.length - 1) {
        let targetRow = rowIndex + 1;

        if (event.ctrlKey || event.metaKey) {
          const edge = this.findEdgeInDirection(rowIndex, colIndex, "down");
          targetRow = edge.rowIndex;
        }

        const targetTableRow = this.config.tableRows[targetRow];
        const newRowId = rowIdToString(targetTableRow.rowId);
        const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
        this.selectSingleCell(newCell);
        this.startCell = null;
      }
    }
  }

  /**
   * Handle arrow left key
   */
  private handleArrowLeft(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    if (event.shiftKey && event.key === "ArrowLeft") {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetCol = colIndex - 1;

      if (event.ctrlKey || event.metaKey) {
        const edge = this.findEdgeInDirection(rowIndex, colIndex, "left");
        targetCol = edge.colIndex;
      } else {
        if (this.config.enableRowSelection && targetCol === 0) {
          return;
        }
      }

      if (targetCol >= 0) {
        const currentTableRow = this.config.tableRows[rowIndex];
        const newRowId = rowIdToString(currentTableRow.rowId);
        const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
        this.selectCellRange(this.startCell, endCell);
      }
    } else {
      if (colIndex > 0) {
        let targetCol = colIndex - 1;

        if ((event.ctrlKey || event.metaKey) && event.key === "ArrowLeft") {
          const edge = this.findEdgeInDirection(rowIndex, colIndex, "left");
          targetCol = edge.colIndex;
        } else {
          if (this.config.enableRowSelection && targetCol === 0) {
            return;
          }
        }

        if (targetCol >= 0) {
          const currentTableRow = this.config.tableRows[rowIndex];
          const newRowId = rowIdToString(currentTableRow.rowId);
          const newCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          this.selectSingleCell(newCell);
          this.startCell = null;
        }
      }
    }
  }

  /**
   * Handle arrow right key
   */
  private handleArrowRight(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    const maxColIndex = this.config.enableRowSelection
      ? this.leafHeaders.length
      : this.leafHeaders.length - 1;

    if (event.shiftKey && event.key === "ArrowRight") {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetCol = colIndex + 1;

      if (event.ctrlKey || event.metaKey) {
        const edge = this.findEdgeInDirection(rowIndex, colIndex, "right");
        targetCol = edge.colIndex;
      }

      if (targetCol <= maxColIndex) {
        const currentTableRow = this.config.tableRows[rowIndex];
        const newRowId = rowIdToString(currentTableRow.rowId);
        const endCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
        this.selectCellRange(this.startCell, endCell);
      }
    } else {
      if (colIndex < maxColIndex) {
        let targetCol = colIndex + 1;

        if ((event.ctrlKey || event.metaKey) && event.key === "ArrowRight") {
          const edge = this.findEdgeInDirection(rowIndex, colIndex, "right");
          targetCol = edge.colIndex;
        }

        if (targetCol <= maxColIndex) {
          const currentTableRow = this.config.tableRows[rowIndex];
          const newRowId = rowIdToString(currentTableRow.rowId);
          const newCell = { rowIndex, colIndex: targetCol, rowId: newRowId };
          this.selectSingleCell(newCell);
          this.startCell = null;
        }
      }
    }
  }

  /**
   * Handle home key
   */
  private handleHome(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetRow = rowIndex;
      const targetCol = this.config.enableRowSelection ? 1 : 0;

      if (event.ctrlKey || event.metaKey) {
        targetRow = 0;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const endCell = {
        rowIndex: targetRow,
        colIndex: targetCol,
        rowId: newRowId,
      };
      this.selectCellRange(this.startCell, endCell);
    } else {
      let targetRow = rowIndex;
      const targetCol = this.config.enableRowSelection ? 1 : 0;

      if (event.ctrlKey || event.metaKey) {
        targetRow = 0;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const newCell = {
        rowIndex: targetRow,
        colIndex: targetCol,
        rowId: newRowId,
      };
      this.selectSingleCell(newCell);
      this.startCell = null;
    }
  }

  /**
   * Handle end key
   */
  private handleEnd(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      let targetRow = rowIndex;
      const targetCol = this.config.enableRowSelection
        ? this.leafHeaders.length
        : this.leafHeaders.length - 1;

      if (event.ctrlKey || event.metaKey) {
        targetRow = this.config.tableRows.length - 1;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const endCell = {
        rowIndex: targetRow,
        colIndex: targetCol,
        rowId: newRowId,
      };
      this.selectCellRange(this.startCell, endCell);
    } else {
      let targetRow = rowIndex;
      const targetCol = this.config.enableRowSelection
        ? this.leafHeaders.length
        : this.leafHeaders.length - 1;

      if (event.ctrlKey || event.metaKey) {
        targetRow = this.config.tableRows.length - 1;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const newCell = {
        rowIndex: targetRow,
        colIndex: targetCol,
        rowId: newRowId,
      };
      this.selectSingleCell(newCell);
      this.startCell = null;
    }
  }

  /**
   * Handle page up key
   */
  private handlePageUp(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    const pageSize = 10;
    let targetRow = Math.max(0, rowIndex - pageSize);

    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
      this.selectCellRange(this.startCell, endCell);
    } else {
      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
      this.selectSingleCell(newCell);
      this.startCell = null;
    }
  }

  /**
   * Handle page down key
   */
  private handlePageDown(
    event: KeyboardEvent,
    rowIndex: number,
    colIndex: number,
  ): void {
    const pageSize = 10;
    let targetRow = Math.min(
      this.config.tableRows.length - 1,
      rowIndex + pageSize,
    );

    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = this.initialFocusedCell!;
      }

      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const endCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
      this.selectCellRange(this.startCell, endCell);
    } else {
      const targetTableRow = this.config.tableRows[targetRow];
      const newRowId = rowIdToString(targetTableRow.rowId);
      const newCell = { rowIndex: targetRow, colIndex, rowId: newRowId };
      this.selectSingleCell(newCell);
      this.startCell = null;
    }
  }

  /**
   * Copy selected cells to clipboard
   */
  private copyToClipboard(): void {
    if (this.selectedCells.size === 0) return;

    const text = copySelectedCellsToClipboard(
      this.selectedCells,
      this.leafHeaders,
      this.config.tableRows,
      this.config.copyHeadersToClipboard,
    );
    navigator.clipboard.writeText(text);

    // Trigger copy flash effect
    this.copyFlashCells = new Set(this.selectedCells);
    this.updateCellFlashClasses();
    setTimeout(() => {
      this.copyFlashCells = new Set();
      this.updateCellFlashClasses();
    }, 800);
  }

  /**
   * Paste from clipboard to cells
   */
  private async pasteFromClipboard(): Promise<void> {
    if (!this.initialFocusedCell) return;

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) return;

      const { updatedCells, warningCells } = pasteClipboardDataToCells(
        clipboardText,
        this.initialFocusedCell,
        this.leafHeaders,
        this.config.tableRows,
        this.config.onCellEdit,
        this.config.cellRegistry,
      );

      if (updatedCells.size > 0) {
        this.copyFlashCells = updatedCells;
        this.updateCellFlashClasses();
        setTimeout(() => {
          this.copyFlashCells = new Set();
          this.updateCellFlashClasses();
        }, 800);
      }

      if (warningCells.size > 0) {
        this.warningFlashCells = warningCells;
        this.updateCellFlashClasses();
        setTimeout(() => {
          this.warningFlashCells = new Set();
          this.updateCellFlashClasses();
        }, 800);
      }
    } catch (error) {
      console.warn("Failed to paste from clipboard:", error);
    }
  }

  /**
   * Delete content from selected cells
   */
  private deleteSelectedCells(): void {
    if (this.selectedCells.size === 0) return;

    const { deletedCells, warningCells } = deleteSelectedCellsContent(
      this.selectedCells,
      this.leafHeaders,
      this.config.tableRows,
      this.config.onCellEdit,
      this.config.cellRegistry,
    );

    if (deletedCells.size > 0) {
      this.copyFlashCells = deletedCells;
      this.updateCellFlashClasses();
      setTimeout(() => {
        this.copyFlashCells = new Set();
        this.updateCellFlashClasses();
      }, 800);
    }

    if (warningCells.size > 0) {
      this.warningFlashCells = warningCells;
      this.updateCellFlashClasses();
      setTimeout(() => {
        this.warningFlashCells = new Set();
        this.updateCellFlashClasses();
      }, 800);
    }
  }

  /**
   * Select all cells in the table
   */
  private selectAll(): void {
    const newSelectedCells = new Set<string>();
    for (let row = 0; row < this.config.tableRows.length; row++) {
      for (let col = 0; col < this.leafHeaders.length; col++) {
        const colIndex = this.config.enableRowSelection ? col + 1 : col;
        const tableRow = this.config.tableRows[row];
        const rowId = rowIdToString(tableRow.rowId);
        newSelectedCells.add(`${row}-${colIndex}-${rowId}`);
      }
    }
    this.selectedCells = newSelectedCells;
    this.selectedColumns = new Set();
    this.lastSelectedColumnIndex = null;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this.selectedCells = new Set();
    this.selectedColumns = new Set();
    this.lastSelectedColumnIndex = null;
    this.startCell = null;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Set selected cells (for external control)
   */
  setSelectedCells(cells: Set<string>): void {
    this.selectedCells = cells;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Set selected columns (for external control)
   */
  setSelectedColumns(columns: Set<number>): void {
    this.selectedColumns = columns;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Update flash classes on cells (copy/warning animations)
   */
  private updateCellFlashClasses(): void {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const allCells = document.querySelectorAll(
        ".st-cell[data-row-index][data-col-index][data-row-id]",
      );

      allCells.forEach((cellElement) => {
        if (!(cellElement instanceof HTMLElement)) return;

        const rowIndex = parseInt(
          cellElement.getAttribute("data-row-index") || "-1",
          10,
        );
        const colIndex = parseInt(
          cellElement.getAttribute("data-col-index") || "-1",
          10,
        );
        const rowId = cellElement.getAttribute("data-row-id");

        if (rowIndex < 0 || colIndex < 0 || !rowId) return;

        const cellId = createSetString({ rowIndex, colIndex, rowId });
        const isInitialFocused = this.isInitialFocusedCell({
          rowIndex,
          colIndex,
          rowId,
        });

        // Update copy flash classes
        if (this.copyFlashCells.has(cellId)) {
          cellElement.classList.add(
            isInitialFocused
              ? "st-cell-copy-flash-first"
              : "st-cell-copy-flash",
          );
        } else {
          cellElement.classList.remove(
            "st-cell-copy-flash-first",
            "st-cell-copy-flash",
          );
        }

        // Update warning flash classes
        if (this.warningFlashCells.has(cellId)) {
          cellElement.classList.add(
            isInitialFocused
              ? "st-cell-warning-flash-first"
              : "st-cell-warning-flash",
          );
        } else {
          cellElement.classList.remove(
            "st-cell-warning-flash-first",
            "st-cell-warning-flash",
          );
        }
      });
    });
  }

  /**
   * Apply selection classes to all currently rendered cells. Used after drag ends
   * so that the DOM (which may have been replaced during scroll) reflects selection.
   */
  private syncAllCellClasses(): void {
    const root = this.config.tableRoot ?? document;
    const allCells = root.querySelectorAll(
      ".st-cell[data-row-index][data-col-index][data-row-id]",
    );
    allCells.forEach((cellElement) => {
      if (!(cellElement instanceof HTMLElement)) return;

      const rowIndex = parseInt(
        cellElement.getAttribute("data-row-index") || "-1",
        10,
      );
      const colIndex = parseInt(
        cellElement.getAttribute("data-col-index") || "-1",
        10,
      );
      const rowId = cellElement.getAttribute("data-row-id");

      if (rowIndex < 0 || colIndex < 0 || !rowId) return;

      const cell: Cell = { rowIndex, colIndex, rowId };
      const isSelected = this.isSelected(cell);
      const isColumnSelected = this.selectedColumns.has(colIndex);
      const isIndividuallySelected = isSelected && !isColumnSelected;
      const isInitialFocused = this.isInitialFocusedCell(cell);
      const borderClass = this.getBorderClass(cell);

      cellElement.classList.remove(
        "st-cell-selected",
        "st-cell-selected-first",
        "st-cell-column-selected",
        "st-cell-column-selected-first",
        "st-selected-top-border",
        "st-selected-bottom-border",
        "st-selected-left-border",
        "st-selected-right-border",
      );

      if (isIndividuallySelected) {
        if (isInitialFocused) {
          cellElement.classList.add("st-cell-selected-first");
        } else {
          cellElement.classList.add("st-cell-selected");
        }
        const borderClasses = borderClass.split(" ").filter(Boolean);
        borderClasses.forEach((cls) => cellElement.classList.add(cls));
      }
      if (isColumnSelected) {
        if (isInitialFocused) {
          cellElement.classList.add("st-cell-column-selected-first");
        } else {
          cellElement.classList.add("st-cell-column-selected");
        }
      }
      cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");
      if (isInitialFocused && document.activeElement !== cellElement) {
        const activeElement = document.activeElement;
        const isActiveInsideCell =
          activeElement && cellElement.contains(activeElement);
        if (!isActiveInsideCell) {
          cellElement.focus();
        }
      }
    });
  }

  /**
   * Update all cell classes based on current selection state
   * Directly manipulates the DOM without triggering React re-renders.
   * When isSelecting (drag), run synchronously so classes are applied before
   * any scroll-triggered render replaces the DOM in the next frame.
   */
  private updateAllCellClasses(): void {
    if (this.isSelecting) {
      this.syncAllCellClasses();
    } else {
      requestAnimationFrame(() => this.syncAllCellClasses());
    }
  }

  /**
   * Check if a cell is selected
   */
  isSelected({ colIndex, rowIndex, rowId }: Cell): boolean {
    const cellId = createSetString({ colIndex, rowIndex, rowId });
    if (this.selectedCells.has(cellId)) return true;
    const rowIdStr = String(rowId);
    // selectedCells keys use table row index; resolve it from rowId so we match after scroll/re-render.
    const tableRowIndex = this.config.tableRows.findIndex(
      (r) => rowIdToString(r.rowId) === rowIdStr,
    );
    if (
      tableRowIndex >= 0 &&
      this.selectedCells.has(
        createSetString({
          rowIndex: tableRowIndex,
          colIndex,
          rowId: rowIdStr,
        }),
      )
    ) {
      return true;
    }
    // Fallback: match by rowId and colIndex by parsing keys (rowIndex-colIndex-rowId).
    for (const key of Array.from(this.selectedCells)) {
      const parts = key.split("-");
      if (parts.length < 3) continue;
      if (Number(parts[1]) === colIndex && parts.slice(2).join("-") === rowIdStr) return true;
    }
    return this.selectedColumns.has(colIndex);
  }

  /**
   * Get border class for a cell based on its selection state
   */
  getBorderClass({ colIndex, rowIndex, rowId }: Cell): string {
    if (this.isSelecting) {
      return "";
    }

    const rowIdStr = String(rowId);
    const tableRowIndex = this.config.tableRows.findIndex(
      (r) => rowIdToString(r.rowId) === rowIdStr,
    );
    const tableIndex = tableRowIndex >= 0 ? tableRowIndex : rowIndex;

    const classes: string[] = [];
    const topRow = this.config.tableRows[tableIndex - 1];
    const topRowId = topRow ? rowIdToString(topRow.rowId) : null;
    const bottomRow = this.config.tableRows[tableIndex + 1];
    const bottomRowId = bottomRow ? rowIdToString(bottomRow.rowId) : null;

    const topCell =
      topRowId !== null
        ? { colIndex, rowIndex: tableIndex - 1, rowId: topRowId }
        : null;
    const bottomCell =
      bottomRowId !== null
        ? { colIndex, rowIndex: tableIndex + 1, rowId: bottomRowId }
        : null;
    const leftCell = { colIndex: colIndex - 1, rowIndex: tableIndex, rowId };
    const rightCell = { colIndex: colIndex + 1, rowIndex: tableIndex, rowId };

    if (
      !topCell ||
      !this.isSelected(topCell) ||
      (this.selectedColumns.has(colIndex) && tableIndex === 0)
    )
      classes.push("st-selected-top-border");
    if (
      !bottomCell ||
      !this.isSelected(bottomCell) ||
      (this.selectedColumns.has(colIndex) &&
        tableIndex === this.config.tableRows.length - 1)
    )
      classes.push("st-selected-bottom-border");
    if (!this.isSelected(leftCell)) classes.push("st-selected-left-border");
    if (!this.isSelected(rightCell)) classes.push("st-selected-right-border");

    return classes.join(" ");
  }

  /**
   * Check if a cell is the initial focused cell
   */
  isInitialFocusedCell({ rowIndex, colIndex, rowId }: Cell): boolean {
    if (!this.initialFocusedCell) return false;
    return (
      rowIndex === this.initialFocusedCell.rowIndex &&
      colIndex === this.initialFocusedCell.colIndex &&
      rowId === this.initialFocusedCell.rowId
    );
  }

  /**
   * Check if a cell is currently showing copy flash animation
   */
  isCopyFlashing({ colIndex, rowIndex, rowId }: Cell): boolean {
    const cellId = createSetString({ colIndex, rowIndex, rowId });
    return this.copyFlashCells.has(cellId);
  }

  /**
   * Check if a cell is currently showing warning flash animation
   */
  isWarningFlashing({ colIndex, rowIndex, rowId }: Cell): boolean {
    const cellId = createSetString({ colIndex, rowIndex, rowId });
    return this.warningFlashCells.has(cellId);
  }

  /**
   * Get columns that have selected cells
   */
  getColumnsWithSelectedCells(): Set<number> {
    return this.columnsWithSelectedCells;
  }

  /**
   * Get rows that have selected cells
   */
  getRowsWithSelectedCells(): Set<string> {
    return this.rowsWithSelectedCells;
  }

  /**
   * Get selected cells
   */
  getSelectedCells(): Set<string> {
    return this.selectedCells;
  }

  /**
   * Get selected columns
   */
  getSelectedColumns(): Set<number> {
    return this.selectedColumns;
  }

  /**
   * Get last selected column index
   */
  getLastSelectedColumnIndex(): number | null {
    return this.lastSelectedColumnIndex;
  }

  /**
   * Get start cell for range selection
   */
  getStartCell(): Cell | null {
    return this.startCell;
  }

  /**
   * Set the initial focused cell (e.g. when clearing selection from header drag).
   */
  setInitialFocusedCell(cell: Cell | null): void {
    this.initialFocusedCell = cell;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Select a single cell
   */
  selectSingleCell(cell: Cell): void {
    const maxColIndex = this.config.enableRowSelection
      ? this.leafHeaders.length
      : this.leafHeaders.length - 1;

    if (
      cell.rowIndex >= 0 &&
      cell.rowIndex < this.config.tableRows.length &&
      cell.colIndex >= 0 &&
      cell.colIndex <= maxColIndex
    ) {
      const cellId = createSetString(cell);

      this.selectedColumns = new Set();
      this.lastSelectedColumnIndex = null;
      this.selectedCells = new Set([cellId]);
      this.initialFocusedCell = cell;

      this.updateDerivedState();
      this.updateAllCellClasses();

      // Scroll the cell into view
      setTimeout(
        () =>
          scrollCellIntoView(
            cell,
            this.config.rowHeight,
            this.config.customTheme,
          ),
        0,
      );
    }
  }

  /**
   * Select a range of cells from startCell to endCell
   */
  selectCellRange(startCell: Cell, endCell: Cell): void {
    const newSelectedCells = computeSelectionRange(
      startCell,
      endCell,
      this.config.tableRows,
      !!this.config.enableRowSelection,
    );

    this.selectedColumns = new Set();
    this.lastSelectedColumnIndex = null;
    this.selectedCells = newSelectedCells;
    this.initialFocusedCell = endCell;

    this.updateDerivedState();
    this.updateAllCellClasses();

    // Scroll the end cell into view
    setTimeout(
      () =>
        scrollCellIntoView(
          endCell,
          this.config.rowHeight,
          this.config.customTheme,
        ),
      0,
    );
  }

  /**
   * Select one or more columns
   */
  selectColumns(columnIndices: number[], isShiftKey = false): void {
    this.selectedCells = new Set();
    this.initialFocusedCell = null;

    const newSelection = new Set(isShiftKey ? this.selectedColumns : []);
    columnIndices.forEach((idx) => newSelection.add(idx));
    this.selectedColumns = newSelection;

    if (columnIndices.length > 0) {
      this.lastSelectedColumnIndex = columnIndices[columnIndices.length - 1];
    }

    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Update selection range during mouse drag
   */
  private updateSelectionRange(startCell: Cell, endCell: Cell): void {
    const newSelectedCells = computeSelectionRange(
      startCell,
      endCell,
      this.config.tableRows,
      !!this.config.enableRowSelection,
    );
    this.selectedCells = newSelectedCells;
    this.updateDerivedState();
    this.updateAllCellClasses();
  }

  /**
   * Calculate the nearest cell to a given mouse position
   */
  private calculateNearestCell(clientX: number, clientY: number): Cell | null {
    return calculateNearestCellUtil(clientX, clientY);
  }

  /**
   * Get cell from mouse position
   */
  private getCellFromMousePosition(
    clientX: number,
    clientY: number,
  ): Cell | null {
    return getCellFromMousePositionUtil(clientX, clientY);
  }

  /**
   * Handle auto-scrolling when dragging near edges
   */
  private handleAutoScroll(clientX: number, clientY: number): void {
    handleAutoScrollUtil(clientX, clientY);
  }

  /**
   * Continuous scroll loop during mouse drag
   */
  private continuousScroll(): void {
    if (!this.isSelecting || !this.startCell) {
      if (this.scrollAnimationFrame !== null) {
        cancelAnimationFrame(this.scrollAnimationFrame);
        this.scrollAnimationFrame = null;
      }
      return;
    }

    // Only process if mouse position has been captured
    if (this.currentMouseX !== null && this.currentMouseY !== null) {
      this.handleAutoScroll(this.currentMouseX, this.currentMouseY);

      const now = Date.now();
      if (now - this.lastSelectionUpdate >= this.selectionThrottleMs) {
        const cellAtPosition = this.getCellFromMousePosition(
          this.currentMouseX,
          this.currentMouseY,
        );
        if (cellAtPosition) {
          this.updateSelectionRange(this.startCell, cellAtPosition);
          this.lastSelectionUpdate = now;
        }
      }
    }

    this.scrollAnimationFrame = requestAnimationFrame(() =>
      this.continuousScroll(),
    );
  }

  /**
   * Handle mouse down on a cell to start selection
   */
  handleMouseDown({ colIndex, rowIndex, rowId }: Cell): void {
    if (!this.config.selectableCells) return;

    this.isSelecting = true;
    this.startCell = { rowIndex, colIndex, rowId };

    setTimeout(() => {
      this.selectedColumns = new Set();
      this.lastSelectedColumnIndex = null;
      const cellId = createSetString({ colIndex, rowIndex, rowId });
      this.selectedCells = new Set([cellId]);
      this.initialFocusedCell = { rowIndex, colIndex, rowId };
      this.updateDerivedState();
      this.updateAllCellClasses();
    }, 0);

    this.currentMouseX = null;
    this.currentMouseY = null;
    this.lastSelectionUpdate = 0;

    this.globalMouseMoveHandler = (event: MouseEvent) => {
      if (!this.isSelecting || !this.startCell) return;
      this.currentMouseX = event.clientX;
      this.currentMouseY = event.clientY;
    };

    this.globalMouseUpHandler = () => {
      this.isSelecting = false;

      if (this.scrollAnimationFrame !== null) {
        cancelAnimationFrame(this.scrollAnimationFrame);
        this.scrollAnimationFrame = null;
      }

      if (this.globalMouseMoveHandler) {
        document.removeEventListener("mousemove", this.globalMouseMoveHandler);
        this.globalMouseMoveHandler = null;
      }
      if (this.globalMouseUpHandler) {
        document.removeEventListener("mouseup", this.globalMouseUpHandler);
        this.globalMouseUpHandler = null;
      }

      // Re-render table so body DOM is rebuilt; then apply selection classes to the new DOM
      // in the same tick (so test/UI see them without waiting for rAF).
      this.config.onSelectionDragEnd?.();
      this.syncAllCellClasses();
      requestAnimationFrame(() => this.syncAllCellClasses());
    };

    document.addEventListener("mousemove", this.globalMouseMoveHandler);
    document.addEventListener("mouseup", this.globalMouseUpHandler);

    this.scrollAnimationFrame = requestAnimationFrame(() =>
      this.continuousScroll(),
    );
  }

  /**
   * Handle mouse over a cell during selection drag
   */
  handleMouseOver({ colIndex, rowIndex, rowId }: Cell): void {
    if (!this.config.selectableCells) return;
    if (this.isSelecting && this.startCell) {
      this.updateSelectionRange(this.startCell, { colIndex, rowIndex, rowId });
    }
  }
}
