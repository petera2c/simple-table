import { useMemo } from "react";
import { BUFFER_ROW_COUNT } from "../consts/general-consts";
import { getVisibleRows } from "../utils/infiniteScrollUtils";
import { flattenRowsWithGrouping, getRowId } from "../utils/rowUtils";
import Row from "../types/Row";

interface UseTableRowProcessingProps {
  currentSortedRows: Row[];
  nextSortedRows: Row[];
  pastSortedRows: Row[];
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
  currentSortedRows,
  nextSortedRows,
  pastSortedRows,
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

    return {
      currentTableRows: processRowSet(currentSortedRows),
      nextTableRows: processRowSet(nextSortedRows),
      pastTableRows: processRowSet(pastSortedRows),
    };
  }, [
    currentSortedRows,
    nextSortedRows,
    pastSortedRows,
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

    const nextVisibleRowIds = getVisibleRows({
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      tableRows: processedRows.nextTableRows,
      rowHeight,
      scrollTop,
    }).map((row) => getRowId({ row: row.row, rowIdAccessor }));

    const pastVisibleRowIds = getVisibleRows({
      bufferRowCount: BUFFER_ROW_COUNT,
      contentHeight,
      tableRows: processedRows.pastTableRows,
      rowHeight,
      scrollTop,
    }).map((row) => getRowId({ row: row.row, rowIdAccessor }));

    // Calculate rows to render (for animation)
    const rowsToRender = shouldPaginate
      ? currentVisibleRows
      : (() => {
          const newSet = new Set([...pastVisibleRowIds, ...nextVisibleRowIds]);
          const uniqueIds = Array.from(newSet).filter((id) => {
            const foundRow = currentVisibleRows.find(
              (row) => getRowId({ row: row.row, rowIdAccessor }) === id
            );
            return !foundRow;
          });

          const foundRows = processedRows.currentTableRows.filter((row) =>
            uniqueIds.includes(getRowId({ row: row.row, rowIdAccessor }))
          );

          return [...currentVisibleRows, ...foundRows];
        })();

    return {
      currentVisibleRows,
      nextVisibleRowIds,
      pastVisibleRowIds,
      rowsToRender,
    };
  }, [processedRows, contentHeight, rowHeight, scrollTop, rowIdAccessor, shouldPaginate]);

  return {
    currentTableRows: processedRows.currentTableRows,
    currentVisibleRows: visibilityData.currentVisibleRows,
    rowsToRender: visibilityData.rowsToRender,
  };
};

export default useTableRowProcessing;
