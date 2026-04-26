import HeaderObject, { Accessor } from "../../types/HeaderObject";
import {
  renderHeaderCells,
  AbsoluteCell,
  HeaderRenderContext,
  cleanupHeaderCellRendering,
} from "../../utils/headerCellRenderer";
import {
  renderBodyCells,
  AbsoluteBodyCell,
  CellRenderContext,
  cleanupBodyCellRendering,
} from "../../utils/bodyCellRenderer";
import TableRow from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";
import { getCellId } from "../../utils/cellUtils";
import { DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
import {
  calculateTotalHeight,
  calculateRowTopPosition,
} from "../../utils/infiniteScrollUtils";
import {
  createNestedGridRow,
  createNestedGridSpacer,
  type NestedGridRowRenderContext,
} from "../../utils/nestedGridRowRenderer";
import { createStateRow, type StateRowRenderContext } from "../../utils/stateRowRenderer";

export interface HeaderSectionParams {
  headers: HeaderObject[];
  collapsedHeaders: Set<Accessor>;
  pinned?: "left" | "right";
  maxHeaderDepth: number;
  headerHeight: number;
  context: HeaderRenderContext;
  sectionWidth?: number;
  startColIndex?: number;
}

export interface BodySectionParams {
  headers: HeaderObject[];
  rows: TableRow[];
  collapsedHeaders: Set<Accessor>;
  pinned?: "left" | "right";
  context: CellRenderContext;
  sectionWidth?: number;
  rowHeight: number;
  heightOffsets?: Array<[number, number]>;
  totalRowCount?: number;
  startColIndex?: number;
  /** When true, only update cell positions for existing cells (scroll performance). */
  positionOnly?: boolean;
  /** Full table rows ref + range for range-based body cell cache (avoids cache miss on every scroll). */
  fullTableRows?: TableRow[];
  renderedStartIndex?: number;
  renderedEndIndex?: number;
  /** When provided, body cell renderer hands outgoing cells to the coordinator
   * for FLIP-style out-animation instead of removing them immediately. */
  animationCoordinator?: AnimationCoordinator;
}

interface BodyCellsCacheEntry {
  cells: AbsoluteBodyCell[];
  deps: {
    headersHash: string;
    rowsRef: TableRow[];
    collapsedHeadersSize: number;
    rowHeight: number;
    heightOffsetsHash: string;
    /** Padded row index band over fullTableRows; reduces geometry rebuilds on small scrolls. */
    bandStart?: number;
    bandEnd?: number;
    fullTableRowsRef?: TableRow[];
  };
}

/**
 * Per-section snapshot of just enough state to recompute every cell position
 * (left × top for every row × every leaf header) on demand. Used by the
 * animation coordinator: it needs positions for off-screen rows so cells
 * sliding in or out of the visible band have a real "from" / "to" point.
 *
 * Rebuilt on every body section render so it always reflects the layout the
 * user is currently looking at — i.e. when captureAnimationSnapshot fires
 * before the next render runs, this represents the *pre-change* layout.
 */
interface BodySectionSnapshotConfig {
  rows: TableRow[];
  headerPositions: Array<{ accessor: Accessor; left: number; width: number }>;
  rowHeight: number;
  heightOffsets?: Array<[number, number]>;
  customTheme?: any;
}

/**
 * Compute every cell position (every row × every leaf header) implied by a
 * snapshot config. Used both for FLIP "First" snapshots (pre-change layout)
 * and to feed the renderer the post-change layout for cells that exit the
 * visible band — the off-screen `top` is what we want them to slide *to*.
 */
function computeFullSectionLayout(
  config: BodySectionSnapshotConfig,
): Map<string, CellPosition> {
  const layout = new Map<string, CellPosition>();
  const dataRows = config.rows.filter((r) => !r.nestedTable && !r.stateIndicator);
  for (const tableRow of dataRows) {
    const top = config.customTheme
      ? calculateRowTopPosition({
          position: tableRow.position,
          rowHeight: config.rowHeight,
          heightOffsets: config.heightOffsets,
          customTheme: config.customTheme,
        })
      : tableRow.position * config.rowHeight;
    const rowKey = tableRow.stableRowKey ?? rowIdToString(tableRow.rowId);
    for (const header of config.headerPositions) {
      const cellId = getCellId({
        accessor: header.accessor,
        rowId: rowKey,
      });
      layout.set(cellId, {
        left: header.left,
        top,
        width: header.width,
        height: config.rowHeight,
      });
    }
  }
  return layout;
}

const BODY_CELL_BAND_PADDING = 28;

interface HeaderCellsCacheEntry {
  cells: AbsoluteCell[];
  deps: {
    headersHash: string;
    collapsedHeadersSize: number;
    maxDepth: number;
    headerHeight: number;
  };
}

interface ContextCacheEntry {
  context: CellRenderContext | HeaderRenderContext;
  deps: {
    contextHash: string;
  };
}

export class SectionRenderer {
  private headerSections: Map<string, HTMLElement> = new Map();
  private bodySections: Map<string, HTMLElement> = new Map();

  private bodyCellsCache: Map<string, BodyCellsCacheEntry> = new Map();
  private headerCellsCache: Map<string, HeaderCellsCacheEntry> = new Map();
  private contextCache: Map<string, ContextCacheEntry> = new Map();
  private bodySectionSnapshots: Map<string, BodySectionSnapshotConfig> = new Map();

  // Track the next colIndex for each section after rendering
  private nextColIndexMap: Map<string, number> = new Map();

  // State row elements per section (key: sectionKey, value: Map<position, HTMLElement>)
  private stateRowsMap: Map<string, Map<number, HTMLElement>> = new Map();

  // Nested grid row elements per section (key: sectionKey, value: Map<position, { element, cleanup? }>)
  private nestedGridRowsMap: Map<
    string,
    Map<number, { element: HTMLElement; cleanup?: () => void }>
  > = new Map();

  renderHeaderSection(params: HeaderSectionParams): HTMLElement {
    const {
      headers,
      collapsedHeaders,
      pinned,
      maxHeaderDepth,
      headerHeight,
      context,
      sectionWidth,
      startColIndex = 0,
    } = params;

    const sectionKey = pinned || "main";
    let section = this.headerSections.get(sectionKey);

    if (!section) {
      section = document.createElement("div");
      section.className =
        pinned === "left"
          ? "st-header-pinned-left"
          : pinned === "right"
            ? "st-header-pinned-right"
            : "st-header-main";
      section.setAttribute("role", "rowgroup");
      this.headerSections.set(sectionKey, section);
    }

    const filteredHeaders = headers.filter((h) => {
      if (pinned === "left") return h.pinned === "left";
      if (pinned === "right") return h.pinned === "right";
      return !h.pinned;
    });

    if (filteredHeaders.length === 0) {
      section.style.display = "none";
      return section;
    }

    section.style.display = "";

    section.style.cssText = `
      position: relative;
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      height: ${maxHeaderDepth * headerHeight}px;
    `;

    const absoluteCells = this.getCachedHeaderCells(
      sectionKey,
      filteredHeaders,
      collapsedHeaders,
      maxHeaderDepth,
      headerHeight,
      startColIndex,
    );

    // Calculate and store the next colIndex for this section
    const maxColIndex =
      absoluteCells.length > 0
        ? Math.max(...absoluteCells.map((c) => c.colIndex)) + 1
        : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.getCachedContext(
      `header-${sectionKey}`,
      context,
      pinned,
    );

    // Render with current scrollLeft to preserve scroll position during re-renders
    const currentScrollLeft = section.scrollLeft;
    renderHeaderCells(section, absoluteCells, cachedContext, currentScrollLeft);
    // Restore header scroll after render so the browser doesn't reset it (which would trigger header→body sync and reset body scroll)
    if (!pinned && currentScrollLeft !== section.scrollLeft) {
      section.scrollLeft = currentScrollLeft;
    }

    // For main section (not pinned), attach render function for scroll updates.
    // cachedContext is from the last full header render; during vertical drag-scroll the header
    // may not re-render while selection changes. Callers should pass live selection sets so
    // calculateHeaderCellClasses does not overwrite st-header-* with stale data (flicker).
    if (!pinned && section) {
      (section as any).__renderHeaderCells = (
        scrollLeft: number,
        liveSelection?: {
          columnsWithSelectedCells: Set<number>;
          selectedColumns: Set<number>;
        },
      ) => {
        if (!section) return;
        const ctx =
          liveSelection !== undefined
            ? {
                ...cachedContext,
                columnsWithSelectedCells: liveSelection.columnsWithSelectedCells,
                selectedColumns: liveSelection.selectedColumns,
              }
            : cachedContext;
        renderHeaderCells(section, absoluteCells, ctx, scrollLeft);
      };
    }

    return section;
  }

  renderBodySection(params: BodySectionParams): HTMLElement {
    const {
      headers,
      rows,
      collapsedHeaders,
      pinned,
      context,
      sectionWidth,
      rowHeight,
      heightOffsets,
      totalRowCount,
      startColIndex = 0,
      positionOnly = false,
      fullTableRows,
      renderedStartIndex,
      renderedEndIndex,
      animationCoordinator,
    } = params;

    const sectionKey = pinned || "main";
    let section = this.bodySections.get(sectionKey);
    let isNewSection = false;

    if (!section) {
      section = document.createElement("div");
      section.className =
        pinned === "left"
          ? "st-body-pinned-left"
          : pinned === "right"
            ? "st-body-pinned-right"
            : "st-body-main";
      section.setAttribute("role", "rowgroup");
      this.bodySections.set(sectionKey, section);
      isNewSection = true;
    }

    const filteredHeaders = headers.filter((h) => {
      if (pinned === "left") return h.pinned === "left";
      if (pinned === "right") return h.pinned === "right";
      return !h.pinned;
    });

    if (filteredHeaders.length === 0) {
      section.style.display = "none";
      return section;
    }

    section.style.display = "";

    // Calculate total height properly using calculateTotalHeight with heightOffsets
    const rowCount = totalRowCount !== undefined ? totalRowCount : rows.length;
    const totalHeight = calculateTotalHeight(
      rowCount,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
    );

    section.style.cssText = `
      position: relative;
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      ${!pinned ? "flex-grow: 1;" : ""}
      height: ${totalHeight}px;
    `;

    const absoluteCells = this.getCachedBodyCells(
      sectionKey,
      filteredHeaders,
      rows,
      collapsedHeaders,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
      startColIndex,
      fullTableRows,
      renderedStartIndex,
      renderedEndIndex,
    );

    // Cache just enough state to recompute the position of every cell in this
    // section (including off-screen rows) for animation snapshots. The
    // animation coordinator reads these on captureAnimationSnapshot and
    // needs them to FLIP cells that were never in the DOM (rows that slide
    // into view from off-screen) or that won't be in the DOM after the
    // change (rows that slide out of view).
    this.captureSnapshotConfig(
      sectionKey,
      filteredHeaders,
      collapsedHeaders,
      fullTableRows ?? rows,
      rowHeight,
      heightOffsets,
      context.customTheme ?? DEFAULT_CUSTOM_THEME,
    );

    // The post-render full layout maps every cell id (visible OR off-screen)
    // to its destination in the *new* state. The body cell renderer hands
    // this to the animation coordinator so cells exiting the visible band
    // can slide to their off-screen post-change position before being torn
    // down — instead of just disappearing in place.
    const fullCellLayout = animationCoordinator
      ? this.getFullSectionLayout(sectionKey)
      : null;

    const dataRowCount = rows.filter((r) => !r.nestedTable && !r.stateIndicator).length;
    const maxColIndex =
      absoluteCells.length > 0 && dataRowCount > 0
        ? startColIndex + absoluteCells.length / dataRowCount
        : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.getCachedContext(
      `body-${sectionKey}`,
      context,
      pinned,
    );

    // Render with current scrollLeft to preserve scroll position during re-renders.
    // Pass full rows so separators and nested grid rows account for every row.
    const currentScrollLeft = section.scrollLeft;
    renderBodyCells(
      section,
      absoluteCells,
      cachedContext,
      currentScrollLeft,
      rows,
      positionOnly,
      animationCoordinator,
      fullCellLayout ?? undefined,
    );

    // Render nested grid rows (full-width rows that contain a nested SimpleTable) or spacers in pinned sections
    this.renderNestedGridRows(section, sectionKey, rows, pinned, cachedContext);

    // Render state indicator rows (loading/error/empty) as full-width rows – only in main (non-pinned) section
    if (!pinned) {
      this.renderStateRows(section, sectionKey, rows, cachedContext);
    }

    // For main section (not pinned), attach render function for scroll updates (used by SectionScrollController.onMainSectionScrollLeft)
    if (!pinned && section) {
      (section as any).__renderBodyCells = (scrollLeft: number) => {
        if (section) {
          renderBodyCells(
            section,
            absoluteCells,
            cachedContext,
            scrollLeft,
            rows,
            true,
          );
        }
      };
    }

    return section;
  }

  private renderNestedGridRows(
    section: HTMLElement,
    sectionKey: string,
    rows: TableRow[],
    pinned: "left" | "right" | undefined,
    context: CellRenderContext,
  ): void {
    const nestedRows = rows.filter((r) => r.nestedTable);
    const currentPositions = new Set(nestedRows.map((r) => r.position));

    let map = this.nestedGridRowsMap.get(sectionKey);
    if (!map) {
      map = new Map();
      this.nestedGridRowsMap.set(sectionKey, map);
    }

    // Remove nested row elements that are no longer in the list
    map.forEach((entry, position) => {
      if (!currentPositions.has(position)) {
        entry.cleanup?.();
        entry.element.remove();
        map!.delete(position);
      }
    });

    const nestedContext: NestedGridRowRenderContext = {
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme ?? ({} as any),
      theme: context.theme,
      rowGrouping: context.rowGrouping,
      depth: 0,
      loadingStateRenderer: context.loadingStateRenderer,
      errorStateRenderer: context.errorStateRenderer,
      emptyStateRenderer: context.emptyStateRenderer,
      icons: context.icons,
    };

    nestedRows.forEach((tableRow) => {
      const position = tableRow.position;
      const existing = map!.get(position);

      if (existing) {
        // Already rendered for this position; could update if needed (e.g. height/position changed)
        return;
      }

      if (pinned) {
        const spacer = createNestedGridSpacer(tableRow, {
          rowHeight: context.rowHeight,
          heightOffsets: context.heightOffsets,
          customTheme: context.customTheme ?? ({} as any),
        });
        section.appendChild(spacer);
        map!.set(position, { element: spacer });
      } else {
        nestedContext.depth = tableRow.depth > 0 ? tableRow.depth - 1 : 0;
        const { element, cleanup } = createNestedGridRow(
          tableRow,
          nestedContext,
        );
        section.appendChild(element);
        map!.set(position, { element, cleanup });
      }
    });
  }

  private renderStateRows(
    section: HTMLElement,
    sectionKey: string,
    rows: TableRow[],
    context: CellRenderContext,
  ): void {
    const stateRows = rows.filter((r) => r.stateIndicator);
    const currentPositions = new Set(stateRows.map((r) => r.position));

    let map = this.stateRowsMap.get(sectionKey);
    if (!map) {
      map = new Map();
      this.stateRowsMap.set(sectionKey, map);
    }

    // Remove state row elements that are no longer in the list
    map.forEach((element, position) => {
      if (!currentPositions.has(position)) {
        element.remove();
        map!.delete(position);
      }
    });

    const stateContext: StateRowRenderContext = {
      index: 0,
      rowHeight: context.rowHeight,
      heightOffsets: context.heightOffsets,
      customTheme: context.customTheme ?? ({} as any),
      loadingStateRenderer: context.loadingStateRenderer,
      errorStateRenderer: context.errorStateRenderer,
      emptyStateRenderer: context.emptyStateRenderer,
    };

    stateRows.forEach((tableRow, i) => {
      const position = tableRow.position;
      const existing = map!.get(position);

      if (existing) {
        // Update position in case it changed
        const top = calculateRowTopPosition({
          position,
          rowHeight: context.rowHeight,
          heightOffsets: context.heightOffsets,
          customTheme: context.customTheme ?? ({} as any),
        });
        existing.style.transform = `translate3d(0, ${top}px, 0)`;
        return;
      }

      const rowElement = createStateRow(tableRow, { ...stateContext, index: i });
      // Position the state row correctly
      const top = calculateRowTopPosition({
        position,
        rowHeight: context.rowHeight,
        heightOffsets: context.heightOffsets,
        customTheme: context.customTheme ?? ({} as any),
      });
      rowElement.style.position = "absolute";
      rowElement.style.transform = `translate3d(0, ${top}px, 0)`;
      rowElement.style.width = "100%";
      section.appendChild(rowElement);
      map!.set(position, rowElement);
    });
  }

  private calculateAbsoluteHeaderCells(
    headers: HeaderObject[],
    collapsedHeaders: Set<Accessor>,
    maxDepth: number,
    headerHeight: number,
    startColIndex: number = 0,
  ): AbsoluteCell[] {
    const cells: AbsoluteCell[] = [];
    let colIndex = startColIndex;
    let currentLeft = 0;

    const processHeader = (
      header: HeaderObject,
      depth: number,
      parentHeader?: HeaderObject,
    ): number => {
      if (header.hide || header.excludeFromRender) return 0;

      const isCollapsed = collapsedHeaders.has(header.accessor);
      const hasChildren = header.children && header.children.length > 0;

      if (hasChildren) {
        const visibleChildren = header.children!.filter((child) => {
          const showWhen = child.showWhen || "parentExpanded";
          if (isCollapsed) {
            return showWhen === "parentCollapsed" || showWhen === "always";
          } else {
            return showWhen === "parentExpanded" || showWhen === "always";
          }
        });

        if (header.singleRowChildren) {
          const width = typeof header.width === "number" ? header.width : 150;
          cells.push({
            header,
            left: currentLeft,
            top: depth * headerHeight,
            width,
            height: (maxDepth - depth) * headerHeight,
            colIndex,
            parentHeader,
          });
          colIndex++;
          currentLeft += width;

          let childrenWidth = 0;
          visibleChildren.forEach((child) => {
            childrenWidth += processHeader(child, depth, header);
          });

          return width + childrenWidth;
        }

        if (visibleChildren.length === 0) {
          const width = typeof header.width === "number" ? header.width : 150;
          cells.push({
            header,
            left: currentLeft,
            top: depth * headerHeight,
            width,
            height: (maxDepth - depth) * headerHeight,
            colIndex,
            parentHeader,
          });
          colIndex++;
          currentLeft += width;
          return width;
        }

        // Parent with children - process children first, then add parent cell.
        // colIndex must be the first leaf index under this group: getHeaderLeafIndices
        // and column-highlight logic assume parent headers start at their first child's index.
        // (Using the post-children colIndex wrongly made the next sibling's first leaf match this group.)
        const parentLeft = currentLeft;
        const groupStartColIndex = colIndex;
        let totalChildrenWidth = 0;
        visibleChildren.forEach((child) => {
          totalChildrenWidth += processHeader(child, depth + 1, header);
        });

        // Add parent cell spanning all children
        cells.push({
          header,
          left: parentLeft,
          top: depth * headerHeight,
          width: totalChildrenWidth,
          height: headerHeight,
          colIndex: groupStartColIndex,
          parentHeader,
        });

        return totalChildrenWidth;
      } else {
        const width = typeof header.width === "number" ? header.width : 150;
        cells.push({
          header,
          left: currentLeft,
          top: depth * headerHeight,
          width,
          height: (maxDepth - depth) * headerHeight,
          colIndex,
          parentHeader,
        });
        colIndex++;
        currentLeft += width;
        return width;
      }
    };

    headers.forEach((header) => processHeader(header, 0));

    return cells;
  }

  private calculateAbsoluteBodyCells(
    headers: HeaderObject[],
    rows: TableRow[],
    collapsedHeaders: Set<Accessor>,
    rowHeight: number,
    heightOffsets?: Array<[number, number]>,
    customTheme?: any,
    startColIndex: number = 0,
  ): AbsoluteBodyCell[] {
    const cells: AbsoluteBodyCell[] = [];

    // Exclude nested table rows and state indicator rows – both are rendered as full-width rows, not per-column cells
    const rowsForCells = rows.filter((r) => !r.nestedTable && !r.stateIndicator);

    const leafHeaders = this.getLeafHeaders(headers, collapsedHeaders);

    // Build header positions map with accumulated widths
    const headerPositions = new Map<string, { left: number; width: number }>();
    let currentLeft = 0;
    leafHeaders.forEach((header) => {
      const width = typeof header.width === "number" ? header.width : 150;
      headerPositions.set(header.accessor, { left: currentLeft, width });
      currentLeft += width;
    });

    rowsForCells.forEach((tableRow, rowIndex) => {
      // Calculate proper top position using calculateRowTopPosition
      const topPosition = customTheme
        ? calculateRowTopPosition({
            position: tableRow.position,
            rowHeight,
            heightOffsets,
            customTheme,
          })
        : rowIndex * rowHeight;

      // Derive odd/even from the row's absolute table position rather than
      // its index in the rendered (virtualized) slice. The slice index changes
      // every time the user scrolls, which would otherwise flip a row's
      // odd/even class as soon as it's reused for a different visible row.
      const isOdd = tableRow.position % 2 === 1;

      leafHeaders.forEach((header, leafIndex) => {
        const position = headerPositions.get(header.accessor);
        const colIndex = startColIndex + leafIndex;
        cells.push({
          header,
          row: tableRow.row,
          rowIndex,
          colIndex,
          rowId: rowIdToString(tableRow.rowId),
          stableRowKey: tableRow.stableRowKey,
          displayRowNumber: tableRow.displayPosition,
          depth: tableRow.depth,
          isOdd,
          tableRow,
          left: position?.left ?? 0,
          top: topPosition,
          width: position?.width ?? 150,
          height: rowHeight,
        });
      });
    });

    return cells;
  }

  private getLeafHeaders(
    headers: HeaderObject[],
    collapsedHeaders: Set<Accessor>,
  ): HeaderObject[] {
    const leaves: HeaderObject[] = [];

    const processHeader = (header: HeaderObject): void => {
      if (header.hide || header.excludeFromRender) return;

      const isCollapsed = collapsedHeaders.has(header.accessor);
      const hasChildren = header.children && header.children.length > 0;

      if (hasChildren) {
        const visibleChildren = header.children!.filter((child) => {
          const showWhen = child.showWhen || "parentExpanded";
          if (isCollapsed) {
            return showWhen === "parentCollapsed" || showWhen === "always";
          } else {
            return showWhen === "parentExpanded" || showWhen === "always";
          }
        });

        if (header.singleRowChildren) {
          leaves.push(header);
        }

        if (visibleChildren.length > 0) {
          visibleChildren.forEach((child) => processHeader(child));
        } else if (!header.singleRowChildren) {
          leaves.push(header);
        }
      } else {
        leaves.push(header);
      }
    };

    headers.forEach((header) => processHeader(header));

    return leaves;
  }

  private createHeadersHash(headers: HeaderObject[]): string {
    const hashHeader = (h: HeaderObject): string => {
      let hash = `${h.accessor}:${h.width}:${h.pinned || ""}:${h.hide || ""}`;
      if (h.children && h.children.length > 0) {
        hash += `:children[${h.children.map(hashHeader).join(",")}]`;
      }
      return hash;
    };
    return headers.map(hashHeader).join("|");
  }

  private createHeightOffsetsHash(
    heightOffsets?: Array<[number, number]>,
  ): string {
    if (!heightOffsets || heightOffsets.length === 0) return "";
    return heightOffsets.map(([pos, height]) => `${pos}:${height}`).join("|");
  }

  private createContextHash(context: any): string {
    const keys = [
      "columnBorders",
      "enableRowSelection",
      "cellUpdateFlash",
      "useOddColumnBackground",
      "useHoverRowBackground",
      "useOddEvenRowBackground",
      "rowHeight",
      "containerWidth",
    ];
    let hash = keys.map((k) => `${k}:${context[k]}`).join("|");

    // Include sort state in hash for header context
    if (context.sort) {
      hash += `|sort:${context.sort.key.accessor}-${context.sort.direction}`;
    } else {
      hash += `|sort:none`;
    }

    // Include filter state in hash for header context
    if (context.filters && Object.keys(context.filters).length > 0) {
      hash += `|filters:${JSON.stringify(context.filters)}`;
    } else {
      hash += `|filters:none`;
    }

    // Include expansion state in hash for body context
    if (context.expandedRows) {
      hash += `|expandedRows:${context.expandedRows.size}`;
    }
    if (context.collapsedRows) {
      hash += `|collapsedRows:${context.collapsedRows.size}`;
    }
    if (context.expandedDepths) {
      hash += `|expandedDepths:${Array.isArray(context.expandedDepths) ? context.expandedDepths.length : context.expandedDepths.size}`;
    }
    // Include column collapse state so header/body re-render with correct collapse icons and visibility
    if (context.collapsedHeaders != null) {
      const size = context.collapsedHeaders.size;
      const serialized =
        size === 0
          ? ""
          : Array.from(context.collapsedHeaders as Set<unknown>)
              .sort()
              .join(",");
      hash += `|collapsedHeaders:${size}:${serialized}`;
    }
    // Include row selection so body re-renders with updated isRowSelected when selection changes
    if (context.selectedRowCount !== undefined) {
      hash += `|selectedRowCount:${context.selectedRowCount}`;
    }
    // Include column selection so header/body re-render with st-header-selected and st-cell-column-selected
    if (context.selectedColumns && context.selectedColumns.size !== undefined) {
      hash += `|selectedColumns:${Array.from(
        context.selectedColumns as Set<number>,
      )
        .sort((a, b) => a - b)
        .join(",")}`;
    }
    if (
      context.columnsWithSelectedCells &&
      context.columnsWithSelectedCells.size !== undefined
    ) {
      hash += `|columnsWithSelectedCells:${Array.from(
        context.columnsWithSelectedCells as Set<number>,
      )
        .sort((a, b) => a - b)
        .join(",")}`;
    }
    if (
      context.rowsWithSelectedCells &&
      context.rowsWithSelectedCells.size !== undefined
    ) {
      hash += `|rowsWithSelectedCells:${Array.from(
        context.rowsWithSelectedCells as Set<string>,
      )
        .sort()
        .join(",")}`;
    }

    return hash;
  }

  private getCachedBodyCells(
    sectionKey: string,
    headers: HeaderObject[],
    rows: TableRow[],
    collapsedHeaders: Set<Accessor>,
    rowHeight: number,
    heightOffsets?: Array<[number, number]>,
    customTheme?: any,
    startColIndex: number = 0,
    fullTableRows?: TableRow[],
    renderedStartIndex?: number,
    renderedEndIndex?: number,
  ): AbsoluteBodyCell[] {
    const headersHash = this.createHeadersHash(headers);
    const heightOffsetsHash = this.createHeightOffsetsHash(heightOffsets);
    const useRangeCache =
      fullTableRows != null &&
      renderedStartIndex != null &&
      renderedEndIndex != null;

    const cached = this.bodyCellsCache.get(sectionKey);

    const bandCoversViewport = (bandStart: number, bandEnd: number) =>
      bandStart <= renderedStartIndex! && bandEnd >= renderedEndIndex!;

    const cacheHit =
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.rowHeight === rowHeight &&
      cached.deps.heightOffsetsHash === heightOffsetsHash &&
      (useRangeCache
        ? cached.deps.fullTableRowsRef === fullTableRows &&
          cached.deps.bandStart !== undefined &&
          cached.deps.bandEnd !== undefined &&
          bandCoversViewport(cached.deps.bandStart, cached.deps.bandEnd)
        : cached.deps.rowsRef === rows);

    if (cacheHit && cached) {
      if (!useRangeCache) {
        return cached.cells;
      }
      const positionToVisualIndex = new Map<number, number>();
      rows.forEach((r, i) => {
        positionToVisualIndex.set(r.position, i);
      });
      const out: AbsoluteBodyCell[] = [];
      for (const c of cached.cells) {
        const ri = positionToVisualIndex.get(c.tableRow.position);
        if (ri === undefined) continue;
        // isOdd is derived from c.tableRow.position upstream and is stable
        // across viewport scrolls — only the visual rowIndex needs remapping.
        if (c.rowIndex !== ri) {
          out.push({ ...c, rowIndex: ri });
        } else {
          out.push(c);
        }
      }
      return out;
    }

    let bandSlice: TableRow[];
    let bandStart: number | undefined;
    let bandEnd: number | undefined;
    if (useRangeCache) {
      const n = fullTableRows!.length;
      bandStart = Math.max(0, renderedStartIndex! - BODY_CELL_BAND_PADDING);
      bandEnd = Math.min(n, renderedEndIndex! + BODY_CELL_BAND_PADDING);
      bandSlice = fullTableRows!.slice(bandStart, bandEnd);
    } else {
      bandSlice = rows;
    }

    const cells = this.calculateAbsoluteBodyCells(
      headers,
      bandSlice,
      collapsedHeaders,
      rowHeight,
      heightOffsets,
      customTheme,
      startColIndex,
    );

    this.bodyCellsCache.set(sectionKey, {
      cells,
      deps: {
        headersHash,
        rowsRef: bandSlice,
        collapsedHeadersSize: collapsedHeaders.size,
        rowHeight,
        heightOffsetsHash,
        ...(useRangeCache && {
          fullTableRowsRef: fullTableRows,
          bandStart,
          bandEnd,
        }),
      },
    });

    if (!useRangeCache) {
      return cells;
    }

    const positionToVisualIndex = new Map<number, number>();
    rows.forEach((r, i) => {
      positionToVisualIndex.set(r.position, i);
    });
    const mapped: AbsoluteBodyCell[] = [];
    for (const c of cells) {
      const ri = positionToVisualIndex.get(c.tableRow.position);
      if (ri === undefined) continue;
      // isOdd is derived from c.tableRow.position upstream and is stable
      // across viewport scrolls — only the visual rowIndex needs remapping.
      if (c.rowIndex !== ri) {
        mapped.push({ ...c, rowIndex: ri });
      } else {
        mapped.push(c);
      }
    }
    return mapped;
  }

  private getCachedHeaderCells(
    sectionKey: string,
    headers: HeaderObject[],
    collapsedHeaders: Set<Accessor>,
    maxDepth: number,
    headerHeight: number,
    startColIndex: number = 0,
  ): AbsoluteCell[] {
    const cached = this.headerCellsCache.get(sectionKey);

    const headersHash = this.createHeadersHash(headers);

    if (
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.maxDepth === maxDepth &&
      cached.deps.headerHeight === headerHeight
    ) {
      return cached.cells;
    }

    const cells = this.calculateAbsoluteHeaderCells(
      headers,
      collapsedHeaders,
      maxDepth,
      headerHeight,
      startColIndex,
    );

    this.headerCellsCache.set(sectionKey, {
      cells,
      deps: {
        headersHash,
        collapsedHeadersSize: collapsedHeaders.size,
        maxDepth,
        headerHeight,
      },
    });

    return cells;
  }

  private getCachedContext<T extends CellRenderContext | HeaderRenderContext>(
    cacheKey: string,
    context: T,
    pinned?: "left" | "right",
  ): T {
    const cached = this.contextCache.get(cacheKey);
    const contextHash = this.createContextHash(context);

    if (cached && cached.deps.contextHash === contextHash) {
      return cached.context as T;
    }

    const newContext = { ...context, pinned };
    this.contextCache.set(cacheKey, {
      context: newContext,
      deps: { contextHash },
    });

    return newContext as T;
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    if (!type || type === "all") {
      this.bodyCellsCache.clear();
      this.headerCellsCache.clear();
      this.contextCache.clear();
      // Clear rendered cell elements from all body sections
      this.bodySections.forEach((section) => {
        cleanupBodyCellRendering(section);
      });
      // Clear rendered cell elements from all header sections
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section);
      });
    } else if (type === "body") {
      // Only clear the calculated cells cache so we recompute the cell list (e.g. after expand/collapse).
      // Do NOT clear rendered cell elements: renderBodyCells will update existing cells in place
      // (so expand icon can animate) and remove only cells no longer visible.
      this.bodyCellsCache.clear();
    } else if (type === "header") {
      // Only clear the calculated cells cache so we recompute layout for new header order/widths.
      // Do NOT clear rendered cell elements: renderHeaderCells reuses cells by accessor and updates
      // position/classes in place. Tearing down cells on every drag swap caused visible flicker
      // because each `dragover` recreated all 11 header cells (debug session 65665a, H6).
      this.headerCellsCache.clear();
    } else if (type === "context") {
      this.contextCache.clear();
      // Recompute absolute header layout from current effectiveHeaders; otherwise
      // cached AbsoluteCell.header refs drift from live objects (sort/resize bug).
      this.headerCellsCache.clear();
      // Do NOT clear rendered header cells: renderHeaderCells refreshes icons (sort/filter)
      // in place via per-cell iconState tracking on dataset. See `renderHeaderCells`
      // existing-cell branch in `headerCellRenderer.ts`.
    }
  }

  /**
   * Get the next colIndex after rendering a section
   */
  getNextColIndex(sectionKey: string): number {
    return this.nextColIndexMap.get(sectionKey) ?? 0;
  }

  /**
   * Build a per-section layout map covering every cell in the dataset (every
   * row × every leaf header), not just the cells in the current virtualization
   * band. Used by the animation coordinator: it needs positions for off-screen
   * rows so that:
   *
   *   - Cells that newly enter the visible band (e.g. row sorted from bottom
   *     to top) can FLIP in from their actual pre-change off-screen `top`.
   *   - Cells that leave the visible band (e.g. row sorted from top to
   *     bottom) can be retained and slid to their actual post-change
   *     off-screen `top` before being removed.
   *
   * The body container clips overflow so cells whose interpolated position
   * falls outside the viewport simply aren't painted — the animation looks
   * like a slide in from / out to the viewport edge.
   */
  getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>> {
    const out = new Map<HTMLElement, Map<string, CellPosition>>();
    this.bodySectionSnapshots.forEach((config, sectionKey) => {
      const section = this.bodySections.get(sectionKey);
      if (!section) return;
      out.set(section, computeFullSectionLayout(config));
    });
    return out;
  }

  /**
   * Compute every cell position the section currently knows about (every row
   * × every leaf header), including positions for off-screen rows, by using
   * the most recent snapshot config for `sectionKey`. Returns null if no
   * snapshot has been captured for this section yet.
   */
  getFullSectionLayout(sectionKey: string): Map<string, CellPosition> | null {
    const config = this.bodySectionSnapshots.get(sectionKey);
    return config ? computeFullSectionLayout(config) : null;
  }

  /**
   * Refresh the per-section snapshot config so getCurrentBodyLayouts can
   * recompute positions for any row × column combination the section
   * currently knows about.
   */
  private captureSnapshotConfig(
    sectionKey: string,
    headers: HeaderObject[],
    collapsedHeaders: Set<Accessor>,
    rows: TableRow[],
    rowHeight: number,
    heightOffsets?: Array<[number, number]>,
    customTheme?: any,
  ): void {
    const leafHeaders = this.getLeafHeaders(headers, collapsedHeaders);
    const headerPositions: Array<{ accessor: Accessor; left: number; width: number }> = [];
    let currentLeft = 0;
    for (const header of leafHeaders) {
      const width = typeof header.width === "number" ? header.width : 150;
      headerPositions.push({ accessor: header.accessor, left: currentLeft, width });
      currentLeft += width;
    }
    this.bodySectionSnapshots.set(sectionKey, {
      rows,
      headerPositions,
      rowHeight,
      heightOffsets,
      customTheme,
    });
  }

  cleanup(): void {
    this.headerSections.clear();
    this.bodySections.clear();
    this.bodyCellsCache.clear();
    this.headerCellsCache.clear();
    this.contextCache.clear();
    this.bodySectionSnapshots.clear();
    this.nextColIndexMap.clear();
  }
}
