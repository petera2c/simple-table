import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useMemo, useState } from "react";
import SortConfig from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";

// Extract sort logic to custom hook
const useSortableData = (tableRows: Row[], headers: HeaderObject[]) => {
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>(
    {}
  );

  const sortedRows = useMemo(() => {
    if (!sort) return tableRows;
    const { sortedData } = handleSort(headers, tableRows, sort);
    return sortedData;
  }, [tableRows, sort, headers]);

  return { sort, setSort, sortedRows, hiddenColumns, setHiddenColumns };
};

export default useSortableData;
