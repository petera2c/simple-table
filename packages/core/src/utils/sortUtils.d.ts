import HeaderObject from "../types/HeaderObject";
import Row from "../types/Row";
import SortColumn from "../types/SortColumn";
export declare const handleSort: ({ headers, rows, sortColumn, }: {
    headers: HeaderObject[];
    rows: Row[];
    sortColumn: SortColumn;
}) => Row[];
