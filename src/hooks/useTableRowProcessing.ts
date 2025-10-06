import { useMemo, useState, useCallback } from "react";
import { BUFFER_ROW_COUNT } from "../consts/general-consts";
import { getVisibleRows } from "../utils/infiniteScrollUtils";
import { flattenRowsWithGrouping, getRowId } from "../utils/rowUtils";
import Row from "../types/Row";
import { Accessor } from "../types/HeaderObject";
import { FilterCondition } from "../types/FilterTypes";
import TableRow from "../types/TableRow";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  sortedRows: Row[];
  currentPage: number;
  rowsPerPage: number;
  shouldPaginate: boolean;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  unexpandedRows: Set<string>;
  expandAll: boolean;
  contentHeight: number;
  rowHeight: number;
  scrollTop: number;
  // Functions to preview what rows would be after changes
  computeFilteredRowsPreview: (filter: FilterCondition) => Row[];
  computeSortedRowsPreview: (accessor: Accessor) => Row[];
}

const useTableRowProcessing = ({
  allowAnimations,
  sortedRows,
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
  computeFilteredRowsPreview,
  computeSortedRowsPreview,
}: UseTableRowProcessingProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState(0);
  const [rowsEnteringTheDom, setRowsEnteringTheDom] = useState<any[]>([]);
  const [rowsLeavingTheDom, setRowsLeavingTheDom] = useState<any[]>([]);

  // Cleanup function to reset animation states
  const cleanupAnimationRows = useCallback(() => {
    setRowsEnteringTheDom([]);
    setRowsLeavingTheDom([]);
    setIsAnimating(false);
  }, []);

  // Process rows through pagination and grouping
  const processRowSet = useCallback(
    (rows: Row[]) => {
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
    },
    [
      currentPage,
      rowsPerPage,
      shouldPaginate,
      rowGrouping,
      rowIdAccessor,
      unexpandedRows,
      expandAll,
    ]
  );

  // Current table rows (processed for display)
  const currentTableRows = useMemo(() => {
    // Use sortedRows which already have filters applied
    return processRowSet(sortedRows);
  }, [sortedRows, processRowSet]);

  // Calculate target visible rows (what should be visible)
  const targetVisibleRows = useMemo(() => {
    return getVisibleRows({
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      tableRows: currentTableRows,
      rowHeight,
      scrollTop,
    });
  }, [currentTableRows, contentHeight, rowHeight, scrollTop]);

  // Combine target visible rows with leaving rows for rendering
  const visibleRowsWithLeaving = useMemo(() => {
    // Create a set of IDs from rowsLeavingTheDom
    const leavingRowIds = new Set(
      rowsLeavingTheDom.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
    );

    // Filter out any rows from targetVisibleRows that are already in rowsLeavingTheDom
    const uniqueTargetRows = targetVisibleRows.filter((row) => {
      const id = String(getRowId({ row: row.row, rowIdAccessor }));
      return !leavingRowIds.has(id);
    });

    // Combine unique target rows with leaving rows (leaving rows take precedence)
    return [...uniqueTargetRows, ...rowsLeavingTheDom];
  }, [targetVisibleRows, rowsLeavingTheDom, rowIdAccessor]);

  // Animation handlers for filter/sort changes
  const prepareForFilterChange = useCallback(
    (filter: any, capturePositions?: () => void) => {
      if (!allowAnimations || shouldPaginate) return;

      // CRITICAL: Capture positions of existing leaving rows BEFORE updating them
      // This prevents teleporting when their positions change
      if (capturePositions) {
        capturePositions();
      }

      // Calculate what rows would be after filter
      const newFilteredRows = computeFilteredRowsPreview(filter);
      const newProcessedRows = processRowSet(newFilteredRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount: BUFFER_ROW_COUNT,
        contentHeight,
        tableRows: newProcessedRows,
        rowHeight,
        scrollTop,
      });

      // Find all rows that WILL BE visible after the filter, but with their CURRENT positions (before filter)
      // This gives us the starting point for animation
      const rowsInCurrentPosition = newVisibleRows
        .map((newVisibleRow) => {
          const id = String(getRowId({ row: newVisibleRow.row, rowIdAccessor }));
          // Find this row in the CURRENT table state (before filter) to get its current position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(getRowId({ row: currentRow.row, rowIdAccessor })) === id
          );
          return currentStateRow || newVisibleRow; // Fallback to newVisibleRow if not found in current state
        })
        .filter(Boolean);

      setIsAnimating(true);
      setAnimationStartTime(Date.now());

      // Add unique rows to rowsEnteringTheDom (don't add duplicates from targetVisibleRows or existing rowsEnteringTheDom)
      setRowsEnteringTheDom((existingRows) => {
        // Create set of IDs already in targetVisibleRows
        const targetVisibleIds = new Set(
          targetVisibleRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Filter to only include rows that aren't already in targetVisibleRows or existingRows
        const uniqueNewRows = rowsInCurrentPosition.filter((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          return !targetVisibleIds.has(id) && !existingRowIds.has(id);
        });

        // Add unique rows to existing rows
        return [...existingRows, ...uniqueNewRows];
      });

      // Track rows that are leaving the DOM (currently visible but won't be visible after filter)
      setRowsLeavingTheDom((existingRows) => {
        // Create set of IDs that will be visible after filter
        const newVisibleIds = new Set(
          newVisibleRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Create map of existing leaving rows for quick lookup
        const existingRowsMap = new Map(
          existingRows.map((row) => [String(getRowId({ row: row.row, rowIdAccessor })), row])
        );

        // Find rows from targetVisibleRows that won't be visible after filter
        const candidateLeavingRows = targetVisibleRows.filter((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          return !newVisibleIds.has(id);
        });

        // Separate into rows that need position updates vs truly new leaving rows
        const rowsToUpdate: TableRow[] = [];
        const newLeavingRows: TableRow[] = [];

        candidateLeavingRows.forEach((leavingRow) => {
          const id = String(getRowId({ row: leavingRow.row, rowIdAccessor }));
          // Find this row in the NEW processed rows to get its NEW position (after filter)
          const rowInNewState = newProcessedRows.find(
            (newRow) => String(getRowId({ row: newRow.row, rowIdAccessor })) === id
          );
          const rowWithNewPosition = rowInNewState || leavingRow;

          if (existingRowsMap.has(id)) {
            // Row is already leaving, update its position
            rowsToUpdate.push(rowWithNewPosition);
          } else {
            // Row is newly leaving
            newLeavingRows.push(rowWithNewPosition);
          }
        });

        // Update existing rows with new positions, keep rows not in update list unchanged
        const updatedExistingRows = existingRows.map((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          const updatedRow = rowsToUpdate.find(
            (r) => String(getRowId({ row: r.row, rowIdAccessor })) === id
          );
          return updatedRow || row;
        });

        // Combine updated existing rows with new leaving rows
        return [...updatedExistingRows, ...newLeavingRows];
      });
    },
    [
      allowAnimations,
      shouldPaginate,
      computeFilteredRowsPreview,
      processRowSet,
      contentHeight,
      rowHeight,
      scrollTop,
      currentTableRows,
      targetVisibleRows,
      rowIdAccessor,
    ]
  );

  const prepareForSortChange = useCallback(
    (accessor: Accessor, targetVisibleRows: TableRow[], capturePositions?: () => void) => {
      if (!allowAnimations || shouldPaginate) return;

      // CRITICAL: Capture positions of existing leaving rows BEFORE updating them
      // This prevents teleporting when their positions change
      if (capturePositions) {
        capturePositions();
      }

      // Calculate what rows would be after sort
      const newSortedRows = computeSortedRowsPreview(accessor);
      const newProcessedRows = processRowSet(newSortedRows);
      const newVisibleRows = getVisibleRows({
        bufferRowCount: BUFFER_ROW_COUNT,
        contentHeight,
        tableRows: newProcessedRows,
        rowHeight,
        scrollTop,
      });

      // Find all rows that WILL BE visible after the sort, but with their CURRENT positions (before sort)
      // This gives us the starting point for animation
      const rowsInCurrentPosition = newVisibleRows
        .map((newVisibleRow) => {
          const id = String(getRowId({ row: newVisibleRow.row, rowIdAccessor }));
          // Find this row in the CURRENT table state (before sort) to get its current position
          const currentStateRow = currentTableRows.find(
            (currentRow) => String(getRowId({ row: currentRow.row, rowIdAccessor })) === id
          );
          return currentStateRow || newVisibleRow; // Fallback to newVisibleRow if not found in current state
        })
        .filter(Boolean);

      setIsAnimating(true);
      setAnimationStartTime(Date.now());

      // Add unique rows to rowsEnteringTheDom (don't add duplicates from targetVisibleRows or existing rowsEnteringTheDom)
      setRowsEnteringTheDom((existingRows) => {
        // Create set of IDs already in targetVisibleRows
        const targetVisibleIds = new Set(
          targetVisibleRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Filter to only include rows that aren't already in targetVisibleRows or existingRows
        const uniqueNewRows = rowsInCurrentPosition.filter((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          return !targetVisibleIds.has(id) && !existingRowIds.has(id);
        });

        // Add unique rows to existing rows
        return [...existingRows, ...uniqueNewRows];
      });

      // Track rows that are leaving the DOM (currently visible but won't be visible after sort)
      setRowsLeavingTheDom((existingRows) => {
        // Create set of IDs that will be visible after sort
        const newVisibleIds = new Set(
          newVisibleRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Create map of existing leaving rows for quick lookup
        const existingRowsMap = new Map(
          existingRows.map((row) => [String(getRowId({ row: row.row, rowIdAccessor })), row])
        );

        // Find rows from targetVisibleRows that won't be visible after sort
        const candidateLeavingRows = targetVisibleRows.filter((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          return !newVisibleIds.has(id);
        });

        // Separate into rows that need position updates vs truly new leaving rows
        const rowsToUpdate: TableRow[] = [];
        const newLeavingRows: TableRow[] = [];

        candidateLeavingRows.forEach((leavingRow) => {
          const id = String(getRowId({ row: leavingRow.row, rowIdAccessor }));
          // Find this row in the NEW processed rows to get its NEW position (after sort)
          const rowInNewState = newProcessedRows.find(
            (newRow) => String(getRowId({ row: newRow.row, rowIdAccessor })) === id
          );
          const rowWithNewPosition = rowInNewState || leavingRow;

          if (existingRowsMap.has(id)) {
            // Row is already leaving, update its position
            rowsToUpdate.push(rowWithNewPosition);
          } else {
            // Row is newly leaving
            newLeavingRows.push(rowWithNewPosition);
          }
        });

        // Update existing rows with new positions, keep rows not in update list unchanged
        const updatedExistingRows = existingRows.map((row) => {
          const id = String(getRowId({ row: row.row, rowIdAccessor }));
          const updatedRow = rowsToUpdate.find(
            (r) => String(getRowId({ row: r.row, rowIdAccessor })) === id
          );
          return updatedRow || row;
        });

        // Combine updated existing rows with new leaving rows
        return [...updatedExistingRows, ...newLeavingRows];
      });
    },
    [
      allowAnimations,
      shouldPaginate,
      computeSortedRowsPreview,
      processRowSet,
      contentHeight,
      rowHeight,
      scrollTop,
      currentTableRows,
      rowIdAccessor,
    ]
  );

  return {
    currentTableRows,
    currentVisibleRows: visibleRowsWithLeaving,
    isAnimating,
    animationStartTime,
    prepareForFilterChange,
    prepareForSortChange,
    cleanupAnimationRows,
    rowsEnteringTheDom,
  };
};

export default useTableRowProcessing;
