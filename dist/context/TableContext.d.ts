/// <reference types="react" />
import CellValue from "../types/CellValue";
declare const TableContext: import("react").Context<{
    rows: {
        [key: string]: CellValue;
    }[];
    tableRows: {
        [key: string]: CellValue;
    }[];
}>;
export default TableContext;
