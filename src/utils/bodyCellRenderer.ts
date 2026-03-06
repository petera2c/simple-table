// Main orchestrator for body cell rendering
// This file coordinates all body cell rendering modules

import { getCellId } from "./cellUtils";
import { AbsoluteBodyCell, CellRenderContext } from "./bodyCell/types";
import { getRenderedCells } from "./bodyCell/eventTracking";
import { createBodyCellElement, updateBodyCellElement, untrackCellByRow } from "./bodyCell/styling";

// Re-export types for backward compatibility
export type {
  AbsoluteBodyCell,
  CellData,
  CellEditParams,
  CellClickParams,
  CellRegistryEntry,
  CellRenderContext,
} from "./bodyCell/types";

// Re-export cleanup function
export { cleanupBodyCellRendering } from "./bodyCell/eventTracking";

// Helper to filter visible cells based on horizontal scroll
const getVisibleBodyCells = (
  cells: AbsoluteBodyCell[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number = 200,
): AbsoluteBodyCell[] => {
  if (cells.length === 0) return [];

  const visibleLeft = scrollLeft - overscan;
  const visibleRight = scrollLeft + viewportWidth + overscan;

  const visibleCells = cells.filter((cell) => {
    const cellRight = cell.left + cell.width;
    return cellRight >= visibleLeft && cell.left <= visibleRight;
  });

  return visibleCells;
};

// Main render function
export const renderBodyCells = (
  container: HTMLElement,
  cells: AbsoluteBodyCell[],
  context: CellRenderContext,
  scrollLeft: number = 0,
): void => {
  // Get viewport width for horizontal virtual scrolling
  // Use containerWidth from context (provided by DimensionManager) if available
  const viewportWidth = context.containerWidth || container.clientWidth || 0;

  // For pinned sections, always render all cells (they don't scroll horizontally)
  // For main section, only render visible cells based on scroll position
  const cellsToRender = context.pinned
    ? cells
    : getVisibleBodyCells(cells, scrollLeft, viewportWidth);

  const renderedCells = getRenderedCells(container);

  // Build set of cell IDs that should be visible
  const visibleCellIds = new Set(
    cellsToRender.map((cell) => getCellId({ accessor: cell.header.accessor, rowId: cell.rowId })),
  );

  // Remove cells that are no longer visible
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      // Untrack from row hover map before removing
      const rowIndex = parseInt(element.getAttribute("data-row-index") || "-1", 10);
      if (rowIndex >= 0) {
        untrackCellByRow(rowIndex, element);
      }
      element.remove();
      renderedCells.delete(cellId);
    }
  });

  // Batch create new cells using DocumentFragment
  const fragment = document.createDocumentFragment();
  const cellsToCreate: Array<{ cell: AbsoluteBodyCell; cellId: string }> = [];

  // First pass: identify cells to create vs update
  cellsToRender.forEach((cell) => {
    const cellId = getCellId({ accessor: cell.header.accessor, rowId: cell.rowId });

    if (!renderedCells.has(cellId)) {
      cellsToCreate.push({ cell, cellId });
    } else {
      // Update existing cell to reflect current state
      const cellElement = renderedCells.get(cellId)!;
      updateBodyCellElement(cellElement, cell, context);
    }
  });

  // Second pass: batch create new cells
  cellsToCreate.forEach(({ cell, cellId }) => {
    const cellElement = createBodyCellElement(cell, context);
    fragment.appendChild(cellElement);
    renderedCells.set(cellId, cellElement);
  });

  // Single DOM operation to add all new cells
  if (fragment.childNodes.length > 0) {
    container.appendChild(fragment);
  }
};
