import { ReactNode, RefObject } from "react";
import HeaderObject from "./HeaderObject";
import CellChangeProps from "./CellChangeProps";
import CellValue from "./CellValue";
import Row from "./Row";

export interface TableCellProps {
  borderClass: string;
  cellHasChildren: boolean;
  colIndex: number;
  content: CellValue | ReactNode;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isExpanded?: boolean;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onExpandRow: (rowIndex: number) => void;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  row: Row;
  rowIndex: number;
  shouldDisplayLastColumnCell?: boolean;
}

export default TableCellProps;
