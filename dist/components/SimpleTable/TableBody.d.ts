import HeaderObject from "../../types/HeaderObject";
interface TableBodyProps {
    getBorderClass: (rowIndex: number, columnIndex: number) => string;
    handleMouseDown: (rowIndex: number, columnIndex: number) => void;
    handleMouseOver: (rowIndex: number, columnIndex: number) => void;
    headers: HeaderObject[];
    isSelected: (rowIndex: number, columnIndex: number) => boolean;
    isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
    isWidthDragging: boolean;
    shouldDisplayLastColumnCell: boolean;
    shouldPaginate: boolean;
    sortedRows: {
        [key: string]: any;
    }[];
}
declare const TableBody: ({ getBorderClass, handleMouseDown, handleMouseOver, headers, isSelected, isTopLeftCell, isWidthDragging, shouldDisplayLastColumnCell, shouldPaginate, sortedRows, }: TableBodyProps & {
    shouldDisplayLastColumnCell: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default TableBody;
