import { useState, useCallback, useMemo } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import Row from "../types/Row";
import { Accessor } from "../types/HeaderObject";
import { getNestedValue } from "../utils/rowUtils";

// Helper function to compute filtered rows for a given filter state
const computeFilteredRows = ({
  externalFilterHandling,
  tableRows,
  filterState,
}: {
  externalFilterHandling: boolean;
  tableRows: Row[];
  filterState: TableFilterState | null;
}): Row[] => {
  if (externalFilterHandling) return tableRows;
  if (!filterState || Object.keys(filterState).length === 0) return tableRows;

  return tableRows.filter((row) => {
    return Object.values(filterState).every((filter) => {
      try {
        const cellValue = getNestedValue(row, filter.accessor);
        return applyFilterToValue(cellValue, filter);
      } catch (error) {
        console.warn(`Filter error for accessor ${filter.accessor}:`, error);
        return true; // Include row if filter fails
      }
    });
  });
};

interface UseFilterableDataProps {
  rows: Row[];
  externalFilterHandling: boolean;
  onFilterChange?: (filters: TableFilterState) => void;
}

interface UseFilterableDataReturn {
  filteredRows: Row[];
  updateFilter: (filter: FilterCondition) => void;
  clearFilter: (accessor: Accessor) => void;
  clearAllFilters: () => void;
  filters: TableFilterState;
  // Function to compute what rows would be after applying a filter (for pre-animation calculation)
  computeFilteredRowsPreview: (filter: FilterCondition) => Row[];
}

const useFilterableData = ({
  rows,
  externalFilterHandling,
  onFilterChange,
}: UseFilterableDataProps): UseFilterableDataReturn => {
  // Single filter state instead of complex 3-state system
  const [filters, setFilters] = useState<TableFilterState>({});

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
    (filter: FilterCondition) => {
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
    (accessor: Accessor) => {
      const newFilterState = { ...filters };
      delete newFilterState[accessor];

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
    (filter: FilterCondition) => {
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
