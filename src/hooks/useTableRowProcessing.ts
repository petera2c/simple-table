import { useMemo, useState, useLayoutEffect, useCallback, useRef } from "react";
import { calculateBufferRowCount } from "../consts/general-consts";
import { getVisibleRows } from "../utils/infiniteScrollUtils";
import { getRowId } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";
import { Accessor } from "../types/HeaderObject";
import { FilterCondition } from "../types/FilterTypes";
import TableRow from "../types/TableRow";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  /** Already flattened rows from useFlattenedRows */
  flattenedRows: TableRow[];
  /** Original flattened rows for establishing baseline positions */
  originalFlattenedRows: TableRow[];
  currentPage: number;
  rowsPerPage: number;
  shouldPaginate: boolean;
  serverSidePagination: boolean;
  rowIdAccessor: Accessor;
  contentHeight: number | undefined;
  rowHeight: number;
  scrollTop: number;
  scrollDirection?: "up" | "down" | "none";
  // Functions to preview what rows would be after changes (now return TableRow[])
  computeFilteredRowsPreview: (filter: FilterCondition) => TableRow[];
  computeSortedRowsPreview: (accessor: Accessor) => TableRow[];
}

const useTableRowProcessing = ({
  allowAnimations,
  flattenedRows,
  originalFlattenedRows,
  currentPage,
  rowsPerPage,
  shouldPaginate,
  serverSidePagination,
  rowIdAccessor,
  contentHeight,
  rowHeight,
  scrollTop,
  scrollDirection = "none",
  computeFilteredRowsPreview,
  computeSortedRowsPreview,
}: UseTableRowProcessingProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [extendedRows, setExtendedRows] = useState<TableRow[]>([]);
  const previousTableRowsRef = useRef<TableRow[]>([]); // Track ALL processed rows, not just visible
  const previousVisibleRowsRef = useRef<TableRow[]>([]); // Track only visible rows for animation

  // Calculate buffer row count based on actual row height
  // This ensures consistent ~800px overscan regardless of row size
  const bufferRowCount = useMemo(() => calculateBufferRowCount(rowHeight), [rowHeight]);

  // Track original positions of all rows (before any sort/filter applied)
  const originalPositionsRef = useRef<Map<string, number>>(new Map());

  // Capture values when animation starts to avoid dependency issues in timeout effect
  const animationCaptureRef = useRef<{
    tableRows: TableRow[];
    visibleRows: TableRow[];
  } | null>(null);

  // Apply pagination to already-flattened rows and recalculate positions
  const applyPagination = useCallback(
    (rows: TableRow[]): TableRow[] => {
      // Apply pagination (skip slicing for server-side pagination)
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedRows =
        shouldPaginate && !serverSidePagination
          ? rows.slice(startIndex, currentPage * rowsPerPage)
          : rows;

      // Recalculate positions after pagination
      return paginatedRows.map((tableRow, index) => ({
        ...tableRow,
        position: index,
        displayPosition: index,
        // Calculate absolute row index accounting for pagination offset
        absoluteRowIndex: shouldPaginate && !serverSidePagination ? startIndex + index : index,
      }));
    },
    [currentPage, rowsPerPage, serverSidePagination, shouldPaginate]
  );

  // Establish original positions from unfiltered/unsorted data
  useMemo(() => {
    // Only set original positions once when component first loads
    if (originalPositionsRef.current.size === 0 && originalFlattenedRows.length > 0) {
      const newOriginalPositions = new Map<string, number>();
      originalFlattenedRows.forEach((tableRow, index) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        newOriginalPositions.set(id, index);
      });

      originalPositionsRef.current = newOriginalPositions;
    }
  }, [originalFlattenedRows, rowIdAccessor]);

  // Current table rows (paginated for display)
  // Now pagination happens on FLATTENED rows, so rowsPerPage correctly counts all visible rows
  const currentTableRows = useMemo(() => {
    return applyPagination(flattenedRows);
  }, [flattenedRows, applyPagination]);

  // Calculate target visible rows (what should be visible)
  // If contentHeight is undefined, we skip virtualization and render all rows
  const targetVisibleRows = useMemo(() => {
    if (contentHeight === undefined) {
      // No virtualization - return all rows
      return currentTableRows;
    }
    return getVisibleRows({
      bufferRowCount,
      contentHeight,
      tableRows: currentTableRows,
      rowHeight,
      scrollTop,
      scrollDirection,
    });
  }, [currentTableRows, contentHeight, rowHeight, scrollTop, scrollDirection, bufferRowCount]);

  // Categorize rows based on ID changes
  const categorizeRows = useCallback(
    (previousRows: TableRow[], currentRows: TableRow[]) => {
      const previousIds = new Set(
        previousRows.map((tableRow) =>
          String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          )
        )
      );
      const currentIds = new Set(
        currentRows.map((tableRow) =>
          String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          )
        )
      );

      const staying = currentRows.filter((tableRow) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        return previousIds.has(id);
      });

      const entering = currentRows.filter((tableRow) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        return !previousIds.has(id);
      });

      const leaving = previousRows.filter((tableRow) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        return !currentIds.has(id);
      });

      return { staying, entering, leaving };
    },
    [rowIdAccessor]
  );

  // Check if there are actual row changes (comparing all rows, not just visible)
  const hasRowChanges = useMemo(() => {
    if (previousTableRowsRef.current.length === 0) {
      return false;
    }

    const currentIds = currentTableRows.map((tableRow) =>
      String(
        getRowId({
          row: tableRow.row,
          rowIdAccessor,
          rowPath: tableRow.rowPath,
        })
      )
    );
    const previousIds = previousTableRowsRef.current.map((tableRow) =>
      String(
        getRowId({
          row: tableRow.row,
          rowIdAccessor,
          rowPath: tableRow.rowPath,
        })
      )
    );

    const hasChanges =
      currentIds.length !== previousIds.length ||
      !currentIds.every((id, index) => id === previousIds[index]);

    return hasChanges;
  }, [currentTableRows, rowIdAccessor]);

  // Animation effect
  useLayoutEffect(() => {
    // Don't re-run effect while animation is in progress
    if (isAnimating) {
      return;
    }

    // Helper to clear extended rows only if needed (avoid unnecessary state updates
    // that would cause infinite re-renders)
    const clearExtendedRowsIfNeeded = () => {
      if (extendedRows.length > 0) {
        setExtendedRows([]);
      }
    };

    // Always sync when not animating
    if (!allowAnimations || shouldPaginate) {
      clearExtendedRowsIfNeeded();
      previousTableRowsRef.current = currentTableRows;
      previousVisibleRowsRef.current = targetVisibleRows;
      return;
    }

    // Initialize on first render
    if (previousTableRowsRef.current.length === 0) {
      clearExtendedRowsIfNeeded();
      previousTableRowsRef.current = currentTableRows;
      previousVisibleRowsRef.current = targetVisibleRows;
      return;
    }

    // Check if rows actually changed - this detects STAGE 2 (after sort/filter applied)
    if (!hasRowChanges) {
      clearExtendedRowsIfNeeded();
      previousTableRowsRef.current = currentTableRows;
      previousVisibleRowsRef.current = targetVisibleRows;
      return;
    }

    // STAGE 2: Rows have new positions, trigger animation
    // extendedRows already contains current + entering rows (from STAGE 1)
    // Now the positions will update automatically when the component re-renders

    // Capture current values before starting animation
    animationCaptureRef.current = {
      tableRows: currentTableRows,
      visibleRows: targetVisibleRows,
    };

    // Start animation
    setIsAnimating(true);
  }, [
    allowAnimations,
    currentTableRows,
    extendedRows.length,
    hasRowChanges,
    isAnimating,
    shouldPaginate,
    targetVisibleRows,
  ]);

  // Separate effect to handle animation timeout - only runs when we have extended rows to animate
  useLayoutEffect(() => {
    if (isAnimating && animationCaptureRef.current && extendedRows.length > 0) {
      // STAGE 3: After animation completes, remove leaving rows
      const timeout = setTimeout(() => {
        const captured = animationCaptureRef.current!;
        setIsAnimating(false);
        setExtendedRows([]); // Clear extended rows to use normal virtualization
        previousTableRowsRef.current = captured.tableRows;
        previousVisibleRowsRef.current = captured.visibleRows;
        animationCaptureRef.current = null; // Clean up
      }, ANIMATION_CONFIGS.ROW_REORDER.duration + 100);

      return () => clearTimeout(timeout);
    }
  }, [isAnimating, extendedRows.length]); // Depend on isAnimating AND extendedRows length

  // Final rows to render - handles 3-stage animation
  const rowsToRender = useMemo(() => {
    // If animations are disabled, always use normal virtualization
    if (!allowAnimations || shouldPaginate) {
      return targetVisibleRows;
    }

    // If we have extended rows (from STAGE 1), we need to dynamically update their positions
    // to reflect the current sort/filter state (STAGE 2)
    if (extendedRows.length > 0) {
      // Create a map of ALL positions from currentTableRows (not just visible ones)
      // This ensures we have positions for existing rows AND entering rows
      const positionMap = new Map<string, number>();
      const displayPositionMap = new Map<string, number>();
      currentTableRows.forEach((tableRow) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        positionMap.set(id, tableRow.position);
        displayPositionMap.set(id, tableRow.displayPosition);
      });

      // Update ALL rows in extendedRows with their new positions
      const updatedExtendedRows = extendedRows.map((tableRow) => {
        const id = String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        );
        const newPosition = positionMap.get(id);
        const newDisplayPosition = displayPositionMap.get(id);

        // If this row exists in the new sorted state, use its new position
        // Otherwise keep the original position (for leaving rows that are no longer in the sorted data)
        if (newPosition !== undefined && newDisplayPosition !== undefined) {
          return { ...tableRow, position: newPosition, displayPosition: newDisplayPosition };
        }
        return tableRow;
      });

      return updatedExtendedRows;
    }

    // Default: use normal visible rows (STAGE 3 after animation completes)
    return targetVisibleRows;
  }, [
    targetVisibleRows,
    extendedRows,
    currentTableRows,
    allowAnimations,
    shouldPaginate,
    rowIdAccessor,
  ]);

  // Animation handlers for filter/sort changes
  const prepareForFilterChange = useCallback(
    (filter: FilterCondition) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // Calculate what rows would be after filter (already flattened from preview function)
      const newFlattenedRows = computeFilteredRowsPreview(filter);
      const newPaginatedRows = applyPagination(newFlattenedRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount,
        contentHeight,
        tableRows: newPaginatedRows,
        rowHeight,
        scrollTop,
        scrollDirection,
      });

      // CRITICAL: Compare VISIBLE rows (before filter) vs what WILL BE visible (after filter)
      // This identifies rows that are entering the visible area
      const { entering: visibleEntering } = categorizeRows(targetVisibleRows, newVisibleRows);

      // Find these entering rows in the CURRENT table state (before filter) to get original positions
      const enteringFromCurrentState = visibleEntering
        .map((enteringRow) => {
          const id = String(
            getRowId({
              row: enteringRow.row,
              rowIdAccessor,
              rowPath: enteringRow.rowPath,
            })
          );
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) =>
              String(
                getRowId({
                  row: currentRow.row,
                  rowIdAccessor,
                  rowPath: currentRow.rowPath,
                })
              ) === id
          );
          return currentStateRow || enteringRow; // Fallback to enteringRow if not found
        })
        .filter(Boolean) as TableRow[];

      if (enteringFromCurrentState.length > 0) {
        setExtendedRows([...targetVisibleRows, ...enteringFromCurrentState]);
      }
    },
    [
      allowAnimations,
      shouldPaginate,
      computeFilteredRowsPreview,
      applyPagination,
      contentHeight,
      rowHeight,
      scrollTop,
      scrollDirection,
      categorizeRows,
      currentTableRows,
      targetVisibleRows,
      rowIdAccessor,
      bufferRowCount,
    ]
  );

  const prepareForSortChange = useCallback(
    (accessor: Accessor) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // Calculate what rows would be after sort (already flattened from preview function)
      const newFlattenedRows = computeSortedRowsPreview(accessor);
      const newPaginatedRows = applyPagination(newFlattenedRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount,
        contentHeight,
        tableRows: newPaginatedRows,
        rowHeight,
        scrollTop,
        scrollDirection,
      });

      // CRITICAL: Compare VISIBLE rows (before sort) vs what WILL BE visible (after sort)
      // This identifies rows that are entering the visible area
      const { entering: visibleEntering } = categorizeRows(targetVisibleRows, newVisibleRows);

      // Find these entering rows in the CURRENT table state (before sort) to get original positions
      const enteringFromCurrentState = visibleEntering
        .map((enteringRow) => {
          const id = String(
            getRowId({
              row: enteringRow.row,
              rowIdAccessor,
              rowPath: enteringRow.rowPath,
            })
          );
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) =>
              String(
                getRowId({
                  row: currentRow.row,
                  rowIdAccessor,
                  rowPath: currentRow.rowPath,
                })
              ) === id
          );
          return currentStateRow || enteringRow; // Fallback to enteringRow if not found
        })
        .filter(Boolean) as TableRow[];

      if (enteringFromCurrentState.length > 0) {
        setExtendedRows([...targetVisibleRows, ...enteringFromCurrentState]);
      }
    },
    [
      allowAnimations,
      shouldPaginate,
      computeSortedRowsPreview,
      applyPagination,
      contentHeight,
      rowHeight,
      scrollTop,
      scrollDirection,
      categorizeRows,
      currentTableRows,
      targetVisibleRows,
      rowIdAccessor,
      bufferRowCount,
    ]
  );

  return {
    currentTableRows,
    currentVisibleRows: targetVisibleRows,
    isAnimating,
    prepareForFilterChange,
    prepareForSortChange,
    rowsToRender,
  };
};

export default useTableRowProcessing;
