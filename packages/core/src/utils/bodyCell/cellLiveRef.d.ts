import type Row from "../../types/Row";
import type TableRow from "../../types/TableRow";
import { CellRenderContext } from "./types";
export interface CellLiveRef {
    row: Row;
    tableRow: TableRow;
    context: CellRenderContext;
}
export declare const cellLiveRefMap: WeakMap<HTMLElement, CellLiveRef>;
