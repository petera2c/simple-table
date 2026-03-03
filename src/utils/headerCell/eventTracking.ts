import HeaderObject from "../../types/HeaderObject";

// Event listener tracking - store listeners per element
const elementListenersMap = new WeakMap<
  HTMLElement,
  Array<{
    event: string;
    handler: EventListener;
    options?: AddEventListenerOptions;
  }>
>();

let throttleLastCallTime = 0;

// Drag state tracking
export let prevUpdateTime = Date.now();
export let prevDraggingPosition = { screenX: 0, screenY: 0 };
export let prevHeaders: HeaderObject[] | null = null;

export const setPrevUpdateTime = (time: number) => {
  prevUpdateTime = time;
};

export const setPrevDraggingPosition = (position: { screenX: number; screenY: number }) => {
  prevDraggingPosition = position;
};

export const setPrevHeaders = (headers: HeaderObject[] | null) => {
  prevHeaders = headers;
};

// Track rendered cells for incremental updates (per container)
const renderedCellsMap = new WeakMap<HTMLElement, Map<string, HTMLElement>>();

export const getRenderedCells = (container: HTMLElement): Map<string, HTMLElement> => {
  if (!renderedCellsMap.has(container)) {
    renderedCellsMap.set(container, new Map());
  }
  return renderedCellsMap.get(container)!;
};

export const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;

export const throttle = (callback: () => void, limit: number) => {
  const now = Date.now();
  if (throttleLastCallTime === 0 || now - throttleLastCallTime >= limit) {
    throttleLastCallTime = now;
    callback();
  }
};

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

export const cleanupHeaderCellRendering = (container?: HTMLElement) => {
  // No longer need to clean up all listeners globally
  // Event listeners are now tracked per element via WeakMap
  // and will be garbage collected when elements are removed

  throttleLastCallTime = 0;

  if (container) {
    const renderedCells = getRenderedCells(container);
    // Remove all rendered cell elements from the DOM
    renderedCells.forEach((element) => {
      element.remove();
    });
    renderedCells.clear();
  }
};
