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

// Define the interface for cell registry entries
export interface CellRegistryEntry {
  updateContent: (newValue: CellValue) => void;
}

interface TableContextType {
  // Stable values that don't change frequently
  allowAnimations?: boolean;
  cellRegistry?: Map<string, CellRegistryEntry>;
  cellUpdateFlash?: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  editColumns?: boolean;
  expandIcon?: ReactNode;
  filters: TableFilterState;
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearAllFilters: () => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  headerContainerRef: RefObject<HTMLDivElement>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isAnimating: boolean;
  isCopyFlashing: (cell: Cell) => boolean;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isResizing: boolean;
  isScrolling: boolean;
  isSelected: (cell: Cell) => boolean;
  isWarningFlashing: (cell: Cell) => boolean;
  mainBodyRef: RefObject<HTMLDivElement>;
  nextIcon: ReactNode;
  onCellEdit?: (props: any) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onLoadMore?: () => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
  prevIcon: ReactNode;
  rowGrouping?: Accessor[];
  rowHeight: number;
  rowIdAccessor: Accessor;
  scrollbarWidth: number;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  selectableColumns: boolean;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setInitialFocusedCell: Dispatch<SetStateAction<Cell | null>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  setIsScrolling: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
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
