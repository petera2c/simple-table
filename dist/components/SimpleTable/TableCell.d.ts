/// <reference types="react" />
interface TableCellProps {
    rowIndex: number;
    colIndex: number;
    content: any;
    isSelected: boolean;
    isTopLeftCell: boolean;
    borderClass: string;
    onMouseDown: (rowIndex: number, colIndex: number) => void;
    onMouseOver: (rowIndex: number, colIndex: number) => void;
    isLastRow: boolean;
}
declare const TableCell: import("react").ForwardRefExoticComponent<TableCellProps & import("react").RefAttributes<HTMLTableCellElement>>;
export default TableCell;
