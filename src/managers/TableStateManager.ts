import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import TableRow from "../types/TableRow";
import Cell from "../types/Cell";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { ColumnVisibilityState } from "../types/ColumnVisibilityTypes";
import SortColumn, { SortDirection } from "../types/SortColumn";
import RowState from "../types/RowState";
import { CustomTheme } from "../types/CustomTheme";
import { IconsConfig } from "../types/IconsConfig";
import { ColumnEditorConfig } from "../types/ColumnEditorConfig";
import Theme from "../types/Theme";
import { RowButton } from "../types/RowButton";
import { HeaderDropdown } from "../types/HeaderDropdownProps";
import { GetRowId } from "../types/GetRowId";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import OnSortProps from "../types/OnSortProps";
import CellClickProps from "../types/CellClickProps";
import OnRowGroupExpandProps from "../types/OnRowGroupExpandProps";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import CellValue from "../types/CellValue";

import { TableManager } from "./TableManager";
import { SelectionManager } from "./SelectionManager";
import { RowSelectionManager } from "./RowSelectionManager";
import { DragHandlerManager } from "./DragHandlerManager";

/**
 * Comprehensive configuration for the table state manager.
 * This consolidates all configuration needed by the various sub-managers.
 */
export interface TableStateManagerConfig {
  headers: HeaderObject[];
  rows: Row[];
  rowHeight: number;
  headerHeight?: number;
  customTheme: CustomTheme;
  theme: Theme;
  
  externalSortHandling?: boolean;
  externalFilterHandling?: boolean;
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
  selectableCells?: boolean;
  selectableColumns?: boolean;
  enableRowSelection?: boolean;
  copyHeadersToClipboard?: boolean;
  columnBorders?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  autoExpandColumns?: boolean;
  cellUpdateFlash?: boolean;
  editColumns?: boolean;
  enableHeaderEditing?: boolean;
  shouldPaginate?: boolean;
  
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
  onCellClick?: (props: CellClickProps) => void;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  
  rowButtons?: RowButton[];
  headerDropdown?: HeaderDropdown;
  icons?: IconsConfig;
  columnEditorConfig?: ColumnEditorConfig;
  includeHeadersInCSVExport?: boolean;
  
  announce?: (message: string) => void;
  
  containerElement?: HTMLElement;
  collapsedHeaders?: Set<Accessor>;
}

/**
 * The complete state of the table.
 * This represents all the data that components need to render.
 */
export interface TableStateManagerState {
  headers: HeaderObject[];
  rows: Row[];
  tableRows: TableRow[];
  
  collapsedHeaders: Set<Accessor>;
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  expandedDepths: Set<number>;
  rowStateMap: Map<string | number, RowState>;
  
  filters: TableFilterState;
  sort: SortColumn | null;
  
  selectedCells: Set<string>;
  selectedColumns: Set<number>;
  columnsWithSelectedCells: Set<number>;
  rowsWithSelectedCells: Set<string>;
  selectedRows: Set<string>;
  selectedRowCount: number;
  selectedRowsData: any[];
  
  containerWidth: number;
  calculatedHeaderHeight: number;
  maxHeaderDepth: number;
  
  isResizing: boolean;
  isScrolling: boolean;
  isLoading: boolean;
  
  scrollTop: number;
  scrollLeft: number;
  scrollDirection: "up" | "down" | "none";
  
  activeHeaderDropdown: HeaderObject | null;
  
  heightOffsets: HeightOffsets;
}

type StateChangeCallback = (state: TableStateManagerState) => void;

/**
 * Central state manager for the entire table.
 * This class consolidates all the individual managers and provides a unified state interface.
 * 
 * This is designed to eventually replace the React Context API with a vanilla JS solution.
 * It uses the observer pattern to notify subscribers of state changes.
 */
export class TableStateManager {
  private config: TableStateManagerConfig;
  private state: TableStateManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  
  public tableManager: TableManager;
  public selectionManager: SelectionManager | null = null;
  public rowSelectionManager: RowSelectionManager | null = null;
  public dragHandlerManager: DragHandlerManager | null = null;
  
  public cellRegistry: Map<string, { updateContent: (newValue: CellValue) => void }> = new Map();
  public headerRegistry: Map<string, { setEditing: (isEditing: boolean) => void }> = new Map();

  constructor(config: TableStateManagerConfig) {
    this.config = config;
    
    this.tableManager = new TableManager({
      headers: config.headers,
      rows: config.rows,
      rowHeight: config.rowHeight,
      headerHeight: config.headerHeight,
      customTheme: config.customTheme,
      externalSortHandling: config.externalSortHandling,
      externalFilterHandling: config.externalFilterHandling,
      rowGrouping: config.rowGrouping,
      getRowId: config.getRowId,
      selectableCells: config.selectableCells,
      selectableColumns: config.selectableColumns,
      enableRowSelection: config.enableRowSelection,
      copyHeadersToClipboard: config.copyHeadersToClipboard,
      height: config.height,
      maxHeight: config.maxHeight,
      initialSortColumn: config.initialSortColumn,
      initialSortDirection: config.initialSortDirection,
      onSortChange: config.onSortChange,
      onFilterChange: config.onFilterChange,
      onColumnOrderChange: config.onColumnOrderChange,
      onColumnVisibilityChange: config.onColumnVisibilityChange,
      onColumnWidthChange: config.onColumnWidthChange,
      onLoadMore: config.onLoadMore,
      onCellEdit: config.onCellEdit,
      announce: config.announce,
      containerElement: config.containerElement,
      collapsedHeaders: config.collapsedHeaders,
    });

    if (config.selectableCells) {
      this.selectionManager = this.tableManager.selectionManager;
    }

    if (config.enableRowSelection) {
      this.rowSelectionManager = new RowSelectionManager({
        tableRows: this.tableManager.rowManager.getFlattenedRows(),
        onRowSelectionChange: config.onRowSelectionChange,
        enableRowSelection: config.enableRowSelection,
      });
    }

    if (config.columnReordering) {
      this.dragHandlerManager = new DragHandlerManager({
        headers: config.headers,
        onTableHeaderDragEnd: (newHeaders) => {
          this.updateHeaders(newHeaders);
        },
        onColumnOrderChange: config.onColumnOrderChange,
      });
    }

    this.state = this.computeState();
    this.setupManagerSubscriptions();
  }

  private setupManagerSubscriptions(): void {
    this.tableManager.subscribe(() => {
      this.state = this.computeState();
      this.notifySubscribers();
    });

    if (this.selectionManager) {
      this.selectionManager.updateConfig({
        headers: this.config.headers,
        tableRows: this.tableManager.rowManager.getFlattenedRows(),
      });
    }

    if (this.rowSelectionManager) {
      this.rowSelectionManager.subscribe(() => {
        this.state = this.computeState();
        this.notifySubscribers();
      });
    }
  }

  private computeState(): TableStateManagerState {
    const sortState = this.tableManager.sortManager.getState();
    const filterState = this.tableManager.filterManager.getState();
    const rowState = this.tableManager.rowManager.getState();
    const dimensionState = this.tableManager.dimensionManager.getState();
    const scrollState = this.tableManager.scrollManager.getState();
    
    const selectionState = this.selectionManager ? {
      selectedCells: this.selectionManager.getSelectedCells(),
      selectedColumns: this.selectionManager.getSelectedColumns(),
      columnsWithSelectedCells: this.selectionManager.getColumnsWithSelectedCells(),
      rowsWithSelectedCells: this.selectionManager.getRowsWithSelectedCells(),
    } : {
      selectedCells: new Set<string>(),
      selectedColumns: new Set<number>(),
      columnsWithSelectedCells: new Set<number>(),
      rowsWithSelectedCells: new Set<string>(),
    };

    const rowSelectionState = this.rowSelectionManager ? this.rowSelectionManager.getState() : {
      selectedRows: new Set<string>(),
      selectedRowCount: 0,
      selectedRowsData: [],
    };

    return {
      headers: this.config.headers,
      rows: this.config.rows,
      tableRows: rowState.flattenedRows,
      
      collapsedHeaders: this.config.collapsedHeaders || new Set(),
      expandedRows: rowState.expandedRows,
      collapsedRows: rowState.collapsedRows,
      expandedDepths: rowState.expandedDepths,
      rowStateMap: rowState.rowStateMap,
      
      filters: filterState.filters,
      sort: sortState.sort,
      
      ...selectionState,
      ...rowSelectionState,
      
      containerWidth: dimensionState.containerWidth,
      calculatedHeaderHeight: dimensionState.calculatedHeaderHeight,
      maxHeaderDepth: dimensionState.maxHeaderDepth,
      
      isResizing: false,
      isScrolling: scrollState.isScrolling,
      isLoading: false,
      
      scrollTop: scrollState.scrollTop,
      scrollLeft: scrollState.scrollLeft,
      scrollDirection: scrollState.scrollDirection,
      
      activeHeaderDropdown: null,
      
      heightOffsets: rowState.heightOffsets,
    };
  }

  updateConfig(config: Partial<TableStateManagerConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.headers !== undefined) {
      this.tableManager.updateConfig({ headers: config.headers });
      this.dragHandlerManager?.updateConfig({ headers: config.headers });
    }

    if (config.rows !== undefined) {
      this.tableManager.updateConfig({ rows: config.rows });
    }

    if (config.rowHeight !== undefined) {
      this.tableManager.updateConfig({ rowHeight: config.rowHeight });
    }

    if (config.customTheme !== undefined) {
      this.tableManager.updateConfig({ customTheme: config.customTheme });
    }

    this.state = this.computeState();
    this.notifySubscribers();
  }

  updateHeaders(headers: HeaderObject[]): void {
    this.config = { ...this.config, headers };
    this.tableManager.updateConfig({ headers });
    this.dragHandlerManager?.updateConfig({ headers });
    this.state = this.computeState();
    this.notifySubscribers();
  }

  setIsResizing(isResizing: boolean): void {
    this.state = { ...this.state, isResizing };
    this.notifySubscribers();
  }

  setIsScrolling(isScrolling: boolean): void {
    this.tableManager.scrollManager.setScrolling(isScrolling);
  }

  setExpandedDepths(expandedDepths: Set<number>): void {
    this.tableManager.rowManager.setExpandedDepths(expandedDepths);
  }

  setExpandedRows(expandedRows: Map<string, number>): void {
    this.tableManager.rowManager.setExpandedRows(expandedRows);
  }

  setCollapsedRows(collapsedRows: Map<string, number>): void {
    this.tableManager.rowManager.setCollapsedRows(collapsedRows);
  }

  setRowStateMap(rowStateMap: Map<string | number, RowState>): void {
    this.tableManager.rowManager.setRowStateMap(rowStateMap);
  }

  setActiveHeaderDropdown(header: HeaderObject | null): void {
    this.state = { ...this.state, activeHeaderDropdown: header };
    this.notifySubscribers();
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  getState(): TableStateManagerState {
    return this.state;
  }

  isSelected(cell: Cell): boolean {
    return this.selectionManager?.isSelected(cell) ?? false;
  }

  isInitialFocusedCell(cell: Cell): boolean {
    return this.selectionManager?.isInitialFocusedCell(cell) ?? false;
  }

  isCopyFlashing(cell: Cell): boolean {
    return this.selectionManager?.isCopyFlashing(cell) ?? false;
  }

  isWarningFlashing(cell: Cell): boolean {
    return this.selectionManager?.isWarningFlashing(cell) ?? false;
  }

  getBorderClass(cell: Cell): string {
    return this.selectionManager?.getBorderClass(cell) ?? "";
  }

  handleMouseDown(cell: Cell): void {
    this.selectionManager?.handleMouseDown(cell);
  }

  handleMouseOver(cell: Cell): void {
    this.selectionManager?.handleMouseOver(cell);
  }

  clearSelection(): void {
    this.selectionManager?.clearSelection();
  }

  selectColumns(columnIndices: number[], isShiftKey?: boolean): void {
    this.selectionManager?.selectColumns(columnIndices, isShiftKey);
  }

  isRowSelected(rowId: string): boolean {
    return this.rowSelectionManager?.isRowSelected(rowId) ?? false;
  }

  areAllRowsSelected(): boolean {
    return this.rowSelectionManager?.areAllRowsSelected() ?? false;
  }

  handleRowSelect(rowId: string, isSelected: boolean): void {
    this.rowSelectionManager?.handleRowSelect(rowId, isSelected);
  }

  handleSelectAll(isSelected: boolean): void {
    this.rowSelectionManager?.handleSelectAll(isSelected);
  }

  handleToggleRow(rowId: string): void {
    this.rowSelectionManager?.handleToggleRow(rowId);
  }

  handleApplyFilter(filter: FilterCondition): void {
    this.tableManager.filterManager.updateFilter(filter);
  }

  handleClearFilter(accessor: Accessor): void {
    this.tableManager.filterManager.clearFilter(accessor);
  }

  handleClearAllFilters(): void {
    this.tableManager.filterManager.clearAllFilters();
  }

  updateSort(props?: { accessor: Accessor; direction?: SortDirection }): void {
    this.tableManager.sortManager.updateSort(props);
  }

  destroy(): void {
    this.tableManager.destroy();
    this.selectionManager?.destroy();
    this.rowSelectionManager?.destroy();
    this.dragHandlerManager?.destroy();
    this.subscribers.clear();
  }
}
