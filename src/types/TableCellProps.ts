import { RefObject } from "react";
import HeaderObject from "./HeaderObject";
import CellChangeProps from "./CellChangeProps";
import { RowId } from "./RowId";
import TableRow from "./TableRow";
import Cell from "./Cell";

export interface TableCellProps {
  borderClass: string;
  colIndex: number;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  header: HeaderObject;
  headers: HeaderObject[];
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isSelected: boolean;
  isInitialFocusedCell: boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  onMouseDown: (props: Cell) => void;
  onMouseOver: (props: Cell) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  rowIndex: number;
  visibleRow: TableRow;
}

export default TableCellProps;
