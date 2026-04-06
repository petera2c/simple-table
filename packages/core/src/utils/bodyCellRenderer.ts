// Main orchestrator for body cell rendering
// This file coordinates all body cell rendering modules

import { getCellId } from "./cellUtils";
import { AbsoluteBodyCell, CellRenderContext } from "./bodyCell/types";
import { getRenderedCells } from "./bodyCell/eventTracking";
import {
  createBodyCellElement,
  updateBodyCellElement,
  updateBodyCellPosition,
  untrackCellByRow,
} from "./bodyCell/styling";
import { updateExpandIconState } from "./bodyCell/expansion";
import { updateCheckboxElement } from "./columnEditor/createCheckbox";
import { isRowExpanded } from "./rowUtils";
import {
  applyRowSeparatorSectionWidth,
  createRowSeparator,
} from "./rowSeparatorRenderer";
import { calculateSeparatorTopPosition } from "./infiniteScrollUtils";
import { DEFAULT_CUSTOM_THEME } from "../types/CustomTheme";
import type TableRow from "../types/TableRow";

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

// Track rendered separators per container
const renderedSeparatorsMap = new WeakMap<
  HTMLElement,
  Map<number, HTMLElement>
>();

const getRenderedSeparators = (
  container: HTMLElement,
): Map<number, HTMLElement> => {
  if (!renderedSeparatorsMap.has(container)) {
    renderedSeparatorsMap.set(container, new Map());
  }
  return renderedSeparatorsMap.get(container)!;
};

// Helper to filter visible cells based on horizontal scroll
const getVisibleBodyCells = (
  cells: AbsoluteBodyCell[],
  scrollLeft: number,
  viewportWidth: number,
  overscan: number = 100, // Reduced from 200px to 100px
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

// Track separator metadata to avoid unnecessary updates
interface SeparatorMetadata {
  position: number;
  displayStrongBorder: boolean;
  sectionWidthPx?: number;
}

const separatorMetadataMap = new WeakMap<
  HTMLElement,
  Map<number, SeparatorMetadata>
>();

const getSeparatorMetadata = (
  container: HTMLElement,
): Map<number, SeparatorMetadata> => {
  if (!separatorMetadataMap.has(container)) {
    separatorMetadataMap.set(container, new Map());
  }
  return separatorMetadataMap.get(container)!;
};

// Row boundary when using full row list (e.g. including nested grid rows)
interface RowBoundaryFromRows {
  rowIndex: number; // used as separator key (position)
  position: number;
  displayStrongBorder: boolean;
}

// Render row separators between rows. When allRows is provided, boundaries include every row (e.g. nested grid rows).
const renderRowSeparators = (
  container: HTMLElement,
  cells: AbsoluteBodyCell[],
  context: CellRenderContext,
  renderedSeparators: Map<number, HTMLElement>,
  allRows?: TableRow[],
): void => {
  // Get separator metadata cache
  const separatorMetadata = getSeparatorMetadata(container);

  const sectionWidthPx = ((): number | undefined => {
    const w = context.pinned
      ? (context.containerWidth ?? container.clientWidth ?? 0)
      : (context.mainSectionContainerWidth ??
        context.containerWidth ??
        container.clientWidth ??
        0);
    return w > 0 ? w : undefined;
  })();

  let boundariesFromRows: RowBoundaryFromRows[] = [];

  if (allRows && allRows.length > 0) {
    // Build boundaries from full row list so separators appear above/below nested grid rows too
    boundariesFromRows = allRows.map((row, i) => ({
      rowIndex: row.position,
      position: row.position,
      displayStrongBorder: i > 0 ? allRows[i - 1].isLastGroupRow : false,
    }));
  } else if (cells.length > 0) {
    // Fallback: derive boundaries from cells (original behavior)
    const rowBoundaries: Array<{
      rowIndex: number;
      firstCell: AbsoluteBodyCell;
      prevCell?: AbsoluteBodyCell;
    }> = [];
    let currentRowIndex = -1;
    let firstCellInRow: AbsoluteBodyCell | null = null;
    let prevRowFirstCell: AbsoluteBodyCell | undefined = undefined;

    cells.forEach((cell) => {
      if (cell.rowIndex !== currentRowIndex) {
        if (firstCellInRow && currentRowIndex > 0) {
          rowBoundaries.push({
            rowIndex: currentRowIndex,
            firstCell: firstCellInRow,
            prevCell: prevRowFirstCell,
          });
        }
        prevRowFirstCell = firstCellInRow || undefined;
        currentRowIndex = cell.rowIndex;
        firstCellInRow = cell;
      }
    });
    if (firstCellInRow && currentRowIndex > 0) {
      rowBoundaries.push({
        rowIndex: currentRowIndex,
        firstCell: firstCellInRow,
        prevCell: prevRowFirstCell,
      });
    }
    boundariesFromRows = rowBoundaries.map(
      ({ rowIndex, firstCell, prevCell }) => ({
        rowIndex,
        position: firstCell.tableRow.position,
        displayStrongBorder: prevCell?.tableRow?.isLastGroupRow ?? false,
      }),
    );
  }

  if (boundariesFromRows.length === 0) return;

  // Render separators for each row boundary
  boundariesFromRows.forEach(({ rowIndex, position, displayStrongBorder }) => {
    // Get cached metadata
    const cachedMetadata = separatorMetadata.get(rowIndex);

    // Check if separator needs to be created or updated
    if (!renderedSeparators.has(rowIndex)) {
      // Create new separator
      const separator = createRowSeparator({
        position,
        rowHeight: context.rowHeight,
        displayStrongBorder,
        heightOffsets: context.heightOffsets,
        customTheme: context.customTheme,
        isSticky: false,
        sectionWidthPx,
      });

      container.appendChild(separator);
      renderedSeparators.set(rowIndex, separator);

      // Cache metadata
      separatorMetadata.set(rowIndex, {
        position,
        displayStrongBorder,
        sectionWidthPx,
      });
    } else {
      // Update existing separator only if something changed
      const separator = renderedSeparators.get(rowIndex)!;

      const needsUpdate =
        !cachedMetadata ||
        cachedMetadata.position !== position ||
        cachedMetadata.displayStrongBorder !== displayStrongBorder ||
        cachedMetadata.sectionWidthPx !== sectionWidthPx;

      if (needsUpdate) {
        applyRowSeparatorSectionWidth(separator, sectionWidthPx);

        // Update class if strong border state changed
        if (cachedMetadata?.displayStrongBorder !== displayStrongBorder) {
          if (displayStrongBorder) {
            separator.classList.add("st-last-group-row");
          } else {
            separator.classList.remove("st-last-group-row");
          }
        }

        // Update position only if it changed
        if (!cachedMetadata || cachedMetadata.position !== position) {
          const topPosition = calculateSeparatorTopPosition({
            position,
            rowHeight: context.rowHeight,
            heightOffsets: context.heightOffsets,
            customTheme: context.customTheme ?? DEFAULT_CUSTOM_THEME,
          });
          separator.style.transform = `translate3d(0, ${topPosition}px, 0)`;
        }

        // Update cached metadata
        separatorMetadata.set(rowIndex, {
          position,
          displayStrongBorder,
          sectionWidthPx,
        });
      }
    }
  });
};

// Main render function. When allRows is provided, separators are built from the full row list (including nested grid rows).
// When positionOnly is true (e.g. scroll-driven), only positions are updated; content and separators are skipped for performance.
export const renderBodyCells = (
  container: HTMLElement,
  cells: AbsoluteBodyCell[],
  context: CellRenderContext,
  scrollLeft: number = 0,
  allRows?: TableRow[],
  positionOnly?: boolean,
): void => {
  // Get viewport width: for main section use mainSectionContainerWidth to avoid clientWidth read
  const viewportWidth = context.pinned
    ? (context.containerWidth ?? container.clientWidth ?? 0)
    : (context.mainSectionContainerWidth ??
      context.containerWidth ??
      container.clientWidth ??
      0);

  // For pinned sections, always render all cells (they don't scroll horizontally)
  // For main section, only render visible cells based on scroll position
  const cellsToRender = context.pinned
    ? cells
    : getVisibleBodyCells(cells, scrollLeft, viewportWidth);

  const renderedCells = getRenderedCells(container);
  const renderedSeparators = getRenderedSeparators(container);

  // Build set of cell IDs that should be visible
  const visibleCellIds = new Set(
    cellsToRender.map((cell) =>
      getCellId({ accessor: cell.header.accessor, rowId: cell.rowId }),
    ),
  );

  // Get unique row indices for separator visibility (use full row list when provided so nested rows get separators)
  const visibleRowIndices = allRows?.length
    ? new Set(allRows.map((r) => r.position))
    : new Set(cellsToRender.map((cell) => cell.rowIndex));

  // Remove cells that are no longer visible
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      // Untrack from row hover map before removing
      const rowIndex = parseInt(
        element.getAttribute("data-row-index") || "-1",
        10,
      );
      if (rowIndex >= 0) {
        untrackCellByRow(rowIndex, element);
      }
      element.remove();
      renderedCells.delete(cellId);
    }
  });

  if (!positionOnly) {
    // Remove separators that are no longer visible (only when doing full render)
    const separatorMetadata = getSeparatorMetadata(container);
    renderedSeparators.forEach((element, rowIndex) => {
      if (!visibleRowIndices.has(rowIndex)) {
        element.remove();
        renderedSeparators.delete(rowIndex);
        separatorMetadata.delete(rowIndex);
      }
    });
  }

  // Batch create new cells using DocumentFragment
  const fragment = document.createDocumentFragment();
  const cellsToCreate: Array<{ cell: AbsoluteBodyCell; cellId: string }> = [];

  // First pass: identify cells to create vs update
  cellsToRender.forEach((cell) => {
    const cellId = getCellId({
      accessor: cell.header.accessor,
      rowId: cell.rowId,
    });

    if (!renderedCells.has(cellId)) {
      cellsToCreate.push({ cell, cellId });
    } else {
      const cellElement = renderedCells.get(cellId)!;

      if (positionOnly) {
        // Scroll-driven update: only update position; skip content and checkbox/expand sync
        updateBodyCellPosition(cellElement, cell);
      } else {
        // Full update when row data or context may have changed (e.g. quick filter, sort, selection)
        updateBodyCellElement(cellElement, cell, context);

        // Sync row selection checkbox when context changes (e.g. select-all)
        if (
          cell.header.isSelectionColumn &&
          context.enableRowSelection &&
          context.isRowSelected
        ) {
          const checked = context.isRowSelected(cell.rowId);
          updateCheckboxElement(cellElement, checked);
        }

        // Sync expand/collapse icon direction when expanded state changes (e.g. nested grids)
        if (cell.header.expandable) {
          const expandedDepthsSet = new Set(context.expandedDepths);
          const currentExpandedRows =
            context.getExpandedRows?.() ?? context.expandedRows;
          const currentCollapsedRows =
            context.getCollapsedRows?.() ?? context.collapsedRows;
          const currentIsExpanded = isRowExpanded(
            cell.rowId,
            cell.depth,
            expandedDepthsSet,
            currentExpandedRows,
            currentCollapsedRows,
          );
          updateExpandIconState(cellElement, currentIsExpanded);
        }
      }
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

  // Render separators for visible rows (skip when positionOnly; row boundaries unchanged on horizontal scroll)
  if (!positionOnly) {
    renderRowSeparators(
      container,
      cellsToRender,
      context,
      renderedSeparators,
      allRows,
    );
  }
};
