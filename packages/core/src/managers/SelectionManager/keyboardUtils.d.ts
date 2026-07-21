/**
 * Find the edge of data in a direction (pure helper for keyboard navigation).
 */
export declare function findEdgeInDirection(tableRowsLength: number, leafHeadersLength: number, enableRowSelection: boolean, startRow: number, startCol: number, direction: "up" | "down" | "left" | "right"): {
    rowIndex: number;
    colIndex: number;
};
