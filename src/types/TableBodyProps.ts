import { RefObject } from "react";
import { MouseDownProps } from "../hooks/useSelection";
import CellChangeProps from "./CellChangeProps";
import HeaderObject from "./HeaderObject";
import SharedTableProps from "./SharedTableProps";
import Row from "./Row";

interface TableBodyProps extends SharedTableProps {
  currentRows: Row[];
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: MouseDownProps) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  isRowExpanded: (rowId: string | number) => boolean;
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onExpandRowClick: (rowIndex: number) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  scrollbarHorizontalRef: RefObject<HTMLDivElement | null>;
  shouldPaginate: boolean;
}

export default TableBodyProps;
