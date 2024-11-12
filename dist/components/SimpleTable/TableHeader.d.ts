import { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
import Row from "../../types/Row";
interface TableHeaderProps {
    columnResizing: boolean;
    currentRows: Row[];
    draggable: boolean;
    forceUpdate: () => void;
    headersRef: React.RefObject<HeaderObject[]>;
    hiddenColumns: Record<string, boolean>;
    isWidthDragging: boolean;
    onSort: OnSortProps;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
    selectableColumns: boolean;
    setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
    setSelectedCells: Dispatch<React.SetStateAction<Set<string>>>;
    shouldDisplayLastColumnCell: boolean;
    sort: SortConfig | null;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
    tableRef: RefObject<HTMLDivElement>;
}
declare const TableHeader: ({ columnResizing, currentRows, draggable, forceUpdate, headersRef, hiddenColumns, isWidthDragging, onSort, onTableHeaderDragEnd, selectableColumns, setIsWidthDragging, setSelectedCells, shouldDisplayLastColumnCell, sort, sortDownIcon, sortUpIcon, tableRef, }: TableHeaderProps) => import("react/jsx-runtime").JSX.Element;
export default TableHeader;
