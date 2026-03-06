import HeaderObject, { Accessor } from "../../types/HeaderObject";
import {
  renderHeaderCells,
  AbsoluteCell,
  HeaderRenderContext,
} from "../../utils/headerCellRenderer";
import { renderBodyCells, AbsoluteBodyCell, CellRenderContext } from "../../utils/bodyCellRenderer";
import TableRow from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";
import { calculateTotalHeight, calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import { scrollSyncManager } from "../../utils/scrollSyncManager";

interface SectionDimensions {
  mainWidth: number;
  leftWidth: number;
  rightWidth: number;
  leftContentWidth: number;
  rightContentWidth: number;
}

export interface HeaderSectionParams {
  headers: HeaderObject[];
  collapsedHeaders: Set<Accessor>;
  autoExpandColumns?: boolean;
  pinned?: "left" | "right";
  maxHeaderDepth: number;
  headerHeight: number;
  context: HeaderRenderContext;
  sectionWidth?: number;
}

export interface BodySectionParams {
  headers: HeaderObject[];
  rows: TableRow[];
  collapsedHeaders: Set<Accessor>;
  autoExpandColumns?: boolean;
  pinned?: "left" | "right";
  context: CellRenderContext;
  sectionWidth?: number;
  rowHeight: number;
  heightOffsets?: Array<[number, number]>;
  totalRowCount?: number;
}

export class SectionRenderer {
  private headerSections: Map<string, HTMLElement> = new Map();
  private bodySections: Map<string, HTMLElement> = new Map();
  private registeredBodySections: Map<string, { element: HTMLElement; groups: string[] }> = new Map();

  renderHeaderSection(params: HeaderSectionParams): HTMLElement {
    const {
      headers,
      collapsedHeaders,
      autoExpandColumns,
      pinned,
      maxHeaderDepth,
      headerHeight,
      context,
      sectionWidth,
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
      ${!pinned ? "flex-grow: 1;" : ""}
      height: ${maxHeaderDepth * headerHeight}px;
    `;

    const absoluteCells = this.calculateAbsoluteHeaderCells(
      filteredHeaders,
      collapsedHeaders,
      maxHeaderDepth,
      headerHeight,
    );

    // Initial render with scrollLeft = 0
    renderHeaderCells(section, absoluteCells, { ...context, pinned }, 0);

    // For main section (not pinned), attach render function for scroll updates
    if (!pinned && section) {
      (section as any).__renderHeaderCells = (scrollLeft: number) => {
        if (section) {
          renderHeaderCells(section, absoluteCells, { ...context, pinned }, scrollLeft);
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
      autoExpandColumns,
      pinned,
      context,
      sectionWidth,
      rowHeight,
      heightOffsets,
      totalRowCount,
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
      context.customTheme
    );
    
    section.style.cssText = `
      position: relative;
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      ${!pinned ? "flex-grow: 1;" : ""}
      height: ${totalHeight}px;
    `;

    const absoluteCells = this.calculateAbsoluteBodyCells(
      filteredHeaders,
      rows,
      collapsedHeaders,
      rowHeight,
      heightOffsets,
      context.customTheme,
    );

    // Initial render with scrollLeft = 0
    renderBodyCells(section, absoluteCells, { ...context, pinned }, 0);

    // For main section (not pinned), attach render function for scroll updates
    if (!pinned && section) {
      (section as any).__renderBodyCells = (scrollLeft: number) => {
        if (section) {
          renderBodyCells(section, absoluteCells, { ...context, pinned }, scrollLeft);
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
  ): AbsoluteCell[] {
    const cells: AbsoluteCell[] = [];
    let colIndex = 0;
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

        // Parent with children - accumulate children widths
        let totalChildrenWidth = 0;
        visibleChildren.forEach((child) => {
          totalChildrenWidth += processHeader(child, depth + 1, header);
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

      leafHeaders.forEach((header, colIndex) => {
        const position = headerPositions.get(header.accessor);
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

  cleanup(): void {
    // Unregister all body sections from scrollSyncManager
    this.registeredBodySections.forEach(({ element, groups }) => {
      scrollSyncManager.unregisterPane(element, groups);
    });
    this.registeredBodySections.clear();
    
    this.headerSections.clear();
    this.bodySections.clear();
  }
}
