import HeaderObject from "../../types/HeaderObject";

// Event listener tracking
interface EventListenerEntry {
  element: HTMLElement;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

let eventListeners: EventListenerEntry[] = [];
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
  options?: AddEventListenerOptions
) => {
  element.addEventListener(event, handler, options);
  eventListeners.push({ element, event, handler, options });
};

const cleanupEventListeners = () => {
  eventListeners.forEach(({ element, event, handler, options }) => {
    element.removeEventListener(event, handler, options);
  });
  eventListeners = [];
  throttleLastCallTime = 0;
};

export const cleanupHeaderCellRendering = (container?: HTMLElement) => {
  cleanupEventListeners();
  if (container) {
    const renderedCells = getRenderedCells(container);
    renderedCells.clear();
  }
};
