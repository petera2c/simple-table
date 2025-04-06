import { Dispatch, RefObject, SetStateAction } from "react";
import Cell from "./Cell";
import HeaderObject from "./HeaderObject";
import Row from "./Row";
import VisibleRow from "./VisibleRow";

interface TableBodyProps {
  allowAnimations: boolean;
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  flattenedRows: Row[];
  getBorderClass: (cell: Cell) => string;
  handleMouseDown: (cell: Cell) => void;
  handleMouseOver: (cell: Cell) => void;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headers: HeaderObject[];
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isInitialFocusedCell: (cell: Cell) => boolean;
  isSelected: (cell: Cell) => boolean;
  isWidthDragging: boolean;
  mainBodyRef: RefObject<HTMLDivElement | null>;
  mainTemplateColumns: string;
  onCellEdit?: (props: any) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  pinnedRightTemplateColumns: string;
  rowHeight: number;
  scrollbarWidth: number;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  shouldPaginate: boolean;
  setScrollTop: Dispatch<SetStateAction<number>>;
  tableBodyContainerRef: RefObject<HTMLDivElement | null>;
  visibleRows: VisibleRow[];
}

export default TableBodyProps;
