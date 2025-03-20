import { SetStateAction, Dispatch, ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
import Row from "../../types/Row";
interface TableHeaderCellProps {
    columnResizing: boolean;
    currentRows: Row[];
    draggable: boolean;
    draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
    forceUpdate: () => void;
    headersRef: React.RefObject<HeaderObject[]>;
    hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
    index: number;
    onSort: OnSortProps;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    reverse?: boolean;
    selectableColumns: boolean;
    setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
    setSelectedCells: Dispatch<React.SetStateAction<Set<string>>>;
    sort: SortConfig | null;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
}
declare const TableHeaderCell: import("react").ForwardRefExoticComponent<TableHeaderCellProps & import("react").RefAttributes<HTMLDivElement>>;
export default TableHeaderCell;
