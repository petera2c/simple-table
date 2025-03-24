import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useMemo, useState } from "react";
import SortConfig from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";

// Extract sort logic to custom hook
const useSortableData = (tableRows: Row[], headers: HeaderObject[]) => {
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>({});

  // Simple sort handler
  const updateSort = (columnIndex: number, accessor: string) => {
    const targetHeader = headers.find((h) => h.accessor === accessor);
    if (!targetHeader) return;

    setSort((prevSort) => {
      if (!prevSort || prevSort.key.accessor !== accessor) {
        return {
          key: targetHeader,
          direction: "ascending",
        };
      } else if (prevSort.direction === "ascending") {
        return {
          key: targetHeader,
          direction: "descending",
        };
      }
      // Third click removes the sort
      return null;
    });
  };

  const sortedRows = useMemo(() => {
    if (!sort) return tableRows;
    const { sortedData } = handleSort(headers, tableRows, sort);
    return sortedData;
  }, [tableRows, sort, headers]);

  return {
    sort,
    setSort,
    updateSort,
    sortedRows,
    hiddenColumns,
    setHiddenColumns,
  };
};

export default useSortableData;
