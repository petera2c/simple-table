/**
 * Calculates the scrollbar width of an element.
 * This is a pure function that replaces the useScrollbarWidth hook.
 * 
 * @param element - The HTML element to measure
 * @returns The width of the scrollbar in pixels, or 0 if element is null
 */
export function calculateScrollbarWidth(element: HTMLElement | null): number {
  if (!element) return 0;

  const scrollbarWidth = element.offsetWidth - element.clientWidth;
  return scrollbarWidth;
}

/**
 * A class to manage scrollbar width state and updates.
 * This provides a stateful alternative to the useScrollbarWidth hook.
 */
export class ScrollbarWidthManager {
  private width: number = 0;
  private element: HTMLElement | null = null;
  private observers: Set<(width: number) => void> = new Set();

  constructor(element?: HTMLElement | null) {
    if (element) {
      this.setElement(element);
    }
  }

  /**
   * Sets the element to measure and calculates its scrollbar width
   * @param element - The HTML element to measure
   */
  setElement(element: HTMLElement | null): void {
    this.element = element;
    this.update();
  }

  /**
   * Updates the scrollbar width measurement
   */
  update(): void {
    const newWidth = calculateScrollbarWidth(this.element);
    if (newWidth !== this.width) {
      this.width = newWidth;
      this.notifyObservers();
    }
  }

  /**
   * Gets the current scrollbar width
   * @returns The current scrollbar width in pixels
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Manually sets the scrollbar width
   * @param width - The width to set
   */
  setWidth(width: number): void {
    if (width !== this.width) {
      this.width = width;
      this.notifyObservers();
    }
  }

  /**
   * Subscribes to scrollbar width changes
   * @param callback - Function to call when width changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (width: number) => void): () => void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Notifies all observers of width changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.width));
  }

  /**
   * Cleans up the manager
   */
  destroy(): void {
    this.observers.clear();
    this.element = null;
  }
}

export default calculateScrollbarWidth;
