import TableRow from "../types/TableRow";
import Row from "../types/Row";
import RowSelectionChangeProps from "../types/RowSelectionChangeProps";
import type { RowSelectionMode } from "../types/RowSelectionMode";
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
export declare class RowSelectionManager {
    private config;
    private state;
    private subscribers;
    /** Anchor for Shift+range selection */
    private anchorRowId;
    private keydownHandler;
    constructor(config: RowSelectionManagerConfig);
    updateConfig(config: Partial<RowSelectionManagerConfig>): void;
    private getMode;
    private updateDerivedState;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    private fireChange;
    private applySelection;
    isRowSelected(rowId: string): boolean;
    areAllRowsSelected(): boolean;
    getSelectedRows(): Set<string>;
    getSelectedRowCount(): number;
    getSelectedRowsData(): Row[];
    getRow(rowId: string): Row | undefined;
    getActiveRowId(): string | null;
    setActiveRowId(rowId: string | null): void;
    setSelectedRows(selectedRows: Set<string>): void;
    /**
     * Set a row's selected state (does not toggle). Respects single/multiple mode.
     */
    handleRowSelect(rowId: string, isSelected: boolean): void;
    selectRow(rowId: string): void;
    deselectRow(rowId: string): void;
    handleSelectAll(isSelected: boolean): void;
    handleToggleRow(rowId: string): void;
    /**
     * Click-to-select: multiple toggles; single replaces.
     */
    handleRowClickSelect(rowId: string): void;
    clearSelection(): void;
    getState(): RowSelectionManagerState;
    private setupKeyboardNavigation;
    private isEventInsideTable;
    private isTypingInFormField;
    private findRowIndex;
    private resolveActiveRowId;
    private moveActiveRow;
    private handleKeyDown;
    destroy(): void;
}
export {};
