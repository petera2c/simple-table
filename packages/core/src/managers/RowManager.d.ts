import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";
export interface RowManagerConfig {
    rows: Row[];
    headers: HeaderObject[];
    rowGrouping?: Accessor[];
    getRowId?: GetRowId;
    rowHeight: number;
    headerHeight: number;
    customTheme: CustomTheme;
    hasLoadingRenderer: boolean;
    hasErrorRenderer: boolean;
    hasEmptyRenderer: boolean;
}
export interface RowManagerState {
    expandedRows: Map<string, number>;
    collapsedRows: Map<string, number>;
    expandedDepths: Set<number>;
    rowStateMap: Map<string | number, RowState>;
    aggregatedRows: Row[];
    flattenedRows: TableRow[];
    heightOffsets: HeightOffsets;
    paginatableRows: TableRow[];
    parentEndPositions: number[];
}
type StateChangeCallback = (state: RowManagerState) => void;
export declare class RowManager {
    private config;
    private state;
    private subscribers;
    constructor(config: RowManagerConfig);
    private getAllAggregationHeaders;
    private calculateAggregation;
    private computeAggregatedRows;
    private computeFlattenedRows;
    updateConfig(config: Partial<RowManagerConfig>): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    setExpandedRows(expandedRows: Map<string, number>): void;
    setCollapsedRows(collapsedRows: Map<string, number>): void;
    setExpandedDepths(expandedDepths: Set<number>): void;
    setRowStateMap(rowStateMap: Map<string | number, RowState>): void;
    getState(): RowManagerState;
    getAggregatedRows(): Row[];
    getFlattenedRows(): TableRow[];
    getHeightOffsets(): HeightOffsets;
    getPaginatableRows(): TableRow[];
    getParentEndPositions(): number[];
    destroy(): void;
}
export {};
