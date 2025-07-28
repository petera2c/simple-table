import { useState, useCallback, useMemo } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import { Accessor } from "../types/HeaderObject";

// Helper function to compute filtered rows for a given filter state
const computeFilteredRows = <T>({
  externalFilterHandling,
  tableRows,
  filterState,
}: {
  externalFilterHandling: boolean;
  tableRows: T[];
  filterState: TableFilterState<T> | null;
}): T[] => {
  if (externalFilterHandling) return tableRows;
  if (!filterState || Object.keys(filterState).length === 0) return tableRows;

  return tableRows.filter((row) => {
    return Object.values(filterState).every((filter: FilterCondition<T>) => {
      try {
        const cellValue = row[filter.accessor];
        return applyFilterToValue(cellValue, filter);
      } catch (error) {
        console.warn(`Filter error for accessor ${String(filter.accessor)}:`, error);
        return true; // Include row if filter fails
      }
    });
  });
};

interface UseFilterableDataProps<T> {
  rows: T[];
  externalFilterHandling: boolean;
  onFilterChange?: (filters: TableFilterState<T>) => void;
}

interface UseFilterableDataReturn<T> {
  filteredRows: T[];
  updateFilter: (filter: FilterCondition<T>) => void;
  clearFilter: (accessor: Accessor<T>) => void;
  clearAllFilters: () => void;
  filters: TableFilterState<T>;
  // Function to compute what rows would be after applying a filter (for pre-animation calculation)
  computeFilteredRowsPreview: (filter: FilterCondition<T>) => T[];
}

const useFilterableData = <T>({
  rows,
  externalFilterHandling,
  onFilterChange,
}: UseFilterableDataProps<T>): UseFilterableDataReturn<T> => {
  // Single filter state instead of complex 3-state system
  const [filters, setFilters] = useState<TableFilterState<T>>({});

  // Compute current filtered rows
  const filteredRows = useMemo(() => {
    return computeFilteredRows({
      externalFilterHandling,
      tableRows: rows,
      filterState: filters,
    });
  }, [rows, filters, externalFilterHandling]);

  // Filter update handler
  const updateFilter = useCallback(
    (filter: FilterCondition<T>) => {
      const newFilterState = {
        ...filters,
        [filter.accessor]: filter,
      };

      setFilters(newFilterState);
      onFilterChange?.(newFilterState);
    },
    [filters, onFilterChange]
  );

  // Clear single filter
  const clearFilter = useCallback(
    (accessor: Accessor<T>) => {
      const newFilterState = { ...filters };
      delete newFilterState[String(accessor)];

      setFilters(newFilterState);
      onFilterChange?.(newFilterState);
    },
    [filters, onFilterChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({});
    onFilterChange?.({});
  }, [onFilterChange]);

  // Function to preview what rows would be after applying a filter
  // This is used for pre-animation calculation
  const computeFilteredRowsPreview = useCallback(
    (filter: FilterCondition<T>) => {
      const previewFilterState = {
        ...filters,
        [filter.accessor]: filter,
      };

      return computeFilteredRows({
        externalFilterHandling,
        tableRows: rows,
        filterState: previewFilterState,
      });
    },
    [filters, rows, externalFilterHandling]
  );

  return {
    filteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filters,
    computeFilteredRowsPreview,
  };
};

export default useFilterableData;
