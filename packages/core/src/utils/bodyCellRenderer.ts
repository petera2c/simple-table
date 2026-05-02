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
import { applyRowSeparatorSectionWidth, createRowSeparator } from "./rowSeparatorRenderer";
import { calculateSeparatorTopPosition } from "./infiniteScrollUtils";
import { DEFAULT_CUSTOM_THEME } from "../types/CustomTheme";
import type TableRow from "../types/TableRow";
import type HeaderObject from "../types/HeaderObject";
import type { AnimationCoordinator, CellPosition } from "../managers/AnimationCoordinator";

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
const renderedSeparatorsMap = new WeakMap<HTMLElement, Map<number, HTMLElement>>();

const getRenderedSeparators = (container: HTMLElement): Map<number, HTMLElement> => {
  if (!renderedSeparatorsMap.has(container)) {
    renderedSeparatorsMap.set(container, new Map());
  }
  return renderedSeparatorsMap.get(container)!;
};

/**
 * Collects every accessor that will still appear somewhere in the rendered
 * header tree after the current change. Used during accordion-horizontal
 * renders so the source section can distinguish between:
 *
 *   - Column hidden (accessor missing → shrink-out the outgoing cell)
 *   - Column moved to a different pinned section (accessor still present →
 *     drop the outgoing cell so it teleports into the destination)
 *
 * Walks the full tree (including children) and skips entries with
 * `hide` or `excludeFromRender`. Cheap and only invoked when an accordion
 * window is active, so it doesn't run on plain sort/scroll renders.
 */
const collectVisibleLeafAccessors = (headers: HeaderObject[]): Set<string> => {
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

// Track separator metadata to avoid unnecessary updates.
// `topPx` is the actual rendered top pixel (after `heightOffsets` is applied);
// caching the array `position` alone is insufficient because expanding a
// nested-table row changes `heightOffsets`, which shifts the top px of every
// separator below the expansion point without changing their `position`.
interface SeparatorMetadata {
  position: number;
  topPx: number;
  displayStrongBorder: boolean;
  sectionWidthPx?: number;
}

const separatorMetadataMap = new WeakMap<HTMLElement, Map<number, SeparatorMetadata>>();

const getSeparatorMetadata = (container: HTMLElement): Map<number, SeparatorMetadata> => {
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
      : (context.mainSectionContainerWidth ?? context.containerWidth ?? container.clientWidth ?? 0);
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
    boundariesFromRows = rowBoundaries.map(({ rowIndex, firstCell, prevCell }) => ({
      rowIndex,
      position: firstCell.tableRow.position,
      displayStrongBorder: prevCell?.tableRow?.isLastGroupRow ?? false,
    }));
  }

  if (boundariesFromRows.length === 0) return;

  // Render separators for each row boundary
  boundariesFromRows.forEach(({ rowIndex, position, displayStrongBorder }) => {
    // Get cached metadata
    const cachedMetadata = separatorMetadata.get(rowIndex);

    // Compute the actual top pixel for this separator. We compare against the
    // cached pixel value (not the array `position`) because expanding a
    // nested-table row mutates `heightOffsets` and shifts the visual top of
    // every separator below the expansion point without changing `position`.
    const topPx = calculateSeparatorTopPosition({
      position,
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme ?? DEFAULT_CUSTOM_THEME,
    });

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
        topPx,
        displayStrongBorder,
        sectionWidthPx,
      });
    } else {
      // Update existing separator only if something changed
      const separator = renderedSeparators.get(rowIndex)!;

      const needsUpdate =
        !cachedMetadata ||
        cachedMetadata.topPx !== topPx ||
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

        // Update transform only if the rendered top pixel changed
        if (!cachedMetadata || cachedMetadata.topPx !== topPx) {
          separator.style.transform = `translate3d(0, ${topPx}px, 0)`;
        }

        // Update cached metadata
        separatorMetadata.set(rowIndex, {
          position,
          topPx,
          displayStrongBorder,
          sectionWidthPx,
        });
      }
    }
  });
};

// Main render function. When allRows is provided, separators are built from the full row list (including nested grid rows).
// When positionOnly is true (e.g. scroll-driven), only positions are updated; content and separators are skipped for performance.
//
// `fullCellLayout` (when provided) maps every cell id this section knows about
// — including rows currently outside the virtualized band — to its destination
// position in the new state. The animation coordinator uses it so cells that
// exit the visible band on sort can slide to their off-screen `top` before
// being removed. Without it, cells leaving the band would be torn down with
// nowhere to slide to and would simply pop out.
export const renderBodyCells = (
  container: HTMLElement,
  cells: AbsoluteBodyCell[],
  context: CellRenderContext,
  scrollLeft: number = 0,
  allRows?: TableRow[],
  positionOnly?: boolean,
  animationCoordinator?: AnimationCoordinator,
  fullCellLayout?: Map<string, CellPosition>,
): void => {
  // Get viewport width: for main section use mainSectionContainerWidth to avoid clientWidth read
  const viewportWidth = context.pinned
    ? (context.containerWidth ?? container.clientWidth ?? 0)
    : (context.mainSectionContainerWidth ?? context.containerWidth ?? container.clientWidth ?? 0);

  // For pinned sections, always render all cells (they don't scroll horizontally)
  // For main section, only render visible cells based on scroll position
  const cellsToRender = context.pinned
    ? cells
    : getVisibleBodyCells(cells, scrollLeft, viewportWidth);

  const renderedCells = getRenderedCells(container);
  const renderedSeparators = getRenderedSeparators(container);

  // Build set of cell IDs that should be visible.
  // We prefer `stableRowKey` so the same DOM cell survives a sort (so FLIP
  // can animate the cell to its new row position rather than tearing it
  // down and creating a fresh node in place).
  const visibleCellIds = new Set(
    cellsToRender.map((cell) =>
      getCellId({
        accessor: cell.header.accessor,
        rowId: cell.stableRowKey ?? cell.rowId,
      }),
    ),
  );

  // Layout map covering every cell this section knows about (visible rows
  // AND rows currently outside the virtualized band). The animation
  // coordinator uses it to find a post-change "destination" for cells
  // exiting the band so they can slide out to that off-screen position
  // before being removed.
  //
  // Prefer the caller-provided full layout (computed from the section
  // snapshot config so it covers every row); otherwise fall back to a
  // band-only layout derived from `cells`.
  let newCellLayout: Map<string, CellPosition> | null = null;
  if (animationCoordinator) {
    if (fullCellLayout) {
      newCellLayout = fullCellLayout;
    } else {
      newCellLayout = new Map<string, CellPosition>();
      for (const cell of cells) {
        const cellId = getCellId({
          accessor: cell.header.accessor,
          rowId: cell.stableRowKey ?? cell.rowId,
        });
        newCellLayout.set(cellId, {
          left: cell.left,
          top: cell.top,
          width: cell.width,
          height: cell.height,
        });
      }
    }
  }

  // Active accordion axis (set on hide/show/pin/unpin renders). When this
  // is "horizontal", outgoing cells whose column has no destination in any
  // post-change section (true hide) shrink their width to 0 in place via
  // the `.st-accordion-animating` CSS transition. Outgoing cells whose
  // column merely moved to a different section (pin / unpin) are removed
  // immediately so the column appears to teleport into its new section
  // without an extra shrink-then-grow leg, while sibling cells in both
  // sections still FLIP-shift to reflow around the change.
  const accordionAxis =
    animationCoordinator && context.accordionAxis ? context.accordionAxis : null;
  // Set of accessor strings that are still visible somewhere in the
  // post-change header tree. Used to distinguish "column moved sections"
  // (still visible, just elsewhere) from "column hidden" (gone entirely)
  // when deciding shrink-out vs teleport for an outgoing cell. Built once
  // per render only when the accordion-horizontal window is active so the
  // tree walk doesn't run on plain sort/scroll renders.
  const visibleAccessorsAfterChange =
    accordionAxis === "horizontal" ? collectVisibleLeafAccessors(context.headers) : null;

  // Get unique row indices for separator visibility (use full row list when provided so nested rows get separators)
  const visibleRowIndices = allRows?.length
    ? new Set(allRows.map((r) => r.position))
    : new Set(cellsToRender.map((cell) => cell.rowIndex));

  // Remove cells that are no longer visible. When the coordinator wants to
  // animate a cell off-screen, we hand it off instead of removing.
  renderedCells.forEach((element, cellId) => {
    if (!visibleCellIds.has(cellId)) {
      // Untrack from row hover map (the live row no longer owns this DOM node)
      const rowIdAttr = element.getAttribute("data-row-id");
      if (rowIdAttr) {
        untrackCellByRow(rowIdAttr, element);
      }

      const newPos = newCellLayout?.get(cellId);
      if (animationCoordinator && animationCoordinator.shouldRetain(cellId) && newPos) {
        // Slide the cell to its new conceptual position (which may be
        // off-screen — the body's overflow clip handles the visual cutoff)
        // and remove it once the slide completes.
        animationCoordinator.retainCell({
          cellId,
          element,
          container,
          newPosition: newPos,
        });
        renderedCells.delete(cellId);
        return;
      }

      // Accordion-horizontal shrink-out: the column truly disappeared from
      // the table (hide/excludeFromRender). Hand the cell off to the
      // coordinator to shrink its width to 0 in place via the active
      // accordion CSS transition, then remove.
      //
      // If the column merely moved to a different pinned section, the
      // accessor is still visible somewhere in the post-change tree — fall
      // through to the plain `element.remove()` below so the moving column
      // teleports into the destination section while siblings FLIP-shift
      // around it. (Per product behavior: the moving column itself does not
      // animate; only the columns adjusting to make room do.)
      if (
        animationCoordinator &&
        accordionAxis === "horizontal" &&
        animationCoordinator.shouldRetain(cellId)
      ) {
        const accessor = element.getAttribute("data-accessor") ?? "";
        const movedToOtherSection = visibleAccessorsAfterChange?.has(accessor) ?? false;
        if (!movedToOtherSection) {
          animationCoordinator.shrinkOutCell({
            cellId,
            element,
            container,
            axis: accordionAxis,
          });
          renderedCells.delete(cellId);
          return;
        }
        // Cross-section move: fall through to plain element.remove() below.
        // The destination section will create a full-size cell (the snapshot
        // is in a different container, so play.consider skips the FLIP and
        // the create path skips the grow-from-0 because hasSnapshotEntry is
        // true). End result: the moving column teleports into its new
        // section while siblings in both sections still FLIP-shift to
        // reflow around the change.
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
      rowId: cell.stableRowKey ?? cell.rowId,
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
        if (cell.header.isSelectionColumn && context.enableRowSelection && context.isRowSelected) {
          const checked = context.isRowSelected(cell.rowId);
          updateCheckboxElement(cellElement, checked);
        }

        // Sync expand/collapse icon direction when expanded state changes (e.g. nested grids)
        if (cell.header.expandable) {
          const expandedDepthsSet = new Set(context.expandedDepths);
          const currentExpandedRows = context.getExpandedRows?.() ?? context.expandedRows;
          const currentCollapsedRows = context.getCollapsedRows?.() ?? context.collapsedRows;
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

  // Second pass: batch create new cells. If the snapshot captured this cell's
  // pre-change position (e.g. the row was off-screen pre-sort and is now in
  // the band), play() will FLIP it from there — no extra hook needed here.
  //
  // Accordion expand: when the active animation axis is set AND this cell has
  // no snapshot entry, it just appeared because its parent grouping
  // row/header expanded. We initialize the cell at zero size in the
  // animation axis and schedule the real size on the next two rAFs so the
  // CSS `transition: width/height` on `.st-accordion-animating` grows it
  // from zero to its final size. Sibling rows/cells continue to FLIP into
  // their new positions in parallel via {@link AnimationCoordinator.play}.
  const accordionGrowFromZero: Array<{ element: HTMLElement; cell: AbsoluteBodyCell }> = [];

  cellsToCreate.forEach(({ cell, cellId }) => {
    // If a retained out-animating ghost still owns this cellId, claim it back
    // as the live cell instead of discarding + creating a fresh node. This
    // keeps the DOM element continuous — the snapshot captured the ghost's
    // mid-flight visual position pre-render, and play() will FLIP from there
    // to the new live destination, preventing the "cell disappears, another
    // teleports in" effect when a sort fires during another sort's animation.
    const claimed = animationCoordinator?.claimRetainedForReuse(cellId, container);
    if (claimed) {
      updateBodyCellElement(claimed, cell, context);
      renderedCells.set(cellId, claimed);
      return;
    }
    const cellElement = createBodyCellElement(cell, context);

    if (
      accordionAxis &&
      animationCoordinator &&
      // Only grow from zero on a TRUE expand: there is no snapshot entry
      // anywhere for this cellId (e.g. row group expand revealed a new
      // cell, or a column was unhidden / shown for the first time).
      //
      // For cross-section moves (pin / unpin), the snapshot has the cell
      // in the SOURCE container. We deliberately skip the grow-from-0
      // here so the moving column teleports into the destination at full
      // size; play.consider's cross-container check skips the FLIP, so
      // the cell simply appears at its new position. Sibling columns in
      // both sections still FLIP-shift to reflow.
      !animationCoordinator.hasSnapshotEntry(cellId)
    ) {
      if (accordionAxis === "vertical") {
        cellElement.style.height = "0px";
      } else {
        cellElement.style.width = "0px";
      }
      // Marker so any same-tick re-render (e.g. microtask-batched onRender
      // after a chevron toggle) won't overwrite the 0 before the CSS
      // transition has read it. Cleared once the final size is written.
      cellElement.dataset.stAccordionGrow = accordionAxis;
      accordionGrowFromZero.push({ element: cellElement, cell });
    }

    fragment.appendChild(cellElement);
    renderedCells.set(cellId, cellElement);
  });

  // Single DOM operation to add all new cells
  if (fragment.childNodes.length > 0) {
    container.appendChild(fragment);
  }

  // Schedule the accordion size growth on the next two rAFs. The first frame
  // commits the zero-size paint; the second writes the final size, and the
  // `.st-accordion-animating` CSS class transitions `width`/`height` between
  // them. Mirrors the double-rAF pattern in `bodyCell/expansion.ts` for
  // chevron rotation.
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

  // Render separators for visible rows (skip when positionOnly; row boundaries unchanged on horizontal scroll)
  if (!positionOnly) {
    renderRowSeparators(container, cellsToRender, context, renderedSeparators, allRows);
  }
};
