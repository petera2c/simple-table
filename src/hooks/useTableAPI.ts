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
  filters,
  flattenedRows,
  headerRegistryRef,
  headers,
  includeHeadersInCSVExport,
  rowIdAccessor,
  rowIndexMap,
  rows,
  setRows,
  sort,
  tableRef,
  updateFilter,
  updateSort,
  visibleRows,
}: {
  cellRegistryRef: MutableRefObject<Map<string, CellRegistryEntry>>;
  clearAllFilters: () => void;
  clearFilter: (accessor: Accessor) => void;
  filters: TableFilterState;
  flattenedRows: TableRow[];
  headerRegistryRef: MutableRefObject<Map<string, HeaderRegistryEntry>>;
  headers: HeaderObject[];
  includeHeadersInCSVExport: boolean;
  rowIdAccessor: Accessor;
  rowIndexMap: MutableRefObject<Map<string | number, number>>;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  sort: SortColumn | null;
  tableRef?: MutableRefObject<TableRefType | null>;
  updateFilter: (filter: FilterCondition) => void;
  updateSort: (accessor: Accessor | null) => void;
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
        applySortState: asyncStateUpdate((sortColumn: SortColumn | null) => {
          if (sortColumn === null) {
            updateSort(null);
          } else if (sortColumn.key) {
            updateSort(sortColumn.key.accessor);
          }
        }),
        getFilterState: () => {
          return filters;
        },
        applyFilter: asyncStateUpdate(updateFilter),
        clearFilter: asyncStateUpdate(clearFilter),
        clearAllFilters: asyncStateUpdate(clearAllFilters),
      };
    }
  }, [
    cellRegistryRef,
    clearAllFilters,
    clearFilter,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers,
    includeHeadersInCSVExport,
    rowIdAccessor,
    rowIndexMap,
    rows,
    setRows,
    sort,
    tableRef,
    updateFilter,
    updateSort,
    visibleRows,
  ]);
};

export default useTableAPI;
