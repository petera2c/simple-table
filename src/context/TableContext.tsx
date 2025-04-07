import { createContext, useContext, ReactNode, RefObject, Dispatch, SetStateAction } from "react";
import HeaderObject from "../types/HeaderObject";
import OnSortProps from "../types/OnSortProps";
import Cell from "../types/Cell";

interface TableContextType {
  // Stable values that don't change frequently
  allowAnimations?: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  editColumns?: boolean;
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isSelected: (cell: Cell) => boolean;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  onCellEdit?: (props: any) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  scrollbarWidth: number;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  selectableColumns: boolean;
  setInitialFocusedCell: Dispatch<SetStateAction<Cell | null>>;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  shouldPaginate: boolean;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
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
