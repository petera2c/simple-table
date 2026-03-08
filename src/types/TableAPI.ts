import UpdateDataProps from "./UpdateCellProps";
import HeaderObject, { Accessor } from "./HeaderObject";
import TableRow from "./TableRow";
import SortColumn, { SortDirection } from "./SortColumn";
import { TableFilterState, FilterCondition } from "./FilterTypes";
import Cell from "./Cell";

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
  setQuickFilter: (text: string) => void;
  getSelectedCells: () => Set<string>;
  clearSelection: () => void;
  selectCell: (cell: Cell) => void;
  selectCellRange: (startCell: Cell, endCell: Cell) => void;
};
