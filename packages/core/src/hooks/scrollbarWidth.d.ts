/**
 * Calculates the scrollbar width of an element.
 * This is a pure function that replaces the useScrollbarWidth hook.
 *
 * @param element - The HTML element to measure
 * @returns The width of the scrollbar in pixels, or 0 if element is null
 */
export declare function calculateScrollbarWidth(element: HTMLElement | null): number;
/**
 * A class to manage scrollbar width state and updates.
 * This provides a stateful alternative to the useScrollbarWidth hook.
 */
export declare class ScrollbarWidthManager {
    private width;
    private element;
    private observers;
    constructor(element?: HTMLElement | null);
    /**
     * Sets the element to measure and calculates its scrollbar width
     * @param element - The HTML element to measure
     */
    setElement(element: HTMLElement | null): void;
    /**
     * Updates the scrollbar width measurement
     */
    update(): void;
    /**
     * Gets the current scrollbar width
     * @returns The current scrollbar width in pixels
     */
    getWidth(): number;
    /**
     * Manually sets the scrollbar width
     * @param width - The width to set
     */
    setWidth(width: number): void;
    /**
     * Subscribes to scrollbar width changes
     * @param callback - Function to call when width changes
     * @returns Unsubscribe function
     */
    subscribe(callback: (width: number) => void): () => void;
    /**
     * Notifies all observers of width changes
     */
    private notifyObservers;
    /**
     * Cleans up the manager
     */
    destroy(): void;
}
export default calculateScrollbarWidth;
