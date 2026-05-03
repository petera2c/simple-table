import { getCellId } from "../cellUtils";
import { getHeaderLeafIndices, getHeaderDescriptionId, getHeaderDescription } from "../headerUtils";
import { DEFAULT_SHOW_WHEN } from "../../types/HeaderObject";
import { AbsoluteCell, HeaderRenderContext } from "./types";
import { createSortIcon } from "./sorting";
import { createFilterIcon } from "./filtering";
import { createCollapseIcon } from "./collapsing";
import { createResizeHandle } from "./resizing";
import { createLabelContent, createEditableInput } from "./editing";
import {
  handleColumnHeaderClick,
  handleColumnHeaderDoubleClick,
  attachDragHandlers,
} from "./dragging";
import { addTrackedEventListener } from "./eventTracking";

// Calculate header cell class names based on current state
export const calculateHeaderCellClasses = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
  isLastMainAutoExpandColumn: boolean,
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
    isLastMainAutoExpandColumn ? "st-no-resize" : "",
  ]
    .filter(Boolean)
    .join(" ");
};

export const createHeaderCellElement = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
  isLastMainAutoExpandColumn: boolean,
): HTMLElement => {
  const { header, colIndex } = cell;
  const { reverse } = context;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  // Get class names
  const classNames = calculateHeaderCellClasses(
    cell,
    context,
    isLastMainAutoExpandColumn,
  );

  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId: "header" });
  cellElement.setAttribute("data-accessor", String(header.accessor));
  cellElement.setAttribute("role", "columnheader");
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));

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

  if (reverse) {
    const resizeHandle = createResizeHandle(
      header,
      context,
      isLastMainAutoExpandColumn,
    );
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
    const labelContent = createLabelContent(header, context);

    const renderedContent = header.headerRenderer({
      accessor: header.accessor,
      colIndex,
      header,
      components: {
        sortIcon: sortIcon || undefined,
        filterIcon: filterIcon || undefined,
        collapseIcon: collapseIcon || undefined,
        labelContent: labelContent,
      },
    });

    // The headerRenderer should return a DOM element (HTMLElement)
    // The React adapter wraps React-based headerRenderers to convert them to DOM elements
    if (renderedContent instanceof HTMLElement) {
      labelElement.appendChild(renderedContent);
    } else {
      // Fallback to default rendering if not a DOM element
      labelElement.appendChild(labelContent);
    }
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

  if (!reverse) {
    const resizeHandle = createResizeHandle(
      header,
      context,
      isLastMainAutoExpandColumn,
    );
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
): void => {
  const oldSortIcon = cellElement.querySelector('.st-icon-container[aria-label*="Sort"]');
  const oldFilterIcon = cellElement.querySelector('.st-icon-container[aria-label*="Filter"]');
  const oldCollapseIcon = cellElement.querySelector(".st-expand-icon-container");

  oldSortIcon?.remove();
  oldFilterIcon?.remove();
  oldCollapseIcon?.remove();

  const sortIcon = createSortIcon(header, context);
  const filterIcon = createFilterIcon(header, context);
  const collapseIcon = createCollapseIcon(header, context);

  if (!header.headerRenderer && header.align === "right") {
    if (collapseIcon) cellElement.insertBefore(collapseIcon, cellElement.firstChild);
    if (filterIcon) cellElement.insertBefore(filterIcon, cellElement.firstChild);
    if (sortIcon) cellElement.insertBefore(sortIcon, cellElement.firstChild);
  } else if (!header.headerRenderer && header.align !== "right") {
    const resizeHandle = cellElement.querySelector(".st-header-resize-handle-container");
    if (sortIcon) {
      if (resizeHandle) {
        cellElement.insertBefore(sortIcon, resizeHandle);
      } else {
        cellElement.appendChild(sortIcon);
      }
    }
    if (filterIcon) {
      if (resizeHandle) {
        cellElement.insertBefore(filterIcon, resizeHandle);
      } else {
        cellElement.appendChild(filterIcon);
      }
    }
    if (collapseIcon) {
      if (resizeHandle) {
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
  isLastMainAutoExpandColumn: boolean,
): void => {
  const { header, colIndex } = cell;

  cellElement.className = calculateHeaderCellClasses(
    cell,
    context,
    isLastMainAutoExpandColumn,
  );

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

  refreshHeaderCellIcons(cellElement, header, context);
};
