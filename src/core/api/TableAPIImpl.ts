import { TableAPI } from "../../types/TableAPI";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import TableRow from "../../types/TableRow";
import SortColumn, { SortDirection } from "../../types/SortColumn";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { CustomTheme } from "../../types/CustomTheme";
import UpdateDataProps from "../../types/UpdateCellProps";
import { SetHeaderRenameProps, ExportToCSVProps } from "../../types/TableAPI";
import RowState from "../../types/RowState";
import Cell from "../../types/Cell";
import { SelectionManager } from "../../managers/SelectionManager";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { flattenRows } from "../../utils/rowFlattening";
import { exportTableToCSV } from "../../utils/csvExportUtils";

export interface TableAPIContext {
  config: SimpleTableConfig;
  localRows: Row[];
  effectiveHeaders: HeaderObject[];
  headers: HeaderObject[];
  customTheme: CustomTheme;
  currentPage: number;
  /** Returns current page from live state (use this in API getCurrentPage so it stays correct after setPage). */
  getCurrentPage: () => number;
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  expandedDepths: Set<number>;
  rowStateMap: Map<string | number, RowState>;
  headerRegistry: Map<string, any>;
  cellRegistry?: Map<string, { updateContent: (value: any) => void }>;
  columnEditorOpen: boolean;
  expandedDepthsManager: any;
  selectionManager: SelectionManager | null;
  sortManager: SortManager | null;
  filterManager: FilterManager | null;
  onRender: () => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setCurrentPage: (page: number) => void;
  setColumnEditorOpen: (open: boolean) => void;
}

export class TableAPIImpl {
  static createAPI(context: TableAPIContext): TableAPI {
    return {
      updateData: (props: UpdateDataProps) => {
        const { rowIndex, accessor, newValue } = props;
        if (rowIndex >= 0 && rowIndex < context.localRows.length) {
          const row = context.localRows[rowIndex] as any;
          row[accessor] = newValue;
          const rowPath = [rowIndex];
          const rowIdArray: (string | number)[] = context.config.getRowId
            ? [
                rowIndex,
                context.config.getRowId({
                  row: context.localRows[rowIndex],
                  depth: 0,
                  index: rowIndex,
                  rowPath,
                  rowIndexPath: rowPath,
                }),
              ]
            : [rowIndex];
          const key = `${rowIdArray.join("-")}-${accessor}`;
          const entry = context.cellRegistry?.get(key);
          if (entry) {
            entry.updateContent(newValue);
          } else {
            context.onRender();
          }
        }
      },

      setHeaderRename: (props: SetHeaderRenameProps) => {
        const headerRegistry = context.headerRegistry.get(props.accessor as string);
        if (headerRegistry) {
          headerRegistry.setEditing(true);
        }
      },

      getVisibleRows: (): TableRow[] => {
        return [];
      },

      getAllRows: (): TableRow[] => {
        const flattenResult = flattenRows({
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
        return flattenResult.flattenedRows;
      },

      getHeaders: (): HeaderObject[] => {
        return context.effectiveHeaders;
      },

      exportToCSV: (props?: ExportToCSVProps) => {
        const flattenResult = flattenRows({
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
        exportTableToCSV(
          flattenResult.flattenedRows,
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
        const flattenResult = flattenRows({
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
        return Math.ceil(flattenResult.paginatableRows.length / (context.config.rowsPerPage ?? 10));
      },

      setPage: async (page: number) => {
        context.setCurrentPage(page);
        context.onRender();
        if (context.config.onPageChange) {
          await context.config.onPageChange(page);
        }
      },

      expandAll: () => {
        context.expandedDepthsManager?.expandAll();
      },

      collapseAll: () => {
        context.expandedDepthsManager?.collapseAll();
      },

      expandDepth: (depth: number) => {
        context.expandedDepthsManager?.expandDepth(depth);
      },

      collapseDepth: (depth: number) => {
        context.expandedDepthsManager?.collapseDepth(depth);
      },

      toggleDepth: (depth: number) => {
        context.expandedDepthsManager?.toggleDepth(depth);
      },

      setExpandedDepths: (depths: Set<number>) => {
        context.expandedDepths = depths;
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
        context.setColumnEditorOpen(open !== undefined ? open : !context.columnEditorOpen);
        context.onRender();
      },

      applyColumnVisibility: async (visibility: { [accessor: string]: boolean }) => {
        const updatedHeaders = context.headers.map((header) => {
          const accessor = header.accessor as string;
          if (accessor in visibility) {
            return { ...header, hide: !visibility[accessor] };
          }
          return header;
        });
        context.setHeaders(updatedHeaders);
        context.onRender();
        if (context.config.onColumnVisibilityChange) {
          const visibilityState: ColumnVisibilityState = {};
          Object.entries(visibility).forEach(([accessor, visible]) => {
            visibilityState[accessor] = visible;
          });
          context.config.onColumnVisibilityChange(visibilityState);
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
