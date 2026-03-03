import SortColumn from "../types/SortColumn";

/**
 * Pure function to check if sort has changed and call the callback if needed
 * @param sort - Current sort state
 * @param previousSort - Previous sort state
 * @param onSortChange - Callback to invoke when sort changes
 */
export const callOnSortChange = (
  sort: SortColumn | null,
  previousSort: SortColumn | null,
  onSortChange?: (sort: SortColumn | null) => void
): void => {
  if (
    sort &&
    (previousSort?.key.accessor !== sort.key.accessor ||
      previousSort?.direction !== sort.direction)
  ) {
    onSortChange?.(sort);
  } else if (!sort && previousSort) {
    // Sort was cleared
    onSortChange?.(null);
  }
};

export default callOnSortChange;
