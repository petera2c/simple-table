import type Row from "../types/Row";
import type { GetRowId } from "../types/GetRowId";
/** Mark and return a fresh empty row used as an `isLoading` skeleton placeholder. */
export declare const createLoadingPlaceholderRow: () => Row;
export declare const isLoadingPlaceholderRow: (row: Row) => boolean;
/**
 * Consumer `getRowId` often collapses empty placeholders to the same key.
 * Skip it for placeholders so WeakMap identity / positional ids stay unique.
 */
export declare const wrapGetRowIdForLoadingPlaceholders: (getRowId: GetRowId | undefined) => GetRowId | undefined;
export declare const createLoadingPlaceholderRows: (count: number) => Row[];
