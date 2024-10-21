/// <reference types="react" />
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
import CellValue from "../../types/CellValue";
interface TableCellProps {
    borderClass: string;
    colIndex: number;
    content: CellValue;
    header: HeaderObject;
    isSelected: boolean;
    isTopLeftCell: boolean;
    onCellChange?: (props: CellChangeProps) => void;
    onMouseDown: (rowIndex: number, colIndex: number) => void;
    onMouseOver: (rowIndex: number, colIndex: number) => void;
    row: {
        [key: string]: CellValue;
    };
    rowIndex: number;
}
declare const TableCell: import("react").ForwardRefExoticComponent<TableCellProps & import("react").RefAttributes<HTMLTableCellElement>>;
export default TableCell;
