import { SetStateAction, Dispatch, ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
interface TableHeaderCellProps {
    draggable: boolean;
    draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
    columnResizing: boolean;
    forceUpdate: () => void;
    headersRef: React.RefObject<HeaderObject[]>;
    hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
    index: number;
    onSort: OnSortProps;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
    sort: SortConfig | null;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
}
declare const TableHeaderCell: import("react").ForwardRefExoticComponent<TableHeaderCellProps & import("react").RefAttributes<HTMLDivElement>>;
export default TableHeaderCell;
