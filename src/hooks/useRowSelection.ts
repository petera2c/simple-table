import { useState, useCallback, useMemo } from "react";
import TableRow from "../types/TableRow";
import {
  areAllRowsSelected,
  toggleRowSelection,
  selectAllRows,
  deselectAllRows,
  getSelectedRows,
  getSelectedRowCount,
  isRowSelected as utilIsRowSelected,
} from "../utils/rowSelectionUtils";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import { rowIdToString } from "../utils/rowUtils";

interface UseRowSelectionProps {
  tableRows: TableRow[];
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  enableRowSelection?: boolean;
}

export const useRowSelection = ({
  tableRows,
  onRowSelectionChange,
  enableRowSelection = false,
}: UseRowSelectionProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Check if a specific row is selected
  const isRowSelected = useCallback(
    (rowId: string): boolean => {
      if (!enableRowSelection) return false;
      return utilIsRowSelected(rowId, selectedRows);
    },
    [selectedRows, enableRowSelection]
  );

  // Check if all rows are selected
  const areAllSelected = useCallback((): boolean => {
    if (!enableRowSelection) return false;
    return areAllRowsSelected(tableRows, selectedRows);
  }, [tableRows, selectedRows, enableRowSelection]);

  // Get count of selected rows
  const selectedRowCount = useMemo(() => {
    if (!enableRowSelection) return 0;
    return getSelectedRowCount(selectedRows);
  }, [selectedRows, enableRowSelection]);

  // Get the actual row data for selected rows
  const selectedRowsData = useMemo(() => {
    if (!enableRowSelection) return [];
    return getSelectedRows(tableRows, selectedRows);
  }, [tableRows, selectedRows, enableRowSelection]);

  // Handle individual row selection
  const handleRowSelect = useCallback(
    (rowId: string, isSelected: boolean) => {
      if (!enableRowSelection) return;

      const newSelectedRows = toggleRowSelection(rowId, selectedRows);
      setSelectedRows(newSelectedRows);

      // Call the callback with the row data
      if (onRowSelectionChange) {
        const tableRow = tableRows.find(
          (tr) => rowIdToString(tr.rowId) === rowId
        );
        if (tableRow) {
          onRowSelectionChange({
            row: tableRow.row,
            isSelected,
            selectedRows: newSelectedRows,
          });
        }
      }
    },
    [selectedRows, tableRows, onRowSelectionChange, enableRowSelection]
  );

  // Handle select all/deselect all
  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      if (!enableRowSelection) return;

      let newSelectedRows: Set<string>;

      if (isSelected) {
        newSelectedRows = selectAllRows(tableRows);
        // Call onRowSelectionChange for each row being selected
        if (onRowSelectionChange) {
          tableRows.forEach((tableRow) =>
            onRowSelectionChange({
              row: tableRow.row,
              isSelected: true,
              selectedRows: newSelectedRows,
            })
          );
        }
      } else {
        newSelectedRows = deselectAllRows();
        // Call onRowSelectionChange for each currently selected row being deselected
        if (onRowSelectionChange) {
          selectedRows.forEach((rowId) => {
            const tableRow = tableRows.find(
              (tr) => rowIdToString(tr.rowId) === rowId
            );
            if (tableRow) {
              onRowSelectionChange({
                row: tableRow.row,
                isSelected: false,
                selectedRows: newSelectedRows,
              });
            }
          });
        }
      }

      setSelectedRows(newSelectedRows);
    },
    [tableRows, onRowSelectionChange, selectedRows, enableRowSelection]
  );

  // Handle toggling a single row (convenience method)
  const handleToggleRow = useCallback(
    (rowId: string) => {
      if (!enableRowSelection) return;

      const wasSelected = isRowSelected(rowId);
      handleRowSelect(rowId, !wasSelected);
    },
    [isRowSelected, handleRowSelect, enableRowSelection]
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    if (!enableRowSelection) return;

    // Call onRowSelectionChange for each currently selected row being deselected
    if (onRowSelectionChange) {
      const newSelectedRows = new Set<string>();
      selectedRows.forEach((rowId) => {
        const tableRow = tableRows.find(
          (tr) => rowIdToString(tr.rowId) === rowId
        );
        if (tableRow) {
          onRowSelectionChange({
            row: tableRow.row,
            isSelected: false,
            selectedRows: newSelectedRows,
          });
        }
      });
    }

    setSelectedRows(new Set());
  }, [selectedRows, tableRows, onRowSelectionChange, enableRowSelection]);

  return {
    selectedRows,
    setSelectedRows,
    isRowSelected,
    areAllRowsSelected: areAllSelected,
    selectedRowCount,
    selectedRowsData,
    handleRowSelect,
    handleSelectAll,
    handleToggleRow,
    clearSelection,
  };
};
