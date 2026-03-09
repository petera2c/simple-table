import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import SortColumn, { SortDirection } from "../types/SortColumn";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { ColumnVisibilityState } from "../types/ColumnVisibilityTypes";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";
import RowState from "../types/RowState";

import { SortManager, SortManagerConfig } from "./SortManager";
import { FilterManager, FilterManagerConfig } from "./FilterManager";
import { RowManager, RowManagerConfig } from "./RowManager";
import { ColumnManager, ColumnManagerConfig } from "./ColumnManager";
import { DimensionManager, DimensionManagerConfig } from "./DimensionManager";
import { ScrollManager, ScrollManagerConfig } from "./ScrollManager";
import { SelectionManager, SelectionManagerConfig } from "./SelectionManager";

export interface TableManagerConfig {
  headers: HeaderObject[];
  rows: Row[];
  rowHeight: number;
  headerHeight?: number;
  customTheme: CustomTheme;
  
  externalSortHandling?: boolean;
  externalFilterHandling?: boolean;
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
  selectableCells?: boolean;
  selectableColumns?: boolean;
  enableRowSelection?: boolean;
  copyHeadersToClipboard?: boolean;
  
  height?: string | number;
  maxHeight?: string | number;
  
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  
  onSortChange?: (sort: SortColumn | null) => void;
  onFilterChange?: (filters: TableFilterState) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onLoadMore?: () => void;
  onCellEdit?: (props: any) => void;
  
  announce?: (message: string) => void;
  
  containerElement?: HTMLElement;
  cellRegistry?: Map<string, any>;
  collapsedHeaders?: Set<Accessor>;
}

export interface TableManagerState {
  isReady: boolean;
}

type StateChangeCallback = () => void;

export class TableManager {
  private config: TableManagerConfig;
  private state: TableManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();

  public sortManager: SortManager;
  public filterManager: FilterManager;
  public rowManager: RowManager;
  public columnManager: ColumnManager;
  public dimensionManager: DimensionManager;
  public scrollManager: ScrollManager;
  public selectionManager: SelectionManager;

  constructor(config: TableManagerConfig) {
    this.config = config;
    
    this.state = {
      isReady: false,
    };

    const sortConfig: SortManagerConfig = {
      headers: config.headers,
      tableRows: config.rows,
      externalSortHandling: config.externalSortHandling || false,
      onSortChange: config.onSortChange,
      rowGrouping: config.rowGrouping,
      initialSortColumn: config.initialSortColumn,
      initialSortDirection: config.initialSortDirection,
      announce: config.announce,
    };
    this.sortManager = new SortManager(sortConfig);

    const filterConfig: FilterManagerConfig = {
      rows: config.rows,
      headers: config.headers,
      externalFilterHandling: config.externalFilterHandling || false,
      onFilterChange: config.onFilterChange,
      announce: config.announce,
    };
    this.filterManager = new FilterManager(filterConfig);

    const sortedRows = this.sortManager.getSortedRows();
    const filteredRows = this.filterManager.getFilteredRows();
    
    const rowConfig: RowManagerConfig = {
      rows: this.applyFiltersAndSort(config.rows),
      headers: config.headers,
      rowGrouping: config.rowGrouping,
      getRowId: config.getRowId,
      rowHeight: config.rowHeight,
      headerHeight: config.headerHeight || config.rowHeight,
      customTheme: config.customTheme,
      hasLoadingRenderer: false,
      hasErrorRenderer: false,
      hasEmptyRenderer: false,
    };
    this.rowManager = new RowManager(rowConfig);

    const columnConfig: ColumnManagerConfig = {
      headers: config.headers,
      collapsedHeaders: config.collapsedHeaders || new Set(),
      onColumnOrderChange: config.onColumnOrderChange,
      onColumnVisibilityChange: config.onColumnVisibilityChange,
      onColumnWidthChange: config.onColumnWidthChange,
    };
    this.columnManager = new ColumnManager(columnConfig);

    const dimensionConfig: DimensionManagerConfig = {
      effectiveHeaders: config.headers,
      headerHeight: config.headerHeight,
      rowHeight: config.rowHeight,
      height: config.height,
      maxHeight: config.maxHeight,
      totalRowCount: config.rows.length,
      containerElement: config.containerElement,
    };
    this.dimensionManager = new DimensionManager(dimensionConfig);

    const scrollConfig: ScrollManagerConfig = {
      onLoadMore: config.onLoadMore,
    };
    this.scrollManager = new ScrollManager(scrollConfig);

    const selectionConfig: SelectionManagerConfig = {
      selectableCells: config.selectableCells || false,
      headers: config.headers,
      tableRows: [],
      onCellEdit: config.onCellEdit,
      cellRegistry: config.cellRegistry,
      collapsedHeaders: config.collapsedHeaders,
      rowHeight: config.rowHeight,
      enableRowSelection: config.enableRowSelection,
      copyHeadersToClipboard: config.copyHeadersToClipboard || false,
      customTheme: config.customTheme,
    };
    this.selectionManager = new SelectionManager(selectionConfig);

    this.setupManagerSubscriptions();
    
    this.state.isReady = true;
    this.notifySubscribers();
  }

  private setupManagerSubscriptions(): void {
    this.sortManager.subscribe(() => {
      this.handleSortChange();
    });

    this.filterManager.subscribe(() => {
      this.handleFilterChange();
    });

    this.rowManager.subscribe(() => {
      this.notifySubscribers();
    });

    this.columnManager.subscribe(() => {
      this.notifySubscribers();
    });

    this.dimensionManager.subscribe(() => {
      this.notifySubscribers();
    });

    this.scrollManager.subscribe(() => {
      this.notifySubscribers();
    });
  }

  private applyFiltersAndSort(rows: Row[]): Row[] {
    const filteredRows = this.filterManager.getFilteredRows();
    const sortedRows = this.sortManager.getSortedRows();
    
    if (this.config.externalFilterHandling && this.config.externalSortHandling) {
      return rows;
    } else if (this.config.externalFilterHandling) {
      return sortedRows;
    } else if (this.config.externalSortHandling) {
      return filteredRows;
    } else {
      const sortedAndFiltered = this.sortManager.getSortedRows();
      return sortedAndFiltered;
    }
  }

  private handleSortChange(): void {
    const processedRows = this.applyFiltersAndSort(this.config.rows);
    this.rowManager.updateConfig({ rows: processedRows });
    this.notifySubscribers();
  }

  private handleFilterChange(): void {
    const processedRows = this.applyFiltersAndSort(this.config.rows);
    this.sortManager.updateConfig({ tableRows: processedRows });
    this.rowManager.updateConfig({ rows: processedRows });
    this.notifySubscribers();
  }

  updateConfig(config: Partial<TableManagerConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.headers !== undefined) {
      this.sortManager.updateConfig({ headers: config.headers });
      this.filterManager.updateConfig({ headers: config.headers });
      this.rowManager.updateConfig({ headers: config.headers });
      this.columnManager.updateConfig({ headers: config.headers });
      this.dimensionManager.updateConfig({ effectiveHeaders: config.headers });
      this.selectionManager.updateConfig({ headers: config.headers });
    }

    if (config.rows !== undefined) {
      this.sortManager.updateConfig({ tableRows: config.rows });
      this.filterManager.updateConfig({ rows: config.rows });
      
      const processedRows = this.applyFiltersAndSort(config.rows);
      this.rowManager.updateConfig({ rows: processedRows });
      
      this.dimensionManager.updateConfig({ totalRowCount: config.rows.length });
    }

    if (config.rowHeight !== undefined) {
      this.rowManager.updateConfig({ rowHeight: config.rowHeight });
      this.dimensionManager.updateConfig({ rowHeight: config.rowHeight });
      this.selectionManager.updateConfig({ rowHeight: config.rowHeight });
    }

    if (config.customTheme !== undefined) {
      this.rowManager.updateConfig({ customTheme: config.customTheme });
      this.selectionManager.updateConfig({ customTheme: config.customTheme });
    }

    if (config.collapsedHeaders !== undefined) {
      this.columnManager.updateConfig({ collapsedHeaders: config.collapsedHeaders });
      this.selectionManager.updateConfig({ collapsedHeaders: config.collapsedHeaders });
    }

    this.notifySubscribers();
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb());
  }

  getState(): TableManagerState {
    return this.state;
  }

  isReady(): boolean {
    return this.state.isReady;
  }

  destroy(): void {
    this.sortManager.destroy();
    this.filterManager.destroy();
    this.rowManager.destroy();
    this.columnManager.destroy();
    this.dimensionManager.destroy();
    this.scrollManager.destroy();
    this.selectionManager.destroy();
    this.subscribers.clear();
  }
}
