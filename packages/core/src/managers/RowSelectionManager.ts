import TableRow from "../types/TableRow";
import Row from "../types/Row";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import type { RowSelectionMode } from "../types/RowSelectionMode";
import { rowIdToString } from "../utils/rowUtils";
import {
  areAllRowsSelected,
  setRowSelected,
  selectAllRows,
  deselectAllRows,
  getSelectedRows,
  getSelectedRowCount,
  isRowSelected as utilIsRowSelected,
  findRowById,
  selectRowRange,
  toggleRowSelection,
} from "../utils/rowSelectionUtils";

export interface RowSelectionManagerConfig {
  tableRows: TableRow[];
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void;
  enableRowSelection?: boolean;
  rowSelectionMode?: RowSelectionMode;
  selectRowOnClick?: boolean;
  showRowSelectionColumn?: boolean;
  /** When true, Arrow/Home/End/Ctrl+A are left to SelectionManager; Space still toggles rows. */
  selectableCells?: boolean;
  /** Table root element used to decide whether keyboard events apply. */
  tableRoot?: HTMLElement | null;
}

export interface RowSelectionManagerState {
  selectedRows: Set<string>;
  selectedRowCount: number;
  selectedRowsData: Row[];
  /** Keyboard focus / navigation target row id */
  activeRowId: string | null;
}

type StateChangeCallback = (state: RowSelectionManagerState) => void;

export class RowSelectionManager {
  private config: RowSelectionManagerConfig;
  private state: RowSelectionManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  /** Anchor for Shift+range selection */
  private anchorRowId: string | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(config: RowSelectionManagerConfig) {
    this.config = {
      rowSelectionMode: "multiple",
      selectRowOnClick: false,
      showRowSelectionColumn: true,
      selectableCells: false,
      ...config,
    };

    this.state = {
      selectedRows: new Set<string>(),
      selectedRowCount: 0,
      selectedRowsData: [],
      activeRowId: null,
    };

    this.setupKeyboardNavigation();
  }

  updateConfig(config: Partial<RowSelectionManagerConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.tableRows) {
      this.updateDerivedState();
    }
  }

  private getMode(): RowSelectionMode {
    return this.config.rowSelectionMode ?? "multiple";
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

  private fireChange(rowId: string, isSelected: boolean, selectedRows: Set<string>): void {
    if (!this.config.onRowSelectionChange) return;
    const tableRow = this.config.tableRows.find((tr) => rowIdToString(tr.rowId) === rowId);
    if (tableRow) {
      this.config.onRowSelectionChange({
        row: tableRow.row,
        isSelected,
        selectedRows,
      });
    }
  }

  private applySelection(newSelectedRows: Set<string>): void {
    const prev = this.state.selectedRows;
    this.state = {
      ...this.state,
      selectedRows: newSelectedRows,
    };
    this.updateDerivedState();

    if (this.config.onRowSelectionChange) {
      // Notify for every id whose membership changed (covers single-mode
      // replace, where the previously selected row is cleared implicitly).
      const allIds = new Set([...prev, ...newSelectedRows]);
      allIds.forEach((id) => {
        const was = prev.has(id);
        const now = newSelectedRows.has(id);
        if (was !== now) {
          this.fireChange(id, now, newSelectedRows);
        }
      });
    }

    this.notifySubscribers();
  }

  isRowSelected(rowId: string): boolean {
    if (!this.config.enableRowSelection) return false;
    return utilIsRowSelected(rowId, this.state.selectedRows);
  }

  areAllRowsSelected(): boolean {
    if (!this.config.enableRowSelection) return false;
    if (this.getMode() === "single") return false;
    return areAllRowsSelected(this.config.tableRows, this.state.selectedRows);
  }

  getSelectedRows(): Set<string> {
    return this.state.selectedRows;
  }

  getSelectedRowCount(): number {
    return this.state.selectedRowCount;
  }

  getSelectedRowsData(): Row[] {
    return this.state.selectedRowsData;
  }

  getRow(rowId: string): Row | undefined {
    return findRowById(this.config.tableRows, rowId);
  }

  getActiveRowId(): string | null {
    return this.state.activeRowId;
  }

  setActiveRowId(rowId: string | null): void {
    if (this.state.activeRowId === rowId) return;
    this.state = { ...this.state, activeRowId: rowId };
    this.notifySubscribers();
  }

  setSelectedRows(selectedRows: Set<string>): void {
    this.state = {
      ...this.state,
      selectedRows,
    };
    this.updateDerivedState();
    this.notifySubscribers();
  }

  /**
   * Set a row's selected state (does not toggle). Respects single/multiple mode.
   */
  handleRowSelect(rowId: string, isSelected: boolean): void {
    if (!this.config.enableRowSelection) return;

    const mode = this.getMode();
    const newSelectedRows = setRowSelected(rowId, isSelected, this.state.selectedRows, mode);

    // No-op if unchanged
    if (
      newSelectedRows.size === this.state.selectedRows.size &&
      [...newSelectedRows].every((id) => this.state.selectedRows.has(id))
    ) {
      return;
    }

    this.anchorRowId = rowId;
    this.state = { ...this.state, activeRowId: rowId };
    this.applySelection(newSelectedRows);
  }

  selectRow(rowId: string): void {
    this.handleRowSelect(rowId, true);
  }

  deselectRow(rowId: string): void {
    this.handleRowSelect(rowId, false);
  }

  handleSelectAll(isSelected: boolean): void {
    if (!this.config.enableRowSelection) return;
    if (this.getMode() === "single") return;

    let newSelectedRows: Set<string>;

    if (isSelected) {
      newSelectedRows = selectAllRows(this.config.tableRows);
    } else {
      newSelectedRows = deselectAllRows();
    }

    this.applySelection(newSelectedRows);
  }

  handleToggleRow(rowId: string): void {
    if (!this.config.enableRowSelection) return;

    const mode = this.getMode();
    if (mode === "single") {
      // Single mode: select this row (replace). Clicking an already-selected row keeps it.
      this.handleRowSelect(rowId, true);
      return;
    }

    const wasSelected = this.isRowSelected(rowId);
    this.handleRowSelect(rowId, !wasSelected);
  }

  /**
   * Click-to-select: multiple toggles; single replaces.
   */
  handleRowClickSelect(rowId: string): void {
    if (!this.config.enableRowSelection || !this.config.selectRowOnClick) return;
    this.handleToggleRow(rowId);
  }

  clearSelection(): void {
    if (!this.config.enableRowSelection) return;
    if (this.state.selectedRows.size === 0) return;
    this.applySelection(new Set());
  }

  getState(): RowSelectionManagerState {
    return this.state;
  }

  private setupKeyboardNavigation(): void {
    this.keydownHandler = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.keydownHandler);
  }

  private isEventInsideTable(event: KeyboardEvent): boolean {
    const root = this.config.tableRoot;
    if (!root) return false;
    const target = event.target;
    if (!(target instanceof Node)) return false;
    return root.contains(target);
  }

  private isTypingInFormField(): boolean {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement ||
      activeElement?.getAttribute("contenteditable") === "true"
    );
  }

  private findRowIndex(rowId: string | null): number {
    if (!rowId) return -1;
    return this.config.tableRows.findIndex((tr) => rowIdToString(tr.rowId) === rowId);
  }

  private resolveActiveRowId(): string | null {
    if (this.state.activeRowId) {
      const idx = this.findRowIndex(this.state.activeRowId);
      if (idx !== -1) return this.state.activeRowId;
    }
    // Fall back to first selected, then first visible row
    for (const id of this.state.selectedRows) {
      if (this.findRowIndex(id) !== -1) return id;
    }
    const first = this.config.tableRows[0];
    return first ? rowIdToString(first.rowId) : null;
  }

  private moveActiveRow(targetIndex: number, withShift: boolean): void {
    const rows = this.config.tableRows;
    if (rows.length === 0) return;
    const clamped = Math.max(0, Math.min(rows.length - 1, targetIndex));
    const targetId = rowIdToString(rows[clamped].rowId);
    const mode = this.getMode();

    this.state = { ...this.state, activeRowId: targetId };

    if (withShift && mode === "multiple") {
      const anchorId = this.anchorRowId ?? targetId;
      const anchorIndex = this.findRowIndex(anchorId);
      const start = anchorIndex === -1 ? clamped : anchorIndex;
      // Range replaces from anchor: keep selection outside? Plan says expand/collapse
      // from anchor — use range as the selection set for the contiguous block,
      // preserving selections outside the previous range is complex; select the range.
      const newSelected = selectRowRange(rows, start, clamped);
      this.applySelection(newSelected);
      return;
    }

    this.anchorRowId = targetId;

    if (mode === "single") {
      this.applySelection(new Set([targetId]));
    } else {
      this.notifySubscribers();
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.config.enableRowSelection) return;
    if (!this.isEventInsideTable(event)) return;
    if (this.isTypingInFormField()) return;

    const ownsNavigation = !this.config.selectableCells;
    const key = event.key;

    // Space: always toggle active/focused row (even when cell selection owns arrows)
    if (key === " " || key === "Spacebar") {
      // Don't steal Space from native checkbox inputs (they stopPropagation already,
      // but guard anyway).
      if (event.target instanceof HTMLInputElement && event.target.type === "checkbox") {
        return;
      }
      event.preventDefault();
      const activeId = this.resolveActiveRowId();
      if (activeId) {
        // When selectableCells is on, prefer the focused cell's row if available
        const focusedCell = document.activeElement?.closest?.("[data-row-id]") as HTMLElement | null;
        const focusedRowId = focusedCell?.getAttribute("data-row-id") ?? activeId;
        this.handleToggleRow(focusedRowId);
        this.state = { ...this.state, activeRowId: focusedRowId };
      }
      return;
    }

    if (!ownsNavigation) return;

    if ((event.ctrlKey || event.metaKey) && key.toLowerCase() === "a") {
      if (this.getMode() === "multiple") {
        event.preventDefault();
        this.handleSelectAll(true);
      }
      return;
    }

    const activeId = this.resolveActiveRowId();
    const currentIndex = this.findRowIndex(activeId);
    const lastIndex = this.config.tableRows.length - 1;
    if (lastIndex < 0) return;

    const withShift = event.shiftKey;

    if (key === "ArrowUp") {
      event.preventDefault();
      const next = currentIndex <= 0 ? 0 : currentIndex - 1;
      this.moveActiveRow(next, withShift);
    } else if (key === "ArrowDown") {
      event.preventDefault();
      const next = currentIndex < 0 ? 0 : Math.min(lastIndex, currentIndex + 1);
      this.moveActiveRow(next, withShift);
    } else if (key === "Home") {
      event.preventDefault();
      this.moveActiveRow(0, withShift);
    } else if (key === "End") {
      event.preventDefault();
      this.moveActiveRow(lastIndex, withShift);
    }
  }

  destroy(): void {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
    this.subscribers.clear();
  }
}
