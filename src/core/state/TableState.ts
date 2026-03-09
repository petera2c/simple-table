import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { generateRowId, rowIdToString } from "../../utils/rowUtils";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import { GetRowId } from "../../types/GetRowId";

export interface TableStateConfig {
  defaultHeaders: HeaderObject[];
  rows: Row[];
  enableRowSelection?: boolean;
  selectionColumnWidth?: number;
  getRowId?: GetRowId;
}

export class TableState {
  private headers: HeaderObject[] = [];
  private effectiveHeaders: HeaderObject[] = [];
  private localRows: Row[] = [];
  private currentPage: number = 1;
  private scrollTop: number = 0;
  private scrollDirection: "up" | "down" | "none" = "none";
  private isResizing: boolean = false;
  private isScrolling: boolean = false;
  private columnEditorOpen: boolean = false;
  private activeHeaderDropdown: HeaderObject | null = null;
  private collapsedHeaders: Set<Accessor> = new Set();
  private expandedDepths: Set<number> = new Set();
  private expandedRows: Map<string, number> = new Map();
  private collapsedRows: Map<string, number> = new Map();
  private rowStateMap: Map<string | number, RowState> = new Map();
  private rowIndexMap: Map<string | number, number> = new Map();

  private config: TableStateConfig;

  constructor(config: TableStateConfig) {
    this.config = config;
    this.headers = [...config.defaultHeaders];
    this.localRows = [...config.rows];
    this.rebuildRowIndexMap();
  }

  private rebuildRowIndexMap(): void {
    this.rowIndexMap.clear();
    this.localRows.forEach((row, index) => {
      const rowIdArray = generateRowId({
        row,
        getRowId: this.config.getRowId,
        depth: 0,
        index,
        rowPath: [index],
        rowIndexPath: [index],
      });
      const rowIdKey = rowIdToString(rowIdArray);
      this.rowIndexMap.set(rowIdKey, index);
    });
  }

  computeEffectiveHeaders(): HeaderObject[] {
    let processedHeaders = [...this.headers];

    if (this.config.enableRowSelection && !this.headers?.[0]?.isSelectionColumn) {
      const selectionHeader = createSelectionHeader(this.config.selectionColumnWidth ?? 50);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    return processedHeaders;
  }

  updateEffectiveHeaders(): void {
    this.effectiveHeaders = this.computeEffectiveHeaders();
  }

  getHeaders(): HeaderObject[] {
    return this.headers;
  }

  setHeaders(headers: HeaderObject[]): void {
    this.headers = headers;
    this.updateEffectiveHeaders();
  }

  getEffectiveHeaders(): HeaderObject[] {
    return this.effectiveHeaders;
  }

  getLocalRows(): Row[] {
    return this.localRows;
  }

  setLocalRows(rows: Row[]): void {
    this.localRows = rows;
    this.rebuildRowIndexMap();
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  getScrollTop(): number {
    return this.scrollTop;
  }

  setScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }

  getScrollDirection(): "up" | "down" | "none" {
    return this.scrollDirection;
  }

  setScrollDirection(direction: "up" | "down" | "none"): void {
    this.scrollDirection = direction;
  }

  getIsResizing(): boolean {
    return this.isResizing;
  }

  setIsResizing(isResizing: boolean): void {
    this.isResizing = isResizing;
  }

  getIsScrolling(): boolean {
    return this.isScrolling;
  }

  setIsScrolling(isScrolling: boolean): void {
    this.isScrolling = isScrolling;
  }

  getColumnEditorOpen(): boolean {
    return this.columnEditorOpen;
  }

  setColumnEditorOpen(open: boolean): void {
    this.columnEditorOpen = open;
  }

  getActiveHeaderDropdown(): HeaderObject | null {
    return this.activeHeaderDropdown;
  }

  setActiveHeaderDropdown(header: HeaderObject | null): void {
    this.activeHeaderDropdown = header;
  }

  getCollapsedHeaders(): Set<Accessor> {
    return this.collapsedHeaders;
  }

  setCollapsedHeaders(headers: Set<Accessor>): void {
    this.collapsedHeaders = headers;
  }

  getExpandedDepths(): Set<number> {
    return this.expandedDepths;
  }

  setExpandedDepths(depths: Set<number>): void {
    this.expandedDepths = depths;
  }

  getExpandedRows(): Map<string, number> {
    return this.expandedRows;
  }

  setExpandedRows(rows: Map<string, number>): void {
    this.expandedRows = rows;
  }

  getCollapsedRows(): Map<string, number> {
    return this.collapsedRows;
  }

  setCollapsedRows(rows: Map<string, number>): void {
    this.collapsedRows = rows;
  }

  getRowStateMap(): Map<string | number, RowState> {
    return this.rowStateMap;
  }

  setRowStateMap(map: Map<string | number, RowState>): void {
    this.rowStateMap = map;
  }

  getRowIndexMap(): Map<string | number, number> {
    return this.rowIndexMap;
  }

  updateConfig(config: Partial<TableStateConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.defaultHeaders) {
      this.headers = [...config.defaultHeaders];
      this.updateEffectiveHeaders();
    }
    
    if (config.rows) {
      this.localRows = [...config.rows];
      this.rebuildRowIndexMap();
    }
  }
}
