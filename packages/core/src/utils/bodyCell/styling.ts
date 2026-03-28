import CellValue from "../../types/CellValue";
import type Row from "../../types/Row";
import { getCellId } from "../cellUtils";
import { getNestedValue, setNestedValue } from "../rowUtils";
import { AbsoluteBodyCell, CellData, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createEditor } from "./editing";
import { createCellContent } from "./content";

// Global map for efficient row hover tracking: rowIndex -> Set<HTMLElement>
const rowCellsMap = new Map<number, Set<HTMLElement>>();

// WeakMap holding a mutable row ref per cell element so click handlers always
// read the latest row data even when the cell DOM node is reused across renders.
const cellRowRefMap = new WeakMap<HTMLElement, { current: Row }>();

// Track current hovered row for cleanup
let currentHoveredRow: number | null = null;

// Helper to add cell to row tracking
const trackCellByRow = (rowIndex: number, cellElement: HTMLElement): void => {
  if (!rowCellsMap.has(rowIndex)) {
    rowCellsMap.set(rowIndex, new Set());
  }
  rowCellsMap.get(rowIndex)!.add(cellElement);
};

// Helper to remove cell from row tracking
export const untrackCellByRow = (
  rowIndex: number,
  cellElement: HTMLElement,
): void => {
  const cellSet = rowCellsMap.get(rowIndex);
  if (cellSet) {
    cellSet.delete(cellElement);
    if (cellSet.size === 0) {
      rowCellsMap.delete(rowIndex);
    }
  }
};

// Helper to set hover state for entire row
const setRowHoverState = (rowIndex: number, hovered: boolean): void => {
  const cellSet = rowCellsMap.get(rowIndex);
  if (cellSet) {
    cellSet.forEach((cell) => {
      if (hovered) {
        cell.classList.add("st-row-hovered");
      } else {
        cell.classList.remove("st-row-hovered");
      }
    });
  }
};

// Calculate cell class names based on current state
const calculateBodyCellClasses = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): string => {
  const { header, rowIndex, colIndex, rowId, depth, isOdd } = cell;

  const isSelectionColumn =
    header.isSelectionColumn && context.enableRowSelection;
  const clickable = Boolean(header?.isEditable);

  // Calculate selection states
  const cellData: CellData = { rowIndex, colIndex, rowId };
  const borderClass = context.getBorderClass(cellData);
  const isHighlighted = context.isSelected(cellData);
  const isInitialFocused = context.isInitialFocusedCell(cellData);
  const isCellCopyFlashing = context.isCopyFlashing(cellData);
  const isCellWarningFlashing = context.isWarningFlashing(cellData);

  // Check column selection
  const isColumnSelected = context.selectedColumns.has(colIndex);
  const isIndividuallySelected = isHighlighted && !isColumnSelected;

  // Check if row has selected cells
  const hasHighlightedCellInRow =
    isSelectionColumn && context.rowsWithSelectedCells.has(String(rowId));

  // Check if this is the last column in section
  const isLastColumnInSection = (() => {
    if (!context.columnBorders) return false;

    const pinnedLeftColumns = context.headers.filter(
      (h) => h.pinned === "left",
    );
    const mainColumns = context.headers.filter((h) => !h.pinned);
    const pinnedRightColumns = context.headers.filter(
      (h) => h.pinned === "right",
    );

    if (header.pinned === "left") {
      return (
        pinnedLeftColumns[pinnedLeftColumns.length - 1]?.accessor ===
        header.accessor
      );
    } else if (header.pinned === "right") {
      return (
        pinnedRightColumns[pinnedRightColumns.length - 1]?.accessor ===
        header.accessor
      );
    } else {
      return mainColumns[mainColumns.length - 1]?.accessor === header.accessor;
    }
  })();

  // Check if this is a sub-cell
  const isSubCell = false;

  // Build class names
  return [
    "st-cell",
    depth > 0 && header.expandable ? `st-cell-depth-${depth}` : "",
    isIndividuallySelected
      ? isInitialFocused
        ? `st-cell-selected-first ${borderClass}`
        : `st-cell-selected ${borderClass}`
      : "",
    isColumnSelected
      ? isInitialFocused
        ? "st-cell-column-selected-first"
        : "st-cell-column-selected"
      : "",
    clickable ? "clickable" : "",
    isCellCopyFlashing
      ? isInitialFocused
        ? "st-cell-copy-flash-first"
        : "st-cell-copy-flash"
      : "",
    isCellWarningFlashing
      ? isInitialFocused
        ? "st-cell-warning-flash-first"
        : "st-cell-warning-flash"
      : "",
    context.useOddColumnBackground
      ? colIndex % 2 === 0
        ? "even-column"
        : "odd-column"
      : "",
    isSelectionColumn ? "st-selection-cell" : "",
    hasHighlightedCellInRow ? "st-selection-has-highlighted-cell" : "",
    isLastColumnInSection ? "st-last-column" : "",
    isSubCell ? "st-sub-cell" : "",
    context.useOddEvenRowBackground
      ? isOdd
        ? "st-cell-even-row"
        : "st-cell-odd-row"
      : "",
    context.isRowSelected?.(rowId) ? "st-cell-selected-row" : "",
  ]
    .filter(Boolean)
    .join(" ");
};

// Create a single body cell element
export const createBodyCellElement = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): HTMLElement => {
  const { header, row, rowIndex, colIndex, rowId } = cell;

  const isSelectionColumn =
    header.isSelectionColumn && context.enableRowSelection;

  // Calculate cell data for state checks
  const cellData: CellData = { rowIndex, colIndex, rowId };
  const isInitialFocused = context.isInitialFocusedCell(cellData);

  // Get class names
  const classNames = calculateBodyCellClasses(cell, context);
  // Create cell element
  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId });
  cellElement.setAttribute("role", "gridcell");
  cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");
  // ARIA: 1-based row index in the full grid (matches main: position + maxHeaderDepth + 1)
  const maxHeaderDepth = context.maxHeaderDepth ?? 1;
  cellElement.setAttribute(
    "aria-rowindex",
    String(cell.tableRow.position + maxHeaderDepth + 1),
  );
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));

  // Set data attributes for selection manager to query
  cellElement.setAttribute("data-row-index", String(rowIndex));
  cellElement.setAttribute("data-col-index", String(colIndex));
  cellElement.setAttribute("data-row-id", String(rowId));
  cellElement.setAttribute("data-accessor", String(header.accessor));

  // Apply absolute positioning like headers
  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;

  // Track editing state
  let isEditing = false;

  // Determine if this column type uses dropdown editing
  const isEditInDropdown =
    header.type === "boolean" ||
    header.type === "date" ||
    header.type === "enum";

  const renderCellContent = () => {
    // For dropdown editors, keep the normal cell content visible
    // For inline editors, replace the cell content
    if (isEditing && !isEditInDropdown) {
      cellElement.innerHTML = "";
      // Remove tabindex from cell when editing to prevent focus conflicts
      cellElement.setAttribute("tabindex", "-1");
      const editor = createEditor(cell, context, () => {
        isEditing = false;
        // Restore tabindex when done editing
        cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");
        renderCellContent();
        // Re-register cell in registry after editing
        registerCellInRegistry();
      });
      if (editor) {
        // Wrap inline editor in st-cell-editing div
        const editingDiv = document.createElement("div");
        editingDiv.className = "st-cell-editing";
        editingDiv.appendChild(editor);
        cellElement.appendChild(editingDiv);
      }
    } else if (isEditing && isEditInDropdown) {
      // For dropdown editing, create the dropdown but keep normal cell content
      const editor = createEditor(cell, context, () => {
        isEditing = false;
        // Re-render to show updated value
        renderCellContent();
        registerCellInRegistry();
      });
      if (editor) {
        // Dropdown positions itself absolutely, no need to add to cell
      }
    } else {
      // Not editing - create normal content span
      cellElement.innerHTML = "";
      const contentSpan = document.createElement("span");
      contentSpan.className = `st-cell-content ${
        header.align === "right"
          ? "right-aligned"
          : header.align === "center"
            ? "center-aligned"
            : "left-aligned"
      }`;
      createCellContent(cell, context, contentSpan);
      cellElement.appendChild(contentSpan);
    }
  };

  renderCellContent();

  // Register cell in registry for direct updates
  const registerCellInRegistry = () => {
    if (context.cellRegistry && !isSelectionColumn) {
      const key = `${rowId}-${header.accessor}`;
      context.cellRegistry.set(key, {
        updateContent: (newValue: CellValue) => {
          if (!isEditing) {
            // Update the row data
            setNestedValue(row, header.accessor, newValue);

            // Re-render cell content
            renderCellContent();

            // Add update flash animation
            if (context.cellUpdateFlash) {
              cellElement.classList.add(
                isInitialFocused
                  ? "st-cell-updating-first"
                  : "st-cell-updating",
              );
              setTimeout(() => {
                cellElement.classList.remove(
                  "st-cell-updating-first",
                  "st-cell-updating",
                );
              }, 800);
            }
          }
        },
      });
    }
  };

  registerCellInRegistry();

  // Event handlers for cell selection
  if (!isEditing && !isSelectionColumn) {
    const handleMouseDown = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".st-expand-icon-container")) return;
      context.handleMouseDown(cellData);
    };

    const handleMouseOver = () => {
      context.handleMouseOver(cellData);
    };

    addTrackedEventListener(cellElement, "mousedown", handleMouseDown);
    addTrackedEventListener(cellElement, "mouseover", handleMouseOver);
  }

  // Keyboard navigation
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;

    if (isEditing || isSelectionColumn) {
      return;
    }

    // Start editing on F2 or Enter
    if (
      (keyEvent.key === "F2" || keyEvent.key === "Enter") &&
      header.isEditable &&
      !isEditing
    ) {
      keyEvent.preventDefault();
      isEditing = true;
      renderCellContent();
    }
  };

  addTrackedEventListener(cellElement, "keydown", handleKeyDown);

  // Double-click handler for editing
  const handleDoubleClick = (event: Event) => {
    if (header.isEditable && !isSelectionColumn && !isEditing) {
      isEditing = true;
      renderCellContent();
    }
  };

  addTrackedEventListener(cellElement, "dblclick", handleDoubleClick);

  // Mutable row ref so click handler always reads the latest row data
  // even when updateBodyCellElement re-uses this DOM element with new rows.
  const rowRef = { current: row as Row };
  cellRowRefMap.set(cellElement, rowRef);

  // Cell click callback
  if (context.onCellClick && !isSelectionColumn) {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Don't trigger cell click if the click originated from an expand icon
      if (target.closest(".st-expand-icon-container")) {
        return;
      }

      const currentRow = cellRowRefMap.get(cellElement)?.current ?? row;
      const currentValue = getNestedValue(currentRow, header.accessor);
      context.onCellClick?.({
        accessor: header.accessor,
        colIndex,
        row: currentRow,
        rowIndex,
        value: currentValue,
      });
    };

    addTrackedEventListener(cellElement, "click", handleClick);
  }

  // Row hover handlers - use efficient Map-based tracking
  if (context.useHoverRowBackground) {
    // Track this cell by row index
    trackCellByRow(rowIndex, cellElement);

    const handleMouseEnter = () => {
      // Clear previous hovered row if different
      if (currentHoveredRow !== null && currentHoveredRow !== rowIndex) {
        setRowHoverState(currentHoveredRow, false);
      }
      // Set hover state for current row
      setRowHoverState(rowIndex, true);
      currentHoveredRow = rowIndex;
    };

    const handleMouseLeave = () => {
      // Remove hover state
      setRowHoverState(rowIndex, false);
      if (currentHoveredRow === rowIndex) {
        currentHoveredRow = null;
      }
    };

    addTrackedEventListener(cellElement, "mouseenter", handleMouseEnter);
    addTrackedEventListener(cellElement, "mouseleave", handleMouseLeave);
  }

  return cellElement;
};

// Lightweight position-only update for scroll operations
export const updateBodyCellPosition = (
  cellElement: HTMLElement,
  cell: AbsoluteBodyCell,
): void => {
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;
};

// Update an existing body cell element with current state
export const updateBodyCellElement = (
  cellElement: HTMLElement,
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): void => {
  const { rowIndex, colIndex, rowId } = cell;
  const cellData: CellData = { rowIndex, colIndex, rowId };

  // Update classes to reflect current state
  cellElement.className = calculateBodyCellClasses(cell, context);

  // Update tabindex for focus
  const isInitialFocused = context.isInitialFocusedCell(cellData);
  cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");

  // Update position (may have changed due to column resize or scroll)
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;

  // Update data attributes and ARIA (matches main: position + maxHeaderDepth + 1)
  cellElement.setAttribute("data-row-index", String(rowIndex));
  cellElement.setAttribute("data-col-index", String(colIndex));
  const maxHeaderDepth = context.maxHeaderDepth ?? 1;
  cellElement.setAttribute(
    "aria-rowindex",
    String(cell.tableRow.position + maxHeaderDepth + 1),
  );
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  cellElement.setAttribute("data-row-id", String(rowId));
  cellElement.setAttribute("data-accessor", String(cell.header.accessor));

  // Keep the mutable row ref current so click handlers read fresh data.
  const existingRowRef = cellRowRefMap.get(cellElement);
  if (existingRowRef) {
    existingRowRef.current = cell.row as Row;
  }

  // Update cell content (important for sorting/filtering where row data changes).
  // Skip full content replace for expandable cells so the expand icon DOM node is preserved;
  // then updateExpandIconState can toggle its class and the CSS transition will run.
  if (!cell.header.expandable) {
    const contentSpan = cellElement.querySelector(
      ".st-cell-content",
    ) as HTMLElement;
    if (contentSpan) {
      contentSpan.innerHTML = "";
      createCellContent(cell, context, contentSpan);
    }
  }
};
