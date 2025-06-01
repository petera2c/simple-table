import { ReactNode, RefObject, createContext, useContext, Dispatch, SetStateAction } from "react";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import TableRow from "../types/TableRow";
import Cell from "../types/Cell";
import HeaderObject from "../types/HeaderObject";
import OnSortProps from "../types/OnSortProps";
import Theme from "../types/Theme";

// Define the interface for cell registry entries
export interface CellRegistryEntry {
  updateContent: (newValue: any) => void;
}

interface TableContextType {
  // Stable values that don't change frequently
  allowAnimations?: boolean;
  cellRegistry?: Map<string, CellRegistryEntry>;
  cellUpdateFlash?: boolean;
  collapseIcon?: ReactNode;
  columnReordering: boolean;
  columnResizing: boolean;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  editColumns?: boolean;
  expandIcon?: ReactNode;
  expandedRows: Set<string>;
  filters: TableFilterState;
  tableRows: TableRow[];
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearFilter: (accessor: string) => void;
  handleClearAllFilters: () => void;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isSelected: (cell: Cell) => boolean;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  nextIcon: ReactNode;
  onCellEdit?: (props: any) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  prevIcon: ReactNode;
  rowGrouping?: string[];
  rowHeight: number;
  rowIdAccessor: string;
  scrollbarWidth: number;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  selectableColumns: boolean;
  setExpandedRows: Dispatch<SetStateAction<Set<string>>>;
  setInitialFocusedCell: Dispatch<SetStateAction<Cell | null>>;
  setMainBodyWidth: Dispatch<SetStateAction<number>>;
  setPinnedLeftWidth: Dispatch<SetStateAction<number>>;
  setPinnedRightWidth: Dispatch<SetStateAction<number>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  shouldPaginate: boolean;
  sortDownIcon: ReactNode;
  sortUpIcon: ReactNode;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
  theme: Theme;
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
