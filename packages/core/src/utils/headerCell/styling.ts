import { getCellId } from "../cellUtils";
import { getHeaderLeafIndices, getHeaderDescriptionId, getHeaderDescription } from "../headerUtils";
import { DEFAULT_SHOW_WHEN } from "../../types/HeaderObject";
import { AbsoluteCell, HeaderRenderContext } from "./types";
import { createSortIcon } from "./sorting";
import { createFilterIcon } from "./filtering";
import { createCollapseIcon } from "./collapsing";
import { getHeaderColspan, hasCollapsibleChildren } from "../collapseUtils";
import { createResizeHandle } from "./resizing";
import { createLabelContent, createEditableInput } from "./editing";
import {
  handleColumnHeaderClick,
  handleColumnHeaderDoubleClick,
  attachDragHandlers,
} from "./dragging";
import { addTrackedEventListener, removeFloatingHeaderTooltips } from "./eventTracking";

// Calculate header cell class names based on current state
export const calculateHeaderCellClasses = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
): string => {
  const { header, colIndex, parentHeader } = cell;
  const {
    collapsedHeaders,
    columnBorders,
    columnReordering,
    enableHeaderEditing,
    selectedColumns,
    columnsWithSelectedCells,
    draggedHeaderRef,
    hoveredHeaderRef,
  } = context;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  const clickable = Boolean(header?.isSortable);
  const isCollapsed = collapsedHeaders.has(header.accessor);

  const hasVisibleChildren = (() => {
    if (!header.children || header.children.length === 0) return false;

    if (isCollapsed) {
      return header.children.some((child) => {
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        return showWhen === "parentCollapsed" || showWhen === "always";
      });
    }

    return true;
  })();

  const isSubHeader = parentHeader?.singleRowChildren;
  const shouldApplyParentClass = hasVisibleChildren && !header.singleRowChildren;

  const isLastColumnInSection = (() => {
    if (!columnBorders) return false;

    if (!header.children || header.children.length === 0) {
      return colIndex === context.lastHeaderIndex;
    } else {
      const leafIndices = getHeaderLeafIndices(header, colIndex);
      return leafIndices.includes(context.lastHeaderIndex);
    }
  })();

  const isHeaderSelected = (() => {
    if (!context.selectableColumns || isSelectionColumn) return false;

    const columnsToSelect = getHeaderLeafIndices(header, colIndex);
    return columnsToSelect.some((columnIndex) => selectedColumns.has(columnIndex));
  })();

  const hasHighlightedCell = (() => {
    if (isSelectionColumn) return false;

    const columnsToCheck = getHeaderLeafIndices(header, colIndex);
    return columnsToCheck.some((columnIndex) => columnsWithSelectedCells.has(columnIndex));
  })();

  return [
    "st-header-cell",
    header.accessor === hoveredHeaderRef.current?.accessor ? "st-hovered" : "",
    draggedHeaderRef.current?.accessor === header.accessor ? "st-dragging" : "",
    clickable ? "clickable" : "",
    columnReordering && !clickable ? "columnReordering" : "",
    shouldApplyParentClass ? "parent" : "",
    isSubHeader ? "st-sub-header" : "",
    isLastColumnInSection ? "st-last-column" : "",
    enableHeaderEditing && !isSelectionColumn ? "st-header-editable" : "",
    isHeaderSelected ? "st-header-selected" : "",
    hasHighlightedCell && !isHeaderSelected ? "st-header-has-highlighted-cell" : "",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Renders a custom header's `headerRenderer` output into the `.st-header-label`
 * element, passing freshly built sort/filter/collapse icons as `components`.
 *
 * Shared by initial creation ({@link createHeaderCellElement}) and in-place icon
 * refresh ({@link refreshHeaderCellIcons}). The refresh path is what makes
 * `components.sortIcon` appear (and stay current) when sorting toggles after the
 * cell already exists: the sort icon only exists for the active sort column, so a
 * custom header must be re-rendered with the new icon instead of being skipped.
 */
const renderHeaderRendererContent = (
  labelElement: HTMLElement,
  header: AbsoluteCell["header"],
  colIndex: number,
  context: HeaderRenderContext,
  icons: {
    sortIcon: HTMLElement | null;
    filterIcon: HTMLElement | null;
    collapseIcon: HTMLElement | null;
  },
): void => {
  const labelContent = createLabelContent(header, context);

  // Discard the previous renderer subtree (React portal, etc.) before replacing
  // the label's children. Without this, in-place icon refresh on sort/filter
  // orphans the prior portal host — floating UI portaled to document.body
  // (tooltips/popovers) stays mounted under a detached anchor.
  context.onRendererHostDiscard?.(labelElement);
  removeFloatingHeaderTooltips(labelElement);
  labelElement.innerHTML = "";

  const renderedContent = header.headerRenderer!({
    accessor: header.accessor,
    colIndex,
    header,
    components: {
      sortIcon: icons.sortIcon || undefined,
      filterIcon: icons.filterIcon || undefined,
      collapseIcon: icons.collapseIcon || undefined,
      labelContent,
    },
  });

  // The headerRenderer should return a DOM element (HTMLElement). The React
  // adapter wraps React-based headerRenderers to convert them to DOM elements.
  if (renderedContent instanceof HTMLElement) {
    labelElement.appendChild(renderedContent);
  } else {
    // Fallback to default rendering if not a DOM element.
    labelElement.appendChild(labelContent);
  }
};

export const createHeaderCellElement = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
): HTMLElement => {
  const { header, colIndex } = cell;
  const { reverse } = context;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  // Get class names
  const classNames = calculateHeaderCellClasses(cell, context);

  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId: "header" });
  cellElement.setAttribute("data-accessor", String(header.accessor));
  cellElement.setAttribute("role", "columnheader");
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  // Grouped/nested header cells span their visible leaf columns; expose that
  // span so the column hierarchy isn't flattened for AT.
  if (header.children && header.children.length > 0) {
    const colspan = getHeaderColspan(header, context.headers, context.collapsedHeaders);
    cellElement.setAttribute("aria-colspan", String(colspan));
  }
  // A collapsible column header is itself the expand/collapse control's owner,
  // so expose its expanded state on the columnheader (not only on the icon).
  if (hasCollapsibleChildren(header)) {
    const collapsedSet = context.getCollapsedHeaders?.() ?? context.collapsedHeaders;
    cellElement.setAttribute("aria-expanded", String(!collapsedSet.has(header.accessor)));
  }

  if (header.isSortable) {
    if (context.sort?.key.accessor === header.accessor) {
      cellElement.setAttribute(
        "aria-sort",
        context.sort.direction === "asc" ? "ascending" : "descending",
      );
    } else {
      cellElement.setAttribute("aria-sort", "none");
    }
  }

  const headerDescription = getHeaderDescription(header, Boolean(header.filterable));
  if (headerDescription) {
    const descriptionId = getHeaderDescriptionId(header.accessor);
    cellElement.setAttribute("aria-describedby", descriptionId);

    const descriptionSpan = document.createElement("span");
    descriptionSpan.id = descriptionId;
    descriptionSpan.className = "st-sr-only";
    descriptionSpan.textContent = headerDescription;
    cellElement.appendChild(descriptionSpan);
  }

  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;

  const sortIcon = createSortIcon(header, context);
  const filterIcon = createFilterIcon(header, context);
  const collapseIcon = createCollapseIcon(header, context);

  // Right-pinned columns resize from their leading (left) edge so the handle
  // sits between the main section and the pinned strip. `reverse` (RTL) flips
  // the visual direction, so XOR it with the pinned-right flag.
  const placeResizeHandleAtStart = reverse !== (context.pinned === "right");

  if (placeResizeHandleAtStart) {
    const resizeHandle = createResizeHandle(header, context);
    if (resizeHandle) {
      cellElement.appendChild(resizeHandle);
    }
  }

  if (!header.headerRenderer && header.align === "right") {
    if (collapseIcon) cellElement.appendChild(collapseIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (sortIcon) cellElement.appendChild(sortIcon);
  }

  const labelElement = document.createElement("div");
  labelElement.className = "st-header-label";

  if (header.headerRenderer) {
    renderHeaderRendererContent(labelElement, header, colIndex, context, {
      sortIcon,
      filterIcon,
      collapseIcon,
    });
  } else {
    const labelContent = createLabelContent(header, context);
    labelElement.appendChild(labelContent);
  }

  const handleClick = (event: MouseEvent) => {
    if (!isSelectionColumn) {
      handleColumnHeaderClick(event, header, colIndex, context);
    }
  };

  addTrackedEventListener(labelElement, "click", handleClick as EventListener);

  const handleDoubleClick = (event: MouseEvent) => {
    if (!isSelectionColumn) {
      handleColumnHeaderDoubleClick(event, header, context);
    }
  };

  addTrackedEventListener(labelElement, "dblclick", handleDoubleClick as EventListener);

  attachDragHandlers(labelElement, cellElement, header, context);

  cellElement.appendChild(labelElement);

  if (!header.headerRenderer && header.align !== "right") {
    if (collapseIcon) cellElement.appendChild(collapseIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (sortIcon) cellElement.appendChild(sortIcon);
  }

  if (!placeResizeHandleAtStart) {
    const resizeHandle = createResizeHandle(header, context);
    if (resizeHandle) {
      cellElement.appendChild(resizeHandle);
    }
  }

  if (context.headerRegistry && !header.isSelectionColumn) {
    const key = String(header.accessor);
    context.headerRegistry.set(key, {
      setEditing: (editing: boolean) => {
        if (editing) {
          const labelTextSpan = labelElement.querySelector(".st-header-label-text") as HTMLElement;
          if (labelTextSpan) {
            labelTextSpan.innerHTML = "";
            const input = createEditableInput(header, context, labelTextSpan);
            labelTextSpan.appendChild(input);
          }
        }
      },
    });
  }

  return cellElement;
};

export const getLastHeaderIndex = (absoluteCells: AbsoluteCell[]): number => {
  if (absoluteCells.length === 0) return -1;
  // With grouped headers, the last array entry is often a parent cell whose colIndex is the
  // group's start, not the rightmost leaf — use the maximum leaf index present.
  return Math.max(...absoluteCells.map((c) => c.colIndex));
};

/** Replace sort/filter/collapse icons on an existing header cell, preserving label/drag handlers. */
export const refreshHeaderCellIcons = (
  cellElement: HTMLElement,
  header: AbsoluteCell["header"],
  context: HeaderRenderContext,
  colIndex: number,
): void => {
  const sortIcon = createSortIcon(header, context);
  const filterIcon = createFilterIcon(header, context);
  const collapseIcon = createCollapseIcon(header, context);

  // Custom headers own where the icons live (inside their own markup), so we
  // can't surgically swap individual icon nodes. Re-run the renderer with the
  // freshly built icons and replace the label content. Without this, a custom
  // header's `components.sortIcon` never appears when the sort toggles after the
  // cell was first created (the sort icon only exists for the active column).
  if (header.headerRenderer) {
    const labelElement = cellElement.querySelector(".st-header-label") as HTMLElement | null;
    if (labelElement) {
      renderHeaderRendererContent(labelElement, header, colIndex, context, {
        sortIcon,
        filterIcon,
        collapseIcon,
      });
    }
    return;
  }

  const oldSortIcon = cellElement.querySelector('.st-icon-container[aria-label*="Sort"]');
  const oldFilterIcon = cellElement.querySelector('.st-icon-container[aria-label*="Filter"]');
  const oldCollapseIcon = cellElement.querySelector(".st-expand-icon-container");

  oldSortIcon?.remove();
  oldFilterIcon?.remove();
  oldCollapseIcon?.remove();

  if (header.align === "right") {
    if (collapseIcon) cellElement.insertBefore(collapseIcon, cellElement.firstChild);
    if (filterIcon) cellElement.insertBefore(filterIcon, cellElement.firstChild);
    if (sortIcon) cellElement.insertBefore(sortIcon, cellElement.firstChild);
  } else {
    const resizeHandle = cellElement.querySelector(".st-header-resize-handle-container");
    // In right-pinned cells the resize handle is the FIRST child (leading edge),
    // so the trailing icons should just be appended rather than inserted before it.
    const resizeHandleIsTrailing =
      resizeHandle != null && resizeHandle !== cellElement.firstChild;
    if (sortIcon) {
      if (resizeHandleIsTrailing) {
        cellElement.insertBefore(sortIcon, resizeHandle);
      } else {
        cellElement.appendChild(sortIcon);
      }
    }
    if (filterIcon) {
      if (resizeHandleIsTrailing) {
        cellElement.insertBefore(filterIcon, resizeHandle);
      } else {
        cellElement.appendChild(filterIcon);
      }
    }
    if (collapseIcon) {
      if (resizeHandleIsTrailing) {
        cellElement.insertBefore(collapseIcon, resizeHandle);
      } else {
        cellElement.appendChild(collapseIcon);
      }
    }
  }
};

// Update an existing header cell element with current state
export const updateHeaderCellElement = (
  cellElement: HTMLElement,
  cell: AbsoluteCell,
  context: HeaderRenderContext,
): void => {
  const { header, colIndex } = cell;

  cellElement.className = calculateHeaderCellClasses(cell, context);

  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  // Honor the in-flight accordion grow marker (see body-cell counterpart in
  // ./styling/updateBodyCellElement). Without this, a same-tick re-render
  // after a column collapse/expand toggle would overwrite the inline 0 size
  // before the CSS transition picks it up.
  const accordionGrowAxis = cellElement.dataset.stAccordionGrow;
  if (accordionGrowAxis !== "horizontal") {
    cellElement.style.width = `${cell.width}px`;
  }
  if (accordionGrowAxis !== "vertical") {
    cellElement.style.height = `${cell.height}px`;
  }

  refreshHeaderCellIcons(cellElement, header, context, colIndex);
};
