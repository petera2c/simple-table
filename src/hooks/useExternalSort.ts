import { useEffect } from "react";
import SortConfig from "../types/SortConfig";

const useExternalSort = ({
  sort,
  onSortChange,
}: {
  sort: SortConfig;
  onSortChange?: (sort: SortConfig) => void;
}) => {
  // On sort change, if there is an external sort handling, call the onSortChange prop
  useEffect(() => {
    onSortChange?.(sort);
  }, [sort, onSortChange]);
};

export default useExternalSort;
