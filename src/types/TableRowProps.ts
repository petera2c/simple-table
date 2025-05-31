import { RefObject } from "react";
import CellChangeProps from "./CellChangeProps";
import HeaderObject from "./HeaderObject";
import Row from "./Row";
import Cell from "./Cell";
type TableRowProps = {
  allowAnimations: boolean;
  currentRows: { [key: string]: any }[];
  draggedHeaderRef: RefObject<HeaderObject | null>;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: Cell) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isInitialFocusedCell: (rowIndex: number, columnIndex: number) => boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  onToggleGroup: (rowId: number) => void;
  row: Row;
  rowIndex: number;
  shouldPaginate: boolean;
  tableRef: RefObject<HTMLDivElement | null>;
};

export default TableRowProps;
