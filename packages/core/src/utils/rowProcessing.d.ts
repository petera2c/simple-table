import { CumulativeHeightMap } from "./infiniteScrollUtils";
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
    /** Visible range start index into currentTableRows (when virtualized). */
    renderedStartIndex: number;
    /** Visible range end index into currentTableRows (when virtualized). */
    renderedEndIndex: number;
    stickyParents: TableRow[];
    regularRows: TableRow[];
    partiallyVisibleRows: TableRow[];
    paginatedHeightOffsets: HeightOffsets | undefined;
    heightMap: CumulativeHeightMap | undefined;
    /** Pre-pagination flattened rows (each row's `position` is its global index).
     * Used by animation snapshot to include off-page rows so cross-page sort can
     * FLIP cells in/out from off-screen. */
    allFlattenedRows: TableRow[];
    /** Global flattened-list index where the current page starts. 0 when no
     * pagination is active. Used by animation snapshot to convert global
     * positions into page-relative `top` values. */
    pageStartIndex: number;
}
export declare function processRows(config: ProcessRowsConfig): ProcessRowsResult;
/** Layout inputs that do not depend on scroll position (reuse across scroll-raf frames). */
export interface ProcessRowsScrollReuseBase {
    currentTableRows: TableRow[];
    paginatedHeightOffsets: HeightOffsets | undefined;
    heightMap: CumulativeHeightMap | undefined;
    allFlattenedRows: TableRow[];
    pageStartIndex: number;
}
/**
 * Recomputes only viewport-dependent fields when pagination, height map, and row list
 * are unchanged (vertical scroll only). Avoids re-running applyPagination and
 * buildCumulativeHeightMap on every scroll frame.
 */
export declare function recomputeProcessRowsViewport(base: ProcessRowsScrollReuseBase, config: {
    contentHeight: number | undefined;
    rowHeight: number;
    scrollTop: number;
    scrollDirection?: "up" | "down" | "none";
    enableStickyParents: boolean;
    rowGrouping?: Accessor[];
}): ProcessRowsResult;
