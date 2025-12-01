import { useMemo, useState, useLayoutEffect, useCallback, useRef } from "react";
import { calculateBufferRowCount } from "../consts/general-consts";
import { getVisibleRows } from "../utils/infiniteScrollUtils";
import { flattenRowsWithGrouping, getRowId } from "../utils/rowUtils";
import { ANIMATION_CONFIGS } from "../components/animate/animation-utils";
import Row from "../types/Row";
import { Accessor } from "../types/HeaderObject";
import { FilterCondition } from "../types/FilterTypes";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  sortedRows: Row[];
  // Original unfiltered rows for establishing baseline positions
  originalRows: Row[];
  currentPage: number;
  rowsPerPage: number;
  shouldPaginate: boolean;
  serverSidePagination: boolean;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  unexpandedRows: Set<string>;
  expandAll: boolean;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  scrollDirection?: "up" | "down" | "none";
  // Functions to preview what rows would be after changes
  computeFilteredRowsPreview: (filter: FilterCondition) => Row[];
  computeSortedRowsPreview: (accessor: Accessor) => Row[];
  rowStateMap: Map<string | number, RowState>;
  hasLoadingRenderer: boolean;
  hasErrorRenderer: boolean;
  hasEmptyRenderer: boolean;
}

const useTableRowProcessing = ({
  allowAnimations,
  sortedRows,
  originalRows,
  currentPage,
  rowsPerPage,
  shouldPaginate,
  serverSidePagination,
  rowGrouping,
  rowIdAccessor,
  unexpandedRows,
  expandAll,
  contentHeight,
  rowHeight,
  scrollTop,
  scrollDirection = "none",
  computeFilteredRowsPreview,
  computeSortedRowsPreview,
  rowStateMap,
  hasLoadingRenderer,
  hasErrorRenderer,
  hasEmptyRenderer,
}: UseTableRowProcessingProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [extendedRows, setExtendedRows] = useState<any[]>([]);
  const previousTableRowsRef = useRef<any[]>([]); // Track ALL processed rows, not just visible
  const previousVisibleRowsRef = useRef<any[]>([]); // Track only visible rows for animation

  // Calculate buffer row count based on actual row height
  // This ensures consistent ~800px overscan regardless of row size
  const bufferRowCount = useMemo(() => calculateBufferRowCount(rowHeight), [rowHeight]);

  // Track original positions of all rows (before any sort/filter applied)
  const originalPositionsRef = useRef<Map<string, number>>(new Map());

  // Capture values when animation starts to avoid dependency issues in timeout effect
  const animationCaptureRef = useRef<{
    tableRows: any[];
    visibleRows: any[];
  } | null>(null);

  // Process rows through pagination and grouping
  const processRowSet = useCallback(
    (rows: Row[]) => {
      // Apply pagination (skip slicing for server-side pagination)
      const paginatedRows =
        shouldPaginate && !serverSidePagination
          ? rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
          : rows;

      // Calculate the display position offset for pagination
      const displayPositionOffset = shouldPaginate ? (currentPage - 1) * rowsPerPage : 0;

      // Apply grouping
      if (!rowGrouping || rowGrouping.length === 0) {
        return paginatedRows.map(
          (row, index) =>
            ({
              row,
              depth: 0,
              displayPosition: displayPositionOffset + index,
              groupingKey: undefined,
              position: index,
              isLastGroupRow: false,
            } as TableRow)
        );
      }

      return flattenRowsWithGrouping({
        rows: paginatedRows,
        rowGrouping,
        rowIdAccessor,
        unexpandedRows,
        expandAll,
        displayPositionOffset,
        rowStateMap,
        hasLoadingRenderer,
        hasErrorRenderer,
        hasEmptyRenderer,
      });
    },
    [
      currentPage,
      expandAll,
      hasEmptyRenderer,
      hasErrorRenderer,
      hasLoadingRenderer,
      rowGrouping,
      rowIdAccessor,
      rowStateMap,
      rowsPerPage,
      serverSidePagination,
      shouldPaginate,
      unexpandedRows,
    ]
  );

  // Establish original positions from unfiltered/unsorted data
  useMemo(() => {
    // Only set original positions once when component first loads
    if (originalPositionsRef.current.size === 0) {
      const originalProcessedRows = processRowSet(originalRows);
      const newOriginalPositions = new Map<string, number>();
      originalProcessedRows.forEach((tableRow) => {
        const id = String(getRowId({ row: tableRow.row, rowIdAccessor }));
        newOriginalPositions.set(id, tableRow.position);
      });

      originalPositionsRef.current = newOriginalPositions;
    }
  }, [originalRows, processRowSet, rowIdAccessor]);

  // Current table rows (processed for display)
  const currentTableRows = useMemo(() => {
    // Use sortedRows which already have filters applied
    return processRowSet(sortedRows);
  }, [sortedRows, processRowSet]);

  // Calculate target visible rows (what should be visible)
  const targetVisibleRows = useMemo(() => {
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
    (previousRows: any[], currentRows: any[]) => {
      const previousIds = new Set(
        previousRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
      );
      const currentIds = new Set(
        currentRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
      );

      const staying = currentRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return previousIds.has(id);
      });

      const entering = currentRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        return !previousIds.has(id);
      });

      const leaving = previousRows.filter((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
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

    const currentIds = currentTableRows.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
    );
    const previousIds = previousTableRowsRef.current.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
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

    // Always sync when not animating
    if (!allowAnimations || shouldPaginate) {
      setExtendedRows([]); // Clear extended rows to use normal virtualization
      previousTableRowsRef.current = currentTableRows;
      previousVisibleRowsRef.current = targetVisibleRows;
      return;
    }

    // Initialize on first render
    if (previousTableRowsRef.current.length === 0) {
      setExtendedRows([]); // Clear extended rows to use normal virtualization
      previousTableRowsRef.current = currentTableRows;
      previousVisibleRowsRef.current = targetVisibleRows;
      return;
    }

    // Check if rows actually changed - this detects STAGE 2 (after sort/filter applied)
    if (!hasRowChanges) {
      setExtendedRows([]); // Clear extended rows to use normal virtualization
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
      currentTableRows.forEach((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        positionMap.set(id, row.position);
        displayPositionMap.set(id, row.displayPosition);
      });

      // Update ALL rows in extendedRows with their new positions
      const updatedExtendedRows = extendedRows.map((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        const newPosition = positionMap.get(id);
        const newDisplayPosition = displayPositionMap.get(id);

        // If this row exists in the new sorted state, use its new position
        // Otherwise keep the original position (for leaving rows that are no longer in the sorted data)
        if (newPosition !== undefined && newDisplayPosition !== undefined) {
          return { ...row, position: newPosition, displayPosition: newDisplayPosition };
        }
        return row;
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
    (filter: any) => {
      if (!allowAnimations || shouldPaginate) return;

      // Calculate what rows would be after filter
      const newFilteredRows = computeFilteredRowsPreview(filter);
      const newProcessedRows = processRowSet(newFilteredRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount,
        contentHeight,
        tableRows: newProcessedRows,
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
          const id = String(getRowId({ row: enteringRow.row, rowIdAccessor }));
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(getRowId({ row: currentRow.row, rowIdAccessor })) === id
          );
          return currentStateRow || enteringRow; // Fallback to enteringRow if not found
        })
        .filter(Boolean);

      if (enteringFromCurrentState.length > 0) {
        setExtendedRows([...targetVisibleRows, ...enteringFromCurrentState]);
      }
    },
    [
      allowAnimations,
      shouldPaginate,
      computeFilteredRowsPreview,
      processRowSet,
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
      if (!allowAnimations || shouldPaginate) return;

      // Calculate what rows would be after sort
      const newSortedRows = computeSortedRowsPreview(accessor);
      const newProcessedRows = processRowSet(newSortedRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount,
        contentHeight,
        tableRows: newProcessedRows,
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
          const id = String(getRowId({ row: enteringRow.row, rowIdAccessor }));
          // Find this row in the current table state to get its original position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(getRowId({ row: currentRow.row, rowIdAccessor })) === id
          );
          return currentStateRow || enteringRow; // Fallback to enteringRow if not found
        })
        .filter(Boolean);

      if (enteringFromCurrentState.length > 0) {
        setExtendedRows([...targetVisibleRows, ...enteringFromCurrentState]);
      }
    },
    [
      allowAnimations,
      shouldPaginate,
      computeSortedRowsPreview,
      processRowSet,
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
