import TableRow from "../types/TableRow";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import { rowIdToString } from "../utils/rowUtils";
import {
  areAllRowsSelected,
  toggleRowSelection,
  selectAllRows,
  deselectAllRows,
  getSelectedRows,
  getSelectedRowCount,
  isRowSelected as utilIsRowSelected,
} from "../utils/rowSelectionUtils";

export interface RowSelectionManagerConfig {
  tableRows: TableRow[];
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  enableRowSelection?: boolean;
}

export interface RowSelectionManagerState {
  selectedRows: Set<string>;
  selectedRowCount: number;
  selectedRowsData: any[];
}

type StateChangeCallback = (state: RowSelectionManagerState) => void;

export class RowSelectionManager {
  private config: RowSelectionManagerConfig;
  private state: RowSelectionManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();

  constructor(config: RowSelectionManagerConfig) {
    this.config = config;
    
    this.state = {
      selectedRows: new Set<string>(),
      selectedRowCount: 0,
      selectedRowsData: [],
    };
  }

  updateConfig(config: Partial<RowSelectionManagerConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.tableRows) {
      this.updateDerivedState();
    }
  }

  private updateDerivedState(): void {
    this.state = {
      ...this.state,
      selectedRowCount: getSelectedRowCount(this.state.selectedRows),
      selectedRowsData: getSelectedRows(this.config.tableRows, this.state.selectedRows),
    };
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  isRowSelected(rowId: string): boolean {
    if (!this.config.enableRowSelection) return false;
    return utilIsRowSelected(rowId, this.state.selectedRows);
  }

  areAllRowsSelected(): boolean {
    if (!this.config.enableRowSelection) return false;
    return areAllRowsSelected(this.config.tableRows, this.state.selectedRows);
  }

  getSelectedRows(): Set<string> {
    return this.state.selectedRows;
  }

  getSelectedRowCount(): number {
    return this.state.selectedRowCount;
  }

  getSelectedRowsData(): any[] {
    return this.state.selectedRowsData;
  }

  setSelectedRows(selectedRows: Set<string>): void {
    this.state = {
      ...this.state,
      selectedRows,
    };
    this.updateDerivedState();
    this.notifySubscribers();
  }

  handleRowSelect(rowId: string, isSelected: boolean): void {
    if (!this.config.enableRowSelection) return;

    const newSelectedRows = toggleRowSelection(rowId, this.state.selectedRows);
    this.state = {
      ...this.state,
      selectedRows: newSelectedRows,
    };
    this.updateDerivedState();

    if (this.config.onRowSelectionChange) {
      const tableRow = this.config.tableRows.find(
        (tr) => rowIdToString(tr.rowId) === rowId
      );
      if (tableRow) {
        this.config.onRowSelectionChange({
          row: tableRow.row,
          isSelected,
          selectedRows: newSelectedRows,
        });
      }
    }

    this.notifySubscribers();
  }

  handleSelectAll(isSelected: boolean): void {
    if (!this.config.enableRowSelection) return;

    let newSelectedRows: Set<string>;

    if (isSelected) {
      newSelectedRows = selectAllRows(this.config.tableRows);
      if (this.config.onRowSelectionChange) {
        this.config.tableRows.forEach((tableRow) =>
          this.config.onRowSelectionChange!({
            row: tableRow.row,
            isSelected: true,
            selectedRows: newSelectedRows,
          })
        );
      }
    } else {
      newSelectedRows = deselectAllRows();
      if (this.config.onRowSelectionChange) {
        this.state.selectedRows.forEach((rowId) => {
          const tableRow = this.config.tableRows.find(
            (tr) => rowIdToString(tr.rowId) === rowId
          );
          if (tableRow) {
            this.config.onRowSelectionChange!({
              row: tableRow.row,
              isSelected: false,
              selectedRows: newSelectedRows,
            });
          }
        });
      }
    }

    this.state = {
      ...this.state,
      selectedRows: newSelectedRows,
    };
    this.updateDerivedState();
    this.notifySubscribers();
  }

  handleToggleRow(rowId: string): void {
    if (!this.config.enableRowSelection) return;

    const wasSelected = this.isRowSelected(rowId);
    this.handleRowSelect(rowId, !wasSelected);
  }

  clearSelection(): void {
    if (!this.config.enableRowSelection) return;

    if (this.config.onRowSelectionChange) {
      const newSelectedRows = new Set<string>();
      this.state.selectedRows.forEach((rowId) => {
        const tableRow = this.config.tableRows.find(
          (tr) => rowIdToString(tr.rowId) === rowId
        );
        if (tableRow) {
          this.config.onRowSelectionChange!({
            row: tableRow.row,
            isSelected: false,
            selectedRows: newSelectedRows,
          });
        }
      });
    }

    this.state = {
      ...this.state,
      selectedRows: new Set(),
    };
    this.updateDerivedState();
    this.notifySubscribers();
  }

  getState(): RowSelectionManagerState {
    return this.state;
  }

  destroy(): void {
    this.subscribers.clear();
  }
}
