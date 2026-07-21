import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";
export interface FlattenRowsConfig {
    rows: Row[];
    rowGrouping?: Accessor[];
    getRowId?: GetRowId;
    expandedRows?: Map<string, number>;
    collapsedRows?: Map<string, number>;
    expandedDepths?: Set<number>;
    rowStateMap?: Map<string | number, RowState>;
    hasLoadingRenderer?: boolean;
    hasErrorRenderer?: boolean;
    hasEmptyRenderer?: boolean;
    headers?: HeaderObject[];
    rowHeight?: number;
    headerHeight?: number;
    customTheme?: CustomTheme;
}
export interface FlattenRowsResult {
    flattenedRows: TableRow[];
    heightOffsets: HeightOffsets;
    paginatableRows: TableRow[];
    parentEndPositions: number[];
}
export declare function flattenRows(config: FlattenRowsConfig): FlattenRowsResult;
