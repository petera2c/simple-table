import UpdateDataProps from "./UpdateCellProps";
import HeaderObject, { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";
import Row from "./Row";
import SortColumn, { SortDirection } from "./SortColumn";
import { TableFilterState, FilterCondition } from "./FilterTypes";
import Cell from "./Cell";
import type { PinnedSectionsState } from "./PinnedSectionsState";
import type { PivotConfig } from "./PivotTypes";

export interface SetHeaderRenameProps {
  accessor: Accessor;
}

export interface ExportToCSVProps {
  filename?: string;
}

export type TableAPI = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
  getVisibleRows: () => TableRow[];
  getAllRows: () => TableRow[];
  getHeaders: () => HeaderObject[];
  exportToCSV: (props?: ExportToCSVProps) => void;
  getSortState: () => SortColumn | null;
  applySortState: (props?: { accessor: Accessor; direction?: SortDirection }) => Promise<void>;
  /** Ordered root accessors per pin section (left, main/unpinned, right) */
  getPinnedState: () => PinnedSectionsState;
  /** Reorder root columns and set pinned flags; lists must include every root accessor exactly once. Essential order is clamped per section. */
  applyPinnedState: (state: PinnedSectionsState) => Promise<void>;
  getFilterState: () => TableFilterState;
  applyFilter: (filter: FilterCondition) => Promise<void>;
  clearFilter: (accessor: Accessor) => Promise<void>;
  clearAllFilters: () => Promise<void>;
  getCurrentPage: () => number;
  getTotalPages: () => number;
  setPage: (page: number) => Promise<void>;
  expandAll: () => void;
  collapseAll: () => void;
  expandDepth: (depth: number) => void;
  collapseDepth: (depth: number) => void;
  toggleDepth: (depth: number) => void;
  setExpandedDepths: (depths: Set<number>) => void;
  getExpandedDepths: () => Set<number>;
  getGroupingProperty: (depth: number) => Accessor | undefined;
  getGroupingDepth: (property: Accessor) => number;
  toggleColumnEditor: (open?: boolean) => void;
  applyColumnVisibility: (visibility: { [accessor: string]: boolean }) => Promise<void>;
  /**
   * Reset columns to the configured definitions: default order, widths, and
   * visibility. All columns become visible again except those explicitly
   * defined with `hide: true` in `defaultHeaders`, regardless of any runtime
   * visibility changes made since mount.
   */
  resetColumns: () => void;
  setQuickFilter: (text: string) => void;
  getSelectedCells: () => Set<string>;
  clearSelection: () => void;
  selectCell: (cell: Cell) => void;
  selectCellRange: (startCell: Cell, endCell: Cell) => void;
  /** Selected row IDs when row selection is enabled. */
  getSelectedRows: () => Set<string>;
  /** Row data objects for currently selected rows (resolved from visible/current table rows). */
  getSelectedRowsData: () => Row[];
  /** Look up a row by its string row id in the current table rows. */
  getRow: (rowId: string) => Row | undefined;
  selectRow: (rowId: string) => void;
  deselectRow: (rowId: string) => void;
  toggleRowSelection: (rowId: string) => void;
  /** Clears row selection only (does not clear cell selection). */
  clearRowSelection: () => void;
  /** Enable, update, or clear matrix pivot (`null` disables). */
  setPivot: (config: PivotConfig | null) => void;
  getPivot: () => PivotConfig | null;
  /** Generated headers while pivot is active; otherwise current headers. */
  getPivotHeaders: () => HeaderObject[];
  /** Post-pivot rows (pre-flatten) while pivot is active; otherwise source rows. */
  getPivotedRows: () => Row[];
};
