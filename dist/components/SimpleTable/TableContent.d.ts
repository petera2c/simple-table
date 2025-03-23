import { RefObject } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
type OmittedTableProps = "headerContainerRef" | "shouldDisplayLastColumnCell" | "pinnedLeftColumns" | "pinnedRightColumns" | "mainTemplateColumns" | "pinnedLeftTemplateColumns" | "pinnedRightTemplateColumns";
interface TableContentProps extends Omit<TableHeaderProps, OmittedTableProps>, Omit<TableBodyProps, OmittedTableProps> {
    editColumns: boolean;
    pinnedLeftRef: RefObject<HTMLDivElement | null>;
    pinnedRightRef: RefObject<HTMLDivElement | null>;
    isRowExpanded: (rowId: string | number) => boolean;
    onExpandRowClick: (rowIndex: number) => void;
}
declare const TableContent: ({ allowAnimations, columnResizing, currentRows, draggable, draggedHeaderRef, editColumns, forceUpdate, getBorderClass, handleMouseDown, handleMouseOver, headersRef, hiddenColumns, hoveredHeaderRef, isRowExpanded, isSelected, isTopLeftCell, isWidthDragging, mainBodyRef, onCellChange, onExpandRowClick, onSort, onTableHeaderDragEnd, pinnedLeftRef, pinnedRightRef, scrollbarHorizontalRef, scrollbarWidth, selectableColumns, setIsWidthDragging, setSelectedCells, shouldPaginate, sort, sortDownIcon, sortUpIcon, tableBodyContainerRef, }: TableContentProps) => import("react/jsx-runtime").JSX.Element;
export default TableContent;
