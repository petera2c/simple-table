// Event listener tracking - store listeners per element
const elementListenersMap = new WeakMap<HTMLElement, Array<{
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}>>();

// Helper to track event listeners per element
export const addTrackedEventListener = (
  element: HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
) => {
  element.addEventListener(event, handler, options);
  
  // Track this listener on the element
  if (!elementListenersMap.has(element)) {
    elementListenersMap.set(element, []);
  }
  elementListenersMap.get(element)!.push({ event, handler, options });
};

// Track rendered cells for incremental updates (per container)
const renderedCellsMap = new WeakMap<HTMLElement, Map<string, HTMLElement>>();

export const getRenderedCells = (container: HTMLElement): Map<string, HTMLElement> => {
  if (!renderedCellsMap.has(container)) {
    renderedCellsMap.set(container, new Map());
  }
  return renderedCellsMap.get(container)!;
};

// Cleanup all event listeners
export const cleanupBodyCellRendering = (container?: HTMLElement) => {
  // No longer need to clean up all listeners globally
  // Event listeners are now tracked per element via WeakMap
  // and will be garbage collected when elements are removed

  if (container) {
    const renderedCells = getRenderedCells(container);
    // Remove all rendered cell elements from the DOM
    renderedCells.forEach((element) => {
      element.remove();
    });
    renderedCells.clear();
  }
};
