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
  isLastHeader: boolean,
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
    isLastHeader ? "st-no-resize" : "",
  ]
    .filter(Boolean)
    .join(" ");
};

export const createHeaderCellElement = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
  isLastHeader: boolean,
): HTMLElement => {
  const { header, colIndex } = cell;
  const { reverse } = context;

  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  // Get class names
  const classNames = calculateHeaderCellClasses(cell, context, isLastHeader);

  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId: "header" });
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

  if (reverse) {
    const resizeHandle = createResizeHandle(header, context, isLastHeader);
    if (resizeHandle) {
      cellElement.appendChild(resizeHandle);
    }
  }

  const sortIcon = createSortIcon(header, context);
  const filterIcon = createFilterIcon(header, context);
  const collapseIcon = createCollapseIcon(header, context);

  if (!header.headerRenderer && header.align === "right") {
    if (collapseIcon) cellElement.appendChild(collapseIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (sortIcon) cellElement.appendChild(sortIcon);
  }

  const labelElement = document.createElement("div");
  labelElement.className = "st-header-label";

  if (header.headerRenderer) {
    const labelContent = createLabelContent(header, context);
    labelElement.appendChild(labelContent);
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
    if (sortIcon) cellElement.appendChild(sortIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (collapseIcon) cellElement.appendChild(collapseIcon);
  }

  if (!reverse) {
    const resizeHandle = createResizeHandle(header, context, isLastHeader);
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
  const lastCell = absoluteCells[absoluteCells.length - 1];
  return lastCell.colIndex;
};

// Update an existing header cell element with current state
export const updateHeaderCellElement = (
  cellElement: HTMLElement,
  cell: AbsoluteCell,
  context: HeaderRenderContext,
  isLastHeader: boolean,
): void => {
  // Update classes to reflect current state
  cellElement.className = calculateHeaderCellClasses(cell, context, isLastHeader);

  // Update position (may have changed due to column resize or scroll)
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;
};
