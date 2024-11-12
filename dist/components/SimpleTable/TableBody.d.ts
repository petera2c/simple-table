import { RefObject } from "react";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
import { MouseDownProps } from "../../hooks/useSelection";
interface TableBodyProps {
    currentRows: {
        [key: string]: any;
    }[];
    getBorderClass: (rowIndex: number, columnIndex: number) => string;
    handleMouseDown: (props: MouseDownProps) => void;
    handleMouseOver: (rowIndex: number, columnIndex: number) => void;
    headers: HeaderObject[];
    hiddenColumns: Record<string, boolean>;
    isSelected: (rowIndex: number, columnIndex: number) => boolean;
    isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
    isWidthDragging: boolean;
    onCellChange?: (props: CellChangeProps) => void;
    shouldDisplayLastColumnCell: boolean;
    shouldPaginate: boolean;
    tableRef: RefObject<HTMLDivElement>;
}
declare const TableBody: ({ currentRows, getBorderClass, handleMouseDown, handleMouseOver, headers, hiddenColumns, isSelected, isTopLeftCell, isWidthDragging, onCellChange, shouldDisplayLastColumnCell, shouldPaginate, tableRef, }: TableBodyProps & {
    shouldDisplayLastColumnCell: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default TableBody;
