import { useEffect } from "react";
import SortConfig, { SortColumn } from "../types/SortConfig";
import usePrevious from "./usePrevious";

const useExternalSort = ({
  sort,
  onSortChange,
}: {
  sort: SortConfig;
  onSortChange?: (sort: SortColumn) => void;
}) => {
  const previousSort = usePrevious(sort.current);
  // On sort change, if there is an external sort handling, call the onSortChange prop
  useEffect(() => {
    if (
      sort.current &&
      previousSort?.key.accessor !== sort.current.key.accessor &&
      previousSort?.direction !== sort.current.direction
    ) {
      onSortChange?.(sort.current);
    }
  }, [sort, onSortChange, previousSort]);
};

export default useExternalSort;
