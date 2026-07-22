import Row from "../types/Row";
import TableRow from "../types/TableRow";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import type { RowSelectionMode } from "../types/RowSelectionMode";
import { rowIdToString } from "./rowUtils";

/**
 * Whether the checkbox / row-buttons column should be injected into headers.
 * Always shown when `rowButtons` is set (buttons need a home).
 */
export const shouldShowRowSelectionColumn = (config: {
  enableRowSelection?: boolean;
  showRowSelectionColumn?: boolean;
  rowButtons?: unknown[];
}): boolean => {
  if (!config.enableRowSelection) return false;
  if (config.rowButtons && config.rowButtons.length > 0) return true;
  return config.showRowSelectionColumn !== false;
};

/**
 * Get the set of selected row IDs from an array of table rows
 */
export const getSelectedRowIds = (tableRows: TableRow[]): string[] => {
  return tableRows
    .filter((tableRow) => tableRow && tableRow.rowId)
    .map((tableRow) => rowIdToString(tableRow.rowId));
};

/**
 * Check if a specific row is selected
 */
export const isRowSelected = (rowId: string, selectedRows: Set<string>): boolean => {
  return selectedRows.has(rowId);
};

/**
 * Check if all rows are selected
 */
export const areAllRowsSelected = (tableRows: TableRow[], selectedRows: Set<string>): boolean => {
  if (tableRows.length === 0) return false;
  return tableRows
    .filter((tableRow) => tableRow && tableRow.rowId)
    .every((tableRow) => selectedRows.has(rowIdToString(tableRow.rowId)));
};

/**
 * Toggle selection of a single row (multiple mode).
 */
export const toggleRowSelection = (rowId: string, selectedRows: Set<string>): Set<string> => {
  const newSelection = new Set(selectedRows);
  if (newSelection.has(rowId)) {
    newSelection.delete(rowId);
  } else {
    newSelection.add(rowId);
  }
  return newSelection;
};

/**
 * Set whether a row is selected, respecting selection mode.
 */
export const setRowSelected = (
  rowId: string,
  isSelected: boolean,
  selectedRows: Set<string>,
  mode: RowSelectionMode = "multiple",
): Set<string> => {
  if (mode === "single") {
    if (isSelected) {
      return new Set([rowId]);
    }
    const next = new Set(selectedRows);
    next.delete(rowId);
    return next;
  }

  const next = new Set(selectedRows);
  if (isSelected) {
    next.add(rowId);
  } else {
    next.delete(rowId);
  }
  return next;
};

/**
 * Select a range of visible rows (inclusive) by index into `tableRows`.
 * Used for Shift+arrow keyboard range selection in multiple mode.
 */
export const selectRowRange = (
  tableRows: TableRow[],
  startIndex: number,
  endIndex: number,
  baseSelection?: Set<string>,
): Set<string> => {
  const lo = Math.min(startIndex, endIndex);
  const hi = Math.max(startIndex, endIndex);
  const next = new Set(baseSelection ?? []);
  for (let i = lo; i <= hi; i++) {
    const tableRow = tableRows[i];
    if (tableRow?.rowId != null) {
      next.add(rowIdToString(tableRow.rowId));
    }
  }
  return next;
};

/**
 * Select all rows
 */
export const selectAllRows = (tableRows: TableRow[]): Set<string> => {
  return new Set(
    tableRows
      .filter((tableRow) => tableRow && tableRow.rowId)
      .map((tableRow) => rowIdToString(tableRow.rowId)),
  );
};

/**
 * Deselect all rows
 */
export const deselectAllRows = (): Set<string> => {
  return new Set();
};

/**
 * Get the selected rows from the table rows array
 */
export const getSelectedRows = (tableRows: TableRow[], selectedRows: Set<string>): Row[] => {
  return tableRows
    .filter((tableRow) => {
      // Safety check: skip rows without rowId (shouldn't happen, but prevents crashes)
      if (!tableRow || !tableRow.rowId) return false;
      return selectedRows.has(rowIdToString(tableRow.rowId));
    })
    .map((tableRow) => tableRow.row);
};

/**
 * Find a row by its string row id in the current table rows.
 */
export const findRowById = (tableRows: TableRow[], rowId: string): Row | undefined => {
  const tableRow = tableRows.find((tr) => tr?.rowId != null && rowIdToString(tr.rowId) === rowId);
  return tableRow?.row;
};

/**
 * Get the count of selected rows
 */
export const getSelectedRowCount = (selectedRows: Set<string>): number => {
  return selectedRows.size;
};

/**
 * Create a selection header for the checkbox column
 */
export const createSelectionHeader = (width: number) => {
  const selectionHeader: HeaderObject = {
    accessor: "__row_selection__" as Accessor,
    label: "",
    width, // Configurable width for selection column
    editable: false,
    type: "boolean",
    pinned: "left",
    isSelectionColumn: true,
    sortable: false,
    filterable: false,
    align: "center",
  };

  return selectionHeader;
};
