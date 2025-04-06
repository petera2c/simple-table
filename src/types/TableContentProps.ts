import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import HeaderObject from "./HeaderObject";
import Row from "./Row";
import SortConfig from "./SortConfig";
import Cell from "./Cell";
import VisibleRow from "./VisibleRow";
import OnSortProps from "./OnSortProps";

// Common properties to omit from both TableHeaderProps and TableBodyProps
type OmittedTableProps =
  | "centerHeaderRef"
  | "headerContainerRef"
  | "mainTemplateColumns"
  | "pinnedLeftColumns"
  | "pinnedLeftHeaderRef"
  | "pinnedLeftTemplateColumns"
  | "pinnedRightColumns"
  | "pinnedRightHeaderRef"
  | "pinnedRightTemplateColumns"
  | "headers";

type TableContentProps = {
  allowAnimations?: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  currentRows: Row[];
  draggedHeaderRef: RefObject<HeaderObject | null>;
  editColumns?: boolean;
  flattenedRows: Row[];
  forceUpdate: () => void;
  getBorderClass: (cell: Cell) => string;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isSelected: (cell: Cell) => boolean;
  isWidthDragging: boolean;
  lastSelectedColumnIndex?: number | null;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  onCellEdit?: (props: any) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  scrollbarWidth: number;
  selectableColumns: boolean;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  shouldPaginate: boolean;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
  visibleRows: VisibleRow[];
};

export default TableContentProps;
