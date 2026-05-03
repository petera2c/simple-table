// Main orchestrator for header cell rendering
// This file coordinates all header cell rendering modules

import { getCellId } from "./cellUtils";
import { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";
import {
  getRenderedCells,
  getHeaderPositionCache,
  removeFloatingHeaderTooltips,
} from "./headerCell/eventTracking";
import {
  createHeaderCellElement,
  calculateHeaderCellClasses,
  getLastHeaderIndex,
  refreshHeaderCellIcons,
} from "./headerCell/styling";
import { updateHeaderSelectionCheckbox } from "./headerCell/selection";
import { updateHeaderCollapseIconState } from "./headerCell/collapsing";
import { hasCollapsibleChildren } from "./collapseUtils";
import type HeaderObject from "../types/HeaderObject";

// Re-export types for backward compatibility
export type { AbsoluteCell, HeaderRenderContext } from "./headerCell/types";

/**
 * Collects every accessor still present in the post-change header tree so
 * the source section can distinguish "column hidden" (accessor missing →
 * shrink-out the outgoing header cell) from "column moved sections"
 * (accessor still present → drop it so it teleports into the destination).
 *
 * Walks the full tree (including children) and skips entries with
 * `hide` or `excludeFromRender`. Mirrors the body-cell helper of the same
 * shape so columns reach a consistent decision in both header and body.
 */
const collectVisibleHeaderAccessors = (headers: HeaderObject[]): Set<string> => {
  const visible = new Set<string>();
  const walk = (list: HeaderObject[]): void => {
    for (const header of list) {
      if (header.hide || header.excludeFromRender) continue;
      visible.add(String(header.accessor));
      if (header.children?.length) walk(header.children);
    }
  };
  walk(headers);
  return visible;
};

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
    : (context.mainSectionContainerWidth ??
      (context.containerWidth ||
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

  // Active accordion axis for hide/show/pin/unpin renders (set by
  // SimpleTableVanilla.beginAccordionAnimation via the render context).
  // When "horizontal" and the column is being TRULY hidden (not just
  // moved to another pinned section), outgoing header cells shrink to 0
  // width via the `.st-accordion-animating` CSS transition instead of
  // popping out. Columns that just changed pinned section teleport
  // (plain remove + plain create at full size in the destination) while
  // siblings still FLIP-shift to reflow.
  const removalAccordionAxis =
    context.animationCoordinator && context.accordionAxis ? context.accordionAxis : null;
  const visibleAccessorsAfterChange =
    removalAccordionAxis === "horizontal" ? collectVisibleHeaderAccessors(context.headers) : null;

  // Remove cells that are no longer visible (and from position cache)
  let removedAnyHeaderCell = false;
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      positionCache.delete(cellId);
      // Accordion shrink-out: only when the column is fully hidden in
      // the post-change tree. For cross-section moves (pin/unpin), the
      // accessor is still visible somewhere — fall through to plain
      // element.remove() so the moving header teleports into the
      // destination section.
      const accessor = element.getAttribute("data-accessor") ?? "";
      const movedToOtherSection = visibleAccessorsAfterChange?.has(accessor) ?? false;
      if (
        removalAccordionAxis === "horizontal" &&
        context.animationCoordinator &&
        !movedToOtherSection &&
        context.animationCoordinator.shouldRetain(cellId)
      ) {
        context.animationCoordinator.shrinkOutCell({
          cellId,
          element,
          container,
          axis: removalAccordionAxis,
        });
      } else {
        element.remove();
      }
      renderedCells.delete(cellId);
      removedAnyHeaderCell = true;
    }
  });
  if (removedAnyHeaderCell) {
    removeFloatingHeaderTooltips(container);
  }

  // Batch create new cells using DocumentFragment
  const fragment = document.createDocumentFragment();
  const cellsToCreate: Array<{
    cell: AbsoluteCell;
    cellId: string;
    isLastMainAutoExpandColumn: boolean;
  }> = [];

  // First pass: identify cells to create vs update
  cellsToRender.forEach((cell) => {
    const cellId = getCellId({ accessor: cell.header.accessor, rowId: "header" });
    const isLastMainAutoExpandColumn = Boolean(
      context.autoExpandColumns && !context.pinned && cell.colIndex === lastHeaderIndex,
    );

    if (!renderedCells.has(cellId)) {
      cellsToCreate.push({ cell, cellId, isLastMainAutoExpandColumn });
    } else {
      // Use cached position to detect change (avoid DOM reads / layout thrash)
      const cellElement = renderedCells.get(cellId)!;
      // Keep grid column index in sync when columns reorder / pin / hide so
      // SelectionManager.syncHeaderSelectionClasses (reads aria-colindex) matches
      // body cells' data-col-index.
      cellElement.setAttribute("aria-colindex", String(cell.colIndex + 1));
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
        // Honor the accordion grow marker so a same-tick re-render after a
        // column collapse/expand toggle doesn't snap the cell to its final
        // size before the CSS transition picks up the 0 → final tween.
        const accordionGrowAxis = cellElement.dataset.stAccordionGrow;
        if (accordionGrowAxis !== "horizontal") {
          cellElement.style.width = `${cell.width}px`;
        }
        if (accordionGrowAxis !== "vertical") {
          cellElement.style.height = `${cell.height}px`;
        }
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
      const newClassNames = calculateHeaderCellClasses(cell, context, isLastMainAutoExpandColumn);
      if (cellElement.className !== newClassNames) {
        cellElement.className = newClassNames;
      }

      // Sync header collapse icon direction when collapsed state changes (same animation as body expand icon)
      if (hasCollapsibleChildren(cell.header)) {
        const isCollapsed = context.collapsedHeaders.has(cell.header.accessor);
        updateHeaderCollapseIconState(cellElement, isCollapsed, cell.header.label);
      }

      // Refresh sort/filter icons in place when this column's sort or filter state changed
      // (cells are no longer torn down on header/context invalidation, so we must replace
      // icons here when context state advances). Tracked per-cell on dataset to avoid
      // unnecessary DOM churn on scroll/reorder where sort/filter haven't changed.
      const sortStateForCell =
        context.sort && context.sort.key.accessor === cell.header.accessor
          ? context.sort.direction
          : "none";
      const filterStateForCell =
        context.filters && context.filters[cell.header.accessor as any] ? "1" : "0";
      const iconStateKey = `${sortStateForCell}|${filterStateForCell}`;
      if (cellElement.dataset.stIconState !== iconStateKey) {
        refreshHeaderCellIcons(cellElement, cell.header, context);
        cellElement.dataset.stIconState = iconStateKey;
      }
    }
  });

  // Accordion expand: when the active animation axis is set AND the cell has
  // no snapshot entry, the column just appeared because its parent
  // collapsible header expanded. Initialize the cell at zero size in the
  // animation axis and schedule the real size on the next two rAFs so the
  // CSS `transition: width/height` on `.st-accordion-animating` grows it
  // from zero. Mirrors the body-cell path so columns and rows share one
  // accordion mechanism.
  const accordionAxis =
    context.animationCoordinator && context.accordionAxis ? context.accordionAxis : null;
  const accordionGrowFromZero: Array<{ element: HTMLElement; cell: AbsoluteCell }> = [];

  // Second pass: batch create new cells (seed position cache so next update doesn't read DOM)
  cellsToCreate.forEach(({ cell, cellId, isLastMainAutoExpandColumn }) => {
    const cellElement = createHeaderCellElement(cell, context, isLastMainAutoExpandColumn);
    // Seed icon-state dataset so the existing-cell branch doesn't refresh icons
    // unnecessarily on the next render (icons are already current on freshly created cells).
    const sortStateForCell =
      context.sort && context.sort.key.accessor === cell.header.accessor
        ? context.sort.direction
        : "none";
    const filterStateForCell =
      context.filters && context.filters[cell.header.accessor as any] ? "1" : "0";
    cellElement.dataset.stIconState = `${sortStateForCell}|${filterStateForCell}`;

    if (
      accordionAxis &&
      context.animationCoordinator &&
      // Only grow from zero on a TRUE expand (no snapshot entry anywhere
      // for this cellId — e.g. the column was just unhidden, or a parent
      // collapsible header just expanded). For cross-section moves
      // (pin / unpin), the snapshot has the cell in the SOURCE container,
      // so this returns false and the destination cell is created at
      // full size, teleporting into place. play.consider's
      // cross-container check then skips the FLIP, while sibling cells
      // in both sections continue to FLIP-shift around the moving column.
      !context.animationCoordinator.hasSnapshotEntry(cellId)
    ) {
      if (accordionAxis === "vertical") {
        cellElement.style.height = "0px";
      } else {
        cellElement.style.width = "0px";
      }
      cellElement.dataset.stAccordionGrow = accordionAxis;
      accordionGrowFromZero.push({ element: cellElement, cell });
    }

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

  if (accordionAxis && accordionGrowFromZero.length > 0) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const { element, cell } of accordionGrowFromZero) {
          if (!element.isConnected) continue;
          if (accordionAxis === "vertical") {
            element.style.height = `${cell.height}px`;
          } else {
            element.style.width = `${cell.width}px`;
          }
          delete element.dataset.stAccordionGrow;
        }
      });
    });
  }

  // Store scroll position for future reference
  if (!context.pinned) {
    container.dataset.lastScrollLeft = String(scrollLeft);
  }
};
