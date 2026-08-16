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

export default calculateScrollbarWidth;
