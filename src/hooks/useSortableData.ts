import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import { useCallback, useMemo, useState } from "react";
import SortColumn, { SortDirection } from "../types/SortColumn";
import { handleSort } from "../utils/sortUtils";
import { isRowArray } from "../utils/rowUtils";

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
  headers,
  tableRows,
  externalSortHandling,
  onSortChange,
  rowGrouping,
  initialSortColumn,
  initialSortDirection,
  onBeforeSort,
}: {
  headers: HeaderObject[];
  tableRows: Row[];
  externalSortHandling: boolean;
  onSortChange?: (sort: SortColumn | null) => void;
  rowGrouping?: string[];
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  onBeforeSort?: () => void;
}) => {
  // Initialize sort state with initial values if provided
  const getInitialSort = useCallback((): SortColumn | null => {
    if (!initialSortColumn) return null;

    const findHeaderRecursively = (headers: HeaderObject[]): HeaderObject | undefined => {
      for (const header of headers) {
        if (header.accessor === initialSortColumn) {
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
    if (!targetHeader) return null;

    return {
      key: targetHeader,
      direction: initialSortDirection || "asc",
    };
  }, [headers, initialSortColumn, initialSortDirection]);

  // Single sort state instead of complex 3-state system
  const [sort, setSort] = useState<SortColumn | null>(getInitialSort);

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
    (props?: { accessor: Accessor; direction?: SortDirection }) => {
      // If accessor is null, clear the sort
      if (!props) {
        setSort(null);
        onSortChange?.(null);
        return;
      }

      const { accessor, direction } = props;

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

      // If direction is explicitly provided, use it
      if (direction) {
        newSortColumn = {
          key: targetHeader,
          direction: direction,
        };
      }
      // Otherwise, cycle through: no sort -> asc -> desc -> no sort
      else if (!sort || sort.key.accessor !== accessor) {
        newSortColumn = {
          key: targetHeader,
          direction: "asc",
        };
      } else if (sort.direction === "asc") {
        newSortColumn = {
          key: targetHeader,
          direction: "desc",
        };
      }
      // If currently desc, clear the sort (newSortColumn stays null)

      // CRITICAL: Capture positions right before state change (react-flip-move pattern)
      onBeforeSort?.();

      setSort(newSortColumn);
      onSortChange?.(newSortColumn);
    },
    [sort, headers, onSortChange, onBeforeSort]
  );

  // Function to preview what rows would be after applying a sort
  // This is used for pre-animation calculation
  const computeSortedRowsPreview = useCallback(
    (accessor: Accessor) => {
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
        return tableRows;
      }

      let previewSortColumn: SortColumn | null = null;

      if (!sort || sort.key.accessor !== accessor) {
        previewSortColumn = {
          key: targetHeader,
          direction: "asc",
        };
      } else if (sort.direction === "asc") {
        previewSortColumn = {
          key: targetHeader,
          direction: "desc",
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
