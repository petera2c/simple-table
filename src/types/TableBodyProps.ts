import { RefObject } from "react";
import { MouseDownProps } from "../hooks/useSelection";
import CellChangeProps from "./CellChangeProps";
import HeaderObject from "./HeaderObject";
import SharedTableProps from "./SharedTableProps";

interface TableBodyProps extends SharedTableProps {
  currentRows: { [key: string]: any }[];
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: MouseDownProps) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  onCellChange?: (props: CellChangeProps) => void;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
  shouldPaginate: boolean;
}
export default TableBodyProps;
