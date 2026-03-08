import { useMemo, useCallback } from "react";
import { calculateBufferRowCount } from "../consts/general-consts";
import {
  getViewportCalculations,
  getStickyParents,
  buildCumulativeHeightMap,
  CumulativeHeightMap,
} from "../utils/infiniteScrollUtils";
import { Accessor } from "../types/HeaderObject";
import TableRow from "../types/TableRow";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

interface UseTableRowProcessingProps {
  /** Already flattened rows from useFlattenedRows */
  flattenedRows: TableRow[];
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
  rowGrouping?: Accessor[];
}

const useTableRowProcessing = ({
  contentHeight,
  currentPage,
  customTheme,
  enableStickyParents,
  flattenedRows,
  heightOffsets,
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
  // Calculate buffer row count based on actual row height
  // This ensures consistent ~800px overscan regardless of row size
  const bufferRowCount = useMemo(() => calculateBufferRowCount(rowHeight), [rowHeight]);

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
    [currentPage, rowsPerPage, serverSidePagination, shouldPaginate],
  );

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
          [positionMap.get(originalPos)!, extraHeight] as [number, number],
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
      customTheme,
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
  const { stickyParents, regularRows, partiallyVisibleRows } = useMemo(() => {
    // Only apply sticky parents if enabled and we have virtualization and viewport calculations
    if (!enableStickyParents || contentHeight === undefined) {
      return { stickyParents: [], regularRows: targetVisibleRows, partiallyVisibleRows: [] };
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
    const stickyResult = rowGrouping
      ? getStickyParents(
          currentTableRows,
          viewportCalcs.rendered.rows,
          viewportCalcs.fullyVisible.rows,
          viewportCalcs.partiallyVisible.rows,
          rowGrouping,
        )
      : { stickyParents: [], regularRows: viewportCalcs.rendered.rows, partiallyVisibleRows: [] };
    console.log("stickyResult", stickyResult);

    return {
      ...stickyResult,
      partiallyVisibleRows: viewportCalcs.partiallyVisible.rows,
    };
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

  return {
    currentTableRows,
    rowsToRender: targetVisibleRows,
    stickyParents,
    regularRows,
    partiallyVisibleRows,
    paginatedHeightOffsets,
    heightMap,
  };
};

export default useTableRowProcessing;
