import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import Row from "../types/Row";
import HeaderObject, { Accessor } from "../types/HeaderObject";
export interface FilterManagerConfig {
    rows: Row[];
    headers: HeaderObject[];
    externalFilterHandling: boolean;
    onFilterChange?: (filters: TableFilterState) => void;
    announce?: (message: string) => void;
}
export interface FilterManagerState {
    filters: TableFilterState;
    filteredRows: Row[];
}
type StateChangeCallback = (state: FilterManagerState) => void;
export declare class FilterManager {
    private config;
    private state;
    private subscribers;
    private headerLookup;
    constructor(config: FilterManagerConfig);
    private updateHeaderLookup;
    private computeFilteredRows;
    updateConfig(config: Partial<FilterManagerConfig>): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    updateFilter(filter: FilterCondition): void;
    clearFilter(accessor: Accessor): void;
    clearAllFilters(): void;
    computeFilteredRowsPreview(filter: FilterCondition): Row[];
    getState(): FilterManagerState;
    getFilters(): TableFilterState;
    getFilteredRows(): Row[];
    destroy(): void;
}
export {};
