import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { renderHeaderCells, AbsoluteCell, HeaderRenderContext } from "../../utils/headerCellRenderer";
import { renderBodyCells, AbsoluteBodyCell, CellRenderContext } from "../../utils/bodyCellRenderer";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableRow from "../../types/TableRow";
import { rowIdToString } from "../../utils/rowUtils";

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
}

export class SectionRenderer {
  private headerSections: Map<string, HTMLElement> = new Map();
  private bodySections: Map<string, HTMLElement> = new Map();

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
      section.className = `st-header-section${pinned ? ` st-pinned-${pinned}` : " st-main"}`;
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

    const gridTemplateColumns = createGridTemplateColumns({
      headers: filteredHeaders,
      collapsedHeaders,
      autoExpandColumns,
    });

    section.style.cssText = `
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      grid-template-columns: ${gridTemplateColumns};
      height: ${maxHeaderDepth * headerHeight}px;
    `;

    const absoluteCells = this.calculateAbsoluteHeaderCells(
      filteredHeaders,
      collapsedHeaders,
      maxHeaderDepth,
      headerHeight,
    );

    renderHeaderCells(section, absoluteCells, { ...context, pinned }, 0);

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
    } = params;

    const sectionKey = pinned || "main";
    let section = this.bodySections.get(sectionKey);

    if (!section) {
      section = document.createElement("div");
      section.className = `st-body-section${pinned ? ` st-pinned-${pinned}` : " st-main"}`;
      section.setAttribute("role", "rowgroup");
      this.bodySections.set(sectionKey, section);
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

    const gridTemplateColumns = createGridTemplateColumns({
      headers: filteredHeaders,
      collapsedHeaders,
      autoExpandColumns,
    });

    section.style.cssText = `
      ${sectionWidth !== undefined ? `width: ${sectionWidth}px;` : ""}
      grid-template-columns: ${gridTemplateColumns};
    `;

    const absoluteCells = this.calculateAbsoluteBodyCells(
      filteredHeaders,
      rows,
      collapsedHeaders,
      rowHeight,
    );

    renderBodyCells(section, absoluteCells, { ...context, pinned }, 0);

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

    const processHeader = (
      header: HeaderObject,
      depth: number,
      parentHeader?: HeaderObject,
    ): void => {
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
          const width = typeof header.width === "number" ? header.width : 150;
          cells.push({
            header,
            left: colIndex * width,
            top: depth * headerHeight,
            width,
            height: headerHeight,
            colIndex,
            parentHeader,
          });
          colIndex++;
        }

        visibleChildren.forEach((child) => {
          processHeader(child, depth + 1, header);
        });

        if (!header.singleRowChildren && visibleChildren.length === 0) {
          const width = typeof header.width === "number" ? header.width : 150;
          cells.push({
            header,
            left: colIndex * width,
            top: depth * headerHeight,
            width,
            height: (maxDepth - depth) * headerHeight,
            colIndex,
            parentHeader,
          });
          colIndex++;
        }
      } else {
        const width = typeof header.width === "number" ? header.width : 150;
        cells.push({
          header,
          left: colIndex * width,
          top: depth * headerHeight,
          width,
          height: (maxDepth - depth) * headerHeight,
          colIndex,
          parentHeader,
        });
        colIndex++;
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
  ): AbsoluteBodyCell[] {
    const cells: AbsoluteBodyCell[] = [];

    const leafHeaders = this.getLeafHeaders(headers, collapsedHeaders);

    rows.forEach((tableRow, rowIndex) => {
      leafHeaders.forEach((header, colIndex) => {
        const width = typeof header.width === "number" ? header.width : 150;
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
          left: colIndex * width,
          top: rowIndex * rowHeight,
          width,
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

  cleanup(): void {
    this.headerSections.clear();
    this.bodySections.clear();
  }
}
