import { useEffect, useRef, useReducer } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { FilterManager, FilterManagerConfig } from "../managers/FilterManager";

interface UseFilterableDataProps {
  rows: Row[];
  headers: HeaderObject[];
  externalFilterHandling: boolean;
  onFilterChange?: (filters: TableFilterState) => void;
  announce?: (message: string) => void;
}

interface UseFilterableDataReturn {
  filteredRows: Row[];
  updateFilter: (filter: FilterCondition) => void;
  clearFilter: (accessor: Accessor) => void;
  clearAllFilters: () => void;
  filters: TableFilterState;
  computeFilteredRowsPreview: (filter: FilterCondition) => Row[];
}

const useFilterableData = ({
  rows,
  headers,
  externalFilterHandling,
  onFilterChange,
  announce,
}: UseFilterableDataProps): UseFilterableDataReturn => {
  const managerRef = useRef<FilterManager>();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  if (!managerRef.current) {
    const config: FilterManagerConfig = {
      rows,
      headers,
      externalFilterHandling,
      onFilterChange,
      announce,
    };
    managerRef.current = new FilterManager(config);
  }

  useEffect(() => {
    const manager = managerRef.current!;
    const unsubscribe = manager.subscribe(() => {
      forceUpdate();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    managerRef.current!.updateConfig({
      rows,
      headers,
      externalFilterHandling,
      onFilterChange,
      announce,
    });
  }, [rows, headers, externalFilterHandling, onFilterChange, announce]);

  useEffect(() => {
    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  const manager = managerRef.current;
  const state = manager.getState();

  return {
    filteredRows: state.filteredRows,
    updateFilter: (filter: FilterCondition) => manager.updateFilter(filter),
    clearFilter: (accessor: Accessor) => manager.clearFilter(accessor),
    clearAllFilters: () => manager.clearAllFilters(),
    filters: state.filters,
    computeFilteredRowsPreview: (filter: FilterCondition) => 
      manager.computeFilteredRowsPreview(filter),
  };
};

export default useFilterableData;

