import { useState, useCallback, useMemo } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import Row from "../types/Row";

interface UseTableFiltersProps {
  externalFilterHandling: boolean;
  rows: Row[];
}

interface UseTableFiltersReturn {
  filters: TableFilterState;
  filteredRows: Row[];
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearFilter: (accessor: string) => void;
  handleClearAllFilters: () => void;
}

export const useTableFilters = ({
  externalFilterHandling,
  rows,
}: UseTableFiltersProps): UseTableFiltersReturn => {
  const [filters, setFilters] = useState<TableFilterState>({});

  // Apply filters to rows
  const filteredRows = useMemo(() => {
    if (externalFilterHandling) return rows;
    if (Object.keys(filters).length === 0) return rows;

    return rows.filter((row) => {
      return Object.values(filters).every((filter) => {
        try {
          const cellValue = row[filter.accessor];
          return applyFilterToValue(cellValue, filter);
        } catch (error) {
          console.warn(`Filter error for accessor ${filter.accessor}:`, error);
          return true; // Include row if filter fails
        }
      });
    });
  }, [externalFilterHandling, filters, rows]);

  // Filter handlers
  const handleApplyFilter = useCallback((filter: FilterCondition) => {
    setFilters((prev) => ({
      ...prev,
      [filter.accessor]: filter,
    }));
  }, []);

  const handleClearFilter = useCallback((accessor: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[accessor];
      return newFilters;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    filteredRows,
    handleApplyFilter,
    handleClearFilter,
    handleClearAllFilters,
  };
};
