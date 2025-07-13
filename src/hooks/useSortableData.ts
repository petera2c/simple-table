import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import SortConfig, { SortColumn } from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";
import { DEFAULT_ANIMATION_CONFIG } from "../components/animate/animation-utils";

// Helper function to compare sort configs
const areSortConfigsEqual = (a: SortColumn | null, b: SortColumn | null) => {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  return a.key.accessor === b.key.accessor && a.direction === b.direction;
};

// Helper function to compute sorted rows for a given sort column
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
  // Restore the original sort state management for animations
  const [sort, setSort] = useState<SortConfig>({
    previous: null,
    current: null,
    next: null,
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

  // Compute next sorted rows (the target state after animation)
  const nextSortedRows = useMemo(() => {
    return computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: sort.next,
      rowGrouping,
      headers,
      sortNestedRows,
    });
  }, [tableRows, sort, headers, externalSortHandling, rowGrouping, sortNestedRows]);

  // Compute current sorted rows - reuse nextSortedRows if sort configs are the same
  const currentSortedRows = useMemo(() => {
    // If current and next sort configs are the same, use the same computed values
    if (areSortConfigsEqual(sort.current, sort.next)) {
      return nextSortedRows;
    }

    // Otherwise, compute based on current sort
    return computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: sort.current,
      rowGrouping,
      headers,
      sortNestedRows,
    });
  }, [tableRows, sort, nextSortedRows, headers, externalSortHandling, rowGrouping, sortNestedRows]);

  // Compute past sorted rows - reuse currentSortedRows if sort configs are the same
  const pastSortedRows = useMemo(() => {
    // If current and previous sort configs are the same, use the same computed values
    if (areSortConfigsEqual(sort.current, sort.previous)) {
      return currentSortedRows;
    }

    // Otherwise, compute based on previous sort
    return computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: sort.previous,
      rowGrouping,
      headers,
      sortNestedRows,
    });
  }, [
    tableRows,
    sort,
    currentSortedRows,
    headers,
    externalSortHandling,
    rowGrouping,
    sortNestedRows,
  ]);

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
      next: null,
    };
    if (!sort || sort.previous?.key.accessor !== accessor) {
      newSort = {
        previous: sort.current,
        current: sort.next,
        next: {
          key: targetHeader,
          direction: "ascending",
        },
      };
    } else if (sort.previous?.direction === "ascending") {
      newSort = {
        previous: sort.current,
        current: sort.next,
        next: {
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

  useLayoutEffect(() => {
    // If animations are not allowed, or the current and future sort are the same, return
    if (
      !allowAnimations ||
      (sort.current?.key.accessor === sort.next?.key.accessor &&
        sort.current?.direction === sort.next?.direction)
    )
      return;

    setSort({
      previous: sort.previous,
      current: sort.next,
      next: sort.next,
    });
  }, [sort, allowAnimations]);

  useLayoutEffect(() => {
    // If animations are not allowed, or the current and future sort are the same, return
    if (
      !allowAnimations ||
      (sort.current?.key.accessor === sort.previous?.key.accessor &&
        sort.current?.direction === sort.previous?.direction) ||
      (sort.current?.key.accessor !== sort.next?.key.accessor &&
        sort.current?.direction !== sort.next?.direction)
    )
      return;

    setTimeout(() => {
      setSort({
        previous: sort.current,
        current: sort.current,
        next: sort.next,
      });
    }, DEFAULT_ANIMATION_CONFIG.duration);
  }, [sort, allowAnimations]);

  return {
    setSort,
    sort,
    currentSortedRows,
    nextSortedRows,
    pastSortedRows,
    updateSort,
  };
};

export default useSortableData;
