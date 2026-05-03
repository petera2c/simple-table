import HeaderObject from "../../types/HeaderObject";
import { getCellId } from "../cellUtils";
import { getHeaderLeafIndices, getColumnRange } from "../headerUtils";
import {
  getHeaderIndexPath,
  swapHeaders,
  insertHeaderAcrossSections,
  getHeaderSection,
} from "../../managers/DragHandlerManager";
import { validateFullHeaderTreeEssentialOrder } from "../pinnedColumnUtils";
import { deepClone } from "../../utils/generalUtils";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { HeaderRenderContext } from "./types";
import { createEditableInput } from "./editing";
import {
  addTrackedEventListener,
  throttle,
  REVERT_TO_PREVIOUS_HEADERS_DELAY,
  prevUpdateTime,
  prevDraggingPosition,
  prevHeaders,
  setPrevUpdateTime,
  setPrevDraggingPosition,
  setPrevHeaders,
} from "./eventTracking";

export const handleColumnHeaderClick = (
  event: MouseEvent,
  header: HeaderObject,
  colIndex: number,
  context: HeaderRenderContext,
) => {
  if (header.isSelectionColumn) return;

  if (context.selectableColumns) {
    const columnsToSelect = getHeaderLeafIndices(header, colIndex);

    const isHeaderAlreadySelected = columnsToSelect.some((columnIndex) =>
      context.selectedColumns.has(columnIndex),
    );

    if (context.enableHeaderEditing && isHeaderAlreadySelected && !event.shiftKey) {
      const cellElement = document.getElementById(
        getCellId({ accessor: header.accessor, rowId: "header" }),
      );

      if (cellElement) {
        const labelElement = cellElement.querySelector(".st-header-label") as HTMLElement;
        if (labelElement) {
          const labelTextSpan = labelElement.querySelector(".st-header-label-text") as HTMLElement;
          if (labelTextSpan) {
            labelTextSpan.innerHTML = "";
            const input = createEditableInput(header, context, labelTextSpan);
            labelTextSpan.appendChild(input);

            if (context.headerRegistry && !header.isSelectionColumn) {
              const key = String(header.accessor);
              const entry = context.headerRegistry.get(key);
              if (entry) {
                entry.setEditing(true);
              }
            }
          }
        }
      }
      return;
    }

    if (event.shiftKey && context.selectColumns) {
      context.setSelectedColumns((prevSelected: Set<number>) => {
        if (prevSelected.size === 0) {
          return new Set(columnsToSelect);
        }

        const currentColumnIndex = columnsToSelect[0];
        const selectedIndices = Array.from(prevSelected).sort((a: number, b: number) => a - b);

        let nearestIndex = selectedIndices[0];
        let minDistance = Math.abs(currentColumnIndex - nearestIndex);

        selectedIndices.forEach((index: number) => {
          const distance = Math.abs(currentColumnIndex - index);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });

        const columnsInRange = getColumnRange(nearestIndex, currentColumnIndex);
        const allColumnsToSelect = [...columnsInRange, ...columnsToSelect];

        return new Set([...Array.from(prevSelected), ...allColumnsToSelect]);
      });
    } else if (context.selectColumns) {
      context.selectColumns(columnsToSelect);
    }

    context.setSelectedCells(new Set());
    context.setInitialFocusedCell(null);
  }

  if (context.onColumnSelect) {
    context.onColumnSelect(header);
  }

  if (!context.selectableColumns && header.isSortable) {
    context.onSort(header.accessor);
  }
};

export const handleColumnHeaderDoubleClick = (
  event: MouseEvent,
  header: HeaderObject,
  context: HeaderRenderContext,
) => {
  if (header.isSelectionColumn) return;

  if (context.selectableColumns && header.isSortable) {
    context.onSort(header.accessor);
  }
};

export const attachDragHandlers = (
  labelElement: HTMLElement,
  cellElement: HTMLElement,
  header: HeaderObject,
  context: HeaderRenderContext,
) => {
  const { columnReordering, draggedHeaderRef, hoveredHeaderRef } = context;
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  if (!columnReordering || header.disableReorder || isSelectionColumn) return;

  labelElement.setAttribute("draggable", "true");

  const handleDragStart = (event: Event) => {
    draggedHeaderRef.current = header;
    setPrevUpdateTime(Date.now());
    cellElement.classList.add("st-dragging");
  };

  addTrackedEventListener(labelElement, "dragstart", handleDragStart);

  const handleDragEnd = (event: Event) => {
    event.preventDefault();
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
    cellElement.classList.remove("st-dragging");

    setTimeout(() => {
      context.setHeaders((prev) => [...prev]);
      if (context.onColumnOrderChange) {
        context.onColumnOrderChange(deepClone(context.getHeaders()));
      }
    }, 10);
  };

  addTrackedEventListener(labelElement, "dragend", handleDragEnd);

  const handleDragOver = (event: Event) => {
    const dragEvent = event as DragEvent;
    dragEvent.preventDefault();

    if (!draggedHeaderRef.current) return;

    throttle(() => {
      // Read live headers (not the closure snapshot from attach time): cells are reused
      // across renders, so the captured `headers` ref drifts after each reorder. Using
      // live headers here ensures every swap is computed against the current state.
      const liveHeaders = context.getHeaders();
      if (!liveHeaders) return;

      const { screenX, screenY } = dragEvent;
      const distance = Math.sqrt(
        Math.pow(screenX - prevDraggingPosition.screenX, 2) +
          Math.pow(screenY - prevDraggingPosition.screenY, 2),
      );

      hoveredHeaderRef.current = header;

      const draggedHeader = draggedHeaderRef.current;
      if (!draggedHeader) return;

      const draggedSection = getHeaderSection(draggedHeader, liveHeaders);
      const hoveredSection = getHeaderSection(header, liveHeaders);
      const isCrossSectionDrag = draggedSection !== hoveredSection;

      let newHeaders: HeaderObject[];
      let emergencyBreak = false;

      if (isCrossSectionDrag) {
        const result = insertHeaderAcrossSections({
          headers: liveHeaders,
          draggedHeader,
          hoveredHeader: header,
        });
        newHeaders = result.newHeaders;
        emergencyBreak = result.emergencyBreak;
      } else {
        const draggedHeaderIndexPath = getHeaderIndexPath(liveHeaders, draggedHeader.accessor);
        const hoveredHeaderIndexPath = getHeaderIndexPath(liveHeaders, header.accessor);

        if (!draggedHeaderIndexPath || !hoveredHeaderIndexPath) return;

        const draggedHeaderDepth = draggedHeaderIndexPath.length;
        const hoveredHeaderDepth = hoveredHeaderIndexPath.length;

        let targetHoveredIndexPath = hoveredHeaderIndexPath;

        if (draggedHeaderDepth !== hoveredHeaderDepth) {
          const depthDifference = hoveredHeaderDepth - draggedHeaderDepth;
          if (depthDifference > 0) {
            targetHoveredIndexPath = hoveredHeaderIndexPath.slice(0, -depthDifference);
          }
        }

        const haveSameParent = (path1: number[], path2: number[]): boolean => {
          if (path1.length !== path2.length) return false;
          if (path1.length === 1) return true;
          return path1.slice(0, -1).every((index, i) => index === path2[i]);
        };

        if (!haveSameParent(draggedHeaderIndexPath, targetHoveredIndexPath)) {
          return;
        }

        const result = swapHeaders(liveHeaders, draggedHeaderIndexPath, targetHoveredIndexPath);
        newHeaders = result.newHeaders;
        emergencyBreak = result.emergencyBreak;
      }

      if (
        header.accessor === draggedHeader.accessor ||
        distance < 10 ||
        JSON.stringify(newHeaders) === JSON.stringify(liveHeaders) ||
        emergencyBreak
      ) {
        return;
      }

      const essentialAccessors = context.essentialAccessors;
      if (
        essentialAccessors &&
        essentialAccessors.size > 0 &&
        !validateFullHeaderTreeEssentialOrder(newHeaders, essentialAccessors)
      ) {
        return;
      }

      const now = Date.now();
      const arePreviousHeadersAndNewHeadersTheSame =
        JSON.stringify(newHeaders) === JSON.stringify(prevHeaders);
      const shouldRevertToPreviousHeaders = now - prevUpdateTime < REVERT_TO_PREVIOUS_HEADERS_DELAY;

      if (
        arePreviousHeadersAndNewHeadersTheSame &&
        (shouldRevertToPreviousHeaders || distance < 40)
      ) {
        return;
      }

      setPrevUpdateTime(now);
      setPrevDraggingPosition({ screenX, screenY });
      setPrevHeaders(liveHeaders);

      context.onTableHeaderDragEnd(newHeaders);
    }, DRAG_THROTTLE_LIMIT);
  };

  addTrackedEventListener(cellElement, "dragover", handleDragOver);

  // Prevent drag ghost image
  const handleDragOverPrevention = (event: Event) => {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = "move";
    }
  };

  addTrackedEventListener(document.documentElement, "dragover", handleDragOverPrevention);
};
