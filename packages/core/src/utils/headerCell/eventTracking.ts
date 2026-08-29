import ColumnDef from "../../types/ColumnDef";
import { cleanupAriaRows } from "../ariaRowOwnership";
import { getHorizontalScrollViewport } from "../../managers/horizontalScroll/scrollLayer";

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
export let prevHeaders: ColumnDef[] | null = null;

export const setPrevUpdateTime = (time: number) => {
  prevUpdateTime = time;
};

export const setPrevDraggingPosition = (position: {
  screenX: number;
  screenY: number;
}) => {
  prevDraggingPosition = position;
};

export const setPrevHeaders = (headers: ColumnDef[] | null) => {
  prevHeaders = headers;
};

// Track rendered cells for incremental updates (per container)
const renderedCellsMap = new WeakMap<HTMLElement, Map<string, HTMLElement>>();

export const getRenderedCells = (
  container: HTMLElement,
): Map<string, HTMLElement> => {
  const viewport = getHorizontalScrollViewport(container);
  if (!renderedCellsMap.has(viewport)) {
    renderedCellsMap.set(viewport, new Map());
  }
  return renderedCellsMap.get(viewport)!;
};

// Cache last applied header position per cell (avoids DOM reads / layout thrash on scroll)
export interface CachedHeaderPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}
const headerPositionCacheMap = new WeakMap<
  HTMLElement,
  Map<string, CachedHeaderPosition>
>();

export const getHeaderPositionCache = (
  container: HTMLElement,
): Map<string, CachedHeaderPosition> => {
  const viewport = getHorizontalScrollViewport(container);
  if (!headerPositionCacheMap.has(viewport)) {
    headerPositionCacheMap.set(viewport, new Map());
  }
  return headerPositionCacheMap.get(viewport)!;
};

export const REVERT_TO_PREVIOUS_HEADERS_DELAY = 150;

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

/** Bumped when header tooltips are dismissed so pending show timers do not recreate them. */
let headerTooltipEpoch = 0;

export const getHeaderTooltipEpoch = () => headerTooltipEpoch;

/** Removes `.st-tooltip` nodes under this table. Pending show timers from before this call do not create a new tooltip. */
export const removeFloatingHeaderTooltips = (fromElement: HTMLElement) => {
  headerTooltipEpoch += 1;
  const root = fromElement.closest(".simple-table-root");
  root?.querySelectorAll(".st-tooltip").forEach((el) => el.remove());
};

export const cleanupHeaderCellRendering = (
  container?: HTMLElement,
  onHostDiscard?: (host: HTMLElement) => void,
) => {
  // No longer need to clean up all listeners globally
  // Event listeners are now tracked per element via WeakMap
  // and will be garbage collected when elements are removed

  throttleLastCallTime = 0;

  if (container) {
    const viewport = getHorizontalScrollViewport(container);
    const renderedCells = getRenderedCells(viewport);
    // Remove all rendered cell elements from the DOM
    renderedCells.forEach((element) => {
      // Tear down any renderer subtree (React portal, etc.) mounted into the
      // header before it's permanently removed, so the adapter doesn't orphan it.
      onHostDiscard?.(element);
      element.remove();
    });
    renderedCells.clear();
    getHeaderPositionCache(viewport).clear();
    removeFloatingHeaderTooltips(viewport);
    cleanupAriaRows(viewport);
  }
};
