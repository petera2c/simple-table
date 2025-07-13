import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useCallback, useEffect, useMemo, useState } from "react";
import SortConfig, { SortColumn } from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";

// Extract sort logic to custom hook
const useSortableData = ({
  allowAnimations,
  headers,
  tableRows,
  externalSortHandling,
  onSortChange,
  rowGrouping,
}: {
  allowAnimations: boolean;
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortConfig | null) => void;
  rowGrouping?: string[];
}) => {
  const [sort, setSort] = useState<SortConfig>({
    previous: null,
    current: null,
    future: null,
  });

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

  // Simple sort handler
  const updateSort = (accessor: string) => {
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

    // Calculate what the new sort will be
    let newSort: SortConfig = {
      previous: null,
      current: null,
      future: null,
    };
    if (!sort || sort.previous?.key.accessor !== accessor) {
      newSort = {
        previous: sort.current,
        current: sort.future,
        future: {
          key: targetHeader,
          direction: "ascending",
        },
      };
    } else if (sort.previous?.direction === "ascending") {
      newSort = {
        previous: sort.current,
        current: sort.future,
        future: {
          key: targetHeader,
          direction: "descending",
        },
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
    if (!sort.current) return tableRows;

    // If rowGrouping is provided, use recursive sorting
    if (rowGrouping && rowGrouping.length > 0) {
      return sortNestedRows({
        groupingKeys: rowGrouping,
        headers,
        rows: tableRows,
        sortColumn: sort.current,
      });
    }

    // Otherwise use flat sorting
    const sortedData = handleSort({ headers, rows: tableRows, sortColumn: sort.current });
    return sortedData;
  }, [tableRows, sort, headers, externalSortHandling, rowGrouping, sortNestedRows]);

  useEffect(() => {
    // If animations are not allowed, or the current and future sort are the same, return
    if (!allowAnimations || sort.current?.key.accessor === sort.future?.key.accessor) return;
  }, [sort, allowAnimations]);

  return {
    setSort,
    sort,
    sortedRows,
    updateSort,
  };
};

export default useSortableData;
