import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useMemo, useState } from "react";
import SortConfig from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";

// Extract sort logic to custom hook
const useSortableData = ({ headers, tableRows }: { headers: HeaderObject[]; tableRows: Row[] }) => {
  const [sort, setSort] = useState<SortConfig | null>(null);

  // Initialize hiddenColumns with headers that have hide:true
  const initialHiddenColumns = useMemo(() => {
    const hidden: Record<string, boolean> = {};
    headers.forEach((header) => {
      if (header.hide === true) {
        hidden[header.accessor] = true;
      }
    });
    return hidden;
  }, [headers]);

  const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>(initialHiddenColumns);

  // Simple sort handler
  const updateSort = (columnIndex: number, accessor: string) => {
    const findHeaderRecursively = (headers: HeaderObject[]): HeaderObject | undefined => {
      for (const header of headers) {
        if (header.accessor === accessor) {
          return header;
        }
        if (header.children && header.children.length > 0) {
          const found = findHeaderRecursively(header.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const targetHeader = findHeaderRecursively(headers);
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
