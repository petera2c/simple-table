import { useMemo, useRef, useLayoutEffect } from "react";
import { BUFFER_ROW_COUNT } from "../consts/general-consts";
import { getVisibleRows } from "../utils/virtualizationUtils";
import { flattenRowsWithGrouping, getRowId } from "../utils/rowUtils";
import Row from "../types/Row";
import useTransformAnimations from "./useTransformAnimations";
import usePrevious from "./usePrevious";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  currentSortedRows: Row[];
  currentFilteredRows: Row[];
  currentPage: number;
  rowsPerPage: number;
  shouldPaginate: boolean;
  rowGrouping?: string[];
  rowIdAccessor: string;
  unexpandedRows: Set<string>;
  expandAll: boolean;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
}

const useTableRowProcessing = ({
  allowAnimations,
  currentSortedRows,
  currentFilteredRows,
  currentPage,
  rowsPerPage,
  shouldPaginate,
  rowGrouping,
  rowIdAccessor,
  unexpandedRows,
  expandAll,
  contentHeight,
  rowHeight,
  scrollTop,
}: UseTableRowProcessingProps) => {
  const previousVisibleRowsRef = useRef<any[]>([]);

  // Simplified single-state processing - eliminates the expensive 6x computation
  const currentTableRows = useMemo(() => {
    const processRowSet = (rows: Row[]) => {
      // Apply pagination
      const paginatedRows = shouldPaginate
        ? rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        : rows;

      // Apply grouping
      if (!rowGrouping || rowGrouping.length === 0) {
        return paginatedRows.map((row, index) => ({
          row,
          depth: 0,
          groupingKey: undefined,
          position: index,
          isLastGroupRow: false,
        }));
      }

      return flattenRowsWithGrouping({
        rows: paginatedRows,
        rowGrouping,
        rowIdAccessor,
        unexpandedRows,
        expandAll,
      });
    };

    // Process only the current state - massive performance improvement
    const currentTableRows = processRowSet(currentSortedRows);

    return currentTableRows;
  }, [
    currentSortedRows,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
  ]);

  // Calculate what rows SHOULD be visible (before animation considerations)
  const targetVisibleRows = useMemo(() => {
    return getVisibleRows({
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      tableRows: currentTableRows,
      rowHeight,
      scrollTop,
    });
  }, [currentTableRows, contentHeight, rowHeight, scrollTop]);

  // Use transform animations on the visible rows level
  const { extendedRows, isAnimating } = useTransformAnimations({
    tableRows: targetVisibleRows,
    previousTableRows: previousVisibleRowsRef.current,
    rowIdAccessor,
    rowHeight,
    allowAnimations: allowAnimations && !shouldPaginate, // Disable animations for pagination
    contentHeight,
  });

  // Store current visible rows for next comparison
  useLayoutEffect(() => {
    if (!isAnimating) {
      previousVisibleRowsRef.current = targetVisibleRows;
    }
  }, [targetVisibleRows, isAnimating]);

  // Check if there are row changes that would trigger animation
  const hasRowChanges = useMemo(() => {
    if (previousVisibleRowsRef.current.length === 0) {
      return false;
    }

    const currentIds = targetVisibleRows.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
    );
    const previousIds = previousVisibleRowsRef.current.map((row) =>
      String(getRowId({ row: row.row, rowIdAccessor }))
    );

    const hasChanges =
      currentIds.length !== previousIds.length ||
      !currentIds.every((id, index) => id === previousIds[index]);

    return hasChanges;
  }, [targetVisibleRows, rowIdAccessor]);

  // Final rows to render (either target or extended during animation)
  const rowsToRender = useMemo(() => {
    // If animations are disabled or not animating, use normal virtualization
    if (!allowAnimations || shouldPaginate || (!isAnimating && !hasRowChanges)) {
      return targetVisibleRows;
    }

    // During animations, use the extended set which includes leaving rows
    if (isAnimating) {
      return extendedRows;
    }

    return targetVisibleRows;
  }, [
    targetVisibleRows,
    extendedRows,
    allowAnimations,
    shouldPaginate,
    isAnimating,
    hasRowChanges,
  ]);

  return {
    currentTableRows,
    currentVisibleRows: targetVisibleRows,
    rowsToRender,
    isAnimating,
  };
};

export default useTableRowProcessing;
