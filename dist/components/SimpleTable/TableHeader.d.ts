import { Dispatch, SetStateAction } from "react";
import HeaderObject from "../../types/HeaderObject";
interface TableHeaderProps {
  columnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  isWidthDragging: boolean;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  shouldDisplayLastColumnCell: boolean;
}
declare const TableHeader: ({
  columnResizing,
  forceUpdate,
  headersRef,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setIsWidthDragging,
  shouldDisplayLastColumnCell,
}: TableHeaderProps) => import("react/jsx-runtime").JSX.Element;
export default TableHeader;
