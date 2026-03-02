// Main orchestrator for header cell rendering
// This file coordinates all header cell rendering modules

import { getCellId } from "./cellUtils";
import { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";
import { getRenderedCells } from "./headerCell/eventTracking";
import { createHeaderCellElement, updateHeaderCellElement, getLastHeaderIndex } from "./headerCell/styling";

// Re-export types for backward compatibility
export type { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";

// Re-export cleanup function
export { cleanupHeaderCellRendering } from "./headerCell/eventTracking";

// Calculate which cells are visible based on scroll position and viewport
const getVisibleCells = (
  absoluteCells: AbsoluteCell[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number = 200 // pixels to render beyond viewport
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
  scrollLeft: number = 0
): void => {
  // Get container width for viewport calculation
  const viewportWidth = container.parentElement?.clientWidth || container.clientWidth || 0;
  
  // For pinned sections, always render all cells (they don't scroll)
  // For main section, only render visible cells based on scroll position
  const cellsToRender = context.pinned 
    ? absoluteCells 
    : getVisibleCells(absoluteCells, scrollLeft, viewportWidth);
  
  const lastHeaderIndex = getLastHeaderIndex(absoluteCells);
  const renderedCells = getRenderedCells(container);
  
  // Build set of cell IDs that should be visible
  const visibleCellIds = new Set(
    cellsToRender.map(cell => getCellId({ accessor: cell.header.accessor, rowId: "header" }))
  );
  
  // Remove cells that are no longer visible
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      element.remove();
      renderedCells.delete(cellId);
    }
  });
  
  // Add new cells or update existing ones
  cellsToRender.forEach((cell) => {
    const cellId = getCellId({ accessor: cell.header.accessor, rowId: "header" });
    const isLastHeader = Boolean(context.autoExpandColumns && !context.pinned && 
      cell.colIndex === lastHeaderIndex);
    
    if (!renderedCells.has(cellId)) {
      // Create new cell
      const cellElement = createHeaderCellElement(cell, context, isLastHeader);
      container.appendChild(cellElement);
      renderedCells.set(cellId, cellElement);
    } else {
      // Update existing cell to reflect current state
      const cellElement = renderedCells.get(cellId)!;
      updateHeaderCellElement(cellElement, cell, context, isLastHeader);
    }
  });
  
  // Store scroll position for future reference
  if (!context.pinned) {
    container.dataset.lastScrollLeft = String(scrollLeft);
  }
};
