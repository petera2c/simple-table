import { useState, useEffect, useRef } from "react";
import TableRow from "../types/TableRow";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import { RowSelectionManager } from "../managers/RowSelectionManager";

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
  const managerRef = useRef<RowSelectionManager | null>(null);
  const [state, setState] = useState({
    selectedRows: new Set<string>(),
    selectedRowCount: 0,
    selectedRowsData: [] as any[],
  });

  useEffect(() => {
    managerRef.current = new RowSelectionManager({
      tableRows,
      onRowSelectionChange,
      enableRowSelection,
    });

    const unsubscribe = managerRef.current.subscribe((newState) => {
      setState({
        selectedRows: newState.selectedRows,
        selectedRowCount: newState.selectedRowCount,
        selectedRowsData: newState.selectedRowsData,
      });
    });

    return () => {
      unsubscribe();
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, []);

  useEffect(() => {
    managerRef.current?.updateConfig({
      tableRows,
      onRowSelectionChange,
      enableRowSelection,
    });
  }, [tableRows, onRowSelectionChange, enableRowSelection]);

  const isRowSelected = (rowId: string): boolean => {
    return managerRef.current?.isRowSelected(rowId) ?? false;
  };

  const areAllRowsSelected = (): boolean => {
    return managerRef.current?.areAllRowsSelected() ?? false;
  };

  const handleRowSelect = (rowId: string, isSelected: boolean): void => {
    managerRef.current?.handleRowSelect(rowId, isSelected);
  };

  const handleSelectAll = (isSelected: boolean): void => {
    managerRef.current?.handleSelectAll(isSelected);
  };

  const handleToggleRow = (rowId: string): void => {
    managerRef.current?.handleToggleRow(rowId);
  };

  const clearSelection = (): void => {
    managerRef.current?.clearSelection();
  };

  const setSelectedRows = (
    selectedRowsOrUpdater: Set<string> | ((prev: Set<string>) => Set<string>)
  ): void => {
    if (typeof selectedRowsOrUpdater === "function") {
      const currentRows = managerRef.current?.getSelectedRows() ?? new Set<string>();
      const newRows = selectedRowsOrUpdater(currentRows);
      managerRef.current?.setSelectedRows(newRows);
    } else {
      managerRef.current?.setSelectedRows(selectedRowsOrUpdater);
    }
  };

  return {
    selectedRows: state.selectedRows,
    setSelectedRows,
    isRowSelected,
    areAllRowsSelected,
    selectedRowCount: state.selectedRowCount,
    selectedRowsData: state.selectedRowsData,
    handleRowSelect,
    handleSelectAll,
    handleToggleRow,
    clearSelection,
  };
};
