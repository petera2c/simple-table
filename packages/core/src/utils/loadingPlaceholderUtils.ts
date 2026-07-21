import type Row from "../types/Row";
import type { GetRowId } from "../types/GetRowId";

const loadingPlaceholderRows = new WeakSet<object>();

/** Mark and return a fresh empty row used as an `isLoading` skeleton placeholder. */
export const createLoadingPlaceholderRow = (): Row => {
  const row: Row = {};
  loadingPlaceholderRows.add(row);
  return row;
};

export const isLoadingPlaceholderRow = (row: Row): boolean =>
  loadingPlaceholderRows.has(row as object);

/**
 * Consumer `getRowId` often collapses empty placeholders to the same key.
 * Skip it for placeholders so WeakMap identity / positional ids stay unique.
 */
export const wrapGetRowIdForLoadingPlaceholders = (
  getRowId: GetRowId | undefined,
): GetRowId | undefined => {
  if (!getRowId) return undefined;
  return (params) => {
    if (isLoadingPlaceholderRow(params.row)) return undefined;
    return getRowId(params);
  };
};

export const createLoadingPlaceholderRows = (count: number): Row[] =>
  Array.from({ length: count }, () => createLoadingPlaceholderRow());
