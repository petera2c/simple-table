import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type Row from "../../types/Row";
import type { CustomTheme } from "../../types/CustomTheme";
import type RowState from "../../types/RowState";
import type { SelectionManager } from "../../managers/SelectionManager";
import type { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { SortManager } from "../../managers/SortManager";
import type { FilterManager } from "../../managers/FilterManager";
import type { FlattenRowsResult } from "../../utils/rowFlattening";
import type { ProcessRowsResult } from "../../utils/rowProcessing";
import type { PivotConfig } from "../../types/PivotTypes";
import type { TableAPIContext } from "./TableAPIContext";

/**
 * Live table instance surface used to build a cached {@link TableAPIContext}.
 * Getters read current instance state rather than a snapshot captured at
 * `getAPI()` time.
 */
export interface TableAPIContextHost {
  getConfig(): SimpleTableConfig;
  getLocalRows(): Row[];
  getHeaders(): ColumnDef[];
  applyHeaders(headers: ColumnDef[]): void;
  getPristineDefaultHeaders(): ColumnDef[];
  getEssentialAccessors(): Set<string>;
  getCustomTheme(): CustomTheme;
  getCurrentPage(): number;
  setCurrentPage(page: number): void;
  getExpandedRows(): Map<string, number>;
  getCollapsedRows(): Map<string, number>;
  getExpandedDepths(): Set<number>;
  clearExpandedRows(): void;
  clearCollapsedRows(): void;
  getRowStateMap(): Map<string | number, RowState>;
  getHeaderRegistry(): Map<string, any>;
  getCellRegistry(): Map<string, { updateContent: (value: any) => void }>;
  isCellAnimating(cellId: string): boolean;
  hasAnimatingCells(): boolean;
  getColumnEditorOpen(): boolean;
  setColumnEditorOpen(open: boolean): void;
  getExpandedDepthsManager(): any;
  getSelectionManager(): SelectionManager | null;
  getRowSelectionManager(): RowSelectionManager | null;
  getSortManager(): SortManager | null;
  getFilterManager(): FilterManager | null;
  getCachedFlattenResult(): FlattenRowsResult | null;
  getCachedProcessedResult(): ProcessRowsResult | null;
  getEffectiveRowGrouping(): Accessor[] | undefined;
  setPivot(config: PivotConfig | null): void;
  getPivot(): PivotConfig | null;
  getPivotHeaders(): ColumnDef[];
  getPivotedRows(): Row[];
  onRender(): void;
  invalidateRowsCache(): void;
  runWithoutAnimationSnapshot(fn: () => void): void;
  computeEffectiveHeaders(): ColumnDef[];
}

export const buildTableAPIContext = (host: TableAPIContextHost): TableAPIContext => ({
  get config() {
    return host.getConfig();
  },
  get localRows() {
    return host.getLocalRows();
  },
  get effectiveHeaders() {
    return host.computeEffectiveHeaders();
  },
  get headers() {
    return host.getHeaders();
  },
  getPristineDefaultHeaders: () => host.getPristineDefaultHeaders(),
  get essentialAccessors() {
    return host.getEssentialAccessors();
  },
  get customTheme() {
    return host.getCustomTheme();
  },
  get currentPage() {
    return host.getCurrentPage();
  },
  getCurrentPage: () => host.getCurrentPage(),
  get expandedRows() {
    return host.getExpandedRows();
  },
  get collapsedRows() {
    return host.getCollapsedRows();
  },
  get expandedDepths() {
    return host.getExpandedDepths();
  },
  clearExpandedRows: () => host.clearExpandedRows(),
  clearCollapsedRows: () => host.clearCollapsedRows(),
  get rowStateMap() {
    return host.getRowStateMap();
  },
  get headerRegistry() {
    return host.getHeaderRegistry();
  },
  get cellRegistry() {
    return host.getCellRegistry();
  },
  isCellAnimating: (cellId: string) => host.isCellAnimating(cellId),
  hasAnimatingCells: () => host.hasAnimatingCells(),
  get columnEditorOpen() {
    return host.getColumnEditorOpen();
  },
  getCachedFlattenResult: () => host.getCachedFlattenResult(),
  getCachedProcessedResult: () => host.getCachedProcessedResult(),
  get expandedDepthsManager() {
    return host.getExpandedDepthsManager();
  },
  get selectionManager() {
    return host.getSelectionManager();
  },
  get rowSelectionManager() {
    return host.getRowSelectionManager();
  },
  get sortManager() {
    return host.getSortManager();
  },
  get filterManager() {
    return host.getFilterManager();
  },
  getEffectiveRowGrouping: () => host.getEffectiveRowGrouping(),
  setPivot: (pivotConfig: PivotConfig | null) => host.setPivot(pivotConfig),
  getPivot: () => host.getPivot(),
  getPivotHeaders: () => host.getPivotHeaders(),
  getPivotedRows: () => host.getPivotedRows(),
  onRender: () => host.onRender(),
  invalidateRowsCache: () => host.invalidateRowsCache(),
  runWithoutAnimationSnapshot: (fn: () => void) => host.runWithoutAnimationSnapshot(fn),
  setHeaders: (headers: ColumnDef[]) => host.applyHeaders(headers),
  setCurrentPage: (page: number) => host.setCurrentPage(page),
  setColumnEditorOpen: (open: boolean) => host.setColumnEditorOpen(open),
});
