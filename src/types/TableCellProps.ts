import { RefObject } from "react";
import HeaderObject from "./HeaderObject";
import CellChangeProps from "./CellChangeProps";
import Row from "./Row";
import { RowId } from "./RowId";

export interface TableCellProps {
  borderClass: string;
  cellHasChildren: boolean;
  colIndex: number;
  depth: number;
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
  row: Row;
  rowIndex: number;
}

export default TableCellProps;
