export const H_SCROLL_LAYER_CLASS = "st-h-scroll-layer";

/** The section pane that owns `element` (the pane itself, or the parent of a slide layer). */
export const getHorizontalScrollViewport = (element: HTMLElement): HTMLElement => {
  if (element.classList.contains(H_SCROLL_LAYER_CLASS) && element.parentElement) {
    return element.parentElement;
  }
  return element;
};

export const ensureHorizontalScrollLayer = (viewport: HTMLElement): HTMLElement => {
  const existing = viewport.querySelector(`:scope > .${H_SCROLL_LAYER_CLASS}`);
  if (existing instanceof HTMLElement) return existing;
  const layer = document.createElement("div");
  layer.className = H_SCROLL_LAYER_CLASS;
  viewport.insertBefore(layer, viewport.firstChild);
  return layer;
};

export const getHorizontalScrollLayer = (viewport: HTMLElement): HTMLElement | null => {
  const existing = viewport.querySelector(`:scope > .${H_SCROLL_LAYER_CLASS}`);
  return existing instanceof HTMLElement ? existing : null;
};

/** Host for cells and rows: the scroll layer when it exists, otherwise the viewport. */
export const getHorizontalScrollContentHost = (viewport: HTMLElement): HTMLElement =>
  getHorizontalScrollLayer(viewport) ?? viewport;
