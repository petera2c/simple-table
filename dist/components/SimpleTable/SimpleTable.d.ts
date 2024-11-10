import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
interface SpreadsheetProps {
    columnEditorPosition?: "left" | "right";
    columnEditorText?: string;
    columnResizing?: boolean;
    defaultHeaders: HeaderObject[];
    draggable?: boolean;
    editColumns?: boolean;
    height?: string;
    hideFooter?: boolean;
    importStyles?: boolean;
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
declare const SimpleTable: ({ columnEditorPosition, columnEditorText, columnResizing, defaultHeaders, draggable, editColumns, height, hideFooter, importStyles, nextIcon, onCellChange, prevIcon, rows, rowsPerPage, selectableCells, shouldPaginate, sortDownIcon, sortUpIcon, }: SpreadsheetProps) => import("react/jsx-runtime").JSX.Element;
export default SimpleTable;
