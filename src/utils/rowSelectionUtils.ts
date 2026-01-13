import Row from "../types/Row";
import TableRow from "../types/TableRow";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import { getRowId } from "./rowUtils";

/**
 * Get the set of selected row IDs from an array of table rows
 */
export const getSelectedRowIds = (tableRows: TableRow[]): string[] => {
  return tableRows.map((tableRow) => String(getRowId(tableRow.rowPath || [tableRow.position])));
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
  return tableRows.every((tableRow) =>
    selectedRows.has(String(getRowId(tableRow.rowPath || [tableRow.position])))
  );
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
export const selectAllRows = (tableRows: TableRow[]): Set<string> => {
  return new Set(
    tableRows.map((tableRow) => String(getRowId(tableRow.rowPath || [tableRow.position])))
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
    .filter((tableRow) =>
      selectedRows.has(String(getRowId(tableRow.rowPath || [tableRow.position])))
    )
    .map((tableRow) => tableRow.row);
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
