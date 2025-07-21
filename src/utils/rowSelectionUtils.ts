import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";

/**
 * Get the set of selected row IDs from an array of rows
 */
export const getSelectedRowIds = (rows: Row[], rowIdAccessor: Accessor): string[] => {
  return rows.map((row) => String(row[rowIdAccessor]));
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
export const areAllRowsSelected = (
  rows: Row[],
  rowIdAccessor: Accessor,
  selectedRows: Set<string>
): boolean => {
  if (rows.length === 0) return false;
  return rows.every((row) => selectedRows.has(String(row[rowIdAccessor])));
};

/**
 * Toggle selection of a single row
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
 * Select all rows
 */
export const selectAllRows = (rows: Row[], rowIdAccessor: Accessor): Set<string> => {
  return new Set(rows.map((row) => String(row[rowIdAccessor])));
};

/**
 * Deselect all rows
 */
export const deselectAllRows = (): Set<string> => {
  return new Set();
};

/**
 * Get the selected rows from the rows array
 */
export const getSelectedRows = (
  rows: Row[],
  rowIdAccessor: Accessor,
  selectedRows: Set<string>
): Row[] => {
  return rows.filter((row) => selectedRows.has(String(row[rowIdAccessor])));
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
export const createSelectionHeader = () => {
  const selectionHeader: HeaderObject = {
    accessor: "__row_selection__" as Accessor,
    label: "",
    width: 42,
    isEditable: false,
    type: "boolean",
    pinned: "left",
    isSelectionColumn: true,
    isSortable: false,
    filterable: false,
    align: "center",
  };

  return selectionHeader;
};
