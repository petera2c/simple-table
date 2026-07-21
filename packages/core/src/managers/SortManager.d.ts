import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import SortColumn, { SortDirection } from "../types/SortColumn";
export interface SortManagerConfig {
    headers: HeaderObject[];
    tableRows: Row[];
    externalSortHandling: boolean;
    onSortChange?: (sort: SortColumn | null) => void;
    rowGrouping?: string[];
    initialSortColumn?: string;
    initialSortDirection?: SortDirection;
    announce?: (message: string) => void;
}
export interface SortManagerState {
    sort: SortColumn | null;
    sortedRows: Row[];
}
type StateChangeCallback = (state: SortManagerState) => void;
export declare class SortManager {
    private config;
    private state;
    private subscribers;
    private headerLookup;
    constructor(config: SortManagerConfig);
    private updateHeaderLookup;
    private getInitialSort;
    private sortNestedRows;
    private computeSortedRows;
    updateConfig(config: Partial<SortManagerConfig>): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    updateSort(props?: {
        accessor: Accessor;
        direction?: SortDirection;
    }): void;
    computeSortedRowsPreview(accessor: Accessor): Row[];
    getState(): SortManagerState;
    getSortColumn(): SortColumn | null;
    getSortedRows(): Row[];
    destroy(): void;
}
export {};
