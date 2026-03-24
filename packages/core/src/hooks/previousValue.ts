/**
 * A class to track previous values of a variable.
 * This replaces the usePrevious hook for non-React code.
 * 
 * @example
 * const tracker = new PreviousValueTracker(initialValue);
 * const previous = tracker.get();
 * tracker.update(newValue);
 */
export class PreviousValueTracker<T> {
  private previousValue: T;

  constructor(initialValue: T) {
    this.previousValue = initialValue;
  }

  /**
   * Updates the tracked value and returns the previous value
   * @param newValue - The new value to track
   * @returns The previous value before update
   */
  update(newValue: T): T {
    const prev = this.previousValue;
    
    // Only update if the value has changed (deep comparison via JSON)
    if (JSON.stringify(prev) !== JSON.stringify(newValue)) {
      this.previousValue = newValue;
    }
    
    return prev;
  }

  /**
   * Gets the current previous value without updating
   * @returns The currently stored previous value
   */
  get(): T {
    return this.previousValue;
  }

  /**
   * Sets the previous value directly (useful for initialization)
   * @param value - The value to set
   */
  set(value: T): void {
    this.previousValue = value;
  }
}

export default PreviousValueTracker;
