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
import { DEFAULT_CUSTOM_THEME } from "../../types/CustomTheme";
import {
  calculateTotalHeight,
  calculateRowTopPosition,
} from "../../utils/infiniteScrollUtils";
import {
  createNestedGridRow,
  createNestedGridSpacer,
  type NestedGridRowRenderContext,
} from "../../utils/nestedGridRowRenderer";

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
}

interface BodyCellsCacheEntry {
  cells: AbsoluteBodyCell[];
  deps: {
    headersHash: string;
    rowsRef: TableRow[];
    collapsedHeadersSize: number;
    rowHeight: number;
    heightOffsetsHash: string;
    /** Range-based cache: when set, cache key includes these instead of rowsRef for stable key on scroll. */
    renderedStartIndex?: number;
    renderedEndIndex?: number;
    fullTableRowsRef?: TableRow[];
  };
}

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

  // Track the next colIndex for each section after rendering
  private nextColIndexMap: Map<string, number> = new Map();

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

    // For main section (not pinned), attach render function for scroll updates
    if (!pinned && section) {
      (section as any).__renderHeaderCells = (scrollLeft: number) => {
        if (section) {
          renderHeaderCells(section, absoluteCells, cachedContext, scrollLeft);
        }
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

    // Calculate and store the next colIndex for this section
    const maxColIndex =
      absoluteCells.length > 0
        ? Math.max(...absoluteCells.map((c) => c.colIndex)) + 1
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
    );

    // Render nested grid rows (full-width rows that contain a nested SimpleTable) or spacers in pinned sections
    this.renderNestedGridRows(section, sectionKey, rows, pinned, cachedContext);

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
            height: headerHeight,
            colIndex,
            parentHeader,
          });
          colIndex++;
          currentLeft += width;

          let childrenWidth = 0;
          visibleChildren.forEach((child) => {
            childrenWidth += processHeader(child, depth + 1, header);
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

        // Parent with children - process children first, then add parent cell
        const parentLeft = currentLeft;
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
          colIndex,
          parentHeader,
        });
        colIndex++;

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

    // Exclude nested table rows – they are rendered as full-width nested grid rows, not per-column cells
    const rowsForCells = rows.filter((r) => !r.nestedTable);

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

      leafHeaders.forEach((header, leafIndex) => {
        const position = headerPositions.get(header.accessor);
        const colIndex = startColIndex + leafIndex;
        cells.push({
          header,
          row: tableRow.row,
          rowIndex,
          colIndex,
          rowId: rowIdToString(tableRow.rowId),
          displayRowNumber: tableRow.displayPosition,
          depth: tableRow.depth,
          isOdd: rowIndex % 2 === 1,
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

    const cacheHit =
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.rowHeight === rowHeight &&
      cached.deps.heightOffsetsHash === heightOffsetsHash &&
      (useRangeCache
        ? cached.deps.fullTableRowsRef === fullTableRows &&
          cached.deps.renderedStartIndex === renderedStartIndex &&
          cached.deps.renderedEndIndex === renderedEndIndex
        : cached.deps.rowsRef === rows);

    if (cacheHit) {
      return cached.cells;
    }

    const rowsToCompute = useRangeCache
      ? fullTableRows!.slice(renderedStartIndex!, renderedEndIndex!)
      : rows;

    const cells = this.calculateAbsoluteBodyCells(
      headers,
      rowsToCompute,
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
        rowsRef: rowsToCompute,
        collapsedHeadersSize: collapsedHeaders.size,
        rowHeight,
        heightOffsetsHash,
        ...(useRangeCache && {
          fullTableRowsRef: fullTableRows,
          renderedStartIndex,
          renderedEndIndex,
        }),
      },
    });

    return cells;
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
      this.headerCellsCache.clear();
      // Clear rendered cell elements from all header sections
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section);
      });
    } else if (type === "context") {
      this.contextCache.clear();
      // Clear header rendered elements so sort indicators etc. update.
      // Do NOT clear body rendered elements: renderBodyCells will update existing cells
      // in place (e.g. selection classes, expand icon state) so expand icon can animate.
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section);
      });
    }
  }

  /**
   * Get the next colIndex after rendering a section
   */
  getNextColIndex(sectionKey: string): number {
    return this.nextColIndexMap.get(sectionKey) ?? 0;
  }

  cleanup(): void {
    this.headerSections.clear();
    this.bodySections.clear();
    this.bodyCellsCache.clear();
    this.headerCellsCache.clear();
    this.contextCache.clear();
    this.nextColIndexMap.clear();
  }
}
