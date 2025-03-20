import { ReactNode } from "react";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
import "../../styles/simple-table.css";
import Theme from "../../types/Theme";
import Row from "../../types/Row";
declare enum ColumnEditorPosition {
    Left = "left",
    Right = "right"
}
interface SimpleTableProps {
    allowAnimations?: boolean;
    columnEditorPosition?: ColumnEditorPosition;
    columnEditorText?: string;
    columnResizing?: boolean;
    defaultHeaders: HeaderObject[];
    draggable?: boolean;
    editColumns?: boolean;
    editColumnsInitOpen?: boolean;
    height?: string;
    hideFooter?: boolean;
    nextIcon?: ReactNode;
    onCellChange?: ({ accessor, newValue, originalRowIndex, row }: CellChangeProps) => void;
    prevIcon?: ReactNode;
    rows: Row[];
    rowsPerPage?: number;
    selectableCells?: boolean;
    selectableColumns?: boolean;
    shouldPaginate?: boolean;
    sortDownIcon?: ReactNode;
    sortUpIcon?: ReactNode;
    theme?: Theme;
}
declare const _default: import("react").MemoExoticComponent<{
    ({ allowAnimations, columnEditorPosition, columnEditorText, columnResizing, defaultHeaders, draggable, editColumns, editColumnsInitOpen, height, hideFooter, nextIcon, onCellChange, prevIcon, rows, rowsPerPage, selectableCells, selectableColumns, shouldPaginate, sortDownIcon, sortUpIcon, theme, }: SimpleTableProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        allowAnimations: boolean;
        columnEditorPosition: ColumnEditorPosition;
        columnEditorText: string;
        columnResizing: boolean;
        defaultHeaders: never[];
        draggable: boolean;
        editColumns: boolean;
        editColumnsInitOpen: boolean;
        height: string;
        hideFooter: boolean;
        nextIcon: import("react/jsx-runtime").JSX.Element;
        onCellChange: () => void;
        prevIcon: import("react/jsx-runtime").JSX.Element;
        rows: never[];
        rowsPerPage: number;
        selectableCells: boolean;
        selectableColumns: boolean;
        shouldPaginate: boolean;
        sortDownIcon: import("react/jsx-runtime").JSX.Element;
        sortUpIcon: import("react/jsx-runtime").JSX.Element;
        theme: string;
    };
}>;
export default _default;
