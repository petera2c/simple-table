import { renderBodyCells, cleanupBodyCellRendering, CellRenderContext } from "../utils/bodyCellRenderer";
import { renderHeaderCells, cleanupHeaderCellRendering, HeaderRenderContext } from "../utils/headerCellRenderer";
import { AbsoluteBodyCell } from "../utils/bodyCell/types";
import { AbsoluteCell } from "../utils/headerCell/types";
import { TableManager } from "../managers/TableManager";

export interface TableRendererConfig {
  tableManager: TableManager;
  headerContainer?: HTMLElement;
  bodyContainer?: HTMLElement;
  pinnedLeftHeaderContainer?: HTMLElement;
  pinnedLeftBodyContainer?: HTMLElement;
  pinnedRightHeaderContainer?: HTMLElement;
  pinnedRightBodyContainer?: HTMLElement;
}

export class TableRenderer {
  private config: TableRendererConfig;
  private tableManager: TableManager;

  constructor(config: TableRendererConfig) {
    this.config = config;
    this.tableManager = config.tableManager;
  }

  updateConfig(config: Partial<TableRendererConfig>): void {
    this.config = { ...this.config, ...config };
  }

  renderHeaders(
    container: HTMLElement,
    absoluteCells: AbsoluteCell[],
    context: HeaderRenderContext,
    scrollLeft: number = 0
  ): void {
    renderHeaderCells(container, absoluteCells, context, scrollLeft);
  }

  renderBody(
    container: HTMLElement,
    cells: AbsoluteBodyCell[],
    context: CellRenderContext,
    scrollLeft: number = 0
  ): void {
    renderBodyCells(container, cells, context, scrollLeft);
  }

  cleanupHeaders(container: HTMLElement): void {
    cleanupHeaderCellRendering(container);
  }

  cleanupBody(container: HTMLElement): void {
    cleanupBodyCellRendering(container);
  }

  destroy(): void {
    if (this.config.headerContainer) {
      this.cleanupHeaders(this.config.headerContainer);
    }
    if (this.config.bodyContainer) {
      this.cleanupBody(this.config.bodyContainer);
    }
    if (this.config.pinnedLeftHeaderContainer) {
      this.cleanupHeaders(this.config.pinnedLeftHeaderContainer);
    }
    if (this.config.pinnedLeftBodyContainer) {
      this.cleanupBody(this.config.pinnedLeftBodyContainer);
    }
    if (this.config.pinnedRightHeaderContainer) {
      this.cleanupHeaders(this.config.pinnedRightHeaderContainer);
    }
    if (this.config.pinnedRightBodyContainer) {
      this.cleanupBody(this.config.pinnedRightBodyContainer);
    }
  }
}
