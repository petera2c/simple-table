export const H_SCROLL_LAYER_CLASS = "st-h-scroll-layer";

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
