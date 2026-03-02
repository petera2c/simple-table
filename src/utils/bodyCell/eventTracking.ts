// Event listener tracking
interface EventListenerEntry {
  element: HTMLElement;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

let eventListeners: EventListenerEntry[] = [];

// Helper to track event listeners
export const addTrackedEventListener = (
  element: HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
) => {
  element.addEventListener(event, handler, options);
  eventListeners.push({ element, event, handler, options });
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
  eventListeners.forEach(({ element, event, handler, options }) => {
    element.removeEventListener(event, handler, options);
  });
  eventListeners = [];
  
  if (container) {
    const renderedCells = getRenderedCells(container);
    renderedCells.clear();
  }
};
