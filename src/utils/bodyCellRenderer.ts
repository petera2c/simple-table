import { Dispatch, SetStateAction } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import CellValue from "../types/CellValue";
import { IconsConfig } from "../types/IconsConfig";
import { getCellId } from "./cellUtils";
import { formatDate } from "./formatters";
import {
  getNestedValue,
  setNestedValue,
  hasNestedRows,
  isRowExpanded as getIsRowExpanded,
} from "./rowUtils";
import { renderLineAreaChart, renderBarChart } from "./chartRenderer";
import OnRowGroupExpandProps from "../types/OnRowGroupExpandProps";
import { calculateRowTopPosition } from "./infiniteScrollUtils";

// Types for cell data
export interface AbsoluteBodyCell {
  header: HeaderObject;
  row: any;
  rowIndex: number;
  colIndex: number;
  rowId: string;
  displayRowNumber: number;
  depth: number;
  isOdd: boolean;
  tableRow: any; // Full table row object
}

// Cell selection/interaction data
export interface CellData {
  rowIndex: number;
  colIndex: number;
  rowId: string;
}

// Cell edit params
export interface CellEditParams {
  accessor: Accessor;
  newValue: CellValue;
  row: any;
  rowIndex: number;
}

// Cell click params
export interface CellClickParams {
  accessor: Accessor;
  colIndex: number;
  row: any;
  rowIndex: number;
  value: CellValue;
}

// Cell registry entry
export interface CellRegistryEntry {
  updateContent: (newValue: CellValue) => void;
}

// Main render context
export interface CellRenderContext {
  // State management
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  expandedRows: Map<string, number>;
  expandedDepths: number[];
  selectedColumns: Set<number>;
  rowsWithSelectedCells: Set<string>;

  // Configuration
  columnBorders: boolean;
  enableRowSelection?: boolean;
  cellUpdateFlash?: boolean;
  useOddColumnBackground?: boolean;
  useHoverRowBackground?: boolean;
  useOddEvenRowBackground?: boolean;
  rowGrouping?: string[];
  headers: HeaderObject[];
  rowHeight: number;
  templateColumns: string;
  heightOffsets?: any;
  customTheme?: any;

  // Callbacks
  onCellEdit?: (params: CellEditParams) => void;
  onCellClick?: (params: CellClickParams) => void;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  handleRowSelect?: (rowId: string, checked: boolean) => void;
  handleMouseDown: (cell: CellData) => void;
  handleMouseOver: (cell: CellData) => void;

  // Refs and state setters
  cellRegistry?: Map<string, CellRegistryEntry>;
  setCollapsedRows: Dispatch<SetStateAction<Map<string, number>>>;
  setExpandedRows: Dispatch<SetStateAction<Map<string, number>>>;
  setRowStateMap: Dispatch<SetStateAction<Map<string | number, any>>>;

  // UI state
  icons: IconsConfig;
  theme: string;
  rowButtons?: any[]; // Row button components

  // Helper functions from context
  getBorderClass: (cell: CellData) => string;
  isSelected: (cell: CellData) => boolean;
  isInitialFocusedCell: (cell: CellData) => boolean;
  isCopyFlashing: (cell: CellData) => boolean;
  isWarningFlashing: (cell: CellData) => boolean;
  isRowSelected?: (rowId: string) => boolean;
  canExpandRowGroup?: (row: any) => boolean;
  isLoading?: boolean;

  // Pinned section
  pinned?: "left" | "right";
}

// Event listener tracking
interface EventListenerEntry {
  element: HTMLElement;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

let eventListeners: EventListenerEntry[] = [];

// Helper to track event listeners
const addTrackedEventListener = (
  element: HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
) => {
  element.addEventListener(event, handler, options);
  eventListeners.push({ element, event, handler, options });
};

// Cleanup all event listeners
export const cleanupBodyCellRendering = () => {
  eventListeners.forEach(({ element, event, handler, options }) => {
    element.removeEventListener(event, handler, options);
  });
  eventListeners = [];
};

// SVG icon data (same as header renderer)
const SVG_ICONS: Record<string, { path: string; viewBox: string; width?: number }> = {
  chevronRight: {
    path: "M9 18l6-6-6-6",
    viewBox: "0 0 24 24",
  },
  chevronDown: {
    path: "M6 9l6 6 6-6",
    viewBox: "0 0 24 24",
  },
};

// Create SVG icon
const createSVGIcon = (iconName: keyof typeof SVG_ICONS, className: string = ""): SVGSVGElement => {
  const iconData = SVG_ICONS[iconName];
  if (!iconData) {
    throw new Error(`Icon "${iconName}" not found`);
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", iconData.viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  if (className) {
    svg.setAttribute("class", className);
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconData.path);
  svg.appendChild(path);

  return svg;
};

// Format cell content for display
const formatCellContent = (
  content: CellValue,
  header: HeaderObject,
  colIndex: number,
  row: any,
  rowIndex: number,
): string | null => {
  // Apply valueFormatter first if it exists
  if (header.valueFormatter) {
    const formatted = header.valueFormatter({
      accessor: header.accessor,
      colIndex,
      row,
      rowIndex,
      value: content,
    });
    // If formatter returns a React element, we can't use it - return string representation
    if (typeof formatted === "object" && formatted !== null) {
      return String(content);
    }
    return String(formatted);
  }

  // Handle different types
  if (typeof content === "boolean") {
    return content ? "True" : "False";
  } else if (Array.isArray(content)) {
    if (content.length === 0) {
      return "[]";
    }
    return content
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return JSON.stringify(item);
        }
        return String(item);
      })
      .join(", ");
  } else if (
    header.type === "date" &&
    content !== null &&
    content !== undefined &&
    (typeof content === "string" ||
      typeof content === "number" ||
      (typeof content === "object" && (content as any) instanceof Date))
  ) {
    return formatDate(content);
  } else if (content === null || content === undefined) {
    return "";
  }

  return String(content);
};

// Create expand/collapse icon for row grouping
const createExpandIcon = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  isExpanded: boolean,
): HTMLElement => {
  const iconContainer = document.createElement("span");
  iconContainer.className = "st-expand-icon";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("aria-label", isExpanded ? "Collapse row" : "Expand row");
  iconContainer.setAttribute("tabindex", "0");

  const icon = createSVGIcon(isExpanded ? "chevronDown" : "chevronRight");
  iconContainer.appendChild(icon);

  const handleToggle = (event: Event) => {
    event.stopPropagation();

    const { rowId, depth } = cell;
    const rowIdStr = String(rowId);

    if (isExpanded) {
      // Collapse
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.set(rowIdStr, depth);
        return next;
      });
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowIdStr);
        return next;
      });
      // Clear row state
      context.setRowStateMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(rowId);
        return newMap;
      });
    } else {
      // Expand
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.set(rowIdStr, depth);
        return next;
      });
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowIdStr);
        return next;
      });

      // Call onRowGroupExpand callback if provided
      if (context.onRowGroupExpand && cell.tableRow.rowIndexPath && context.rowGrouping) {
        const triggerSection = cell.header.pinned;

        const setLoading = (loading: boolean) => {
          setTimeout(() => {
            context.setRowStateMap((prev) => {
              const newMap = new Map(prev);
              const currentState = newMap.get(rowId) || {};
              newMap.set(rowId, { ...currentState, loading, triggerSection });
              return newMap;
            });
          }, 0);
        };

        const setError = (error: string | null) => {
          context.setRowStateMap((prev) => {
            const newMap = new Map(prev);
            const currentState = newMap.get(rowId) || {};
            newMap.set(rowId, { ...currentState, error, loading: false, triggerSection });
            return newMap;
          });
        };

        const setEmpty = (isEmpty: boolean, message?: string) => {
          context.setRowStateMap((prev) => {
            const newMap = new Map(prev);
            const currentState = newMap.get(rowId) || {};
            newMap.set(rowId, { ...currentState, isEmpty, loading: false, triggerSection });
            return newMap;
          });
        };

        // Create a synthetic event object
        const syntheticEvent = {
          stopPropagation: () => {},
          preventDefault: () => {},
        } as any;

        context.onRowGroupExpand({
          row: cell.row,
          depth,
          event: syntheticEvent,
          groupingKey: context.rowGrouping[depth],
          isExpanded: false,
          rowIndexPath: cell.tableRow.rowIndexPath,
          rowIdPath: cell.tableRow.rowPath,
          groupingKeys: context.rowGrouping,
          setLoading,
          setError,
          setEmpty,
        });
      }
    }
  };

  addTrackedEventListener(iconContainer, "click", handleToggle);

  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      handleToggle(event);
    }
  };

  addTrackedEventListener(iconContainer, "keydown", handleKeyDown);

  return iconContainer;
};

// Create selection checkbox
const createSelectionCheckbox = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  isChecked: boolean,
): HTMLElement => {
  const checkboxContainer = document.createElement("label");
  checkboxContainer.className = "st-checkbox-container";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "st-checkbox";
  checkbox.checked = isChecked;
  checkbox.setAttribute("aria-label", `Select row ${cell.displayRowNumber + 1}`);

  const handleChange = () => {
    if (context.handleRowSelect) {
      context.handleRowSelect(String(cell.rowId), checkbox.checked);
    }
  };

  addTrackedEventListener(checkbox, "change", handleChange);

  // Prevent checkbox click from triggering cell selection
  const handleMouseDown = (event: Event) => {
    event.stopPropagation();
  };

  addTrackedEventListener(checkbox, "mousedown", handleMouseDown);

  checkboxContainer.appendChild(checkbox);

  return checkboxContainer;
};

// Create row number display
const createRowNumber = (displayRowNumber: number): HTMLElement => {
  const rowNumber = document.createElement("span");
  rowNumber.className = "st-row-number";
  rowNumber.textContent = String(displayRowNumber + 1);
  return rowNumber;
};

// Create row buttons (placeholder for now - will be enhanced)
const createRowButtons = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
): HTMLElement | null => {
  if (!context.rowButtons || context.rowButtons.length === 0) {
    return null;
  }

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "st-row-buttons";

  // For now, we'll skip rendering React components
  // This would require a React Portal or converting buttons to vanilla JS

  return buttonsContainer;
};

// Create editable input for inline editing
const createEditableInput = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  currentValue: CellValue,
  onComplete: () => void,
): HTMLElement => {
  const { header, row, rowIndex } = cell;

  const input = document.createElement("input");
  input.className = "editable-cell-input";
  input.type = "text";
  input.value = currentValue !== null && currentValue !== undefined ? String(currentValue) : "";
  input.setAttribute("autofocus", "true");

  // Focus the input
  setTimeout(() => input.focus(), 0);

  const handleBlur = () => {
    let newValue: CellValue = input.value;

    // Convert to appropriate type
    if (header.type === "number") {
      const numValue = parseFloat(input.value);
      newValue = isNaN(numValue) ? 0 : numValue;
    } else if (header.type === "boolean") {
      newValue = input.value.toLowerCase() === "true";
    }

    // Update the row data
    setNestedValue(row, header.accessor, newValue);

    // Call onCellEdit callback
    if (context.onCellEdit) {
      context.onCellEdit({
        accessor: header.accessor,
        newValue,
        row,
        rowIndex,
      });
    }

    onComplete();
  };

  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    keyEvent.stopPropagation(); // Prevent table navigation

    if (keyEvent.key === "Enter" || keyEvent.key === "Escape") {
      input.blur();
    }
  };

  const handleMouseDown = (event: Event) => {
    event.stopPropagation(); // Prevent cell deselection
  };

  addTrackedEventListener(input, "blur", handleBlur);
  addTrackedEventListener(input, "keydown", handleKeyDown);
  addTrackedEventListener(input, "mousedown", handleMouseDown);

  return input;
};

// Create cell content (main display area)
const createCellContent = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  contentSpan: HTMLElement,
): void => {
  const { header, row, rowIndex, colIndex, displayRowNumber, depth, rowId } = cell;
  const content = getNestedValue(row, header.accessor);

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  if (context.isLoading || cell.tableRow.isLoadingSkeleton) {
    // Show loading skeleton
    const skeleton = document.createElement("div");
    skeleton.className = "st-loading-skeleton";
    contentSpan.appendChild(skeleton);
    return;
  }

  if (isSelectionColumn) {
    // Selection column: checkbox/row number + row buttons
    const selectionContent = document.createElement("div");
    selectionContent.className = "st-selection-cell-content";

    const selectionControl = document.createElement("div");
    selectionControl.className = "st-selection-control";

    // For now, always show checkbox (hover state handled by CSS)
    const isChecked = context.isRowSelected ? context.isRowSelected(String(rowId)) : false;
    const checkbox = createSelectionCheckbox(cell, context, isChecked);
    selectionControl.appendChild(checkbox);

    selectionContent.appendChild(selectionControl);

    // Add row buttons if any
    const buttons = createRowButtons(cell, context);
    if (buttons) {
      selectionContent.appendChild(buttons);
    }

    contentSpan.appendChild(selectionContent);
    return;
  }

  // Check if we need to render expand icon
  const currentGroupingKey = context.rowGrouping && context.rowGrouping[depth];
  const cellHasChildren = currentGroupingKey ? hasNestedRows(row, currentGroupingKey) : false;
  const canExpandFurther = context.rowGrouping && depth < context.rowGrouping.length;
  const isRowExpandable = context.canExpandRowGroup ? context.canExpandRowGroup(row) : true;
  const hasNestedTableConfig = !!header.nestedTable;
  const shouldShowExpandIcon =
    header.expandable &&
    ((cellHasChildren && canExpandFurther && isRowExpandable) || hasNestedTableConfig);

  if (shouldShowExpandIcon) {
    const expandedDepthsSet = new Set(context.expandedDepths);
    const isExpanded = getIsRowExpanded(
      rowId,
      depth,
      expandedDepthsSet,
      context.expandedRows,
      context.collapsedRows,
    );
    const expandIcon = createExpandIcon(cell, context, isExpanded);
    contentSpan.appendChild(expandIcon);
  }

  // Handle chart rendering
  if (header.type === "lineAreaChart" && Array.isArray(content)) {
    const numericData = (content as any[]).filter(
      (item: any) => typeof item === "number",
    ) as number[];
    if (numericData.length > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 100; // Will be adjusted by chart renderer
      canvas.height = 30;
      renderLineAreaChart(canvas, numericData, header.chartOptions);
      contentSpan.appendChild(canvas);
      return;
    }
  } else if (header.type === "barChart" && Array.isArray(content)) {
    const numericData = (content as any[]).filter(
      (item: any) => typeof item === "number",
    ) as number[];
    if (numericData.length > 0) {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 30;
      renderBarChart(canvas, numericData, header.chartOptions);
      contentSpan.appendChild(canvas);
      return;
    }
  }

  // Handle custom cell renderer
  if (header.cellRenderer) {
    try {
      const rendered = header.cellRenderer({
        accessor: header.accessor,
        colIndex,
        row,
        rowIndex: cell.tableRow.absoluteRowIndex || rowIndex,
        rowPath: cell.tableRow.rowPath,
        theme: context.theme as any,
        value: content,
        formattedValue: header.valueFormatter?.({
          accessor: header.accessor,
          colIndex,
          row,
          rowIndex,
          value: content,
        }),
      });

      // If renderer returns a string, use it
      if (typeof rendered === "string") {
        const textNode = document.createTextNode(rendered);
        contentSpan.appendChild(textNode);
      } else if (rendered && typeof rendered === "object") {
        // If it returns a React element, we can't render it - show formatted content instead
        const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
        if (formatted !== null) {
          const textNode = document.createTextNode(formatted);
          contentSpan.appendChild(textNode);
        }
      }
    } catch (error) {
      console.error("Error rendering cell:", error);
      const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
      if (formatted !== null) {
        const textNode = document.createTextNode(formatted);
        contentSpan.appendChild(textNode);
      }
    }
    return;
  }

  // Default: format and display content
  const formatted = formatCellContent(content, header, colIndex, row, rowIndex);
  if (formatted !== null) {
    const textNode = document.createTextNode(formatted);
    contentSpan.appendChild(textNode);
  }
};

// Create a single body cell element
const createBodyCellElement = (cell: AbsoluteBodyCell, context: CellRenderContext): HTMLElement => {
  const { header, row, rowIndex, colIndex, rowId, displayRowNumber, depth, isOdd, tableRow } = cell;

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
  const isSubCell = false; // Will be determined by parent header logic

  // Build class names
  const classNames = [
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
  ]
    .filter(Boolean)
    .join(" ");

  // Create cell element
  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId });
  cellElement.setAttribute("role", "gridcell");
  cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");

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
      const currentValue = getNestedValue(row, header.accessor);
      const input = createEditableInput(cell, context, currentValue, () => {
        isEditing = false;
        renderCellContent();
        // Re-register cell in registry after editing
        registerCellInRegistry();
      });
      contentSpan.appendChild(input);
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

  // Event handlers
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

  return cellElement;
};

// Main render function
export const renderBodyCells = (
  container: HTMLElement,
  cells: AbsoluteBodyCell[],
  context: CellRenderContext,
): void => {
  // Clean up previous event listeners
  cleanupBodyCellRendering();

  // Remove only DOM-rendered rows (not React-rendered separators/state rows)
  // Look for rows that were created by us (they have a specific marker or we can identify them)
  const existingRows = Array.from(
    container.querySelectorAll(
      ".st-row:not(.st-state-row):not(.st-nested-grid-row):not(.st-state-row-spacer):not(.st-nested-grid-spacer)",
    ),
  );
  existingRows.forEach((row) => {
    // Only remove if it's a regular row (has cells as children)
    if (row.querySelector(".st-cell")) {
      row.remove();
    }
  });

  // Group cells by row
  const cellsByRow = new Map<string, AbsoluteBodyCell[]>();
  cells.forEach((cell) => {
    const key = `${cell.rowIndex}`;
    if (!cellsByRow.has(key)) {
      cellsByRow.set(key, []);
    }
    cellsByRow.get(key)!.push(cell);
  });

  // Render each row with its cells
  cellsByRow.forEach((rowCells, rowKey) => {
    if (rowCells.length === 0) return;

    const firstCell = rowCells[0];
    const { rowIndex, isOdd, tableRow } = firstCell;

    // Create row container
    const rowElement = document.createElement("div");
    rowElement.className = `st-row ${
      context.useOddEvenRowBackground ? (isOdd ? "even" : "odd") : ""
    } ${context.isRowSelected?.(firstCell.rowId) ? "selected" : ""}`;
    rowElement.setAttribute("data-index", String(rowIndex));
    rowElement.setAttribute("role", "row");
    rowElement.style.gridTemplateColumns = context.templateColumns;

    // Position the row using the same calculation as TableRow
    const topPosition = calculateRowTopPosition({
      position: tableRow.position,
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme,
    });
    rowElement.style.top = `${topPosition}px`;
    rowElement.style.height = `${context.rowHeight}px`;

    // Add hover handler
    const handleMouseEnter = () => {
      if (context.useHoverRowBackground) {
        // Find all rows with this index and add hovered class
        const allRowsWithIndex = container.parentElement?.querySelectorAll(
          `.st-row[data-index="${rowIndex}"]`,
        );
        allRowsWithIndex?.forEach((row) => row.classList.add("hovered"));
      }
    };

    const handleMouseLeave = () => {
      // Remove hovered class from all rows with this index
      const allRowsWithIndex = container.parentElement?.querySelectorAll(
        `.st-row[data-index="${rowIndex}"]`,
      );
      allRowsWithIndex?.forEach((row) => row.classList.remove("hovered"));
    };

    addTrackedEventListener(rowElement, "mouseenter", handleMouseEnter);
    addTrackedEventListener(rowElement, "mouseleave", handleMouseLeave);

    // Render cells in this row
    rowCells.forEach((cell) => {
      const cellElement = createBodyCellElement(cell, context);
      rowElement.appendChild(cellElement);
    });

    container.appendChild(rowElement);
  });
};
