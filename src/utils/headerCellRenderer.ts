// Main orchestrator for header cell rendering
// This file coordinates all header cell rendering modules

import { getCellId } from "./cellUtils";
import { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";
import { getRenderedCells, getHeaderPositionCache } from "./headerCell/eventTracking";
import {
  createHeaderCellElement,
  calculateHeaderCellClasses,
  getLastHeaderIndex,
} from "./headerCell/styling";
import { updateHeaderSelectionCheckbox } from "./headerCell/selection";
import { updateHeaderCollapseIconState } from "./headerCell/collapsing";
import { hasCollapsibleChildren } from "./collapseUtils";

// Re-export types for backward compatibility
export type { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";

// Re-export cleanup function
export { cleanupHeaderCellRendering } from "./headerCell/eventTracking";

// Calculate which cells are visible based on scroll position and viewport
const getVisibleCells = (
  absoluteCells: AbsoluteCell[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number = 100, // Reduced from 200px to 100px
): AbsoluteCell[] => {
  if (absoluteCells.length === 0) return [];

  const visibleLeft = scrollLeft - overscan;
  const visibleRight = scrollLeft + viewportWidth + overscan;

  return absoluteCells.filter((cell) => {
    const cellRight = cell.left + cell.width;
    // Cell is visible if it overlaps with the visible range
    return cellRight >= visibleLeft && cell.left <= visibleRight;
  });
};

export const renderHeaderCells = (
  container: HTMLElement,
  absoluteCells: AbsoluteCell[],
  context: HeaderRenderContext,
  scrollLeft: number = 0,
): void => {
  // Get viewport width: for main section use mainSectionContainerWidth to avoid clientWidth read
  const viewportWidth = context.pinned
    ? context.containerWidth
    : (context.mainSectionContainerWidth ?? (context.containerWidth ||
        container.parentElement?.clientWidth ||
        container.clientWidth ||
        0));

  // For pinned sections, always render all cells (they don't scroll)
  // For main section, only render visible cells based on scroll position
  const cellsToRender = context.pinned
    ? absoluteCells
    : getVisibleCells(absoluteCells, scrollLeft, viewportWidth);

  const lastHeaderIndex = getLastHeaderIndex(absoluteCells);
  const renderedCells = getRenderedCells(container);

  // Build set of cell IDs that should be visible
  const visibleCellIds = new Set(
    cellsToRender.map((cell) => getCellId({ accessor: cell.header.accessor, rowId: "header" })),
  );

  const positionCache = getHeaderPositionCache(container);

  // Remove cells that are no longer visible (and from position cache)
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      positionCache.delete(cellId);
      element.remove();
      renderedCells.delete(cellId);
    }
  });

  // Batch create new cells using DocumentFragment
  const fragment = document.createDocumentFragment();
  const cellsToCreate: Array<{ cell: AbsoluteCell; cellId: string; isLastHeader: boolean }> = [];

  // First pass: identify cells to create vs update
  cellsToRender.forEach((cell) => {
    const cellId = getCellId({ accessor: cell.header.accessor, rowId: "header" });
    const isLastHeader = Boolean(
      context.autoExpandColumns && !context.pinned && cell.colIndex === lastHeaderIndex,
    );

    if (!renderedCells.has(cellId)) {
      cellsToCreate.push({ cell, cellId, isLastHeader });
    } else {
      // Use cached position to detect change (avoid DOM reads / layout thrash)
      const cellElement = renderedCells.get(cellId)!;
      const cached = positionCache.get(cellId);
      const positionChanged =
        !cached ||
        cached.left !== cell.left ||
        cached.top !== cell.top ||
        cached.width !== cell.width ||
        cached.height !== cell.height;

      if (positionChanged) {
        cellElement.style.left = `${cell.left}px`;
        cellElement.style.top = `${cell.top}px`;
        cellElement.style.width = `${cell.width}px`;
        cellElement.style.height = `${cell.height}px`;
        positionCache.set(cellId, {
          left: cell.left,
          top: cell.top,
          width: cell.width,
          height: cell.height,
        });
      }

      // Sync header select-all checkbox when row selection changes (e.g. select-all / deselect-all)
      if (
        cell.header.isSelectionColumn &&
        context.enableRowSelection &&
        typeof context.areAllRowsSelected === "function"
      ) {
        updateHeaderSelectionCheckbox(cellElement, context.areAllRowsSelected());
      }

      // Update classes when context changes (e.g. column selection → st-header-selected)
      const newClassNames = calculateHeaderCellClasses(cell, context, isLastHeader);
      if (cellElement.className !== newClassNames) {
        cellElement.className = newClassNames;
      }

      // Sync header collapse icon direction when collapsed state changes (same animation as body expand icon)
      if (hasCollapsibleChildren(cell.header)) {
        const isCollapsed = context.collapsedHeaders.has(cell.header.accessor);
        updateHeaderCollapseIconState(cellElement, isCollapsed, cell.header.label);
      }
    }
  });

  // Second pass: batch create new cells (seed position cache so next update doesn't read DOM)
  cellsToCreate.forEach(({ cell, cellId, isLastHeader }) => {
    const cellElement = createHeaderCellElement(cell, context, isLastHeader);
    fragment.appendChild(cellElement);
    renderedCells.set(cellId, cellElement);
    positionCache.set(cellId, {
      left: cell.left,
      top: cell.top,
      width: cell.width,
      height: cell.height,
    });
  });

  // Single DOM operation to add all new cells
  if (fragment.childNodes.length > 0) {
    container.appendChild(fragment);
  }

  // Store scroll position for future reference
  if (!context.pinned) {
    container.dataset.lastScrollLeft = String(scrollLeft);
  }
};
