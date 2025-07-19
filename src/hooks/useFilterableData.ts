import { useState, useCallback, useMemo } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import Row from "../types/Row";

// Simplified filter configuration interface
export interface FilterConfig {
  current: TableFilterState | null;
}

// Helper function to compute filtered rows
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
        const cellValue = row[filter.accessor];
        return applyFilterToValue(cellValue, filter);
      } catch (error) {
        console.warn(`Filter error for accessor ${filter.accessor}:`, error);
        return true; // Include row if filter fails
      }
    });
  });
};

interface UseFilterableDataProps {
  allowAnimations: boolean;
  rows: Row[];
  externalFilterHandling: boolean;
  onFilterChange?: (filters: TableFilterState) => void;
}

interface UseFilterableDataReturn {
  filterConfig: FilterConfig;
  currentFilteredRows: Row[];
  updateFilter: (filter: FilterCondition) => void;
  clearFilter: (accessor: string) => void;
  clearAllFilters: () => void;
  filters: TableFilterState;
}

const useFilterableData = ({
  allowAnimations,
  rows,
  externalFilterHandling,
  onFilterChange,
}: UseFilterableDataProps): UseFilterableDataReturn => {
  // Simplified filter state - only current filters needed
  const [currentFilters, setCurrentFilters] = useState<TableFilterState>({});

  // Single state computation - massive performance improvement
  const filteredRows = useMemo(() => {
    return computeFilteredRows({
      externalFilterHandling,
      tableRows: rows,
      filterState: currentFilters,
    });
  }, [rows, currentFilters, externalFilterHandling]);

  // Filter update handler
  const updateFilter = useCallback(
    (filter: FilterCondition) => {
      const newFilterState = {
        ...currentFilters,
        [filter.accessor]: filter,
      };

      setCurrentFilters(newFilterState);
      onFilterChange?.(newFilterState);
    },
    [currentFilters, onFilterChange]
  );

  // Clear single filter
  const clearFilter = useCallback(
    (accessor: string) => {
      const newFilterState = { ...currentFilters };
      delete newFilterState[accessor];

      setCurrentFilters(newFilterState);
      onFilterChange?.(newFilterState);
    },
    [currentFilters, onFilterChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setCurrentFilters({});
    onFilterChange?.({});
  }, [onFilterChange]);

  // Return simplified interface - maintaining compatibility with existing code
  return {
    filterConfig: {
      current: currentFilters,
    },
    currentFilteredRows: filteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filters: currentFilters,
  };
};

export default useFilterableData;
