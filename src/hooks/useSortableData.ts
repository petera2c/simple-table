import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useCallback, useMemo, useState } from "react";
import SortConfig, { SortColumn } from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";

// Helper function to compute sorted rows
const computeSortedRows = ({
  externalSortHandling,
  tableRows,
  sortColumn,
  rowGrouping,
  headers,
  sortNestedRows,
}: {
  externalSortHandling: boolean;
  tableRows: Row[];
  sortColumn: SortColumn | null;
  rowGrouping?: string[];
  headers: HeaderObject[];
  sortNestedRows: (params: {
    groupingKeys: string[];
    headers: HeaderObject[];
    rows: Row[];
    sortColumn: SortColumn;
  }) => Row[];
}): Row[] => {
  if (externalSortHandling) return tableRows;
  if (!sortColumn) return tableRows;

  if (rowGrouping && rowGrouping.length > 0) {
    return sortNestedRows({
      groupingKeys: rowGrouping,
      headers,
      rows: tableRows,
      sortColumn,
    });
  } else {
    return handleSort({ headers, rows: tableRows, sortColumn });
  }
};

// Simplified sort hook - single state only
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
  onSortChange?: (sort: SortColumn | null) => void;
  rowGrouping?: string[];
}) => {
  // Simplified sort state - only current sort needed
  const [currentSort, setCurrentSort] = useState<SortColumn | null>(null);

  // Recursive sort function for nested data
  const sortNestedRows = useCallback(
    ({
      groupingKeys,
      headers,
      rows,
      sortColumn,
    }: {
      groupingKeys: string[];
      headers: HeaderObject[];
      rows: Row[];
      sortColumn: SortColumn;
    }): Row[] => {
      // First sort the current level
      const sortedData = handleSort({ headers, rows, sortColumn });

      // If no grouping keys, just return the sorted data
      if (!groupingKeys || groupingKeys.length === 0) {
        return sortedData;
      }

      // For each row, recursively sort its nested data
      return sortedData.map((row) => {
        const currentGroupingKey = groupingKeys[0];
        const nestedData = row[currentGroupingKey];

        if (isRowArray(nestedData)) {
          // Recursively sort the nested data with remaining grouping keys
          const sortedNestedData = sortNestedRows({
            rows: nestedData,
            sortColumn,
            headers,
            groupingKeys: groupingKeys.slice(1),
          });

          // Return a new row object with sorted nested data
          return {
            ...row,
            [currentGroupingKey]: sortedNestedData,
          };
        }

        return row;
      });
    },
    []
  );

  // Single state computation - massive performance improvement
  const sortedRows = useMemo(() => {
    return computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: currentSort,
      rowGrouping,
      headers,
      sortNestedRows,
    });
  }, [tableRows, currentSort, headers, externalSortHandling, rowGrouping, sortNestedRows]);

  // Simplified sort handler
  const updateSort = useCallback(
    (accessor: string) => {
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

      if (!targetHeader) {
        return;
      }

      let newSortColumn: SortColumn | null = null;

      if (!currentSort || currentSort.key.accessor !== accessor) {
        newSortColumn = {
          key: targetHeader,
          direction: "ascending",
        };
      } else if (currentSort.direction === "ascending") {
        newSortColumn = {
          key: targetHeader,
          direction: "descending",
        };
      }
      // If descending, newSortColumn stays null (clears sort)

      setCurrentSort(newSortColumn);
      onSortChange?.(newSortColumn);
    },
    [currentSort, headers, onSortChange]
  );

  // Return simplified interface - maintaining compatibility with existing code
  return {
    setSort: (sortConfig: SortConfig) => {
      setCurrentSort(sortConfig.current);
    },
    sort: {
      previous: null,
      current: currentSort,
      next: currentSort,
    },
    currentSortedRows: sortedRows,
    updateSort,
  };
};

export default useSortableData;
