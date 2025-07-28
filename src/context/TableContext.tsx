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
import HeaderObject, { Accessor, AggregatedRow } from "../types/HeaderObject";
import OnSortProps from "../types/OnSortProps";
import Theme from "../types/Theme";
import CellClickProps from "../types/CellClickProps";
import RowGrouping from "../types/RowGrouping";

// Define the interface for cell registry entries
export interface CellRegistryEntry {
  updateContent: (newValue: any) => void;
}

interface TableContextType<T> {
  // Stable values that don't change frequently
  allowAnimations?: boolean;
  areAllRowsSelected?: () => boolean;
  cellRegistry?: Map<string, CellRegistryEntry>;
  cellUpdateFlash?: boolean;
  clearSelection?: () => void;
  columnReordering: boolean;
  columnResizing: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject<T> | null>;
  editColumns?: boolean;
  enableRowSelection?: boolean;
  expandIcon?: ReactNode;
  filters: TableFilterState<T>;
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleApplyFilter: (filter: FilterCondition<T>) => void;
  handleClearAllFilters: () => void;
  handleClearFilter: (id: string) => void;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  handleRowSelect?: (rowId: string, isSelected: boolean) => void;
  handleSelectAll?: (isSelected: boolean) => void;
  handleToggleRow?: (rowId: string) => void;
  headerContainerRef: RefObject<HTMLDivElement>;
  headers: HeaderObject<AggregatedRow<T>>[];
  hoveredHeaderRef: MutableRefObject<HeaderObject<AggregatedRow<T>> | null>;
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
  onCellClick?: (props: CellClickProps<T>) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject<T>[]) => void;
  onLoadMore?: () => void;
  onSort: OnSortProps<T>;
  onTableHeaderDragEnd: (newHeaders: HeaderObject<T>[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  prevIcon: ReactNode;
  rowGrouping?: RowGrouping;
  rowHeight: number;
  rowIdAccessor: Accessor<T>;
  scrollbarWidth: number;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  selectableColumns: boolean;
  selectedRows?: Set<string>;
  selectedRowCount?: number;
  selectedRowsData?: any[];
  setHeaders: Dispatch<SetStateAction<HeaderObject<T>[]>>;
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
  tableRows: TableRow<T>[];
  theme: Theme;
  unexpandedRows: Set<string>;
  useHoverRowBackground: boolean;
  useOddColumnBackground: boolean;
  useOddEvenRowBackground: boolean;
}

// Use any for the context creation since React contexts can't be truly generic
export const TableContext = createContext<TableContextType<any> | undefined>(undefined);

export const TableProvider = <T,>({
  children,
  value,
}: {
  children: ReactNode;
  value: TableContextType<T>;
}) => {
  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTableContext = <T,>(): TableContextType<T> => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  // This is safe because TableProvider ensures the value matches TableContextType<T>
  // at runtime, and the generic T is enforced at compile time at the usage site
  return context;
};
