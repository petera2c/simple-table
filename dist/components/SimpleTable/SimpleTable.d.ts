import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import "../../styles/simple-table.css";
export interface SpreadsheetProps {
    defaultHeaders: HeaderObject[];
    enableColumnResizing?: boolean;
    height?: string;
    hideFooter?: boolean;
    nextIcon?: ReactNode;
    prevIcon?: ReactNode;
    rows: {
        [key: string]: string | number | boolean | undefined | null;
    }[];
    rowsPerPage?: number;
    shouldPaginate?: boolean;
}
declare const SimpleTable: ({ defaultHeaders, enableColumnResizing, height, hideFooter, nextIcon, prevIcon, rows, rowsPerPage, shouldPaginate, }: SpreadsheetProps) => import("react/jsx-runtime").JSX.Element;
export default SimpleTable;
