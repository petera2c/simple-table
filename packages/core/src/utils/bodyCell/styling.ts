import CellValue from "../../types/CellValue";
import type Row from "../../types/Row";
import { getCellId } from "../cellUtils";
import { getNestedValue, setNestedValue } from "../rowUtils";
import { AbsoluteBodyCell, CellData, CellRegistryEntry, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createEditor } from "./editing";
import { createCellContent } from "./content";
import { CellLiveRef, cellLiveRefMap } from "./cellLiveRef";

// Re-exported for backwards compatibility with existing import sites.
export { cellLiveRefMap };
export type { CellLiveRef };

// Global map for efficient row hover tracking: stable rowId -> Set<HTMLElement>
// (Visual rowIndex within the viewport slice can change on scroll; rowId does not.)
const rowCellsMap = new Map<string, Set<HTMLElement>>();

// Per-element registry key so we can re-key entries when a cell is reused
// for a different row across sort/scroll without leaving stale entries behind.
const cellRegistryKeyMap = new WeakMap<HTMLElement, string>();

// Memoizes the inputs that produced a cell's current content so
// `updateBodyCellElement` can skip the (potentially expensive) content rebuild
// — including re-invoking custom cellRenderers — when nothing relevant changed.
interface CellContentKey {
  row: unknown;
  value: unknown;
  theme: unknown;
  skeleton: boolean;
}
const contentKeyMap = new WeakMap<HTMLElement, CellContentKey>();

/** Drop the content memo so the next `updateBodyCellElement` rebuilds. */
export const invalidateBodyCellContentMemo = (cellElement: HTMLElement): void => {
  contentKeyMap.delete(cellElement);
};

// Track current hovered row for cleanup
let currentHoveredRowId: string | null = null;

// Helper to add cell to row tracking
const trackCellByRow = (rowId: string, cellElement: HTMLElement): void => {
  if (!rowCellsMap.has(rowId)) {
    rowCellsMap.set(rowId, new Set());
  }
  rowCellsMap.get(rowId)!.add(cellElement);
};

// Helper to remove cell from row tracking
export const untrackCellByRow = (rowId: string, cellElement: HTMLElement): void => {
  const cellSet = rowCellsMap.get(rowId);
  if (cellSet) {
    cellSet.delete(cellElement);
    if (cellSet.size === 0) {
      rowCellsMap.delete(rowId);
    }
  }
};

// Evict a cell's entry from the live-update registry when its DOM node is
// permanently removed (e.g. scrolled out of the virtualized band). Without
// this, the registry retains a closure over the detached cell element and its
// live ref, growing unbounded as the user scrolls a large dataset.
export const unregisterCellFromRegistry = (
  cellElement: HTMLElement,
  cellRegistry?: Map<string, CellRegistryEntry>,
): void => {
  const key = cellRegistryKeyMap.get(cellElement);
  if (key !== undefined) {
    cellRegistry?.delete(key);
    cellRegistryKeyMap.delete(cellElement);
  }
};

// Helper to set hover state for entire row
const setRowHoverState = (rowId: string, hovered: boolean): void => {
  const cellSet = rowCellsMap.get(rowId);
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
const calculateBodyCellClasses = (cell: AbsoluteBodyCell, context: CellRenderContext): string => {
  const { header, rowIndex, colIndex, rowId, depth, isOdd } = cell;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  const clickable =
    Boolean(header?.isEditable) || Boolean(context.onCellClick && !isSelectionColumn);

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
    // Stable, scroll-independent row position so consumers can target any row
    // (e.g. `.st-row-position-3`). Uses the absolute table position rather than
    // the virtualized slice index, which changes as rows are reused on scroll.
    `st-row-position-${cell.tableRow.position}`,
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
  cellElement.id = getCellId({
    accessor: header.accessor,
    rowId: cell.stableRowKey ?? rowId,
  });
  // The identity column (first non-selection leaf) identifies the row, so its
  // cells are row headers; all other data cells are gridcells.
  const isRowHeaderCell =
    context.rowHeaderAccessor !== undefined && header.accessor === context.rowHeaderAccessor;
  cellElement.setAttribute("role", isRowHeaderCell ? "rowheader" : "gridcell");
  cellElement.setAttribute("tabindex", isInitialFocused ? "0" : "-1");
  // ARIA: 1-based row index in the full grid (matches main: position + maxHeaderDepth + 1)
  const maxHeaderDepth = context.maxHeaderDepth ?? 1;
  cellElement.setAttribute("aria-rowindex", String(cell.tableRow.position + maxHeaderDepth + 1));
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  // Expose per-cell selection state only when row selection is enabled, so a
  // non-selectable grid doesn't imply selectability via stray aria-selected.
  if (context.enableRowSelection) {
    cellElement.setAttribute("aria-selected", context.isRowSelected?.(rowId) ? "true" : "false");
  }

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
    header.type === "boolean" || header.type === "date" || header.type === "enum";

  const renderCellContent = () => {
    // Always read the latest context from the live ref so re-renders triggered
    // by `updateData` (cell registry `updateContent`) use the current theme and
    // handlers rather than the context captured when this DOM cell was created.
    const liveContext = cellLiveRefMap.get(cellElement)?.context ?? context;
    // For dropdown editors, keep the normal cell content visible
    // For inline editors, replace the cell content
    if (isEditing && !isEditInDropdown) {
      // Tear down any renderer subtree (React portal, etc.) mounted into the
      // cell before we wipe it, so the adapter doesn't orphan it.
      liveContext.onRendererHostDiscard?.(cellElement);
      cellElement.innerHTML = "";
      // Remove tabindex from cell when editing to prevent focus conflicts
      cellElement.setAttribute("tabindex", "-1");
      const editor = createEditor(cell, liveContext, () => {
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
      const editor = createEditor(cell, liveContext, () => {
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
      liveContext.onRendererHostDiscard?.(cellElement);
      cellElement.innerHTML = "";
      const contentSpan = document.createElement("span");
      contentSpan.className = `st-cell-content ${
        header.align === "right"
          ? "right-aligned"
          : header.align === "center"
            ? "center-aligned"
            : "left-aligned"
      }`;
      createCellContent(cell, liveContext, contentSpan);
      cellElement.appendChild(contentSpan);
    }
  };

  renderCellContent();

  // Seed the content memo key so the first updateBodyCellElement can skip the
  // rebuild when the cell's inputs haven't changed since creation.
  if (!cell.header.expandable) {
    contentKeyMap.set(cellElement, {
      row: cell.row,
      value: getNestedValue(row, header.accessor),
      theme: context.theme,
      skeleton: Boolean(context.isLoading || cell.tableRow.isLoadingSkeleton),
    });
  }

  // Mutable row + tableRow ref so handlers (and the cell registry's
  // `updateContent`) always read the latest data even when this DOM cell is
  // reused across renders (sort, scroll). Set before registering so the
  // registry uses it. The chevron's click handler reads tableRow from this
  // ref via the cell DOM element so it sees the current rowId/rowIndexPath
  // after a sort instead of the stale closure values captured at create time.
  const liveRef: CellLiveRef = { row: row as Row, tableRow: cell.tableRow, context };
  cellLiveRefMap.set(cellElement, liveRef);

  // Register cell in registry for direct updates. Keyed by the row's STABLE
  // identity (`stableRowKey ?? positional rowId`) — the same identity used for
  // this cell's DOM id and for `renderedCells`. Because the stable key follows
  // the logical row across sort/filter/reorder, the registry key never changes
  // for a given DOM cell, so no re-keying is needed when rows are reordered.
  const registerCellInRegistry = () => {
    if (context.cellRegistry && !isSelectionColumn) {
      const key = getCellId({ accessor: header.accessor, rowId: cell.stableRowKey ?? rowId });
      cellRegistryKeyMap.set(cellElement, key);
      context.cellRegistry.set(key, {
        updateContent: (newValue: CellValue) => {
          if (!isEditing) {
            // Always write to the current row (DOM cell may be reused).
            setNestedValue(liveRef.row, header.accessor, newValue);

            // Re-render cell content
            renderCellContent();

            // Keep the content memo coherent so the next full render doesn't
            // treat this freshly-rendered value as stale and rebuild it again.
            if (!header.expandable) {
              const liveContext = cellLiveRefMap.get(cellElement)?.context ?? context;
              contentKeyMap.set(cellElement, {
                row: liveRef.row,
                value: getNestedValue(liveRef.row, header.accessor),
                theme: liveContext.theme,
                skeleton: Boolean(liveContext.isLoading || liveRef.tableRow.isLoadingSkeleton),
              });
            }

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
    const handleMouseDown = (event: Event) => {
      const target = event.target as HTMLElement;
      // Don't hijack presses that land on interactive content rendered inside a
      // cell (links, buttons, form controls). Calling preventDefault() here would
      // cancel their native default (e.g. an <a>'s href navigation), and starting
      // a cell selection forces a body re-render that swallows the pending click.
      if (target.closest("a, button, input, select, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      if (target.closest(".st-expand-icon-container")) return;
      const domRi = parseInt(cellElement.getAttribute("data-row-index") ?? "-1", 10);
      const domCi = parseInt(cellElement.getAttribute("data-col-index") ?? "-1", 10);
      const domRid = cellElement.getAttribute("data-row-id");
      if (domRi < 0 || domCi < 0 || domRid === null) return;
      context.handleMouseDown({ rowIndex: domRi, colIndex: domCi, rowId: domRid });
    };

    const handleMouseOver = (event: Event) => {
      const e = event as MouseEvent;
      const domRi = parseInt(cellElement.getAttribute("data-row-index") ?? "-1", 10);
      const domCi = parseInt(cellElement.getAttribute("data-col-index") ?? "-1", 10);
      const domRid = cellElement.getAttribute("data-row-id");
      const cellFromEl =
        domRi >= 0 && domCi >= 0 && domRid !== null
          ? { rowIndex: domRi, colIndex: domCi, rowId: domRid }
          : cellData;
      context.handleMouseOver(cellFromEl, e.clientX, e.clientY);
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

  // Double-click handler for editing
  const handleDoubleClick = (event: Event) => {
    if (header.isEditable && !isSelectionColumn && !isEditing) {
      isEditing = true;
      renderCellContent();
    }
  };

  addTrackedEventListener(cellElement, "dblclick", handleDoubleClick);

  // Cell click callback
  if (context.onCellClick && !isSelectionColumn) {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Don't trigger cell click if the click originated from an expand icon
      if (target.closest(".st-expand-icon-container")) {
        return;
      }

      const currentRow = cellLiveRefMap.get(cellElement)?.row ?? row;
      const currentValue = getNestedValue(currentRow, header.accessor);
      const clickRi = parseInt(cellElement.getAttribute("data-row-index") ?? String(rowIndex), 10);
      const clickCi = parseInt(cellElement.getAttribute("data-col-index") ?? String(colIndex), 10);
      context.onCellClick?.({
        accessor: header.accessor,
        colIndex: clickCi,
        row: currentRow,
        rowIndex: clickRi,
        value: currentValue,
      });
    };

    addTrackedEventListener(cellElement, "click", handleClick);
  }

  // Row hover handlers - use efficient Map-based tracking
  if (context.useHoverRowBackground) {
    const rowIdKey = String(rowId);
    // Track this cell by row id (re-keyed in updateBodyCellElement when the
    // DOM cell is reused for a different row across sort/scroll).
    trackCellByRow(rowIdKey, cellElement);

    // The handlers must read the *current* row id from the DOM so they
    // reference the correct row when this cell is reused after a sort.
    const handleMouseEnter = () => {
      const currentRowId = cellElement.getAttribute("data-row-id") ?? rowIdKey;
      if (currentHoveredRowId !== null && currentHoveredRowId !== currentRowId) {
        setRowHoverState(currentHoveredRowId, false);
      }
      setRowHoverState(currentRowId, true);
      currentHoveredRowId = currentRowId;
    };

    const handleMouseLeave = () => {
      const currentRowId = cellElement.getAttribute("data-row-id") ?? rowIdKey;
      setRowHoverState(currentRowId, false);
      if (currentHoveredRowId === currentRowId) {
        currentHoveredRowId = null;
      }
    };

    addTrackedEventListener(cellElement, "mouseenter", handleMouseEnter);
    addTrackedEventListener(cellElement, "mouseleave", handleMouseLeave);
  }

  return cellElement;
};

// Lightweight position-only update for scroll operations. Honors the
// `data-st-accordion-grow` marker so the in-flight accordion size doesn't
// snap back to the final value during scroll-RAF position updates that
// happen to fire mid-animation.
export const updateBodyCellPosition = (cellElement: HTMLElement, cell: AbsoluteBodyCell): void => {
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  const accordionGrowAxis = cellElement.dataset.stAccordionGrow;
  if (accordionGrowAxis !== "horizontal") {
    cellElement.style.width = `${cell.width}px`;
  }
  if (accordionGrowAxis !== "vertical") {
    cellElement.style.height = `${cell.height}px`;
  }
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

  // Update position (may have changed due to column resize or scroll). When
  // an accordion grow is in flight on this cell (between the initial 0-size
  // write and the 2× rAF that writes the final size), skip the size write
  // for the active axis so subsequent same-tick renders (e.g. the
  // microtask-batched onRender after a chevron toggle) don't trample the
  // inline 0 before the CSS transition can pick it up.
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  const accordionGrowAxis = cellElement.dataset.stAccordionGrow;
  if (accordionGrowAxis !== "horizontal") {
    cellElement.style.width = `${cell.width}px`;
  }
  if (accordionGrowAxis !== "vertical") {
    cellElement.style.height = `${cell.height}px`;
  }

  // Update data attributes and ARIA (matches main: position + maxHeaderDepth + 1)
  cellElement.setAttribute("data-row-index", String(rowIndex));
  cellElement.setAttribute("data-col-index", String(colIndex));
  const maxHeaderDepth = context.maxHeaderDepth ?? 1;
  cellElement.setAttribute("aria-rowindex", String(cell.tableRow.position + maxHeaderDepth + 1));
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  // Keep per-cell selection state current (selection changes re-run this path
  // via calculateBodyCellClasses → updateBodyCellElement).
  if (context.enableRowSelection) {
    cellElement.setAttribute("aria-selected", context.isRowSelected?.(rowId) ? "true" : "false");
  } else if (cellElement.hasAttribute("aria-selected")) {
    cellElement.removeAttribute("aria-selected");
  }
  // Keep the row-header role current if the identity column changed (e.g. the
  // first column was hidden/reordered).
  const desiredRole =
    context.rowHeaderAccessor !== undefined &&
    cell.header.accessor === context.rowHeaderAccessor
      ? "rowheader"
      : "gridcell";
  if (cellElement.getAttribute("role") !== desiredRole) {
    cellElement.setAttribute("role", desiredRole);
  }

  // Re-key the row hover map when this cell is reused for a different row
  // (happens after a sort because the cell DOM node now survives via
  // `stableRowKey`). Without this, hovering would highlight the wrong row.
  const previousRowId = cellElement.getAttribute("data-row-id");
  const nextRowId = String(rowId);
  if (previousRowId && previousRowId !== nextRowId) {
    untrackCellByRow(previousRowId, cellElement);
    trackCellByRow(nextRowId, cellElement);
  }
  cellElement.setAttribute("data-row-id", nextRowId);
  cellElement.setAttribute("data-accessor", String(cell.header.accessor));

  // Keep the mutable row + tableRow ref current so click handlers read fresh
  // data. The chevron handler reads tableRow.rowId / rowIndexPath / rowPath
  // from this ref so toggling expansion after a sort uses the row's CURRENT
  // positional rowId (matching what flattenRows / isRowExpanded compute) and
  // not the pre-sort rowId captured in the create-time closure.
  const existingRef = cellLiveRefMap.get(cellElement);
  if (existingRef) {
    existingRef.row = cell.row as Row;
    existingRef.tableRow = cell.tableRow;
    existingRef.context = context;
  } else {
    cellLiveRefMap.set(cellElement, { row: cell.row as Row, tableRow: cell.tableRow, context });
  }

  // No registry re-keying needed: the cell registry is keyed by the row's
  // STABLE identity (`stableRowKey ?? rowId`), which is the same identity that
  // maps this DOM cell in `renderedCells`. That identity follows the logical
  // row across sort/filter/reorder, so a reused DOM cell keeps the exact same
  // registry key and the entry stays valid without any delete/set swap.
  //
  // (Historically this re-keyed `${positionalRowId}-${accessor}` on every
  // sort, which corrupted the registry: when rows permuted, one cell's
  // `set(nextKey)` overwrote another cell's still-needed entry and a later
  // `delete(previousKey)` dropped the survivor, so `updateData` lookups for
  // the affected rows silently missed — live updates "stopped" after sorting.)

  // Update cell content (important for sorting/filtering where row data changes).
  // Skip full content replace for expandable cells so the expand icon DOM node is preserved;
  // then updateExpandIconState can toggle its class and the CSS transition will run.
  if (cell.header.expandable) {
    // Expandable cells normally keep their content DOM untouched, but the
    // loading skeleton is rendered inside the content span, so a change in
    // skeleton state still requires a rebuild: entering the loading state
    // swaps the expand icon + value for a skeleton, and leaving it restores
    // them. Without this, flipping `isLoading` to true leaves the expandable
    // column showing stale content while every other column shows a skeleton.
    const contentSpan = cellElement.querySelector(".st-cell-content") as HTMLElement;
    if (contentSpan) {
      const isSkeleton = Boolean(context.isLoading || cell.tableRow.isLoadingSkeleton);
      const hasSkeleton = contentSpan.querySelector(".st-loading-skeleton") !== null;
      if (isSkeleton !== hasSkeleton) {
        context.onRendererHostDiscard?.(contentSpan);
        contentSpan.innerHTML = "";
        createCellContent(cell, context, contentSpan);
      }
    }
  } else {
    const contentSpan = cellElement.querySelector(".st-cell-content") as HTMLElement;
    if (contentSpan) {
      // Skip the content rebuild (and re-invocation of potentially expensive
      // custom cellRenderers) when none of the inputs createCellContent depends
      // on have changed. We key on the row object reference (any immutable data
      // change yields a new reference), the resolved cell value, the active
      // theme, and the loading/skeleton state. This makes layout/dimension/
      // scroll-end driven re-renders cheap: cells that are merely repositioned
      // keep their existing DOM instead of being torn down and rebuilt.
      //
      // In-place live updates (cellRegistry.updateContent → setNestedValue) take
      // a separate render path and also change the resolved value, so they are
      // never incorrectly skipped here.
      const prevKey = contentKeyMap.get(cellElement);
      const newValue = getNestedValue(cell.row, cell.header.accessor);
      const isSkeleton = Boolean(context.isLoading || cell.tableRow.isLoadingSkeleton);
      // Also rebuild when content was emptied out-of-band:
      // - childNodes wiped (innerHTML = "") without going through this path
      // - React portal host still present but disposeHost already unmounted its
      //   subtree (common when a retained animation ghost is claimed back after
      //   onHostDiscard ran on it). contentKeyMap would otherwise still match
      //   and skip forever — blank cells that survive sort/visibility until a
      //   full DOM recreate (invalidateCache "all" / remounting resize).
      const portalHost = contentSpan.querySelector("[data-st-portal-id]") as HTMLElement | null;
      const portalDisposedEmpty =
        portalHost !== null &&
        (portalHost.textContent ?? "").trim() === "" &&
        portalHost.childNodes.length === 0;
      const contentMissing = contentSpan.childNodes.length === 0 || portalDisposedEmpty;
      const contentUnchanged =
        !contentMissing &&
        prevKey !== undefined &&
        prevKey.row === cell.row &&
        prevKey.value === newValue &&
        prevKey.theme === context.theme &&
        prevKey.skeleton === isSkeleton;

      if (!contentUnchanged) {
        contentKeyMap.set(cellElement, {
          row: cell.row,
          value: newValue,
          theme: context.theme,
          skeleton: isSkeleton,
        });
        // Discard the previous renderer subtree (React portal, etc.) before
        // replacing the content span's children.
        context.onRendererHostDiscard?.(contentSpan);
        contentSpan.innerHTML = "";
        createCellContent(cell, context, contentSpan);
      }
    }
  }
};
