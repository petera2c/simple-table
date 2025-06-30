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
  rowGrouping,
}: {
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortConfig | null) => void;
  rowGrouping?: string[];
}) => {
  const [sort, setSort] = useState<SortConfig | null>(null);

  // Recursive sort function for nested data
  const sortNestedRows = (
    rows: Row[],
    sortConfig: SortConfig,
    headers: HeaderObject[],
    groupingKeys: string[]
  ): Row[] => {
    // First sort the current level
    const { sortedData } = handleSort(headers, rows, sortConfig);

    // If no grouping keys, just return the sorted data
    if (!groupingKeys || groupingKeys.length === 0) {
      return sortedData;
    }

    // For each row, recursively sort its nested data
    return sortedData.map((row) => {
      const currentGroupingKey = groupingKeys[0];
      const nestedData = row[currentGroupingKey];

      if (Array.isArray(nestedData) && nestedData.length > 0) {
        // Recursively sort the nested data with remaining grouping keys
        const sortedNestedData = sortNestedRows(
          nestedData,
          sortConfig,
          headers,
          groupingKeys.slice(1)
        );

        // Return a new row object with sorted nested data
        return {
          ...row,
          [currentGroupingKey]: sortedNestedData,
        };
      }

      return row;
    });
  };

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

    // If rowGrouping is provided, use recursive sorting
    if (rowGrouping && rowGrouping.length > 0) {
      return sortNestedRows(tableRows, sort, headers, rowGrouping);
    }

    // Otherwise use flat sorting
    const { sortedData } = handleSort(headers, tableRows, sort);
    return sortedData;
  }, [tableRows, sort, headers, externalSortHandling, rowGrouping]);

  return {
    setSort,
    sort,
    sortedRows,
    updateSort,
  };
};

export default useSortableData;
