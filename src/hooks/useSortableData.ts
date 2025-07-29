import HeaderObject, { Accessor } from "../types/HeaderObject";
import { useCallback, useMemo, useState } from "react";
import SortColumn from "../types/SortColumn";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";
import RowGrouping from "../types/RowGrouping";

// Helper function to compute sorted rows for a given sort column
const computeSortedRows = <T>({
  externalSortHandling,
  tableRows,
  sortColumn,
  rowGrouping,
  headers,
  sortNestedRows,
}: {
  externalSortHandling: boolean;
  tableRows: T[];
  sortColumn: SortColumn<T> | null;
  rowGrouping?: RowGrouping;
  headers: HeaderObject<T>[];
  sortNestedRows: (params: {
    groupingKeys: RowGrouping;
    headers: HeaderObject<T>[];
    rows: T[];
    sortColumn: SortColumn<T>;
  }) => T[];
}): T[] => {
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
const useSortableData = <T>({
  headers,
  tableRows,
  externalSortHandling,
  onSortChange,
  rowGrouping,
}: {
  headers: HeaderObject<T>[];
  tableRows: T[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortColumn<T> | null) => void;
  rowGrouping?: RowGrouping;
}) => {
  // Single sort state instead of complex 3-state system
  const [sort, setSort] = useState<SortColumn<T> | null>(null);

  // Recursive sort function for nested data
  const sortNestedRows = useCallback(
    ({
      groupingKeys,
      headers,
      rows,
      sortColumn,
    }: {
      groupingKeys: string[];
      headers: HeaderObject<T>[];
      rows: T[];
      sortColumn: SortColumn<T>;
    }): T[] => {
      // First sort the current level
      const sortedData = handleSort({ headers, rows, sortColumn });

      // If no grouping keys, just return the sorted data
      if (!groupingKeys || groupingKeys.length === 0) {
        return sortedData;
      }

      // For each row, recursively sort its nested data
      return sortedData.map((row) => {
        const currentGroupingKey = groupingKeys[0];
        const nestedData = row[currentGroupingKey as keyof T];

        if (isRowArray(nestedData)) {
          // Recursively sort the nested data with remaining grouping keys
          const sortedNestedData = sortNestedRows({
            rows: nestedData as T[],
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

  // Compute current sorted rows
  const sortedRows = useMemo(() => {
    return computeSortedRows({
      externalSortHandling,
      tableRows,
      sortColumn: sort,
      rowGrouping,
      headers,
      sortNestedRows,
    });
  }, [tableRows, sort, headers, externalSortHandling, rowGrouping, sortNestedRows]);

  // Simple sort handler
  const updateSort = useCallback(
    (accessor: Accessor<T>) => {
      const findHeaderRecursively = (headers: HeaderObject<T>[]): HeaderObject<T> | undefined => {
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

      let newSortColumn: SortColumn<T> | null = null;

      if (!sort || sort.key.accessor !== accessor) {
        newSortColumn = {
          key: targetHeader,
          direction: "ascending",
        };
      } else if (sort.direction === "ascending") {
        newSortColumn = {
          key: targetHeader,
          direction: "descending",
        };
      }

      setSort(newSortColumn);
      onSortChange?.(newSortColumn);
    },
    [sort, headers, onSortChange]
  );

  // Function to preview what rows would be after applying a sort
  // This is used for pre-animation calculation
  const computeSortedRowsPreview = useCallback(
    (accessor: Accessor<T>) => {
      const findHeaderRecursively = (headers: HeaderObject<T>[]): HeaderObject<T> | undefined => {
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
        return tableRows;
      }

      let previewSortColumn: SortColumn<T> | null = null;

      if (!sort || sort.key.accessor !== accessor) {
        previewSortColumn = {
          key: targetHeader,
          direction: "ascending",
        };
      } else if (sort.direction === "ascending") {
        previewSortColumn = {
          key: targetHeader,
          direction: "descending",
        };
      }

      return computeSortedRows({
        externalSortHandling,
        tableRows,
        sortColumn: previewSortColumn,
        rowGrouping,
        headers,
        sortNestedRows,
      });
    },
    [sort, headers, tableRows, externalSortHandling, rowGrouping, sortNestedRows]
  );

  return {
    sort,
    sortedRows,
    updateSort,
    computeSortedRowsPreview,
  };
};

export default useSortableData;
