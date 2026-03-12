import HeaderObject, { Accessor } from "../../types/HeaderObject";
import {
  renderHeaderCells,
  AbsoluteCell,
  HeaderRenderContext,
  cleanupHeaderCellRendering,
} from "../../utils/headerCellRenderer";
import { renderBodyCells, AbsoluteBodyCell, CellRenderContext, cleanupBodyCellRendering } from "../../utils/bodyCellRenderer";
import TableRow from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";
import { calculateTotalHeight, calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import { scrollSyncManager } from "../../utils/scrollSyncManager";

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
}

interface BodyCellsCacheEntry {
  cells: AbsoluteBodyCell[];
  deps: {
    headersHash: string;
    rowsRef: TableRow[];
    collapsedHeadersSize: number;
    rowHeight: number;
    heightOffsetsHash: string;
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
  private registeredBodySections: Map<string, { element: HTMLElement; groups: string[] }> =
    new Map();

  private bodyCellsCache: Map<string, BodyCellsCacheEntry> = new Map();
  private headerCellsCache: Map<string, HeaderCellsCacheEntry> = new Map();
  private contextCache: Map<string, ContextCacheEntry> = new Map();
  
  // Track the next colIndex for each section after rendering
  private nextColIndexMap: Map<string, number> = new Map();

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
    const maxColIndex = absoluteCells.length > 0 
      ? Math.max(...absoluteCells.map(c => c.colIndex)) + 1
      : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.getCachedContext(`header-${sectionKey}`, context, pinned);

    // Render with current scrollLeft to preserve scroll position during re-renders
    const currentScrollLeft = section.scrollLeft;
    renderHeaderCells(section, absoluteCells, cachedContext, currentScrollLeft);

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
      context.customTheme,
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
      context.customTheme,
      startColIndex,
    );
    
    // Calculate and store the next colIndex for this section
    const maxColIndex = absoluteCells.length > 0 
      ? Math.max(...absoluteCells.map(c => c.colIndex)) + 1
      : startColIndex;
    this.nextColIndexMap.set(sectionKey, maxColIndex);

    const cachedContext = this.getCachedContext(`body-${sectionKey}`, context, pinned);

    // Render with current scrollLeft to preserve scroll position during re-renders
    const currentScrollLeft = section.scrollLeft;
    renderBodyCells(section, absoluteCells, cachedContext, currentScrollLeft);

    // For main section (not pinned), attach render function for scroll updates
    if (!pinned && section) {
      (section as any).__renderBodyCells = (scrollLeft: number) => {
        if (section) {
          renderBodyCells(section, absoluteCells, cachedContext, scrollLeft);
        }
      };
    }

    // Register section with scrollSyncManager for horizontal scrollbar sync
    if (isNewSection) {
      const group = pinned ? `pinned-${pinned}` : "default";
      scrollSyncManager.registerPane(section, [group]);
      this.registeredBodySections.set(sectionKey, { element: section, groups: [group] });
    }

    return section;
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

    const leafHeaders = this.getLeafHeaders(headers, collapsedHeaders);

    // Build header positions map with accumulated widths
    const headerPositions = new Map<string, { left: number; width: number }>();
    let currentLeft = 0;
    leafHeaders.forEach((header) => {
      const width = typeof header.width === "number" ? header.width : 150;
      headerPositions.set(header.accessor, { left: currentLeft, width });
      currentLeft += width;
    });

    rows.forEach((tableRow, rowIndex) => {
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

  private getLeafHeaders(headers: HeaderObject[], collapsedHeaders: Set<Accessor>): HeaderObject[] {
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

  private createHeightOffsetsHash(heightOffsets?: Array<[number, number]>): string {
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
  ): AbsoluteBodyCell[] {
    const cached = this.bodyCellsCache.get(sectionKey);

    const headersHash = this.createHeadersHash(headers);
    const heightOffsetsHash = this.createHeightOffsetsHash(heightOffsets);

    const cacheHit =
      cached &&
      cached.deps.headersHash === headersHash &&
      cached.deps.rowsRef === rows &&
      cached.deps.collapsedHeadersSize === collapsedHeaders.size &&
      cached.deps.rowHeight === rowHeight &&
      cached.deps.heightOffsetsHash === heightOffsetsHash;

    if (cacheHit) {
      return cached.cells;
    }
    const cells = this.calculateAbsoluteBodyCells(
      headers,
      rows,
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
        rowsRef: rows,
        collapsedHeadersSize: collapsedHeaders.size,
        rowHeight,
        heightOffsetsHash,
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
      this.bodyCellsCache.clear();
      // Clear rendered cell elements from all body sections
      this.bodySections.forEach((section) => {
        cleanupBodyCellRendering(section);
      });
    } else if (type === "header") {
      this.headerCellsCache.clear();
      // Clear rendered cell elements from all header sections
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section);
      });
    } else if (type === "context") {
      this.contextCache.clear();
      // Context cache affects both headers (sort indicators) and body (selection state)
      // Clear rendered elements from both to force re-render with new context
      this.headerSections.forEach((section) => {
        cleanupHeaderCellRendering(section);
      });
      this.bodySections.forEach((section) => {
        cleanupBodyCellRendering(section);
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
    // Unregister all body sections from scrollSyncManager
    this.registeredBodySections.forEach(({ element, groups }) => {
      scrollSyncManager.unregisterPane(element, groups);
    });
    this.registeredBodySections.clear();

    this.headerSections.clear();
    this.bodySections.clear();
    this.bodyCellsCache.clear();
    this.headerCellsCache.clear();
    this.contextCache.clear();
    this.nextColIndexMap.clear();
  }
}
