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

// Define the interface for cell registry entries
export interface CellRegistryEntry {
  updateContent: (newValue: CellValue) => void;
}

// Define the interface for header cell registry entries
export interface HeaderRegistryEntry {
  setEditing: (isEditing: boolean) => void;
}

/**
 * Static Context - Contains stable values that rarely/never change
 * Components using this context won't re-render when dynamic state changes
 */
interface TableStaticContextType {
  // Configuration (set once, rarely changes)
  allowAnimations?: boolean;
  autoExpandColumns?: boolean;
  canExpandRowGroup?: (row: Row) => boolean;
  cellUpdateFlash?: boolean;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  copyHeadersToClipboard: boolean;
  editColumns?: boolean;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  includeHeadersInCSVExport: boolean;
  rowHeight: number;
  headerHeight: number;
  rowIdAccessor: Accessor;
  scrollbarWidth: number;
  selectableColumns: boolean;
  shouldPaginate: boolean;
  theme: Theme;
  useHoverRowBackground: boolean;
  useOddColumnBackground: boolean;
  useOddEvenRowBackground: boolean;

  // Refs (stable references)
  capturedPositionsRef: MutableRefObject<Map<string, DOMRect>>;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  headerContainerRef: RefObject<HTMLDivElement>;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  tableBodyContainerRef: RefObject<HTMLDivElement>;

  // Registries (stable references)
  cellRegistry?: Map<string, CellRegistryEntry>;
  headerRegistry?: Map<string, HeaderRegistryEntry>;

  // Stable callback functions (created once with useCallback)
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearAllFilters: () => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  handleRowSelect?: (rowId: string, isSelected: boolean) => void;
  handleSelectAll?: (isSelected: boolean) => void;
  handleToggleRow?: (rowId: string) => void;
  isCopyFlashing: (cell: Cell) => boolean;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isRowSelected?: (rowId: string) => boolean;
  isSelected: (cell: Cell) => boolean;
  isWarningFlashing: (cell: Cell) => boolean;
  onCellEdit?: (props: any) => void;
  onCellClick?: (props: CellClickProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onLoadMore?: () => void;
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  clearSelection?: () => void;
  areAllRowsSelected?: () => boolean;

  // State setters (stable references)
  setActiveHeaderDropdown?: Dispatch<SetStateAction<HeaderObject | null>>;
  setCollapsedHeaders: Dispatch<SetStateAction<Set<Accessor>>>;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setInitialFocusedCell: Dispatch<SetStateAction<Cell | null>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  setIsScrolling: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  setSelectedRows?: Dispatch<SetStateAction<Set<string>>>;
  setUnexpandedRows: Dispatch<SetStateAction<Set<string>>>;
  setRowStateMap: Dispatch<SetStateAction<Map<string | number, RowState>>>;

  // Arrays/Objects that should be stable (memoized)
  headers: HeaderObject[];
  rowButtons?: RowButton[];
  rowGrouping?: Accessor[];
  rows: Row[];

  // Icons (stable ReactNodes)
  expandIcon?: ReactNode;
  filterIcon?: ReactNode;
  headerCollapseIcon?: ReactNode;
  headerExpandIcon?: ReactNode;
  nextIcon: ReactNode;
  prevIcon: ReactNode;
  sortDownIcon: ReactNode;
  sortUpIcon: ReactNode;

  // Renderers (stable functions/components)
  loadingStateRenderer?: LoadingStateRenderer;
  errorStateRenderer?: ErrorStateRenderer;
  emptyStateRenderer?: EmptyStateRenderer;
  tableEmptyStateRenderer?: ReactNode;
  headerDropdown?: HeaderDropdown;
}

/**
 * Dynamic Context - Contains values that change frequently
 * Only components that need these values should subscribe to this context
 */
interface TableDynamicContextType {
  // Frequently changing state
  activeHeaderDropdown?: HeaderObject | null;
  collapsedHeaders: Set<Accessor>;
  expandAll: boolean;
  filters: TableFilterState;
  isAnimating: boolean;
  isLoading?: boolean;
  isResizing: boolean;
  isScrolling: boolean;
  rowStateMap: Map<string | number, RowState>;
  selectedColumns: Set<number>;
  columnsWithSelectedCells: Set<number>;
  rowsWithSelectedCells: Set<string>;
  selectedRows?: Set<string>;
  selectedRowCount?: number;
  selectedRowsData?: any[];
  tableRows: TableRow[];
  unexpandedRows: Set<string>;
}

export const TableStaticContext = createContext<TableStaticContextType | undefined>(undefined);
export const TableDynamicContext = createContext<TableDynamicContextType | undefined>(undefined);

export const TableStaticProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: TableStaticContextType;
}) => {
  return <TableStaticContext.Provider value={value}>{children}</TableStaticContext.Provider>;
};

export const TableDynamicProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: TableDynamicContextType;
}) => {
  return <TableDynamicContext.Provider value={value}>{children}</TableDynamicContext.Provider>;
};

export const useTableStaticContext = () => {
  const context = useContext(TableStaticContext);
  if (context === undefined) {
    throw new Error("useTableStaticContext must be used within a TableStaticProvider");
  }
  return context;
};

export const useTableDynamicContext = () => {
  const context = useContext(TableDynamicContext);
  if (context === undefined) {
    throw new Error("useTableDynamicContext must be used within a TableDynamicProvider");
  }
  return context;
};

// Keep the original combined context and hook for backward compatibility
// This allows gradual migration of components
export interface TableContextType extends TableStaticContextType, TableDynamicContextType {}

export const useTableContext = (): TableContextType => {
  const staticContext = useTableStaticContext();
  const dynamicContext = useTableDynamicContext();
  return { ...staticContext, ...dynamicContext };
};
