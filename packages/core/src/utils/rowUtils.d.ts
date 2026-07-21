import TableRow from "../types/TableRow";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import CellValue from "../types/CellValue";
import RowState from "../types/RowState";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";
import { GenerateRowIdParams } from "../types/GenerateRowIdParams";
/**
 * Calculate the height of a nested grid based on the number of child rows
 * @param childRowCount - Number of rows in the nested grid
 * @param rowHeight - Height of each row
 * @param headerHeight - Height of the header
 * @param customTheme - Custom theme configuration
 * @returns Calculated height in pixels (includes padding, borders, row separators, and header border)
 */
export declare const calculateNestedGridHeight: ({ childRowCount, rowHeight, headerHeight, customTheme, }: {
    childRowCount: number;
    rowHeight: number;
    headerHeight: number;
    customTheme: CustomTheme;
}) => number;
/**
 * Calculate the final wrapper height for a nested grid, accounting for custom heights
 *
 * @param calculatedHeight - The default calculated height based on child rows
 * @param customHeight - Optional custom height from nestedTable config (e.g., "200px" or 200)
 * @param customTheme - Custom theme configuration for padding
 * @returns Final height in pixels for the wrapper (includes padding)
 */
export declare const calculateFinalNestedGridHeight: ({ calculatedHeight, customHeight, customTheme, }: {
    calculatedHeight: number;
    customHeight?: string | number;
    customTheme: CustomTheme;
}) => number;
/**
 * Calculate the inner height for a nested SimpleTable component
 * This accounts for the padding that's applied to the wrapper
 *
 * @param calculatedHeight - The total height of the nested grid row (from calculateNestedGridHeight)
 * @param customHeight - Optional custom height from nestedTable config (e.g., "200px")
 * @param customTheme - Custom theme configuration for padding
 * @returns Height value to pass to the nested SimpleTable (string with units)
 */
export declare const calculateNestedTableHeight: ({ calculatedHeight, customHeight, customTheme, }: {
    calculatedHeight: number;
    customHeight?: string | number;
    customTheme: CustomTheme;
}) => string;
/**
 * Get a nested property value from an object using dot notation and array bracket notation
 * Examples:
 *   getNestedValue(row, "latest.rank") returns row.latest.rank
 *   getNestedValue(row, "albums[0].title") returns row.albums[0].title
 *   getNestedValue(row, "releaseDate[0]") returns row.releaseDate[0]
 */
export declare const getNestedValue: (obj: Row, path: Accessor) => CellValue;
/**
 * True when both arrays have the same length and the same row object references
 * at each index. Used by FilterManager / SortManager so in-place live updates
 * that recompute filter/sort only notify subscribers when membership or order
 * actually changed (`.filter()` / `handleSort` always allocate new arrays).
 */
export declare const rowsOrderEqual: (a: Row[], b: Row[]) => boolean;
/**
 * Set a nested property value in an object using dot notation and array bracket notation
 * Examples:
 *   setNestedValue(row, "latest.rank", 5) sets row.latest.rank = 5
 *   setNestedValue(row, "albums[0].title", "New Album") sets row.albums[0].title = "New Album"
 *   setNestedValue(row, "releaseDate[0]", "2024") sets row.releaseDate[0] = "2024"
 */
export declare const setNestedValue: (obj: Row, path: Accessor, value: CellValue) => void;
/**
 * Check if an array contains Row objects (vs primitive arrays like string[] or number[])
 */
export declare const isRowArray: (data: any) => data is Row[];
/**
 * Generate the row ID array from index path and optional custom identifier.
 *
 * The row ID is always an array that includes:
 * - The index at each level of nesting
 * - The grouping key between levels (for readability)
 * - An optional custom identifier from getRowId (appended at the end)
 *
 * Examples:
 * - Root row (index 1): [1]
 * - Nested store (parent index 1, store index 5): [1, "stores", 5]
 * - With custom ID: [1, "stores", 5, "STORE-101"]
 * - Deep nesting: [1, "stores", 5, "products", 2, "PROD-24"]
 *
 * @param params - Object containing row data, getRowId function, and metadata
 * @returns An array representing the unique row ID path
 */
export declare const generateRowId: (params: GenerateRowIdParams) => (string | number)[];
/**
 * Convert a row ID array to a string for use as Map keys, Set members, etc.
 *
 * @param rowId - Array of strings/numbers representing the row ID path
 * @returns A string representation of the row ID
 */
export declare const rowIdToString: (rowId: (string | number)[]) => string;
/**
 * Generate a position-independent stable row key.
 *
 * Unlike `generateRowId`, the stable key never includes positional indices, so
 * it survives sort/filter operations. It is used as the basis for the cell DOM
 * `id` and the animation coordinator's snapshot key, allowing the same DOM
 * element to be reused for the same logical row across re-orders (enabling
 * FLIP-based sort animations).
 *
 * When `getRowId` is provided, the key is derived from the user-supplied id.
 * When it is not, the key falls back to the row object's identity (via a
 * WeakMap) so animations still work for plain row arrays. For nested rows the
 * parent's stable key is included as a prefix so siblings of different parents
 * do not collide.
 */
export declare const generateStableRowKey: (params: {
    getRowId?: GetRowId;
    row: Row;
    depth: number;
    index: number;
    rowPath: (string | number)[];
    rowIndexPath: number[];
    groupingKey?: string;
    parentStableKey?: string | null;
}) => string;
/**
 * Canonical string key for per-row expandable UI state: {@link expandedRows},
 * {@link collapsedRows}, and entries in {@link rowStateMap} (loading/error/empty).
 *
 * Mirrors {@link TableRow.stableRowKey} whenever it is defined so expand state survives
 * sort/filter reorder while positional `rowId` indices change.
 * Falls back to {@link rowIdToString}(rowId) for synthetic rows without a stable key.
 */
export declare const expandStateKey: (tableRow: {
    stableRowKey?: string;
    rowId: (string | number)[];
}) => string;
/**
 * Stable identity for full-width chrome rows (nested grid, loading/error state)
 * under an expanded parent. Parent {@link expandStateKey} survives sort; path-based
 * `rowId` does not, so SectionRenderer must key DOM maps on this instead.
 */
export declare const nestedChromeRowKey: (parentExpandStateKey: string | number, groupingKey: string | undefined) => string;
/**
 * Get nested rows from a row based on the grouping path
 */
export declare const getNestedRows: (row: Row, groupingKey: string) => Row[];
/**
 * Check if a row has nested rows for a given grouping key
 */
export declare const hasNestedRows: (row: Row, groupingKey?: string) => boolean;
/**
 * Determine if a row is expanded based on expandedDepths and manual row overrides
 * @param expandStateRowId - Canonical key for expandable row state ({@link expandStateKey}).
 * Matches keys in expandedRows/collapsedRows (stable across sort/filter when stableRowKey is used).
 * @param depth - The depth level of the row (0-indexed)
 * @param expandedDepths - Set of depth levels that are expanded
 * @param expandedRows - Map of row IDs to their depths for rows that user wants expanded
 * @param collapsedRows - Map of row IDs to their depths for rows that user wants collapsed
 * @returns true if the row is expanded, false otherwise
 */
export declare const isRowExpanded: (expandStateRowId: string | number, depth: number, expandedDepths: Set<number>, expandedRows: Map<string, number>, collapsedRows: Map<string, number>) => boolean;
/**
 * Flatten rows recursively based on row grouping configuration
 * Now calculates ALL properties including position and isLastGroupRow
 * Also injects special state rows for loading/error/empty states (only if renderers are available)
 * Also injects nested grid rows when a header has nestedTable configuration
 */
export declare const flattenRowsWithGrouping: ({ depth, expandedDepths, expandedRows, collapsedRows, rowGrouping, getRowId, rows, displayPositionOffset, rowStateMap, hasLoadingRenderer, hasErrorRenderer, hasEmptyRenderer, headers, rowHeight, headerHeight, customTheme, }: {
    depth?: number;
    expandedDepths: Set<number>;
    expandedRows: Map<string, number>;
    collapsedRows: Map<string, number>;
    rowGrouping?: Accessor[];
    getRowId?: GetRowId;
    rows: Row[];
    displayPositionOffset?: number;
    rowStateMap?: Map<string | number, RowState>;
    hasLoadingRenderer?: boolean;
    hasErrorRenderer?: boolean;
    hasEmptyRenderer?: boolean;
    headers?: HeaderObject[];
    rowHeight: number;
    headerHeight: number;
    customTheme: CustomTheme;
}) => TableRow[];
