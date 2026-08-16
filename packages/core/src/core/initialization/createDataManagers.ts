import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type { CustomTheme } from "../../types/CustomTheme";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type Row from "../../types/Row";
import type { PivotManager } from "../../managers/PivotManager";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import ExpandedDepthsManager from "../../hooks/expandedDepths";
import AriaAnnouncementManager from "../../hooks/ariaAnnouncements";
import { shouldShowRowSelectionColumn } from "../../utils/rowSelectionUtils";

export interface DataManagersHost {
  getConfig(): SimpleTableConfig;
  getHeaders(): ColumnDef[];
  getPristineDefaultHeaders(): ColumnDef[];
  getLocalRows(): Row[];
  getCustomTheme(): CustomTheme;
  getCollapsedHeaders(): Set<Accessor>;
  getCellRegistry(): Map<string, any>;
  getTableRoot(): HTMLElement;
  getEffectiveRowGrouping(): Accessor[] | undefined;
  getPivotManager(): PivotManager | null;
  onAnnouncement(message: string): void;
  onExpandedDepths(depths: Set<number>): void;
  onSortNotify(): void;
  onFilterNotify(filteredRows: Row[]): void;
  onSelectionDragEnd(): void;
}

export interface DataManagers {
  ariaAnnouncementManager: AriaAnnouncementManager;
  expandedDepthsManager: ExpandedDepthsManager;
  sortManager: SortManager;
  filterManager: FilterManager;
  selectionManager: SelectionManager;
}

/** Constructs sort, filter, selection, expand-depth, and aria managers. */
export const createDataManagers = (host: DataManagersHost): DataManagers => {
  const config = host.getConfig();

  const ariaAnnouncementManager = new AriaAnnouncementManager();
  ariaAnnouncementManager.subscribe((message) => {
    host.onAnnouncement(message);
  });

  const expandedDepthsManager = new ExpandedDepthsManager(
    config.expandAll ?? true,
    host.getEffectiveRowGrouping(),
  );
  expandedDepthsManager.subscribe((depths) => {
    host.onExpandedDepths(depths);
  });

  const announce = (message: string) => {
    ariaAnnouncementManager.announce(message);
  };

  const pivotState = host.getPivotManager()?.getState();
  const initialSortRows = pivotState?.active ? pivotState.pivotedRows : host.getLocalRows();

  const sortManager = new SortManager({
    headers: host.getHeaders(),
    tableRows: initialSortRows,
    externalSortHandling: config.externalSortHandling || false,
    onSortChange: (sort) => host.getConfig().onSortChange?.(sort),
    rowGrouping: host.getEffectiveRowGrouping(),
    initialSortColumn: config.initialSortColumn,
    initialSortDirection: config.initialSortDirection,
    announce,
  });

  sortManager.subscribe(() => {
    host.onSortNotify();
  });

  const filterManager = new FilterManager({
    rows: host.getLocalRows(),
    headers: host.getPristineDefaultHeaders(),
    externalFilterHandling: config.externalFilterHandling || false,
    onFilterChange: (filters) => host.getConfig().onFilterChange?.(filters),
    announce,
  });

  filterManager.subscribe((filterState) => {
    host.onFilterNotify(filterState.filteredRows);
  });

  const customTheme = host.getCustomTheme();
  const selectionManager = new SelectionManager({
    selectableCells: config.selectableCells ?? false,
    selectableColumns: config.selectableColumns ?? false,
    headers: host.getHeaders(),
    tableRows: [],
    onCellEdit: (props) => host.getConfig().onCellEdit?.(props),
    cellRegistry: host.getCellRegistry(),
    collapsedHeaders: host.getCollapsedHeaders(),
    rowHeight: customTheme.rowHeight,
    enableRowSelection: shouldShowRowSelectionColumn(config),
    copyHeadersToClipboard: config.copyHeadersToClipboard,
    customTheme,
    tableRoot: host.getTableRoot(),
    onSelectionDragEnd: () => host.onSelectionDragEnd(),
  });

  return {
    ariaAnnouncementManager,
    expandedDepthsManager,
    sortManager,
    filterManager,
    selectionManager,
  };
};
