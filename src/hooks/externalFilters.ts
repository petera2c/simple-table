import { TableFilterState } from "../types/FilterTypes";

/**
 * Calls the onFilterChange callback with the current filters if provided.
 * This is a simple utility function that replaces the useExternalFilters hook.
 * 
 * @param filters - Current filter state
 * @param onFilterChange - Optional callback to invoke when filters change
 */
export function callOnFilterChange(
  filters: TableFilterState,
  onFilterChange?: (filters: TableFilterState) => void
): void {
  onFilterChange?.(filters);
}

export default callOnFilterChange;
