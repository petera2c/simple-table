import { RefObject } from "react";
import HeaderObject from "./HeaderObject";
import CellChangeProps from "./CellChangeProps";
import { RowId } from "./RowId";
import VisibleRow from "./VisibleRow";

export interface TableCellProps {
  borderClass: string;
  colIndex: number;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  onExpandRowClick: (rowId: RowId) => void;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  rowIndex: number;
  visibleRow: VisibleRow;
}

export default TableCellProps;
