import HeaderObject from "../types/HeaderObject";
export interface DimensionManagerConfig {
    effectiveHeaders: HeaderObject[];
    headerHeight?: number;
    rowHeight: number;
    height?: string | number;
    maxHeight?: string | number;
    totalRowCount: number;
    footerHeight?: number;
    containerElement?: HTMLElement;
    /**
     * Visible portion of the table inside an external scroll parent (in pixels).
     * Drives virtualization when neither `height` nor `maxHeight` is set.
     */
    externalViewportHeight?: number;
}
export interface DimensionManagerState {
    containerWidth: number;
    calculatedHeaderHeight: number;
    maxHeaderDepth: number;
    contentHeight: number | undefined;
}
type StateChangeCallback = (state: DimensionManagerState) => void;
/**
 * Wait this long after the last container-width ResizeObserver tick before
 * notifying subscribers. Coalesces CSS-transition / animated layout shifts
 * (e.g. a collapsible nav) into a single trailing update instead of one full
 * table render per animation frame.
 *
 * Kept above typical frame-budget jank (~50–80ms) so a hitch mid-transition
 * does not look like "animation ended" and fire an extra full relayout.
 */
export declare const CONTAINER_RESIZE_NOTIFY_DEBOUNCE_MS = 100;
/**
 * After a trailing notify, keep the burst open this long. A jank-sized quiet
 * gap mid-animation must not start a fresh burst (which would allow another
 * pair of notifies and thrash subscribers).
 */
export declare const CONTAINER_RESIZE_BURST_END_MS = 150;
export declare class DimensionManager {
    private config;
    private state;
    private subscribers;
    private resizeObserver;
    private rafId;
    private resizeNotifyDebounceId;
    private resizeBurstEndId;
    /** Notifies emitted in the current continuous resize burst (capped at 2). */
    private resizeBurstNotifyCount;
    /** True when a 3rd+ trailing tick was suppressed; flush latest width on burst end. */
    private resizeBurstNeedsFinalFlush;
    /** Set when applyContainerWidthSync updates state before any subscriber exists. */
    private initialNotifyPending;
    constructor(config: DimensionManagerConfig);
    private getHeaderDepth;
    private calculateMaxHeaderDepth;
    private calculateHeaderHeight;
    private convertHeightToPixels;
    private calculateContentHeight;
    private cancelPendingResizeNotify;
    private cancelResizeBurstEnd;
    private scheduleResizeBurstEnd;
    /**
     * Trailing debounce for animated / continuous container resizes.
     *
     * Per burst (continuous RO ticks separated by less than {@link CONTAINER_RESIZE_BURST_END_MS}):
     * - 1st quiet gap → notify immediately (sole update, or mid-animation pass)
     * - later quiet gaps → defer to burst-end so subscribers always see the final
     *   width without a 3rd+ notify when frame timing is janky
     */
    private scheduleResizeNotify;
    private observeContainer;
    private applyContainerWidthSync;
    updateConfig(config: Partial<DimensionManagerConfig>): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    getState(): DimensionManagerState;
    getContainerWidth(): number;
    getCalculatedHeaderHeight(): number;
    getMaxHeaderDepth(): number;
    getContentHeight(): number | undefined;
    destroy(): void;
}
export {};
