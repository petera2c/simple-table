import { useEffect, useRef, useState } from "react";
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
  const managerRef = useRef<FilterManager | null>(null);
  const [state, setState] = useState<{
    filteredRows: Row[];
    filters: TableFilterState;
  }>({
    filteredRows: [],
    filters: {},
  });

  useEffect(() => {
    const config: FilterManagerConfig = {
      rows,
      headers,
      externalFilterHandling,
      onFilterChange,
      announce,
    };
    managerRef.current = new FilterManager(config);

    const unsubscribe = managerRef.current.subscribe((newState) => {
      setState({
        filteredRows: newState.filteredRows,
        filters: newState.filters,
      });
    });

    setState({
      filteredRows: managerRef.current.getFilteredRows(),
      filters: managerRef.current.getFilters(),
    });

    return () => {
      unsubscribe();
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    managerRef.current?.updateConfig({
      rows,
      headers,
      externalFilterHandling,
      onFilterChange,
      announce,
    });
  }, [rows, headers, externalFilterHandling, onFilterChange, announce]);

  return {
    filteredRows: state.filteredRows,
    updateFilter: (filter: FilterCondition) => managerRef.current?.updateFilter(filter),
    clearFilter: (accessor: Accessor) => managerRef.current?.clearFilter(accessor),
    clearAllFilters: () => managerRef.current?.clearAllFilters(),
    filters: state.filters,
    computeFilteredRowsPreview: (filter: FilterCondition) => 
      managerRef.current?.computeFilteredRowsPreview(filter) ?? [],
  };
};

export default useFilterableData;

