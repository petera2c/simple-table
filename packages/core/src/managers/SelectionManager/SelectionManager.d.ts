import type Cell from "../../types/Cell";
import { type SelectionManagerConfig } from "./types";
export type { SelectionManagerConfig } from "./types";
export { createSetString } from "./types";
export declare class SelectionManager {
    private config;
    private selectedCells;
    private selectedColumns;
    private lastSelectedColumnIndex;
    private initialFocusedCell;
    private copyFlashCells;
    private warningFlashCells;
    private isSelecting;
    private startCell;
    private keydownHandler;
    private currentMouseX;
    private currentMouseY;
    private scrollAnimationFrame;
    private lastSelectionUpdate;
    private selectionThrottleMs;
    private globalMouseMoveHandler;
    private globalMouseUpHandler;
    private columnsWithSelectedCells;
    private rowsWithSelectedCells;
    private leafHeaders;
    /** rowId -> table row index; avoids O(tableRows) findIndex per cell in getBorderClass */
    private rowIdToTableIndex;
    /** Set of "rowId\tcolIndex" for O(1) selected membership in syncAllCellClasses */
    private selectedByRowIdColIndex;
    /** When true, all cells are selected without storing R×C cell IDs (fast path for Cmd+A). */
    private fullTableSelected;
    constructor(config: SelectionManagerConfig);
    /**
     * Update configuration when props change.
     * When options.positionOnlyBody is true (e.g. scroll-only render), only updates rowIdToTableIndex and
     * selectedByRowIdColIndex so lookups work for new cells; skips columnsWithSelectedCells/rowsWithSelectedCells.
     */
    updateConfig(config: Partial<SelectionManagerConfig>, options?: {
        positionOnlyBody?: boolean;
    }): void;
    /**
     * Update derived state based on current selections.
     * When fullTableSelected, derives columns/rows from table shape (O(R+C)) instead of iterating selectedCells (O(R×C)).
     * Otherwise, single pass over selectedCells to build selectedByRowIdColIndex, columnsWithSelectedCells, rowsWithSelectedCells.
     */
    private updateDerivedState;
    /**
     * Minimal update for scroll-only renders: only rowIdToTableIndex and selectedByRowIdColIndex
     * so isSelected/getBorderClass work for new cells; skips columnsWithSelectedCells and rowsWithSelectedCells.
     * When fullTableSelected, selectedByRowIdColIndex is left empty (isSelected uses the flag).
     */
    private updateRowIdAndSelectionLookupOnly;
    /**
     * Setup keyboard navigation event listener
     */
    private setupKeyboardNavigation;
    /**
     * Clean up event listeners and resources
     */
    destroy(): void;
    /**
     * Handle keyboard events for navigation and clipboard operations
     */
    private handleKeyDown;
    /**
     * Handle navigation keys (arrows, home, end, page up/down)
     */
    private handleNavigationKeys;
    /**
     * Helper function to find the edge of data in a direction
     */
    private findEdgeInDirection;
    /**
     * Handle arrow up key
     */
    private handleArrowUp;
    /**
     * Handle arrow down key
     */
    private handleArrowDown;
    /**
     * Handle arrow left key
     */
    private handleArrowLeft;
    /**
     * Handle arrow right key
     */
    private handleArrowRight;
    /**
     * Handle home key
     */
    private handleHome;
    /**
     * Handle end key
     */
    private handleEnd;
    /**
     * Handle page up key
     */
    private handlePageUp;
    /**
     * Handle page down key
     */
    private handlePageDown;
    /**
     * Copy selected cells to clipboard
     */
    private copyToClipboard;
    /**
     * Paste from clipboard to cells
     */
    private pasteFromClipboard;
    /**
     * Delete content from selected cells
     */
    private deleteSelectedCells;
    /**
     * Select all cells in the table. Uses fullTableSelected flag instead of storing R×C cell IDs for O(1) update.
     */
    private selectAll;
    /**
     * Build the full set of cell IDs when fullTableSelected. Used for copy/delete/getSelectedCells.
     */
    private buildFullTableSelectedSet;
    /**
     * Clear all selections
     */
    clearSelection(): void;
    /**
     * Set selected cells (for external control)
     */
    setSelectedCells(cells: Set<string>): void;
    /**
     * Set selected columns (for external control)
     */
    setSelectedColumns(columns: Set<number>): void;
    /**
     * Update flash classes on cells (copy/warning animations)
     */
    private updateCellFlashClasses;
    private static readonly SELECTION_CLASSES;
    private static readonly HEADER_SELECTION_CLASSES;
    /**
     * Keep column header highlight in sync with cell/column selection during drag.
     * Body cells are patched here; headers normally update only on full render.
     */
    private syncHeaderSelectionClasses;
    private clearHeaderSelectionHighlightClasses;
    /**
     * Apply selection classes to all currently rendered cells. Used after drag ends
     * so that the DOM (which may have been replaced during scroll) reflects selection.
     * Only adds/removes classes that changed to reduce DOM writes.
     * Fast path when there is no selection: one pass to clear all selection classes.
     */
    private syncAllCellClasses;
    /**
     * Update all cell classes based on current selection state
     * Directly manipulates the DOM without triggering React re-renders.
     * When isSelecting (drag) or fullTableSelected (Cmd+A), run synchronously so classes are applied
     * before any scroll-triggered render or next frame.
     */
    private updateAllCellClasses;
    /**
     * Check if a cell is selected. Uses selectedByRowIdColIndex for O(1) membership.
     * When fullTableSelected, returns true for any cell without lookup.
     */
    isSelected({ colIndex, rowIndex, rowId }: Cell): boolean;
    /**
     * Get border class for a cell based on its selection state. Uses rowIdToTableIndex for O(1) lookups.
     * When fullTableSelected, short-circuits with border classes for the full grid (no neighbor lookups).
     */
    getBorderClass({ colIndex, rowIndex, rowId }: Cell): string;
    /**
     * Check if a cell is the initial focused cell
     */
    isInitialFocusedCell({ rowIndex, colIndex, rowId }: Cell): boolean;
    /**
     * Check if a cell is currently showing copy flash animation
     */
    isCopyFlashing({ colIndex, rowIndex, rowId }: Cell): boolean;
    /**
     * Check if a cell is currently showing warning flash animation
     */
    isWarningFlashing({ colIndex, rowIndex, rowId }: Cell): boolean;
    /**
     * Get columns that have selected cells
     */
    getColumnsWithSelectedCells(): Set<number>;
    /**
     * Get rows that have selected cells
     */
    getRowsWithSelectedCells(): Set<string>;
    /**
     * Get selected cells. When fullTableSelected, builds and returns the full set on demand.
     */
    getSelectedCells(): Set<string>;
    /**
     * Get selected columns
     */
    getSelectedColumns(): Set<number>;
    /**
     * Get last selected column index
     */
    getLastSelectedColumnIndex(): number | null;
    /**
     * Get start cell for range selection
     */
    getStartCell(): Cell | null;
    /**
     * Set the initial focused cell (e.g. when clearing selection from header drag).
     */
    setInitialFocusedCell(cell: Cell | null): void;
    /**
     * Select a single cell
     */
    selectSingleCell(cell: Cell): void;
    /**
     * Select a range of cells from startCell to endCell
     */
    selectCellRange(startCell: Cell, endCell: Cell): void;
    /**
     * Select one or more columns
     */
    selectColumns(columnIndices: number[], isShiftKey?: boolean): void;
    /**
     * Update selection range during mouse drag. Skips derived state and class sync when selection unchanged.
     */
    private updateSelectionRange;
    /**
     * Get cell from mouse position
     */
    private getCellFromMousePosition;
    /**
     * Handle auto-scrolling when dragging near edges
     */
    private handleAutoScroll;
    /**
     * Continuous scroll loop during mouse drag
     */
    private continuousScroll;
    /**
     * Handle mouse down on a cell to start selection
     */
    handleMouseDown({ colIndex, rowIndex, rowId }: Cell): void;
    /**
     * Handle mouse over a cell during selection drag.
     * Uses the pointer position to resolve the cell under the cursor (same as continuousScroll)
     * so virtualization/recycled DOM does not apply stale cellData from the firing element.
     */
    handleMouseOver(cellFromElement: Cell, clientX: number, clientY: number): void;
}
