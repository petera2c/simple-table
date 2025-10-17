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
  cellRegistry?: Map<string, CellRegistryEntry>;
  cellUpdateFlash?: boolean;
  clearSelection?: () => void;
  collapsedHeaders: Set<Accessor>;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  editColumns?: boolean;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  expandIcon?: ReactNode;
  filters: TableFilterState;
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
  headerCollapseIcon?: ReactNode;
  headerContainerRef: RefObject<HTMLDivElement>;
  headerDropdown?: HeaderDropdown;
  headerExpandIcon?: ReactNode;
  headerRegistry?: Map<string, HeaderRegistryEntry>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isAnimating: boolean;
  isCopyFlashing: (cell: Cell) => boolean;
  isInitialFocusedCell: (cell: Cell) => boolean;
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
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onLoadMore?: () => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  prevIcon: ReactNode;
  rowButtons?: RowButton[];
  rowGrouping?: Accessor[];
  rowHeight: number;
  headerHeight: number;
  rowIdAccessor: Accessor;
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
  setUnexpandedRows: Dispatch<SetStateAction<Set<string>>>;
  shouldPaginate: boolean;
  sortDownIcon: ReactNode;
  sortUpIcon: ReactNode;
  tableBodyContainerRef: RefObject<HTMLDivElement>;
  tableRows: TableRow[];
  theme: Theme;
  unexpandedRows: Set<string>;
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
