/**
 * Shared utility functions for scroll synchronization
 */

/**
 * Synchronizes scrollLeft from source to target element
 * Only updates if values are different to prevent unnecessary DOM writes
 * 
 * @param source - The element that was scrolled
 * @param target - The element to sync to
 */
export const syncScrollLeft = (source: HTMLElement, target: HTMLElement): void => {
  if (target.scrollLeft !== source.scrollLeft) {
    target.scrollLeft = source.scrollLeft;
  }
};

/**
 * Checks if an element has scrollable content
 * 
 * @param element - The element to check
 * @returns true if the element has horizontal scrollable content
 */
export const hasScrollableContent = (element: HTMLElement): boolean => {
  const { clientWidth, scrollWidth } = element;
  return scrollWidth - clientWidth > 0;
};
