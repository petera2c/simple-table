import { RefObject } from "react";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
interface TableBodyProps {
    getBorderClass: (rowIndex: number, columnIndex: number) => string;
    handleMouseDown: (rowIndex: number, columnIndex: number) => void;
    handleMouseOver: (rowIndex: number, columnIndex: number) => void;
    headers: HeaderObject[];
    hiddenColumns: Record<string, boolean>;
    isSelected: (rowIndex: number, columnIndex: number) => boolean;
    isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
    isWidthDragging: boolean;
    shouldDisplayLastColumnCell: boolean;
    shouldPaginate: boolean;
    sortedRows: {
        [key: string]: any;
    }[];
    onCellChange?: (props: CellChangeProps) => void;
    tableRef: RefObject<HTMLDivElement>;
}
declare const TableBody: ({ getBorderClass, handleMouseDown, handleMouseOver, headers, hiddenColumns, isSelected, isTopLeftCell, isWidthDragging, onCellChange, shouldDisplayLastColumnCell, shouldPaginate, sortedRows, tableRef, }: TableBodyProps & {
    shouldDisplayLastColumnCell: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default TableBody;
