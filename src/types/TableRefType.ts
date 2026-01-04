import UpdateDataProps from "./UpdateCellProps";
import HeaderObject, { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";
import SortColumn, { SortDirection } from "./SortColumn";
import { TableFilterState, FilterCondition } from "./FilterTypes";

interface SetHeaderRenameProps {
  accessor: Accessor;
}

interface ExportToCSVProps {
  filename?: string;
}

type TableRefType = {
  updateData: (props: UpdateDataProps) => void;
  setHeaderRename: (props: SetHeaderRenameProps) => void;
  /** Returns the currently visible rows (e.g., current page when paginated) */
  getVisibleRows: () => TableRow[];
  /** Returns all rows (flattened, including nested/grouped rows) */
  getAllRows: () => TableRow[];
  /** Returns the table's header/column definitions */
  getHeaders: () => HeaderObject[];
  exportToCSV: (props?: ExportToCSVProps) => void;
  /** Returns the current sort state */
  getSortState: () => SortColumn | null;
  /** Applies a new sort state to the table. Pass null to clear sort. Direction defaults to cycling through asc -> desc -> null */
  applySortState: (props?: { accessor: Accessor; direction?: SortDirection }) => Promise<void>;
  /** Returns the current filter state */
  getFilterState: () => TableFilterState;
  /** Applies a filter to a specific column */
  applyFilter: (filter: FilterCondition) => Promise<void>;
  /** Clears a filter for a specific column */
  clearFilter: (accessor: Accessor) => Promise<void>;
  /** Clears all filters */
  clearAllFilters: () => Promise<void>;
  /** Returns the current page number (1-indexed) */
  getCurrentPage: () => number;
  /** Sets the current page (1-indexed) */
  setPage: (page: number) => void;
  /** Expand all rows at all depths */
  expandAll: () => void;
  /** Collapse all rows at all depths */
  collapseAll: () => void;
  /** Expand all rows at a specific depth (0-indexed) */
  expandDepth: (depth: number) => void;
  /** Collapse all rows at a specific depth (0-indexed) */
  collapseDepth: (depth: number) => void;
  /** Toggle expansion for a specific depth */
  toggleDepth: (depth: number) => void;
  /** Set which depths are expanded (replaces current state) */
  setExpandedDepths: (depths: Set<number>) => void;
  /** Get currently expanded depths */
  getExpandedDepths: () => Set<number>;
  /** Get the grouping property name for a depth index */
  getGroupingProperty: (depth: number) => Accessor | undefined;
  /** Get the depth index for a grouping property name */
  getGroupingDepth: (property: Accessor) => number;
};

export default TableRefType;
export type { SetHeaderRenameProps, ExportToCSVProps };
