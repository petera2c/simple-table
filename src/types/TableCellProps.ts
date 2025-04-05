import { RefObject } from "react";
import HeaderObject from "./HeaderObject";
import CellChangeProps from "./CellChangeProps";
import { RowId } from "./RowId";
import VisibleRow from "./VisibleRow";
import Cell from "./Cell";

export interface TableCellProps {
  borderClass: string;
  colIndex: number;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isSelected: boolean;
  isInitialFocusedCell: boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  onExpandRowClick: (rowId: RowId) => void;
  onMouseDown: (props: Cell) => void;
  onMouseOver: (props: Cell) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  rowIndex: number;
  visibleRow: VisibleRow;
}

export default TableCellProps;
