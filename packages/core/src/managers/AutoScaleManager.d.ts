import HeaderObject, { Accessor } from "../types/HeaderObject";
interface AutoScaleConfig {
    autoExpandColumns: boolean;
    containerWidth: number;
    pinnedLeftWidth: number;
    pinnedRightWidth: number;
    mainBodyRef: {
        current: HTMLDivElement | null;
    };
    isResizing?: boolean;
    /**
     * Currently collapsed header accessors. Auto-scale must only account for the
     * leaf columns that are actually visible for the current collapsed state —
     * otherwise it sums the widths of hidden child columns and under-expands,
     * leaving empty space on the right.
     */
    collapsedHeaders?: Set<Accessor>;
}
type HeaderUpdateCallback = (headers: HeaderObject[]) => void;
export declare const applyAutoScaleToHeaders: (headers: HeaderObject[], options: AutoScaleConfig) => HeaderObject[];
export declare class AutoScaleManager {
    private config;
    private onHeadersUpdate;
    private isResizingTracker;
    private containerWidthTracker;
    constructor(config: AutoScaleConfig, onHeadersUpdate: HeaderUpdateCallback);
    updateConfig(config: Partial<AutoScaleConfig>): void;
    private triggerAutoScale;
    applyAutoScale(headers: HeaderObject[]): HeaderObject[];
    setHeaders(headersOrUpdater: HeaderObject[] | ((prev: HeaderObject[]) => HeaderObject[]), currentHeaders: HeaderObject[]): HeaderObject[];
    destroy(): void;
}
export {};
