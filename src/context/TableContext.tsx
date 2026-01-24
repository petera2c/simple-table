import {
  ReactNode,
  RefObject,
  MutableRefObject,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { ColumnVisibilityState } from "../types/ColumnVisibilityTypes";
import TableRow from "../types/TableRow";
import Cell from "../types/Cell";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import OnSortProps from "../types/OnSortProps";
import Theme from "../types/Theme";
import CellValue from "../types/CellValue";
import CellClickProps from "../types/CellClickProps";
import { RowButton } from "../types/RowButton";
import { HeaderDropdown } from "../types/HeaderDropdownProps";
import OnRowGroupExpandProps from "../types/OnRowGroupExpandProps";
import RowState from "../types/RowState";
import Row from "../types/Row";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
} from "../types/RowStateRendererProps";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

// Define the interface for cell registry entries
export interface CellRegistryEntry {
  updateContent: (newValue: CellValue) => void;
}

// Define the interface for header cell registry entries
export interface HeaderRegistryEntry {
  setEditing: (isEditing: boolean) => void;
}

interface TableContextType {
  // Stable values that don't change frequently
  activeHeaderDropdown?: HeaderObject | null;
  allowAnimations?: boolean;
  areAllRowsSelected?: () => boolean;
  autoExpandColumns?: boolean;
  canExpandRowGroup?: (row: Row) => boolean;
  cellRegistry?: Map<string, CellRegistryEntry>;
  cellUpdateFlash?: boolean;
  clearSelection?: () => void;
  collapsedHeaders: Set<Accessor>;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  copyHeadersToClipboard: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  editColumns?: boolean;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  expandedDepths: Set<number>;
  expandIcon?: ReactNode;
  filterIcon?: ReactNode;
  filters: TableFilterState;
  includeHeadersInCSVExport: boolean;
  loadingStateRenderer?: LoadingStateRenderer;
  errorStateRenderer?: ErrorStateRenderer;
  emptyStateRenderer?: EmptyStateRenderer;
  forceUpdate: () => void;
  rowStateMap: Map<string | number, RowState>;
  setRowStateMap: Dispatch<SetStateAction<Map<string | number, RowState>>>;
  rows: Row[];
  getBorderClass: (cell: Cell) => string;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearAllFilters: () => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  handleRowSelect?: (rowId: string, isSelected: boolean) => void;
  handleSelectAll?: (isSelected: boolean) => void;
  handleToggleRow?: (rowId: string) => void;
  headerCollapseIcon?: ReactNode;
  headerContainerRef: RefObject<HTMLDivElement>;
  headerDropdown?: HeaderDropdown;
  headerExpandIcon?: ReactNode;
  headerRegistry?: Map<string, HeaderRegistryEntry>;
  headers: HeaderObject[];
  heightOffsets?: HeightOffsets;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  maxHeaderDepth: number;
  isAnimating: boolean;
  isCopyFlashing: (cell: Cell) => boolean;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isLoading?: boolean;
  isResizing: boolean;
  isRowSelected?: (rowId: string) => boolean;
  isScrolling: boolean;
  isSelected: (cell: Cell) => boolean;
  isWarningFlashing: (cell: Cell) => boolean;
  mainBodyRef: RefObject<HTMLDivElement>;
  nextIcon: ReactNode;
  onCellEdit?: (props: any) => void;
  onCellClick?: (props: CellClickProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onLoadMore?: () => void;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  prevIcon: ReactNode;
  rowButtons?: RowButton[];
  rowGrouping?: Accessor[];
  rowHeight: number;
  headerHeight: number;
  scrollbarWidth: number;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  selectableColumns: boolean;
  selectedColumns: Set<number>;
  columnsWithSelectedCells: Set<number>;
  rowsWithSelectedCells: Set<string>;
  selectedRows?: Set<string>;
  selectedRowCount?: number;
  selectedRowsData?: any[];
  setActiveHeaderDropdown?: Dispatch<SetStateAction<HeaderObject | null>>;
  setCollapsedHeaders: Dispatch<SetStateAction<Set<Accessor>>>;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setInitialFocusedCell: Dispatch<SetStateAction<Cell | null>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  setIsScrolling: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  setSelectedRows?: Dispatch<SetStateAction<Set<string>>>;
  setExpandedDepths: Dispatch<SetStateAction<Set<number>>>;
  setExpandedRows: Dispatch<SetStateAction<Map<string, number>>>;
  setCollapsedRows: Dispatch<SetStateAction<Map<string, number>>>;
  shouldPaginate: boolean;
  sortDownIcon: ReactNode;
  sortUpIcon: ReactNode;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
  tableEmptyStateRenderer?: ReactNode;
  tableRows: TableRow[];
  theme: Theme;
  customTheme: CustomTheme;
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  useHoverRowBackground: boolean;
  useOddColumnBackground: boolean;
  useOddEvenRowBackground: boolean;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: TableContextType;
}) => {
  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
