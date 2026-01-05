import { MutableRefObject, useEffect } from "react";
import { Row, SortColumn, TableRefType, UpdateDataProps } from "..";
import { getRowId, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { getCellKey } from "../utils/cellUtils";
import { CellRegistryEntry, HeaderRegistryEntry } from "../context/TableContext";
import { Accessor } from "../types/HeaderObject";
import { SetHeaderRenameProps, ExportToCSVProps } from "../types/TableRefType";
import TableRow from "../types/TableRow";
import { exportTableToCSV } from "../utils/csvExportUtils";
import HeaderObject from "../types/HeaderObject";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { SortDirection } from "../types/SortColumn";

/**
 * Wraps a function to return a Promise that resolves after the next tick.
 * This ensures React state updates have completed before the promise resolves.
 */
const asyncStateUpdate = <TArgs extends any[]>(
  fn: (...args: TArgs) => void
): ((...args: TArgs) => Promise<void>) => {
  return (...args: TArgs) => {
    return new Promise<void>((resolve) => {
      fn(...args);
      // Wait for next tick to ensure state update completes
      setTimeout(() => resolve(), 0);
    });
  };
};

const useTableAPI = ({
  cellRegistryRef,
  clearAllFilters,
  clearFilter,
  currentPage,
  expandedDepths,
  filters,
  flattenedRows,
  headerRegistryRef,
  headers,
  includeHeadersInCSVExport,
  rowGrouping,
  rowIdAccessor,
  rowIndexMap,
  rows,
  rowsPerPage,
  serverSidePagination,
  setCollapsedRows,
  setCurrentPage,
  setExpandedDepths,
  setExpandedRows,
  setRows,
  shouldPaginate,
  sort,
  tableRef,
  updateFilter,
  updateSort,
  visibleRows,
}: {
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  clearAllFilters: () => void;
  clearFilter: (accessor: Accessor) => void;
  currentPage: number;
  expandedDepths: Set<number>;
  filters: TableFilterState;
  flattenedRows: TableRow[];
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
  headers: HeaderObject[];
  includeHeadersInCSVExport: boolean;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  rowIndexMap: MutableRefObject<Map<string | number, number>>;
  rows: Row[];
  rowsPerPage: number;
  serverSidePagination: boolean;
  setCollapsedRows: (
    rows: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>)
  ) => void;
  setCurrentPage: (page: number) => void;
  setExpandedDepths: (depths: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
  setExpandedRows: (
    rows: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>)
  ) => void;
  setRows: (rows: Row[]) => void;
  shouldPaginate: boolean;
  sort: SortColumn | null;
  tableRef?: MutableRefObject<TableRefType | null>;
  updateFilter: (filter: FilterCondition) => void;
  updateSort: (props?: { accessor: Accessor; direction?: SortDirection }) => void;
  visibleRows: TableRow[];
}) => {
  // Set up API methods on the ref if provided
  useEffect(() => {
    if (tableRef) {
      tableRef.current = {
        updateData: ({ accessor, rowIndex, newValue }: UpdateDataProps) => {
          // Get the row ID using the new utility
          const row = rows?.[rowIndex];
          if (row) {
            const rowId = getRowId({ row, rowIdAccessor });
            const key = getCellKey({ rowId, accessor });
            const cell = cellRegistryRef.current.get(key);

            if (cell) {
              // If the cell is registered (visible), update it directly
              cell.updateContent(newValue);
            }

            // Always update the data source - now directly on the row
            // Support nested accessors by using getNestedValue to check existence
            if (getNestedValue(row, accessor) !== undefined) {
              setNestedValue(row, accessor, newValue);
            }
          }
        },
        setHeaderRename: ({ accessor }: SetHeaderRenameProps) => {
          // Find the header cell in the registry and set it to editing mode
          const headerCell = headerRegistryRef.current.get(String(accessor));
          if (headerCell) {
            headerCell.setEditing(true);
          }
        },
        getVisibleRows: () => {
          return visibleRows;
        },
        getAllRows: () => {
          return flattenedRows;
        },
        getHeaders: () => {
          return headers;
        },
        exportToCSV: ({ filename }: ExportToCSVProps = {}) => {
          // Use flattenedRows to export ALL rows, not just the current page
          exportTableToCSV(flattenedRows, headers, filename, includeHeadersInCSVExport);
        },
        getSortState: () => {
          return sort;
        },
        applySortState: asyncStateUpdate(updateSort),
        getFilterState: () => {
          return filters;
        },
        applyFilter: asyncStateUpdate(updateFilter),
        clearFilter: asyncStateUpdate(clearFilter),
        clearAllFilters: asyncStateUpdate(clearAllFilters),
        getCurrentPage: () => {
          return currentPage;
        },
        setPage: (page: number) => setCurrentPage(page),
        expandAll: () => {
          const maxDepth = rowGrouping?.length || 0;
          const depths = Array.from({ length: maxDepth }, (_, i) => i);
          setExpandedDepths(new Set(depths));
          setExpandedRows(new Map());
          setCollapsedRows(new Map());
        },
        collapseAll: () => {
          setExpandedDepths(new Set());
          setExpandedRows(new Map());
          setCollapsedRows(new Map());
        },
        expandDepth: (depth: number) => {
          setExpandedDepths((prev) => {
            const next = new Set(prev);
            // Add this depth and all parent depths (0 to depth)
            for (let i = 0; i <= depth; i++) {
              next.add(i);
            }
            return next;
          });
          // Clear manual overrides for this depth
          setExpandedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
          setCollapsedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
        },
        collapseDepth: (depth: number) => {
          setExpandedDepths((prev) => {
            const next = new Set(prev);
            next.delete(depth);
            return next;
          });
          // Clear manual overrides for this depth
          setExpandedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
          setCollapsedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
        },
        toggleDepth: (depth: number) => {
          setExpandedDepths((prev) => {
            const next = new Set(prev);
            if (next.has(depth)) {
              next.delete(depth);
            } else {
              next.add(depth);
            }
            return next;
          });
          // Clear manual overrides for this depth
          setExpandedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
          setCollapsedRows((prev) => {
            const next = new Map(prev);
            Array.from(next.entries()).forEach(([rowId, rowDepth]) => {
              if (rowDepth === depth) {
                next.delete(rowId);
              }
            });
            return next;
          });
        },
        setExpandedDepths: (depths: Set<number>) => {
          setExpandedDepths(depths);
        },
        getExpandedDepths: () => {
          return expandedDepths;
        },
        getGroupingProperty: (depth: number) => {
          return rowGrouping?.[depth];
        },
        getGroupingDepth: (property: Accessor) => {
          return rowGrouping?.indexOf(property) ?? -1;
        },
      };
    }
  }, [
    cellRegistryRef,
    clearAllFilters,
    clearFilter,
    currentPage,
    expandedDepths,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers,
    includeHeadersInCSVExport,
    rowGrouping,
    rowIdAccessor,
    rowIndexMap,
    rows,
    rowsPerPage,
    serverSidePagination,
    setCollapsedRows,
    setCurrentPage,
    setExpandedDepths,
    setExpandedRows,
    setRows,
    shouldPaginate,
    sort,
    tableRef,
    updateFilter,
    updateSort,
    visibleRows,
  ]);
};

export default useTableAPI;
