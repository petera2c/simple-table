import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
import "../../styles/simple-table.css";
import Theme from "../../types/Theme";
interface SpreadsheetProps {
    columnEditorPosition?: "left" | "right";
    columnEditorText?: string;
    columnResizing?: boolean;
    defaultHeaders: HeaderObject[];
    draggable?: boolean;
    editColumns?: boolean;
    height?: string;
    hideFooter?: boolean;
    nextIcon?: ReactNode;
    onCellChange?: ({ accessor, newValue, originalRowIndex, row, }: CellChangeProps) => void;
    prevIcon?: ReactNode;
    rows: {
        [key: string]: CellValue;
    }[];
    rowsPerPage?: number;
    selectableCells?: boolean;
    selectableColumns?: boolean;
    shouldPaginate?: boolean;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
    theme?: Theme;
}
declare const SimpleTable: ({ columnEditorPosition, columnEditorText, columnResizing, defaultHeaders, draggable, editColumns, height, hideFooter, nextIcon, onCellChange, prevIcon, rows, rowsPerPage, selectableCells, selectableColumns, shouldPaginate, sortDownIcon, sortUpIcon, theme, }: SpreadsheetProps) => import("react/jsx-runtime").JSX.Element;
export default SimpleTable;
