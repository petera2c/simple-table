import { SetStateAction, Dispatch } from "react";
import HeaderObject from "../../types/HeaderObject";
interface TableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  enableColumnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}
declare const TableHeaderCell: import("react").ForwardRefExoticComponent<
  TableHeaderCellProps & import("react").RefAttributes<HTMLDivElement>
>;
export default TableHeaderCell;
