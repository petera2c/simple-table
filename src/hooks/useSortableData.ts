import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useMemo, useState } from "react";
import SortConfig from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";

// Extract sort logic to custom hook
const useSortableData = ({
  headers,
  tableRows,
  externalSortHandling,
  onSortChange,
}: {
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortConfig | null) => void;
}) => {
  const [sort, setSort] = useState<SortConfig | null>(null);

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

    // Calculate what the new sort will be
    let newSort: SortConfig | null = null;
    if (!sort || sort.key.accessor !== accessor) {
      newSort = {
        key: targetHeader,
        direction: "ascending",
      };
    } else if (sort.direction === "ascending") {
      newSort = {
        key: targetHeader,
        direction: "descending",
      };
    }
    // Third click removes the sort (newSort stays null)

    // Update internal state
    setSort(newSort);

    // Notify external handler
    onSortChange?.(newSort);
  };

  const sortedRows = useMemo(() => {
    // If external sort handling is enabled, don't sort internally
    if (externalSortHandling) return tableRows;
    if (!sort) return tableRows;
    const { sortedData } = handleSort(headers, tableRows, sort);
    return sortedData;
  }, [tableRows, sort, headers, externalSortHandling]);

  return {
    setSort,
    sort,
    sortedRows,
    updateSort,
  };
};

export default useSortableData;
