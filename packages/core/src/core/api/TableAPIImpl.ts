import { TableAPI } from "../../types/TableAPI";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import TableRow from "../../types/TableRow";
import SortColumn, { SortDirection } from "../../types/SortColumn";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import { CustomTheme } from "../../types/CustomTheme";
import UpdateDataProps from "../../types/UpdateCellProps";
import type CellValue from "../../types/CellValue";
import { SetHeaderRenameProps, ExportToCSVProps } from "../../types/TableAPI";
import RowState from "../../types/RowState";
import Cell from "../../types/Cell";
import { SelectionManager } from "../../managers/SelectionManager";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { flattenRows, FlattenRowsResult } from "../../utils/rowFlattening";
import { ProcessRowsResult } from "../../utils/rowProcessing";
import { exportTableToCSV } from "../../utils/csvExportUtils";
import {
  getPinnedSectionsState,
  isHeaderEssential,
  rebuildHeadersFromPinnedState,
} from "../../utils/pinnedColumnUtils";
import { PinnedSectionsState } from "../../types/PinnedSectionsState";
import { deepClone } from "../../utils/generalUtils";

export interface TableAPIContext {
  config: SimpleTableConfig;
  localRows: Row[];
  effectiveHeaders: HeaderObject[];
  headers: HeaderObject[];
  essentialAccessors: Set<string>;
  customTheme: CustomTheme;
  currentPage: number;
  /** Returns current page from live state (use this in API getCurrentPage so it stays correct after setPage). */
  getCurrentPage: () => number;
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  expandedDepths: Set<number>;
  clearExpandedRows: () => void;
  clearCollapsedRows: () => void;
  rowStateMap: Map<string | number, RowState>;
  headerRegistry: Map<string, any>;
  cellRegistry?: Map<string, { updateContent: (value: any) => void }>;
  columnEditorOpen: boolean;
  expandedDepthsManager: any;
  selectionManager: SelectionManager | null;
  sortManager: SortManager | null;
  filterManager: FilterManager | null;
  getCachedFlattenResult?: () => FlattenRowsResult | null;
  getCachedProcessedResult?: () => ProcessRowsResult | null;
  onRender: () => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setCurrentPage: (page: number) => void;
  setColumnEditorOpen: (open: boolean) => void;
}

export class TableAPIImpl {
  static createAPI(context: TableAPIContext): TableAPI {
    const getFlattenResult = (): FlattenRowsResult => {
      const cached = context.getCachedFlattenResult?.();
      if (cached) return cached;
      return flattenRows({
        rows: context.localRows,
        rowGrouping: context.config.rowGrouping,
        getRowId: context.config.getRowId,
        expandedRows: context.expandedRows,
        collapsedRows: context.collapsedRows,
        expandedDepths: context.expandedDepths,
        rowStateMap: context.rowStateMap,
        hasLoadingRenderer: Boolean(context.config.loadingStateRenderer),
        hasErrorRenderer: Boolean(context.config.errorStateRenderer),
        hasEmptyRenderer: Boolean(context.config.emptyStateRenderer),
        headers: context.effectiveHeaders,
        rowHeight: context.customTheme.rowHeight,
        headerHeight: context.customTheme.headerHeight,
        customTheme: context.customTheme,
      });
    };

    /** Coalesce many `updateData` calls in one turn (e.g. live metrics) into one DOM pass. */
    const pendingUpdateDataByKey = new Map<string, CellValue>();
    let updateDataFlushScheduled = false;

    const flushPendingUpdateData = () => {
      updateDataFlushScheduled = false;
      if (pendingUpdateDataByKey.size === 0) return;

      pendingUpdateDataByKey.forEach((value, key) => {
        const entry = context.cellRegistry?.get(key);
        if (entry) {
          entry.updateContent(value);
        }
      });
      pendingUpdateDataByKey.clear();
    };

    const scheduleUpdateDataFlush = () => {
      if (updateDataFlushScheduled) return;
      updateDataFlushScheduled = true;
      queueMicrotask(flushPendingUpdateData);
    };

    /**
     * Cache `Row → currently-rendered TableRow` keyed by the rowsToRender array
     * reference. The cell registry is keyed off each rendered row's positional
     * `rowId` (which changes after sort/filter), but consumers of `updateData`
     * pass `rowIndex` as the index into the unsorted `localRows`. This map lets
     * us resolve the row's *current* display rowId so the registry lookup hits
     * regardless of sort/filter state.
     */
    let displayedTableRowCache: {
      rowsRef: TableRow[];
      map: WeakMap<Row, TableRow>;
    } | null = null;
    const getDisplayedTableRow = (row: Row): TableRow | undefined => {
      const processed = context.getCachedProcessedResult?.();
      const rowsToRender = processed?.rowsToRender;
      if (!rowsToRender || rowsToRender.length === 0) return undefined;
      if (!displayedTableRowCache || displayedTableRowCache.rowsRef !== rowsToRender) {
        const map = new WeakMap<Row, TableRow>();
        for (const tableRow of rowsToRender) {
          if (tableRow.row) map.set(tableRow.row, tableRow);
        }
        displayedTableRowCache = { rowsRef: rowsToRender, map };
      }
      return displayedTableRowCache.map.get(row);
    };

    return {
      updateData: (props: UpdateDataProps) => {
        const { rowIndex, accessor, newValue } = props;
        if (rowIndex >= 0 && rowIndex < context.localRows.length) {
          const row = context.localRows[rowIndex] as any;
          row[accessor] = newValue;

          // Prefer the row's *current* rendered rowId (post sort/filter) so the
          // cell registry key matches what `styling.ts` registered. Falls back
          // to the positional rowId for the unsorted/unfiltered case where the
          // row may not yet be present in `rowsToRender` (e.g. virtualized off
          // screen — registry lookup will simply miss, which is correct).
          const displayedRow = getDisplayedTableRow(row);
          let rowIdArray: (string | number)[];
          if (displayedRow) {
            rowIdArray = displayedRow.rowId;
          } else {
            const rowPath = [rowIndex];
            rowIdArray = context.config.getRowId
              ? [
                  rowIndex,
                  context.config.getRowId({
                    row,
                    depth: 0,
                    index: rowIndex,
                    rowPath,
                    rowIndexPath: rowPath,
                  }),
                ]
              : [rowIndex];
          }
          const key = `${rowIdArray.join("-")}-${accessor}`;
          pendingUpdateDataByKey.set(key, newValue);
          scheduleUpdateDataFlush();
        }
      },

      setHeaderRename: (props: SetHeaderRenameProps) => {
        const headerRegistry = context.headerRegistry.get(props.accessor as string);
        if (headerRegistry) {
          headerRegistry.setEditing(true);
        }
      },

      getVisibleRows: (): TableRow[] => {
        const processed = context.getCachedProcessedResult?.();
        if (processed) return processed.rowsToRender;
        return getFlattenResult().flattenedRows;
      },

      getAllRows: (): TableRow[] => {
        return getFlattenResult().flattenedRows;
      },

      getHeaders: (): HeaderObject[] => {
        return context.effectiveHeaders;
      },

      exportToCSV: (props?: ExportToCSVProps) => {
        exportTableToCSV(
          getFlattenResult().flattenedRows,
          context.effectiveHeaders,
          props?.filename,
          context.config.includeHeadersInCSVExport ?? true,
        );
      },

      getSortState: (): SortColumn | null => {
        return context.sortManager?.getSortColumn() ?? null;
      },

      applySortState: async (props?: { accessor: Accessor; direction?: SortDirection }) => {
        if (context.sortManager) {
          context.sortManager.updateSort(props);
        }
      },

      getPinnedState: (): PinnedSectionsState => {
        return getPinnedSectionsState(context.headers);
      },

      applyPinnedState: async (state: PinnedSectionsState) => {
        const updated = rebuildHeadersFromPinnedState(
          context.headers,
          state,
          context.essentialAccessors,
        );
        if (updated) {
          context.setHeaders(updated);
          context.onRender();
        }
      },

      resetColumns: () => {
        context.setHeaders(deepClone(context.config.defaultHeaders));
        context.onRender();
      },

      getFilterState: (): TableFilterState => {
        return context.filterManager?.getFilters() ?? {};
      },

      applyFilter: async (filter: FilterCondition) => {
        if (context.filterManager) {
          context.filterManager.updateFilter(filter);
        }
      },

      clearFilter: async (accessor: Accessor) => {
        if (context.filterManager) {
          context.filterManager.clearFilter(accessor);
        }
      },

      clearAllFilters: async () => {
        if (context.filterManager) {
          context.filterManager.clearAllFilters();
        }
      },

      getCurrentPage: (): number => {
        return context.getCurrentPage();
      },

      getTotalPages: (): number => {
        const totalRows = context.config.totalRowCount ?? getFlattenResult().paginatableRows.length;
        return Math.ceil(totalRows / (context.config.rowsPerPage ?? 10));
      },

      setPage: async (page: number) => {
        const totalRows = context.config.totalRowCount ?? getFlattenResult().paginatableRows.length;
        const rowsPerPage = context.config.rowsPerPage ?? 10;
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (page < 1 || page > totalPages) return;
        context.setCurrentPage(page);
        context.onRender();
        if (context.config.onPageChange) {
          await context.config.onPageChange(page);
        }
      },

      expandAll: () => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        context.expandedDepthsManager?.expandAll();
      },

      collapseAll: () => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        context.expandedDepthsManager?.collapseAll();
      },

      expandDepth: (depth: number) => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        context.expandedDepthsManager?.expandDepth(depth);
      },

      collapseDepth: (depth: number) => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        context.expandedDepthsManager?.collapseDepth(depth);
      },

      toggleDepth: (depth: number) => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        context.expandedDepthsManager?.toggleDepth(depth);
      },

      setExpandedDepths: (depths: Set<number>) => {
        context.clearExpandedRows();
        context.clearCollapsedRows();
        const mgr = context.expandedDepthsManager;
        if (mgr) {
          const max = context.config.rowGrouping?.length ?? 0;
          const next =
            max === 0
              ? new Set<number>()
              : new Set([...depths].filter((d) => Number.isInteger(d) && d >= 0 && d < max));
          mgr.setExpandedDepths(next);
          return;
        }
        context.onRender();
      },

      getExpandedDepths: (): Set<number> => {
        return context.expandedDepthsManager?.getExpandedDepths() ?? context.expandedDepths;
      },

      getGroupingProperty: (depth: number): Accessor | undefined => {
        return context.config.rowGrouping?.[depth];
      },

      getGroupingDepth: (property: Accessor): number => {
        return context.config.rowGrouping?.indexOf(property) ?? -1;
      },

      toggleColumnEditor: (open?: boolean) => {
        if (!context.config.editColumns) return;
        context.setColumnEditorOpen(open !== undefined ? open : !context.columnEditorOpen);
        context.onRender();
      },

      applyColumnVisibility: async (visibility: { [accessor: string]: boolean }) => {
        const updateHeaderVisibility = (headerList: HeaderObject[]): HeaderObject[] => {
          return headerList.map((header) => {
            const acc = String(header.accessor);
            const shouldUpdate = acc in visibility;
            let hide = shouldUpdate ? !visibility[acc] : header.hide;
            if (isHeaderEssential(header, context.essentialAccessors)) {
              hide = false;
            }
            return {
              ...header,
              hide,
              children: header.children
                ? updateHeaderVisibility(header.children)
                : header.children,
            };
          });
        };

        context.setHeaders(updateHeaderVisibility(context.headers));
        context.onRender();
        if (context.config.onColumnVisibilityChange) {
          context.config.onColumnVisibilityChange(visibility);
        }
      },

      setQuickFilter: (text: string) => {
        if (context.config.quickFilter?.onChange) {
          context.config.quickFilter.onChange(text);
        }
      },

      getSelectedCells: (): Set<string> => {
        return context.selectionManager?.getSelectedCells() || new Set();
      },

      clearSelection: () => {
        context.selectionManager?.clearSelection();
      },

      selectCell: (cell: Cell) => {
        context.selectionManager?.selectSingleCell(cell);
      },

      selectCellRange: (startCell: Cell, endCell: Cell) => {
        context.selectionManager?.selectCellRange(startCell, endCell);
      },
    };
  }
}
