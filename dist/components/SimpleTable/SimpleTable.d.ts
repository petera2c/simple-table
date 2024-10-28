import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import "../../styles/simple-table.css";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
export interface SpreadsheetProps {
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
    shouldPaginate?: boolean;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
}
declare const SimpleTable: ({ columnEditorText, columnResizing, defaultHeaders, draggable, editColumns, height, hideFooter, nextIcon, onCellChange, prevIcon, rows, rowsPerPage, selectableCells, shouldPaginate, sortDownIcon, sortUpIcon, }: SpreadsheetProps) => import("react/jsx-runtime").JSX.Element;
export default SimpleTable;
