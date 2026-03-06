import CellValue from "../../types/CellValue";
import { getCellId } from "../cellUtils";
import { getNestedValue, setNestedValue } from "../rowUtils";
import { AbsoluteBodyCell, CellData, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createEditor } from "./editing";
import { createCellContent } from "./content";

// Global map for efficient row hover tracking: rowIndex -> Set<HTMLElement>
const rowCellsMap = new Map<number, Set<HTMLElement>>();

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
export const untrackCellByRow = (rowIndex: number, cellElement: HTMLElement): void => {
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
export const calculateBodyCellClasses = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): string => {
  const { header, rowIndex, colIndex, rowId, depth, isOdd } = cell;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
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

    const pinnedLeftColumns = context.headers.filter((h) => h.pinned === "left");
    const mainColumns = context.headers.filter((h) => !h.pinned);
    const pinnedRightColumns = context.headers.filter((h) => h.pinned === "right");

    if (header.pinned === "left") {
      return pinnedLeftColumns[pinnedLeftColumns.length - 1]?.accessor === header.accessor;
    } else if (header.pinned === "right") {
      return pinnedRightColumns[pinnedRightColumns.length - 1]?.accessor === header.accessor;
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
    context.useOddColumnBackground ? (colIndex % 2 === 0 ? "even-column" : "odd-column") : "",
    isSelectionColumn ? "st-selection-cell" : "",
    hasHighlightedCellInRow ? "st-selection-has-highlighted-cell" : "",
    isLastColumnInSection ? "st-last-column" : "",
    isSubCell ? "st-sub-cell" : "",
    context.useOddEvenRowBackground ? (isOdd ? "st-cell-even-row" : "st-cell-odd-row") : "",
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

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

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
  
  // Set data attributes for selection manager to query
  cellElement.setAttribute("data-row-index", String(rowIndex));
  cellElement.setAttribute("data-col-index", String(colIndex));
  cellElement.setAttribute("data-row-id", String(rowId));

  // Apply absolute positioning like headers
  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;

  // Create content span
  const contentSpan = document.createElement("span");
  contentSpan.className = `st-cell-content ${
    header.align === "right"
      ? "right-aligned"
      : header.align === "center"
        ? "center-aligned"
        : "left-aligned"
  }`;

  // Track editing state
  let isEditing = false;

  const renderCellContent = () => {
    contentSpan.innerHTML = "";
    if (isEditing) {
      const editor = createEditor(cell, context, () => {
        isEditing = false;
        renderCellContent();
        // Re-register cell in registry after editing
        registerCellInRegistry();
      });
      if (editor) {
        // For dropdown editors, they're added to body/cell, not contentSpan
        // For inline editors, add to contentSpan
        if (editor.classList.contains("editable-cell-input")) {
          contentSpan.appendChild(editor);
        }
      }
    } else {
      createCellContent(cell, context, contentSpan);
    }
  };

  renderCellContent();
  cellElement.appendChild(contentSpan);

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
                isInitialFocused ? "st-cell-updating-first" : "st-cell-updating",
              );
              setTimeout(() => {
                cellElement.classList.remove("st-cell-updating-first", "st-cell-updating");
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
    const handleMouseDown = () => {
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
    if ((keyEvent.key === "F2" || keyEvent.key === "Enter") && header.isEditable && !isEditing) {
      keyEvent.preventDefault();
      isEditing = true;
      renderCellContent();
    }
  };

  addTrackedEventListener(cellElement, "keydown", handleKeyDown);

  // Cell click callback
  if (context.onCellClick && !isSelectionColumn) {
    const handleClick = () => {
      const currentValue = getNestedValue(row, header.accessor);
      context.onCellClick?.({
        accessor: header.accessor,
        colIndex,
        row,
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
};
