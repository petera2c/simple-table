/// <reference types="react" />
interface TableCellProps {
    borderClass: string;
    colIndex: number;
    content: any;
    isSelected: boolean;
    isTopLeftCell: boolean;
    onMouseDown: (rowIndex: number, colIndex: number) => void;
    onMouseOver: (rowIndex: number, colIndex: number) => void;
    rowIndex: number;
}
declare const TableCell: import("react").ForwardRefExoticComponent<TableCellProps & import("react").RefAttributes<HTMLTableCellElement>>;
export default TableCell;
