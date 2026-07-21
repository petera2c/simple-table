import type Cell from "../../types/Cell";
/**
 * Calculate the nearest cell to a given mouse position.
 * Uses row buckets: one getBoundingClientRect per row to find the row, then only
 * measures cells in that row (O(rows + cols) instead of O(rows * cols)).
 */
export declare function calculateNearestCell(clientX: number, clientY: number, root?: Document | HTMLElement): Cell | null;
/**
 * Get cell from mouse position (element under point, or nearest cell).
 */
export declare function getCellFromMousePosition(clientX: number, clientY: number, root?: Document | HTMLElement): Cell | null;
/**
 * Handle auto-scrolling when dragging near table edges.
 * @param root - Table root (e.g. `.simple-table-root`); limits queries to this instance.
 */
export declare function handleAutoScroll(clientX: number, clientY: number, root?: Document | HTMLElement): void;
