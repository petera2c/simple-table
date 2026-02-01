import { useMemo, useState, useLayoutEffect, useCallback, useRef } from "react";
import { calculateBufferRowCount } from "../consts/general-consts";
import {
  getViewportCalculations,
  getStickyParents,
  buildCumulativeHeightMap,
  CumulativeHeightMap,
} from "../utils/infiniteScrollUtils";
import { rowIdToString } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";
import { Accessor } from "../types/HeaderObject";
import { FilterCondition } from "../types/FilterTypes";
import TableRow from "../types/TableRow";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  /** Already flattened rows from useFlattenedRows */
  flattenedRows: TableRow[];
  /** Original flattened rows for establishing baseline positions */
  originalFlattenedRows: TableRow[];
  /** Rows that should count towards pagination (excludes nested grids, state indicators) */
  paginatableRows: TableRow[];
  /** End positions of each depth-0 parent row (including its children) */
  parentEndPositions: number[];
  currentPage: number;
  rowsPerPage: number;
  shouldPaginate: boolean;
  serverSidePagination: boolean;
  contentHeight: number | undefined;
  rowHeight: number;
  scrollTop: number;
  scrollDirection?: "up" | "down" | "none";
  heightOffsets?: HeightOffsets;
  customTheme: CustomTheme;
  enableStickyParents: boolean;
  // Functions to preview what rows would be after changes (now return TableRow[])
  computeFilteredRowsPreview: (filter: FilterCondition) => TableRow[];
  computeSortedRowsPreview: (accessor: Accessor) => TableRow[];
  rowGrouping: Accessor[];
}

const useTableRowProcessing = ({
  allowAnimations,
  computeFilteredRowsPreview,
  computeSortedRowsPreview,
  contentHeight,
  currentPage,
  customTheme,
  enableStickyParents,
  flattenedRows,
  heightOffsets,
  originalFlattenedRows,
  paginatableRows,
  parentEndPositions,
  rowHeight,
  rowsPerPage,
  scrollDirection = "none",
  scrollTop,
  serverSidePagination,
  shouldPaginate,
  rowGrouping,
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
    (allRows: TableRow[], parentEndPositions: number[]): TableRow[] => {
      if (!shouldPaginate || serverSidePagination) {
        // No pagination - return all rows with recalculated positions
        return allRows.map((tableRow, index) => ({
          ...tableRow,
          position: index,
          absoluteRowIndex: index,
        }));
      }

      // Calculate which parent rows should be on this page
      const startParentIndex = (currentPage - 1) * rowsPerPage; // e.g., 0 for page 1
      const endParentIndex = currentPage * rowsPerPage; // e.g., 10 for page 1

      // Find the start and end positions in the flattened array
      // startPosition: where the first parent on this page begins (0 for first parent)
      // endPosition: where the last parent on this page ends (including all its children)
      const startPosition = startParentIndex === 0 ? 0 : parentEndPositions[startParentIndex - 1];
      const endPosition =
        endParentIndex <= parentEndPositions.length
          ? parentEndPositions[endParentIndex - 1]
          : allRows.length;

      // Slice the flattened array to get all rows for this page (parents + their children)
      const paginatedRows = allRows.slice(startPosition, endPosition);

      // Recalculate positions after pagination
      return paginatedRows.map((tableRow, index) => {
        // For nested grid rows, preserve the original absoluteRowIndex from flattenedRows
        // For regular rows, calculate based on pagination offset
        const absoluteRowIndex = tableRow.nestedTable
          ? tableRow.absoluteRowIndex // Keep original position from flattenedRows
          : shouldPaginate && !serverSidePagination
          ? startPosition + index
          : index;

        return {
          ...tableRow,
          position: index,
          // Keep the original displayPosition (don't recalculate)
          absoluteRowIndex,
        };
      });
    },
    [currentPage, rowsPerPage, serverSidePagination, shouldPaginate]
  );

  // Establish original positions from unfiltered/unsorted data
  useMemo(() => {
    // Only set original positions once when component first loads
    if (originalPositionsRef.current.size === 0 && originalFlattenedRows.length > 0) {
      const newOriginalPositions = new Map<string, number>();
      originalFlattenedRows.forEach((tableRow, index) => {
        const id = rowIdToString(tableRow.rowId);
        newOriginalPositions.set(id, index);
      });

      originalPositionsRef.current = newOriginalPositions;
    }
  }, [originalFlattenedRows]);

  // Current table rows (paginated for display)
  // Pagination uses parentEndPositions to slice the flattened array,
  // ensuring we show exactly rowsPerPage parent rows plus all their children
  const currentTableRows = useMemo(() => {
    return applyPagination(flattenedRows, parentEndPositions);
  }, [flattenedRows, parentEndPositions, applyPagination]);

  // Remap heightOffsets for pagination
  // When paginating, row positions are reset to 0, 1, 2... for each page
  // But heightOffsets references original positions from flattenedRows
  // We need to remap to match the new positions in currentTableRows
  const paginatedHeightOffsets = useMemo(() => {
    if (!heightOffsets || heightOffsets.length === 0 || !shouldPaginate || serverSidePagination) {
      return heightOffsets;
    }

    // Build a map: originalPosition (absoluteRowIndex) -> newPosition (position)
    const positionMap = new Map<number, number>();
    currentTableRows.forEach((tableRow) => {
      if (tableRow.nestedTable) {
        // absoluteRowIndex is the position in the original flattenedRows
        // position is the new position in currentTableRows (0, 1, 2...)
        positionMap.set(tableRow.absoluteRowIndex, tableRow.position);
      }
    });

    // Filter heightOffsets to only include rows on current page, and remap positions
    return heightOffsets
      .filter(([originalPos]) => positionMap.has(originalPos))
      .map(
        ([originalPos, extraHeight]) =>
          [positionMap.get(originalPos)!, extraHeight] as [number, number]
      );
  }, [heightOffsets, currentTableRows, shouldPaginate, serverSidePagination]);

  // Build cumulative height map for O(log n) viewport calculations with variable-height rows
  const heightMap = useMemo<CumulativeHeightMap | undefined>(() => {
    // Only build height map if we have height offsets (variable-height rows like nested grids)
    if (!paginatedHeightOffsets || paginatedHeightOffsets.length === 0) {
      return undefined;
    }

    return buildCumulativeHeightMap(
      currentTableRows.length,
      rowHeight,
      paginatedHeightOffsets,
      customTheme
    );
  }, [currentTableRows.length, rowHeight, paginatedHeightOffsets, customTheme]);

  // Calculate target visible rows (what should be visible)
  // If contentHeight is undefined, we skip virtualization and render all rows
  const targetVisibleRows = useMemo(() => {
    if (contentHeight === undefined) {
      // No virtualization - return all rows
      return currentTableRows;
    }

    // Get viewport calculations for virtualization
    const viewportCalcs = getViewportCalculations({
      bufferRowCount,
      contentHeight,
      tableRows: currentTableRows,
      rowHeight,
      scrollTop,
      scrollDirection,
      heightMap,
    });

    return viewportCalcs.rendered.rows;
  }, [
    currentTableRows,
    contentHeight,
    rowHeight,
    scrollTop,
    scrollDirection,
    bufferRowCount,
    heightMap,
  ]);

  // Separate sticky parents from regular rows for row grouping
  const { stickyParents, regularRows } = useMemo(() => {
    // Only apply sticky parents if enabled and we have virtualization and viewport calculations
    if (!enableStickyParents || contentHeight === undefined) {
      return { stickyParents: [], regularRows: targetVisibleRows };
    }

    // Get viewport calculations
    const viewportCalcs = getViewportCalculations({
      bufferRowCount,
      contentHeight,
      tableRows: currentTableRows,
      rowHeight,
      scrollTop,
      scrollDirection,
      heightMap,
    });

    // Separate sticky parents from rendered rows
    return getStickyParents(
      currentTableRows,
      viewportCalcs.rendered.rows,
      viewportCalcs.fullyVisible.rows,
      viewportCalcs.partiallyVisible.rows,
      rowGrouping
    );
  }, [
    bufferRowCount,
    contentHeight,
    currentTableRows,
    enableStickyParents,
    heightMap,
    rowGrouping,
    rowHeight,
    scrollDirection,
    scrollTop,
    targetVisibleRows,
  ]);

  // Categorize rows based on ID changes
  const categorizeRows = useCallback((previousRows: TableRow[], currentRows: TableRow[]) => {
    const previousIds = new Set(
      previousRows.filter((tr) => tr && tr.rowId).map((tableRow) => rowIdToString(tableRow.rowId))
    );
    const currentIds = new Set(
      currentRows.filter((tr) => tr && tr.rowId).map((tableRow) => rowIdToString(tableRow.rowId))
    );

    const staying = currentRows.filter((tableRow) => {
      const id = rowIdToString(tableRow.rowId);
      return previousIds.has(id);
    });

    const entering = currentRows.filter((tableRow) => {
      const id = rowIdToString(tableRow.rowId);
      return !previousIds.has(id);
    });

    const leaving = previousRows.filter((tableRow) => {
      const id = rowIdToString(tableRow.rowId);
      return !currentIds.has(id);
    });

    return { staying, entering, leaving };
  }, []);

  // Check if there are actual row changes (comparing all rows, not just visible)
  const hasRowChanges = useMemo(() => {
    if (previousTableRowsRef.current.length === 0) {
      return false;
    }

    const currentIds = currentTableRows
      .filter((tr) => tr && tr.rowId)
      .map((tableRow) => rowIdToString(tableRow.rowId));
    const previousIds = previousTableRowsRef.current
      .filter((tr) => tr && tr.rowId)
      .map((tableRow) => rowIdToString(tableRow.rowId));

    const hasChanges =
      currentIds.length !== previousIds.length ||
      !currentIds.every((id, index) => id === previousIds[index]);

    return hasChanges;
  }, [currentTableRows]);

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
        const id = rowIdToString(tableRow.rowId);
        positionMap.set(id, tableRow.position);
        displayPositionMap.set(id, tableRow.displayPosition);
      });

      // Update ALL rows in extendedRows with their new positions
      const updatedExtendedRows = extendedRows.map((tableRow) => {
        const id = rowIdToString(tableRow.rowId);
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
  }, [targetVisibleRows, extendedRows, currentTableRows, allowAnimations, shouldPaginate]);

  // Animation handlers for filter/sort changes
  const prepareForFilterChange = useCallback(
    (filter: FilterCondition) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // Calculate what rows would be after filter (already flattened from preview function)
      const newFlattenedRows = computeFilteredRowsPreview(filter);
      // Since shouldPaginate is false here (early return above), pass empty array
      // applyPagination will just return all rows when !shouldPaginate
      const newPaginatedRows = applyPagination(newFlattenedRows, []);
      const newViewportCalcs = getViewportCalculations({
        bufferRowCount,
        contentHeight,
        tableRows: newPaginatedRows,
        rowHeight,
        scrollTop,
        scrollDirection,
        heightMap,
      });
      const newVisibleRows = newViewportCalcs.rendered.rows;

      // CRITICAL: Compare VISIBLE rows (before filter) vs what WILL BE visible (after filter)
      // This identifies rows that are entering the visible area
      const { entering: visibleEntering } = categorizeRows(targetVisibleRows, newVisibleRows);

      // Find these entering rows in the CURRENT table state (before filter) to get original positions
      const enteringFromCurrentState = visibleEntering
        .map((enteringRow) => {
          const id = String(rowIdToString(enteringRow.rowId));
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(rowIdToString(currentRow.rowId)) === id
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
      bufferRowCount,
      heightMap,
    ]
  );

  const prepareForSortChange = useCallback(
    (accessor: Accessor) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // Calculate what rows would be after sort (already flattened from preview function)
      const newFlattenedRows = computeSortedRowsPreview(accessor);
      // Since shouldPaginate is false here (early return above), pass empty array
      // applyPagination will just return all rows when !shouldPaginate
      const newPaginatedRows = applyPagination(newFlattenedRows, []);
      const newViewportCalcs = getViewportCalculations({
        bufferRowCount,
        contentHeight,
        tableRows: newPaginatedRows,
        rowHeight,
        scrollTop,
        scrollDirection,
        heightMap,
      });
      const newVisibleRows = newViewportCalcs.rendered.rows;

      // CRITICAL: Compare VISIBLE rows (before sort) vs what WILL BE visible (after sort)
      // This identifies rows that are entering the visible area
      const { entering: visibleEntering } = categorizeRows(targetVisibleRows, newVisibleRows);

      // Find these entering rows in the CURRENT table state (before sort) to get original positions
      const enteringFromCurrentState = visibleEntering
        .map((enteringRow) => {
          const id = String(rowIdToString(enteringRow.rowId));
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(rowIdToString(currentRow.rowId)) === id
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
      bufferRowCount,
      heightMap,
    ]
  );

  return {
    currentTableRows,
    currentVisibleRows: targetVisibleRows,
    isAnimating,
    prepareForFilterChange,
    prepareForSortChange,
    rowsToRender,
    stickyParents,
    regularRows,
    paginatedHeightOffsets,
  };
};

export default useTableRowProcessing;
