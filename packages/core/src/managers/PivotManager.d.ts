import type HeaderObject from "../types/HeaderObject";
import type { Accessor } from "../types/HeaderObject";
import type Row from "../types/Row";
import type { PivotConfig } from "../types/PivotTypes";
export interface PivotManagerConfig {
    sourceRows: Row[];
    fieldHeaders: HeaderObject[];
    pivot: PivotConfig | null;
}
export interface PivotManagerState {
    active: boolean;
    pivotedRows: Row[];
    headers: HeaderObject[];
    rowGrouping?: Accessor[];
    pivot: PivotConfig | null;
}
type StateChangeCallback = (state: PivotManagerState) => void;
export declare class PivotManager {
    private config;
    private state;
    private subscribers;
    private cacheKey;
    constructor(config: PivotManagerConfig);
    private buildCacheKey;
    private computeState;
    getState(): PivotManagerState;
    isActive(): boolean;
    getPivot(): PivotConfig | null;
    updateConfig(partial: Partial<PivotManagerConfig>): void;
    setPivot(pivot: PivotConfig | null): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    destroy(): void;
}
export {};
