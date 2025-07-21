import { useState, useCallback, useMemo } from "react";
import Row from "../types/Row";
import { Accessor } from "../types/HeaderObject";
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

interface UseRowSelectionProps {
  rows: Row[];
  rowIdAccessor: Accessor;
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  enableRowSelection?: boolean;
}

export const useRowSelection = ({
  rows,
  rowIdAccessor,
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
    return areAllRowsSelected(rows, rowIdAccessor, selectedRows);
  }, [rows, rowIdAccessor, selectedRows, enableRowSelection]);

  // Get count of selected rows
  const selectedRowCount = useMemo(() => {
    if (!enableRowSelection) return 0;
    return getSelectedRowCount(selectedRows);
  }, [selectedRows, enableRowSelection]);

  // Get the actual row data for selected rows
  const selectedRowsData = useMemo(() => {
    if (!enableRowSelection) return [];
    return getSelectedRows(rows, rowIdAccessor, selectedRows);
  }, [rows, rowIdAccessor, selectedRows, enableRowSelection]);

  // Handle individual row selection
  const handleRowSelect = useCallback(
    (rowId: string, isSelected: boolean) => {
      if (!enableRowSelection) return;

      const newSelectedRows = toggleRowSelection(rowId, selectedRows);
      setSelectedRows(newSelectedRows);

      // Call the callback with the row data
      if (onRowSelectionChange) {
        const row = rows.find((r) => String(r[rowIdAccessor]) === rowId);
        if (row) {
          onRowSelectionChange({
            row,
            isSelected,
            selectedRows: newSelectedRows,
          });
        }
      }
    },
    [selectedRows, rows, rowIdAccessor, onRowSelectionChange, enableRowSelection]
  );

  // Handle select all/deselect all
  const handleSelectAll = useCallback(
    (isSelected: boolean) => {
      if (!enableRowSelection) return;

      let newSelectedRows: Set<string>;

      if (isSelected) {
        newSelectedRows = selectAllRows(rows, rowIdAccessor);
        // Call onRowSelectionChange for each row being selected
        if (onRowSelectionChange) {
          rows.forEach((row) =>
            onRowSelectionChange({
              row,
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
            const row = rows.find((r) => String(r[rowIdAccessor]) === rowId);
            if (row) {
              onRowSelectionChange({
                row,
                isSelected: false,
                selectedRows: newSelectedRows,
              });
            }
          });
        }
      }

      setSelectedRows(newSelectedRows);
    },
    [rows, rowIdAccessor, onRowSelectionChange, selectedRows, enableRowSelection]
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
        const row = rows.find((r) => String(r[rowIdAccessor]) === rowId);
        if (row) {
          onRowSelectionChange({
            row,
            isSelected: false,
            selectedRows: newSelectedRows,
          });
        }
      });
    }

    setSelectedRows(new Set());
  }, [selectedRows, rows, rowIdAccessor, onRowSelectionChange, enableRowSelection]);

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
