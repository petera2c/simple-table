import { Dispatch, RefObject, SetStateAction } from "react";
import CellChangeProps from "./CellChangeProps";
import HeaderObject from "./HeaderObject";
import SharedTableProps from "./SharedTableProps";
import Row from "./Row";
import Cell from "./Cell";
import VisibleRow from "./VisibleRow";
interface TableBodyProps extends SharedTableProps {
  flattenedRows: Row[];
  getBorderClass: (props: Cell) => string;
  handleMouseDown: (props: Cell) => void;
  handleMouseOver: (props: Cell) => void;
  headers: HeaderObject[];
  isSelected: (props: Cell) => boolean;
  isInitialFocusedCell: (props: Cell) => boolean;
  onCellEdit?: (props: CellChangeProps) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  scrollbarWidth: number;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  shouldPaginate: boolean;
  visibleRows: VisibleRow[];
}

export default TableBodyProps;
