import { useEffect } from "react";
import { TableFilterState } from "../types/FilterTypes";

const useExternalFilters = ({
  filters,
  onFilterChange,
}: {
  filters: TableFilterState;
  onFilterChange?: (filters: TableFilterState) => void;
}) => {
  // On filter change, if there is an external filter handling, call the onFilterChange prop
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);
};

export default useExternalFilters;
