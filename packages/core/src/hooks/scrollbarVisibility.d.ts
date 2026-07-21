/**
 * Manages scrollbar visibility detection and header padding adjustments.
 * This is a vanilla JS alternative to the useScrollbarVisibility hook.
 */
export declare class ScrollbarVisibilityManager {
    private isMainSectionScrollable;
    private headerContainer;
    private mainSection;
    private scrollbarWidth;
    private resizeObserver;
    private observers;
    private rafId;
    constructor(config: {
        headerContainer?: HTMLElement | null;
        mainSection?: HTMLElement | null;
        scrollbarWidth: number;
    });
    /**
     * Initializes the scrollbar visibility detection
     */
    private initialize;
    /**
     * Checks if the main section is scrollable
     */
    private checkScrollability;
    /**
     * Updates the header padding based on scrollbar visibility
     */
    private updateHeaderPadding;
    /**
     * Updates the scrollbar width and refreshes padding
     * @param width - New scrollbar width in pixels
     */
    setScrollbarWidth(width: number): void;
    /**
     * Updates the header container element
     * @param container - New header container element
     */
    setHeaderContainer(container: HTMLElement | null): void;
    /**
     * Updates the main section element
     * @param section - New main section element
     */
    setMainSection(section: HTMLElement | null): void;
    /**
     * Gets whether the main section is currently scrollable
     * @returns True if the main section has vertical scroll
     */
    getIsMainSectionScrollable(): boolean;
    /**
     * Subscribes to scrollability changes
     * @param callback - Function to call when scrollability changes
     * @returns Unsubscribe function
     */
    subscribe(callback: (isScrollable: boolean) => void): () => void;
    /**
     * Notifies all observers of scrollability changes
     */
    private notifyObservers;
    /**
     * Cleans up the manager and removes all observers
     */
    destroy(): void;
}
export default ScrollbarVisibilityManager;
