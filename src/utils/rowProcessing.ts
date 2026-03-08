import { calculateBufferRowCount } from "../consts/general-consts";
import {
  getViewportCalculations,
  getStickyParents,
  buildCumulativeHeightMap,
  CumulativeHeightMap,
} from "./infiniteScrollUtils";
import { Accessor } from "../types/HeaderObject";
import TableRow from "../types/TableRow";
import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

export interface ProcessRowsConfig {
  flattenedRows: TableRow[];
  paginatableRows: TableRow[];
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

export interface ProcessRowsResult {
  currentTableRows: TableRow[];
  rowsToRender: TableRow[];
  stickyParents: TableRow[];
  regularRows: TableRow[];
  partiallyVisibleRows: TableRow[];
  paginatedHeightOffsets: HeightOffsets | undefined;
  heightMap: CumulativeHeightMap | undefined;
}

function applyPagination(
  allRows: TableRow[],
  parentEndPositions: number[],
  currentPage: number,
  rowsPerPage: number,
  shouldPaginate: boolean,
  serverSidePagination: boolean,
): TableRow[] {
  if (!shouldPaginate || serverSidePagination) {
    return allRows.map((tableRow, index) => ({
      ...tableRow,
      position: index,
      absoluteRowIndex: index,
    }));
  }

  const startParentIndex = (currentPage - 1) * rowsPerPage;
  const endParentIndex = currentPage * rowsPerPage;

  const startPosition = startParentIndex === 0 ? 0 : parentEndPositions[startParentIndex - 1];
  const endPosition =
    endParentIndex <= parentEndPositions.length
      ? parentEndPositions[endParentIndex - 1]
      : allRows.length;

  const paginatedRows = allRows.slice(startPosition, endPosition);

  return paginatedRows.map((tableRow, index) => {
    const absoluteRowIndex = tableRow.nestedTable
      ? tableRow.absoluteRowIndex
      : shouldPaginate && !serverSidePagination
        ? startPosition + index
        : index;

    return {
      ...tableRow,
      position: index,
      absoluteRowIndex,
    };
  });
}

export function processRows(config: ProcessRowsConfig): ProcessRowsResult {
  const {
    contentHeight,
    currentPage,
    customTheme,
    enableStickyParents,
    flattenedRows,
    heightOffsets,
    parentEndPositions,
    rowHeight,
    rowsPerPage,
    scrollDirection = "none",
    scrollTop,
    serverSidePagination,
    shouldPaginate,
    rowGrouping,
  } = config;

  const bufferRowCount = calculateBufferRowCount(rowHeight);

  const currentTableRows = applyPagination(
    flattenedRows,
    parentEndPositions,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    serverSidePagination,
  );

  const paginatedHeightOffsets =
    !heightOffsets || heightOffsets.length === 0 || !shouldPaginate || serverSidePagination
      ? heightOffsets
      : (() => {
          const positionMap = new Map<number, number>();
          currentTableRows.forEach((tableRow) => {
            if (tableRow.nestedTable) {
              positionMap.set(tableRow.absoluteRowIndex, tableRow.position);
            }
          });

          return heightOffsets
            .filter(([originalPos]) => positionMap.has(originalPos))
            .map(
              ([originalPos, extraHeight]) =>
                [positionMap.get(originalPos)!, extraHeight] as [number, number],
            );
        })();

  const heightMap: CumulativeHeightMap | undefined =
    paginatedHeightOffsets && paginatedHeightOffsets.length > 0
      ? buildCumulativeHeightMap(
          currentTableRows.length,
          rowHeight,
          paginatedHeightOffsets,
          customTheme,
        )
      : undefined;

  const targetVisibleRows =
    contentHeight === undefined
      ? currentTableRows
      : getViewportCalculations({
          bufferRowCount,
          contentHeight,
          tableRows: currentTableRows,
          rowHeight,
          scrollTop,
          scrollDirection,
          heightMap,
        }).rendered.rows;

  const { stickyParents, regularRows, partiallyVisibleRows } =
    !enableStickyParents || contentHeight === undefined
      ? { stickyParents: [], regularRows: targetVisibleRows, partiallyVisibleRows: [] }
      : (() => {
          const viewportCalcs = getViewportCalculations({
            bufferRowCount,
            contentHeight,
            tableRows: currentTableRows,
            rowHeight,
            scrollTop,
            scrollDirection,
            heightMap,
          });

          const stickyResult = rowGrouping
            ? getStickyParents(
                currentTableRows,
                viewportCalcs.rendered.rows,
                viewportCalcs.fullyVisible.rows,
                viewportCalcs.partiallyVisible.rows,
                rowGrouping,
              )
            : {
                stickyParents: [],
                regularRows: viewportCalcs.rendered.rows,
                partiallyVisibleRows: [],
              };

          console.log("stickyResult", stickyResult);

          return {
            ...stickyResult,
            partiallyVisibleRows: viewportCalcs.partiallyVisible.rows,
          };
        })();

  return {
    currentTableRows,
    rowsToRender: targetVisibleRows,
    stickyParents,
    regularRows,
    partiallyVisibleRows,
    paginatedHeightOffsets,
    heightMap,
  };
}
