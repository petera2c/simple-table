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
    (filter: any) => {
      if (!allowAnimations || shouldPaginate) return;

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

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Find rows currently visible but won't be visible after filter
        const leavingRows = targetVisibleRows
          .filter((row) => {
            const id = String(getRowId({ row: row.row, rowIdAccessor }));
            return !newVisibleIds.has(id) && !existingRowIds.has(id);
          })
          .map((leavingRow) => {
            const id = String(getRowId({ row: leavingRow.row, rowIdAccessor }));
            // Find this row in the NEW processed rows to get its NEW position (after filter)
            const rowInNewState = newProcessedRows.find(
              (newRow) => String(getRowId({ row: newRow.row, rowIdAccessor })) === id
            );
            // Use the new position if found, otherwise keep current position
            return rowInNewState || leavingRow;
          });

        // Add unique leaving rows with their new positions
        return [...existingRows, ...leavingRows];
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
    (accessor: Accessor, targetVisibleRows: TableRow[]) => {
      if (!allowAnimations || shouldPaginate) return;

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

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
        );

        // Find rows currently visible but won't be visible after sort
        const leavingRows = targetVisibleRows
          .filter((row) => {
            const id = String(getRowId({ row: row.row, rowIdAccessor }));
            return !newVisibleIds.has(id) && !existingRowIds.has(id);
          })
          .map((leavingRow) => {
            const id = String(getRowId({ row: leavingRow.row, rowIdAccessor }));
            // Find this row in the NEW processed rows to get its NEW position (after sort)
            const rowInNewState = newProcessedRows.find(
              (newRow) => String(getRowId({ row: newRow.row, rowIdAccessor })) === id
            );
            // Use the new position if found, otherwise keep current position
            return rowInNewState || leavingRow;
          });

        // Add unique leaving rows with their new positions
        return [...existingRows, ...leavingRows];
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

  console.log("\n");
  console.log(
    "rowsLeavingTheDom",
    JSON.stringify(
      rowsLeavingTheDom.map((row) => ({
        companyName: row.row.companyName,
        id: row.row.id,
        position: row.position,
      }))
    )
  );
  console.log(
    "targetVisibleRows",
    JSON.stringify(
      targetVisibleRows.map((row) => ({
        companyName: row.row.companyName,
        id: row.row.id,
        position: row.position,
      }))
    )
  );
  console.log(
    "rowsEnteringTheDom",
    JSON.stringify(
      rowsEnteringTheDom.map((row) => ({
        companyName: row.row.companyName,
        id: row.row.id,
        position: row.position,
      }))
    )
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
