/**
 * A class to track previous values of a variable.
 * This replaces the usePrevious hook for non-React code.
 *
 * @example
 * const tracker = new PreviousValueTracker(initialValue);
 * const previous = tracker.get();
 * tracker.update(newValue);
 */
export declare class PreviousValueTracker<T> {
    private previousValue;
    constructor(initialValue: T);
    /**
     * Updates the tracked value and returns the previous value
     * @param newValue - The new value to track
     * @returns The previous value before update
     */
    update(newValue: T): T;
    /**
     * Gets the current previous value without updating
     * @returns The currently stored previous value
     */
    get(): T;
    /**
     * Sets the previous value directly (useful for initialization)
     * @param value - The value to set
     */
    set(value: T): void;
}
export default PreviousValueTracker;
