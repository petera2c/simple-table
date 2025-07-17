import { useState, useCallback, useMemo, useLayoutEffect } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { applyFilterToValue } from "../utils/filterUtils";
import Row from "../types/Row";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";

// Filter configuration interface similar to SortConfig
export interface FilterConfig {
  previous: TableFilterState | null;
  current: TableFilterState | null;
  next: TableFilterState | null;
}

// Helper function to compare filter configs
const areFilterConfigsEqual = (a: TableFilterState | null, b: TableFilterState | null) => {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => {
    const aFilter = a[key];
    const bFilter = b[key];

    if (!bFilter) return false;

    return (
      aFilter.accessor === bFilter.accessor &&
      aFilter.operator === bFilter.operator &&
      JSON.stringify(aFilter.value) === JSON.stringify(bFilter.value) &&
      JSON.stringify(aFilter.values) === JSON.stringify(bFilter.values)
    );
  });
};

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
  pastFilteredRows: Row[];
  currentFilteredRows: Row[];
  nextFilteredRows: Row[];
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
  // Filter state management similar to sort state
  // When animations are disabled, the logic below will skip animation transitions
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    previous: null,
    current: null,
    next: null,
  });

  // Optimized computation based on allowAnimations flag
  const filteredRowsData = useMemo(() => {
    if (!allowAnimations) {
      // When animations are disabled, only compute one set of filtered rows
      const filteredRows = computeFilteredRows({
        externalFilterHandling,
        tableRows: rows,
        filterState: filterConfig.next,
      });

      // Return the same filtered rows for all three states to maintain API compatibility
      return {
        currentFilteredRows: filteredRows,
        nextFilteredRows: filteredRows,
        pastFilteredRows: filteredRows,
      };
    }

    // When animations are enabled, compute all three states
    const nextFilteredRows = computeFilteredRows({
      externalFilterHandling,
      tableRows: rows,
      filterState: filterConfig.next,
    });

    const currentFilteredRows = areFilterConfigsEqual(filterConfig.current, filterConfig.next)
      ? nextFilteredRows
      : computeFilteredRows({
          externalFilterHandling,
          tableRows: rows,
          filterState: filterConfig.current,
        });

    const pastFilteredRows = areFilterConfigsEqual(filterConfig.current, filterConfig.previous)
      ? currentFilteredRows
      : computeFilteredRows({
          externalFilterHandling,
          tableRows: rows,
          filterState: filterConfig.previous,
        });

    return {
      currentFilteredRows,
      nextFilteredRows,
      pastFilteredRows,
    };
  }, [allowAnimations, rows, filterConfig, externalFilterHandling]);

  // Filter update handler
  const updateFilter = useCallback(
    (filter: FilterCondition) => {
      if (!allowAnimations) {
        // Simplified filter logic when animations are disabled
        const newFilterState = {
          ...filterConfig.next,
          [filter.accessor]: filter,
        };

        const newFilterConfig: FilterConfig = {
          previous: null,
          current: newFilterState,
          next: newFilterState,
        };

        setFilterConfig(newFilterConfig);
        onFilterChange?.(newFilterState);
        return;
      }

      // Animation-enabled filter logic
      const newFilterState = {
        ...filterConfig.next,
        [filter.accessor]: filter,
      };

      const newFilterConfig: FilterConfig = {
        previous: filterConfig.current,
        current: filterConfig.next,
        next: newFilterState,
      };

      setFilterConfig(newFilterConfig);
      onFilterChange?.(newFilterConfig.current || {});
    },
    [allowAnimations, filterConfig, onFilterChange]
  );

  // Clear single filter
  const clearFilter = useCallback(
    (accessor: string) => {
      if (!allowAnimations) {
        const newFilterState = { ...filterConfig.next };
        delete newFilterState[accessor];

        const newFilterConfig: FilterConfig = {
          previous: null,
          current: newFilterState,
          next: newFilterState,
        };

        setFilterConfig(newFilterConfig);
        onFilterChange?.(newFilterState);
        return;
      }

      // Animation-enabled clear logic
      const newFilterState = { ...filterConfig.next };
      delete newFilterState[accessor];

      const newFilterConfig: FilterConfig = {
        previous: filterConfig.current,
        current: filterConfig.next,
        next: newFilterState,
      };

      setFilterConfig(newFilterConfig);
      onFilterChange?.(newFilterConfig.current || {});
    },
    [allowAnimations, filterConfig, onFilterChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    if (!allowAnimations) {
      const newFilterConfig: FilterConfig = {
        previous: null,
        current: {},
        next: {},
      };

      setFilterConfig(newFilterConfig);
      onFilterChange?.({});
      return;
    }

    // Animation-enabled clear all logic
    const newFilterConfig: FilterConfig = {
      previous: filterConfig.current,
      current: filterConfig.next,
      next: {},
    };

    setFilterConfig(newFilterConfig);
    onFilterChange?.(newFilterConfig.current || {});
  }, [allowAnimations, filterConfig, onFilterChange]);

  // Animation-related useLayoutEffect hooks - only run when animations are enabled
  useLayoutEffect(() => {
    if (!allowAnimations) return;

    // If the current and future filter are the same, return
    if (areFilterConfigsEqual(filterConfig.current, filterConfig.next)) return;

    setFilterConfig({
      previous: filterConfig.previous,
      current: filterConfig.next,
      next: filterConfig.next,
    });
  }, [filterConfig, allowAnimations]);

  useLayoutEffect(() => {
    if (!allowAnimations) return;

    // If the current and future filter are the same, return
    if (
      areFilterConfigsEqual(filterConfig.current, filterConfig.previous) ||
      !areFilterConfigsEqual(filterConfig.current, filterConfig.next)
    )
      return;

    const timeoutId = setTimeout(() => {
      setFilterConfig({
        previous: filterConfig.current,
        current: filterConfig.current,
        next: filterConfig.next,
      });
    }, ANIMATION_CONFIGS.ROW_REORDER.duration);

    return () => clearTimeout(timeoutId);
  }, [filterConfig, allowAnimations]);

  return {
    filterConfig,
    pastFilteredRows: filteredRowsData.pastFilteredRows,
    currentFilteredRows: filteredRowsData.currentFilteredRows,
    nextFilteredRows: filteredRowsData.nextFilteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filters: filterConfig.next || {},
  };
};

export default useFilterableData;
