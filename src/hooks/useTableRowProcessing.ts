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
  const [animationStartTime, setAnimationStartTime] = useState(0);
  const [rowsEnteringTheDom, setRowsEnteringTheDom] = useState<TableRow[]>([]);
  const [rowsLeavingTheDom, setRowsLeavingTheDom] = useState<TableRow[]>([]);

  // Calculate buffer row count based on actual row height
  // This ensures consistent ~800px overscan regardless of row size
  const bufferRowCount = useMemo(() => calculateBufferRowCount(rowHeight), [rowHeight]);

  // Cleanup function to reset animation states
  const cleanupAnimationRows = useCallback(() => {
    setRowsEnteringTheDom([]);
    setRowsLeavingTheDom([]);
    setIsAnimating(false);
  }, []);

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

  // Combine target visible rows with leaving rows for rendering
  const visibleRowsWithLeaving = useMemo(() => {
    // Create a set of IDs from rowsLeavingTheDom
    const leavingRowIds = new Set(
      rowsLeavingTheDom.map((tableRow) =>
        String(
          getRowId({
            row: tableRow.row,
            rowIdAccessor,
            rowPath: tableRow.rowPath,
          })
        )
      )
    );

    // Filter out any rows from targetVisibleRows that are already in rowsLeavingTheDom
    const uniqueTargetRows = targetVisibleRows.filter((tableRow) => {
      const id = String(
        getRowId({
          row: tableRow.row,
          rowIdAccessor,
          rowPath: tableRow.rowPath,
        })
      );
      return !leavingRowIds.has(id);
    });

    // Combine unique target rows with leaving rows (leaving rows take precedence)
    return [...uniqueTargetRows, ...rowsLeavingTheDom];
  }, [targetVisibleRows, rowsLeavingTheDom, rowIdAccessor]);

  // Animation handlers for filter/sort changes
  const prepareForFilterChange = useCallback(
    (filter: FilterCondition, capturePositions?: () => void) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // CRITICAL: Capture positions of existing leaving rows BEFORE updating them
      // This prevents teleporting when their positions change
      if (capturePositions) {
        capturePositions();
      }

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

      // Find all rows that WILL BE visible after the filter, but with their CURRENT positions (before filter)
      // This gives us the starting point for animation
      const rowsInCurrentPosition = newVisibleRows
        .map((newVisibleRow) => {
          const id = String(
            getRowId({
              row: newVisibleRow.row,
              rowIdAccessor,
              rowPath: newVisibleRow.rowPath,
            })
          );
          // Find this row in the CURRENT table state (before filter) to get its current position
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
          return currentStateRow || newVisibleRow; // Fallback to newVisibleRow if not found in current state
        })
        .filter(Boolean) as TableRow[];

      setIsAnimating(true);
      setAnimationStartTime(Date.now());

      // Add unique rows to rowsEnteringTheDom (don't add duplicates from targetVisibleRows or existing rowsEnteringTheDom)
      setRowsEnteringTheDom((existingRows) => {
        // Create set of IDs already in targetVisibleRows
        const targetVisibleIds = new Set(
          targetVisibleRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Filter to only include rows that aren't already in targetVisibleRows or existingRows
        const uniqueNewRows = rowsInCurrentPosition.filter((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          return !targetVisibleIds.has(id) && !existingRowIds.has(id);
        });

        // Add unique rows to existing rows
        return [...existingRows, ...uniqueNewRows];
      });

      // Track rows that are leaving the DOM (currently visible but won't be visible after filter)
      setRowsLeavingTheDom((existingRows) => {
        // Create set of IDs that will be visible after filter
        const newVisibleIds = new Set(
          newVisibleRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Create map of existing leaving rows for quick lookup
        const existingRowsMap = new Map(
          existingRows.map((tableRow) => [
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            ),
            tableRow,
          ])
        );

        // Find rows from targetVisibleRows that won't be visible after filter
        const candidateLeavingRows = targetVisibleRows.filter((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          return !newVisibleIds.has(id);
        });

        // Separate into rows that need position updates vs truly new leaving rows
        const rowsToUpdate: TableRow[] = [];
        const newLeavingRows: TableRow[] = [];

        candidateLeavingRows.forEach((leavingRow) => {
          const id = String(
            getRowId({
              row: leavingRow.row,
              rowIdAccessor,
              rowPath: leavingRow.rowPath,
            })
          );
          // Find this row in the NEW processed rows to get its NEW position (after filter)
          const rowInNewState = newPaginatedRows.find(
            (newRow) =>
              String(
                getRowId({
                  row: newRow.row,
                  rowIdAccessor,
                  rowPath: newRow.rowPath,
                })
              ) === id
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
        const updatedExistingRows = existingRows.map((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          const updatedRow = rowsToUpdate.find(
            (r) =>
              String(
                getRowId({
                  row: r.row,
                  rowIdAccessor,
                  rowPath: r.rowPath,
                })
              ) === id
          );
          return updatedRow || tableRow;
        });

        // Combine updated existing rows with new leaving rows
        return [...updatedExistingRows, ...newLeavingRows];
      });
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
      currentTableRows,
      targetVisibleRows,
      rowIdAccessor,
      bufferRowCount,
    ]
  );

  const prepareForSortChange = useCallback(
    (accessor: Accessor, targetVisibleRows: TableRow[], capturePositions?: () => void) => {
      if (!allowAnimations || shouldPaginate || contentHeight === undefined) return;

      // CRITICAL: Capture positions of existing leaving rows BEFORE updating them
      // This prevents teleporting when their positions change
      if (capturePositions) {
        capturePositions();
      }

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

      // Find all rows that WILL BE visible after the sort, but with their CURRENT positions (before sort)
      // This gives us the starting point for animation
      const rowsInCurrentPosition = newVisibleRows
        .map((newVisibleRow) => {
          const id = String(
            getRowId({
              row: newVisibleRow.row,
              rowIdAccessor,
              rowPath: newVisibleRow.rowPath,
            })
          );
          // Find this row in the CURRENT table state (before sort) to get its current position
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
          return currentStateRow || newVisibleRow; // Fallback to newVisibleRow if not found in current state
        })
        .filter(Boolean) as TableRow[];

      setIsAnimating(true);
      setAnimationStartTime(Date.now());

      // Add unique rows to rowsEnteringTheDom (don't add duplicates from targetVisibleRows or existing rowsEnteringTheDom)
      setRowsEnteringTheDom((existingRows) => {
        // Create set of IDs already in targetVisibleRows
        const targetVisibleIds = new Set(
          targetVisibleRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Create set of IDs already in existingRows
        const existingRowIds = new Set(
          existingRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Filter to only include rows that aren't already in targetVisibleRows or existingRows
        const uniqueNewRows = rowsInCurrentPosition.filter((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          return !targetVisibleIds.has(id) && !existingRowIds.has(id);
        });

        // Add unique rows to existing rows
        return [...existingRows, ...uniqueNewRows];
      });

      // Track rows that are leaving the DOM (currently visible but won't be visible after sort)
      setRowsLeavingTheDom((existingRows) => {
        // Create set of IDs that will be visible after sort
        const newVisibleIds = new Set(
          newVisibleRows.map((tableRow) =>
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            )
          )
        );

        // Create map of existing leaving rows for quick lookup
        const existingRowsMap = new Map(
          existingRows.map((tableRow) => [
            String(
              getRowId({
                row: tableRow.row,
                rowIdAccessor,
                rowPath: tableRow.rowPath,
              })
            ),
            tableRow,
          ])
        );

        // Find rows from targetVisibleRows that won't be visible after sort
        const candidateLeavingRows = targetVisibleRows.filter((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          return !newVisibleIds.has(id);
        });

        // Separate into rows that need position updates vs truly new leaving rows
        const rowsToUpdate: TableRow[] = [];
        const newLeavingRows: TableRow[] = [];

        candidateLeavingRows.forEach((leavingRow) => {
          const id = String(
            getRowId({
              row: leavingRow.row,
              rowIdAccessor,
              rowPath: leavingRow.rowPath,
            })
          );
          // Find this row in the NEW processed rows to get its NEW position (after sort)
          const rowInNewState = newPaginatedRows.find(
            (newRow) =>
              String(
                getRowId({
                  row: newRow.row,
                  rowIdAccessor,
                  rowPath: newRow.rowPath,
                })
              ) === id
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
        const updatedExistingRows = existingRows.map((tableRow) => {
          const id = String(
            getRowId({
              row: tableRow.row,
              rowIdAccessor,
              rowPath: tableRow.rowPath,
            })
          );
          const updatedRow = rowsToUpdate.find(
            (r) =>
              String(
                getRowId({
                  row: r.row,
                  rowIdAccessor,
                  rowPath: r.rowPath,
                })
              ) === id
          );
          return updatedRow || tableRow;
        });

        // Combine updated existing rows with new leaving rows
        return [...updatedExistingRows, ...newLeavingRows];
      });
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
      currentTableRows,
      rowIdAccessor,
      bufferRowCount,
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
