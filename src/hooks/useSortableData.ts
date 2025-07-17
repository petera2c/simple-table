import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import SortConfig, { SortColumn } from "../types/SortConfig";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";

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
  onSortChange?: (sort: SortColumn | null) => void;
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

  // Optimized computation based on allowAnimations flag
  const sortedRowsData = useMemo(() => {
    if (!allowAnimations) {
      // When animations are disabled, only compute one set of sorted rows
      const sortedRows = computeSortedRows({
        externalSortHandling,
        tableRows,
        sortColumn: sort.next,
        rowGrouping,
        headers,
        sortNestedRows,
      });

      // Return the same sorted rows for all three states to maintain API compatibility
      return {
        currentSortedRows: sortedRows,
        nextSortedRows: sortedRows,
        pastSortedRows: sortedRows,
      };
    }

    // When animations are enabled, compute all three states as before
    const nextSortedRows = computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: sort.next,
      rowGrouping,
      headers,
      sortNestedRows,
    });

    const currentSortedRows = areSortConfigsEqual(sort.current, sort.next)
      ? nextSortedRows
      : computeSortedRows({
          externalSortHandling,
          tableRows,
          sortColumn: sort.current,
          rowGrouping,
          headers,
          sortNestedRows,
        });

    const pastSortedRows = areSortConfigsEqual(sort.current, sort.previous)
      ? currentSortedRows
      : computeSortedRows({
          externalSortHandling,
          tableRows,
          sortColumn: sort.previous,
          rowGrouping,
          headers,
          sortNestedRows,
        });

    return {
      currentSortedRows,
      nextSortedRows,
      pastSortedRows,
    };
  }, [
    allowAnimations,
    tableRows,
    sort,
    headers,
    externalSortHandling,
    rowGrouping,
    sortNestedRows,
  ]);

  // Simple sort handler
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

      if (!allowAnimations) {
        // Simplified sort logic when animations are disabled
        let newSortColumn: SortColumn | null = null;

        if (!sort.next || sort.next.key.accessor !== accessor) {
          newSortColumn = {
            key: targetHeader,
            direction: "ascending",
          };
        } else if (sort.next.direction === "ascending") {
          newSortColumn = {
            key: targetHeader,
            direction: "descending",
          };
        }

        const newSort: SortConfig = {
          previous: null,
          current: newSortColumn,
          next: newSortColumn,
        };

        setSort(newSort);
        onSortChange?.(newSort.current);
        return;
      }

      // Original animation-enabled sort logic
      let newSort: SortConfig = {
        previous: null,
        current: null,
        next: null,
      };
      if (!sort || sort.next?.key.accessor !== accessor) {
        newSort = {
          previous: sort.current,
          current: sort.next,
          next: {
            key: targetHeader,
            direction: "ascending",
          },
        };
      } else if (sort.next?.direction === "ascending") {
        newSort = {
          previous: sort.current,
          current: sort.next,
          next: {
            key: targetHeader,
            direction: "descending",
          },
        };
      }

      setSort(newSort);
      onSortChange?.(newSort.current);
    },
    [allowAnimations, sort, headers, onSortChange]
  );

  // Animation-related useLayoutEffect hooks - only run when animations are enabled
  useLayoutEffect(() => {
    if (!allowAnimations) return;

    // If the current and future sort are the same, return
    if (
      sort.current?.key.accessor === sort.next?.key.accessor &&
      sort.current?.direction === sort.next?.direction
    )
      return;

    setSort({
      previous: sort.previous,
      current: sort.next,
      next: sort.next,
    });
  }, [sort, allowAnimations]);

  useLayoutEffect(() => {
    if (!allowAnimations) return;

    // If the current and future sort are the same, return
    if (
      (sort.current?.key.accessor === sort.previous?.key.accessor &&
        sort.current?.direction === sort.previous?.direction) ||
      sort.current?.key.accessor !== sort.next?.key.accessor ||
      sort.current?.direction !== sort.next?.direction
    )
      return;

    const timeoutId = setTimeout(() => {
      setSort({
        previous: sort.current,
        current: sort.current,
        next: sort.next,
      });
    }, ANIMATION_CONFIGS.ROW_REORDER.duration);

    return () => clearTimeout(timeoutId);
  }, [sort, allowAnimations]);

  return {
    setSort,
    sort,
    currentSortedRows: sortedRowsData.currentSortedRows,
    nextSortedRows: sortedRowsData.nextSortedRows,
    pastSortedRows: sortedRowsData.pastSortedRows,
    updateSort,
  };
};

export default useSortableData;
