import { useMemo } from "react";
import { BUFFER_ROW_COUNT } from "../consts/general-consts";
import { getVisibleRows } from "../utils/infiniteScrollUtils";
import { flattenRowsWithGrouping, getRowId } from "../utils/rowUtils";
import Row from "../types/Row";

interface UseTableRowProcessingProps {
  allowAnimations: boolean;
  currentSortedRows: Row[];
  nextSortedRows: Row[];
  pastSortedRows: Row[];
  currentFilteredRows: Row[];
  nextFilteredRows: Row[];
  pastFilteredRows: Row[];
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
  nextSortedRows,
  pastSortedRows,
  currentFilteredRows,
  nextFilteredRows,
  pastFilteredRows,
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
  // Process all three states through pagination and grouping
  const processedRows = useMemo(() => {
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

    // When animations are disabled, only process current sorted rows
    if (!allowAnimations) {
      const currentTableRows = processRowSet(currentSortedRows);
      return {
        currentTableRows,
        nextTableRows: currentTableRows,
        pastTableRows: currentTableRows,
        currentFilterTableRows: currentTableRows,
        nextFilterTableRows: currentTableRows,
        pastFilterTableRows: currentTableRows,
      };
    }

    // When animations are enabled, process all states
    return {
      currentTableRows: processRowSet(currentSortedRows),
      nextTableRows: processRowSet(nextSortedRows),
      pastTableRows: processRowSet(pastSortedRows),
      currentFilterTableRows: processRowSet(currentFilteredRows),
      nextFilterTableRows: processRowSet(nextFilteredRows),
      pastFilterTableRows: processRowSet(pastFilteredRows),
    };
  }, [
    allowAnimations,
    currentSortedRows,
    nextSortedRows,
    pastSortedRows,
    currentFilteredRows,
    nextFilteredRows,
    pastFilteredRows,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
  ]);

  // Calculate visible rows and rows to render
  const visibilityData = useMemo(() => {
    const currentVisibleRows = getVisibleRows({
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      tableRows: processedRows.currentTableRows,
      rowHeight,
      scrollTop,
    });

    // If animations are disabled or pagination is enabled, just return current visible rows
    if (!allowAnimations || shouldPaginate) {
      return {
        currentVisibleRows,
        rowsToRender: currentVisibleRows,
      };
    }

    // When animations are enabled and pagination is disabled, we need to calculate
    // all visible rows across different states for smooth transitions
    const visibilityParams = {
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      rowHeight,
      scrollTop,
    };

    // Calculate visible rows for all states and extract IDs in one pass
    const allVisibleRowIds = new Set<string>();

    // Helper function to process visible rows and collect IDs
    const processVisibleRows = (tableRows: any[]) => {
      return getVisibleRows({
        ...visibilityParams,
        tableRows,
      }).map((row) => {
        const id = String(getRowId({ row: row.row, rowIdAccessor }));
        allVisibleRowIds.add(id);
        return id;
      });
    };

    // Process all states
    processVisibleRows(processedRows.nextTableRows);
    processVisibleRows(processedRows.pastTableRows);
    processVisibleRows(processedRows.nextFilterTableRows);
    processVisibleRows(processedRows.pastFilterTableRows);

    // Find additional rows that need to be rendered (visible in other states but not current)
    const currentVisibleRowIds = new Set(
      currentVisibleRows.map((row) => String(getRowId({ row: row.row, rowIdAccessor })))
    );

    const additionalRowIds = Array.from(allVisibleRowIds).filter(
      (id) => !currentVisibleRowIds.has(id)
    );

    // Find the actual row objects for additional IDs
    const additionalRows = processedRows.currentTableRows.filter((row) =>
      additionalRowIds.includes(String(getRowId({ row: row.row, rowIdAccessor })))
    );

    const rowsToRender = [...currentVisibleRows, ...additionalRows];

    return {
      currentVisibleRows,
      rowsToRender,
    };
  }, [
    processedRows,
    contentHeight,
    rowHeight,
    scrollTop,
    rowIdAccessor,
    shouldPaginate,
    allowAnimations,
  ]);

  return {
    currentTableRows: processedRows.currentTableRows,
    currentVisibleRows: visibilityData.currentVisibleRows,
    rowsToRender: visibilityData.rowsToRender,
  };
};

export default useTableRowProcessing;
