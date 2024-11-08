import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
interface TableHeaderProps {
    draggable: boolean;
    columnResizing: boolean;
    forceUpdate: () => void;
    headersRef: React.RefObject<HeaderObject[]>;
    hiddenColumns: Record<string, boolean>;
    isWidthDragging: boolean;
    onSort: OnSortProps;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
    shouldDisplayLastColumnCell: boolean;
    sort: SortConfig | null;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
    tableRef: RefObject<HTMLDivElement>;
}
declare const TableHeader: ({ draggable, columnResizing, forceUpdate, headersRef, hiddenColumns, isWidthDragging, onSort, onTableHeaderDragEnd, setIsWidthDragging, shouldDisplayLastColumnCell, sort, sortDownIcon, sortUpIcon, tableRef, }: TableHeaderProps) => import("react/jsx-runtime").JSX.Element;
export default TableHeader;
