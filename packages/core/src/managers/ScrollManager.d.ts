export interface ScrollManagerConfig {
    onLoadMore?: () => void;
    infiniteScrollThreshold?: number;
}
export interface ScrollManagerState {
    scrollTop: number;
    scrollLeft: number;
    scrollDirection: "up" | "down" | "none";
    isScrolling: boolean;
}
type StateChangeCallback = (state: ScrollManagerState) => void;
/**
 * Manages vertical scroll state (scrollTop, direction, isScrolling) and infinite scroll.
 * Horizontal header/body/scrollbar sync is handled by SectionScrollController.
 */
export declare class ScrollManager {
    private config;
    private state;
    private subscribers;
    private lastScrollTop;
    private scrollTimeoutId;
    /** Coalesce scroll-driven subscriber notifications to one rAF (avoids sync storms + reflow). */
    private notifySubscribersRafId;
    constructor(config: ScrollManagerConfig);
    updateConfig(config: Partial<ScrollManagerConfig>): void;
    subscribe(callback: StateChangeCallback): () => void;
    private notifySubscribers;
    private scheduleNotifySubscribersFromScroll;
    handleScroll(scrollTop: number, scrollLeft: number, containerHeight: number, contentHeight: number): void;
    setScrolling(isScrolling: boolean): void;
    getState(): ScrollManagerState;
    getScrollTop(): number;
    getScrollLeft(): number;
    getScrollDirection(): "up" | "down" | "none";
    isScrolling(): boolean;
    destroy(): void;
}
export {};
