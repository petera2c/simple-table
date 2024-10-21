import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import "../../styles/simple-table.css";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
export interface SpreadsheetProps {
    defaultHeaders: HeaderObject[];
    enableColumnResizing?: boolean;
    height?: string;
    hideFooter?: boolean;
    nextIcon?: ReactNode;
    onCellChange?: ({ accessor, newValue, originalRowIndex, row, }: CellChangeProps) => void;
    prevIcon?: ReactNode;
    rows: {
        [key: string]: CellValue;
    }[];
    rowsPerPage?: number;
    shouldPaginate?: boolean;
}
declare const SimpleTable: ({ defaultHeaders, enableColumnResizing, height, hideFooter, nextIcon, onCellChange, prevIcon, rows, rowsPerPage, shouldPaginate, }: SpreadsheetProps) => import("react/jsx-runtime").JSX.Element;
export default SimpleTable;
