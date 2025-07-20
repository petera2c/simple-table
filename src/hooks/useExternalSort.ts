import { useEffect } from "react";
import { SortColumn } from "../types/SortConfig";
import usePrevious from "./usePrevious";

const useExternalSort = ({
  sort,
  onSortChange,
}: {
  sort: SortColumn | null;
  onSortChange?: (sort: SortColumn | null) => void;
}) => {
  const previousSort = usePrevious(sort);

  // On sort change, if there is an external sort handling, call the onSortChange prop
  useEffect(() => {
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
  }, [sort, previousSort, onSortChange]);
};

export default useExternalSort;
