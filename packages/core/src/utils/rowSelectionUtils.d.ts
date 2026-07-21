import Row from "../types/Row";
import TableRow from "../types/TableRow";
import HeaderObject from "../types/HeaderObject";
import type { RowSelectionMode } from "../types/RowSelectionMode";
/**
 * Whether the checkbox / row-buttons column should be injected into headers.
 * Always shown when `rowButtons` is set (buttons need a home).
 */
export declare const shouldShowRowSelectionColumn: (config: {
    enableRowSelection?: boolean;
    showRowSelectionColumn?: boolean;
    rowButtons?: unknown[];
}) => boolean;
/**
 * Get the set of selected row IDs from an array of table rows
 */
export declare const getSelectedRowIds: (tableRows: TableRow[]) => string[];
/**
 * Check if a specific row is selected
 */
export declare const isRowSelected: (rowId: string, selectedRows: Set<string>) => boolean;
/**
 * Check if all rows are selected
 */
export declare const areAllRowsSelected: (tableRows: TableRow[], selectedRows: Set<string>) => boolean;
/**
 * Toggle selection of a single row (multiple mode).
 */
export declare const toggleRowSelection: (rowId: string, selectedRows: Set<string>) => Set<string>;
/**
 * Set whether a row is selected, respecting selection mode.
 */
export declare const setRowSelected: (rowId: string, isSelected: boolean, selectedRows: Set<string>, mode?: RowSelectionMode) => Set<string>;
/**
 * Select a range of visible rows (inclusive) by index into `tableRows`.
 * Used for Shift+arrow keyboard range selection in multiple mode.
 */
export declare const selectRowRange: (tableRows: TableRow[], startIndex: number, endIndex: number, baseSelection?: Set<string>) => Set<string>;
/**
 * Select all rows
 */
export declare const selectAllRows: (tableRows: TableRow[]) => Set<string>;
/**
 * Deselect all rows
 */
export declare const deselectAllRows: () => Set<string>;
/**
 * Get the selected rows from the table rows array
 */
export declare const getSelectedRows: (tableRows: TableRow[], selectedRows: Set<string>) => Row[];
/**
 * Find a row by its string row id in the current table rows.
 */
export declare const findRowById: (tableRows: TableRow[], rowId: string) => Row | undefined;
/**
 * Get the count of selected rows
 */
export declare const getSelectedRowCount: (selectedRows: Set<string>) => number;
/**
 * Create a selection header for the checkbox column
 */
export declare const createSelectionHeader: (width: number) => HeaderObject;
