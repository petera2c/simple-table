import { MutableRefObject, useEffect } from "react";
import { Row, SortColumn, TableRefType, UpdateDataProps } from "..";
import { rowIdToString, getNestedValue, setNestedValue } from "../utils/rowUtils";
import { getCellKey } from "../utils/cellUtils";
import { CellRegistryEntry, HeaderRegistryEntry } from "../context/TableContext";
import { Accessor } from "../types/HeaderObject";
import { SetHeaderRenameProps, ExportToCSVProps } from "../types/TableRefType";
import TableRow from "../types/TableRow";
import { exportTableToCSV } from "../utils/csvExportUtils";
import HeaderObject from "../types/HeaderObject";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { SortDirection } from "../types/SortColumn";
import { QuickFilterConfig } from "../types/QuickFilterTypes";

/**
 * Wraps a function to return a Promise that resolves after the next tick.
 * This ensures React state updates have completed before the promise resolves.
 */
const asyncStateUpdate = <TArgs extends any[]>(
  fn: (...args: TArgs) => void,
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
  editColumns,
  expandedDepths,
  filters,
  flattenedRows,
  headerRegistryRef,
  headers,
  includeHeadersInCSVExport,
  onColumnVisibilityChange,
  onPageChange,
  paginatableRows,
  quickFilter,
  rowGrouping,
  rowIndexMap,
  rows,
  rowsPerPage,
  serverSidePagination,
  setCollapsedRows,
  setColumnEditorOpen,
  setCurrentPage,
  setExpandedDepths,
  setExpandedRows,
  setHeaders,
  setRows,
  shouldPaginate,
  sort,
  tableRef,
  totalRowCount,
  updateFilter,
  updateSort,
  visibleRows,
}: {
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  clearAllFilters: () => void;
  clearFilter: (accessor: Accessor) => void;
  currentPage: number;
  editColumns: boolean;
  expandedDepths: Set<number>;
  filters: TableFilterState;
  flattenedRows: TableRow[];
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
  headers: HeaderObject[];
  includeHeadersInCSVExport: boolean;
  onColumnVisibilityChange?: (visibilityState: Record<string, boolean>) => void;
  onPageChange?: (page: number) => void | Promise<void>;
  paginatableRows: TableRow[];
  quickFilter?: QuickFilterConfig;
  rowGrouping?: Accessor[];
  rowIndexMap: MutableRefObject<Map<string | number, number>>;
  rows: Row[];
  rowsPerPage: number;
  serverSidePagination: boolean;
  setCollapsedRows: (
    rows: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
  ) => void;
  setColumnEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: (page: number) => void;
  setExpandedDepths: (depths: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
  setExpandedRows: (
    rows: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
  ) => void;
  setHeaders: React.Dispatch<React.SetStateAction<HeaderObject[]>>;
  setRows: (rows: Row[]) => void;
  shouldPaginate: boolean;
  sort: SortColumn | null;
  tableRef?: MutableRefObject<TableRefType | null>;
  totalRowCount?: number;
  updateFilter: (filter: FilterCondition) => void;
  updateSort: (props?: { accessor: Accessor; direction?: SortDirection }) => void;
  visibleRows: TableRow[];
}) => {
  // Set up API methods on the ref if provided
  useEffect(() => {
    if (tableRef) {
      tableRef.current = {
        updateData: ({ accessor, rowIndex, newValue }: UpdateDataProps) => {
          // Get the row from the data source
          const row = rows?.[rowIndex];
          if (row) {
            // Get the actual rowId from the flattened rows which includes custom IDs from getRowId
            const flattenedRow = flattenedRows.find((r) => r.absoluteRowIndex === rowIndex);
            if (flattenedRow) {
              const rowId = rowIdToString(flattenedRow.rowId);
              const key = getCellKey({ rowId, accessor });
              const cell = cellRegistryRef.current.get(key);

              if (cell) {
                // If the cell is registered (visible), update it directly
                cell.updateContent(newValue);
              }
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
        getTotalPages: () => {
          const totalRows = totalRowCount ?? paginatableRows.length;
          return Math.ceil(totalRows / rowsPerPage);
        },
        setPage: async (page: number) => {
          // Only update page if within valid range
          const totalPages = Math.ceil((totalRowCount ?? paginatableRows.length) / rowsPerPage);
          if (page >= 1 && page <= totalPages) {
            // Update internal state
            setCurrentPage(page);
            // Call user's page change callback if provided
            if (onPageChange) {
              await onPageChange(page);
            }
          }
        },
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
        toggleColumnEditor: (open?: boolean) => {
          // Only allow toggling if editColumns is enabled
          if (!editColumns) return;

          if (open !== undefined) {
            // Explicitly set the state
            setColumnEditorOpen(open);
          } else {
            // Toggle the state
            setColumnEditorOpen((prev) => !prev);
          }
        },
        applyColumnVisibility: asyncStateUpdate((visibility: { [accessor: string]: boolean }) => {
          // Helper function to recursively update headers
          const updateHeaderVisibility = (headers: HeaderObject[]): HeaderObject[] => {
            return headers.map((header) => {
              const accessor = String(header.accessor);
              const shouldUpdate = accessor in visibility;

              return {
                ...header,
                // Update hide property if this accessor is in the visibility object
                hide: shouldUpdate ? !visibility[accessor] : header.hide,
                // Recursively update children if they exist
                children: header.children
                  ? updateHeaderVisibility(header.children)
                  : header.children,
              };
            });
          };

          // Update headers state
          setHeaders((currentHeaders) => updateHeaderVisibility(currentHeaders));

          // Call the callback if provided
          if (onColumnVisibilityChange) {
            onColumnVisibilityChange(visibility);
          }
        }),
        setQuickFilter: (text: string) => {
          // Trigger the onChange callback if provided in quickFilter config
          if (quickFilter?.onChange) {
            quickFilter.onChange(text);
          }
        },
      };
    }
  }, [
    cellRegistryRef,
    clearAllFilters,
    clearFilter,
    currentPage,
    editColumns,
    expandedDepths,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers,
    includeHeadersInCSVExport,
    onColumnVisibilityChange,
    onPageChange,
    paginatableRows,
    quickFilter,
    rowGrouping,
    rowIndexMap,
    rows,
    rowsPerPage,
    serverSidePagination,
    setCollapsedRows,
    setColumnEditorOpen,
    setCurrentPage,
    setExpandedDepths,
    setExpandedRows,
    setHeaders,
    setRows,
    shouldPaginate,
    sort,
    tableRef,
    totalRowCount,
    updateFilter,
    updateSort,
    visibleRows,
  ]);
};

export default useTableAPI;
