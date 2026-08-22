/**
 * Write absolute `left`/`top` while preserving an in-flight FLIP visual position.
 *
 * FLIP inverts use `transform: translate3d(...)` relative to `style.left/top`.
 * Updating left/top without adjusting that translate moves the painted cell by
 * the same delta — then `play()` "corrects" it with a new invert, which reads
 * as a jump during rapid reorders.
 *
 * Column-drag does NOT compensate here: {@link CellSlideAnimator} snapshots
 * visuals before left writes and applies the hold+tween after.
 */

/** When false, left/top writes do not counter-shift FLIP translates. */
let flipCompensationEnabled = true;

/** When true, left/top writes keep the painted box by adjusting translate. */
let keepPaintedOnDestWrite = false;

export const setFlipCompensationEnabled = (enabled: boolean): void => {
  flipCompensationEnabled = enabled;
};

export const setKeepPaintedOnDestWrite = (enabled: boolean): void => {
  keepPaintedOnDestWrite = enabled;
};

const parsePx = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Parse translate/matrix CSS into tx/ty. */
export const parseCssTranslate = (transform: string): { x: number; y: number } | null => {
  if (!transform || transform === "none") return null;
  const t3 = transform.match(/translate3d\(\s*([^,]+),\s*([^,]+)/i);
  if (t3) {
    const x = parseFloat(t3[1]);
    const y = parseFloat(t3[2]);
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  }
  const t2 = transform.match(/translate\(\s*([^,\s]+)(?:\s*,\s*([^)]+))?/i);
  if (t2) {
    const x = parseFloat(t2[1]);
    const y = parseFloat(t2[2] || "0");
    if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  }
  const m = transform.match(/^matrix\(\s*([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    if (parts.length >= 6 && parts.every(Number.isFinite)) {
      return { x: parts[4], y: parts[5] };
    }
  }
  const m3 = transform.match(/^matrix3d\(\s*([^)]+)\)/i);
  if (m3) {
    const parts = m3[1].split(",").map((s) => parseFloat(s.trim()));
    if (parts.length >= 16 && Number.isFinite(parts[12]) && Number.isFinite(parts[13])) {
      return { x: parts[12], y: parts[13] };
    }
  }
  return null;
};

/**
 * Painted translate in style.left/top space. Prefers the computed matrix so a
 * running WAAPI slide is not mistaken for its start keyframe (`style.transform`
 * stays at the invert until the animation finishes).
 */
export const readLiveTranslate = (element: HTMLElement): { x: number; y: number } | null => {
  if (typeof getComputedStyle !== "undefined") {
    const parsed = parseCssTranslate(getComputedStyle(element).transform);
    if (parsed) return parsed;
  }
  return parseCssTranslate(element.style.transform || "");
};

const looksLikeActiveFlip = (element: HTMLElement, styleTransform: string): boolean => {
  if (styleTransform && styleTransform !== "none") return true;
  if (element.style.willChange === "transform") return true;
  if (element.classList.contains("st-flip-active")) return true;
  if (typeof element.getAnimations !== "function") return false;
  return element.getAnimations().some((anim) => {
    const id = (anim as Animation & { id?: string }).id;
    return (
      (id === "st-cell-slide" || id === "st-column-reorder") &&
      (anim.playState === "running" || anim.playState === "paused")
    );
  });
};

/**
 * When `left`/`top` change under an active FLIP, counter-shift the translate so
 * the painted position stays put until the next `play()` invert/transition.
 *
 * A running WAAPI slide keeps `style.transform` at the start keyframe. Bake the
 * computed matrix into style and cancel that slide before shifting, otherwise
 * dest writes move the cell by dTop while the compositor still uses the old
 * remain.
 */
const compensateFlipTransform = (
  element: HTMLElement,
  dLeft: number,
  dTop: number,
): boolean => {
  if (dLeft === 0 && dTop === 0) return false;

  const styleTransform = element.style.transform || "";
  if (!looksLikeActiveFlip(element, styleTransform)) {
    return false;
  }

  const live = readLiveTranslate(element);
  if (!live) return false;

  element.style.transition = "none";
  element.style.willChange = "transform";
  element.classList.add("st-flip-active");
  element.style.transform = `translate3d(${live.x}px, ${live.y}px, 0)`;
  if (typeof element.getAnimations === "function") {
    for (const anim of element.getAnimations()) {
      const id = (anim as Animation & { id?: string }).id;
      if (id === "st-cell-slide" || id === "st-column-reorder") {
        try {
          anim.cancel();
        } catch {
          // ignore
        }
      }
    }
  }
  element.style.transform = `translate3d(${live.x - dLeft}px, ${live.y - dTop}px, 0)`;
  return true;
};

const cancelOwnedSlides = (element: HTMLElement): void => {
  if (typeof element.getAnimations !== "function") return;
  for (const anim of element.getAnimations()) {
    const id = (anim as Animation & { id?: string }).id;
    if (id === "st-cell-slide" || id === "st-column-reorder") {
      try {
        anim.cancel();
      } catch {
        // ignore
      }
    }
  }
};

/**
 * Write left/top and set translate so the painted box stays where it is.
 * Nodes that are not on the page yet only get the slot.
 */
const writeDestKeepingPaintedBox = (
  element: HTMLElement,
  nextLeft: number,
  nextTop: number,
): void => {
  const prevLeft = parsePx(element.style.left);
  const prevTop = parsePx(element.style.top);
  if (prevLeft === nextLeft && prevTop === nextTop) return;
  if (!element.isConnected) {
    element.style.left = `${nextLeft}px`;
    element.style.top = `${nextTop}px`;
    return;
  }

  const live = readLiveTranslate(element) ?? { x: 0, y: 0 };
  const paintedLeft = prevLeft + live.x;
  const paintedTop = prevTop + live.y;
  element.style.transition = "none";
  element.style.willChange = "transform";
  element.classList.add("st-flip-active");
  element.style.transform = `translate3d(${live.x}px, ${live.y}px, 0)`;
  cancelOwnedSlides(element);
  element.style.left = `${nextLeft}px`;
  element.style.top = `${nextTop}px`;
  element.style.transform = `translate3d(${paintedLeft - nextLeft}px, ${paintedTop - nextTop}px, 0)`;
};

/**
 * Set absolute cell coordinates, compensating any active FLIP translate so the
 * visual position does not drift when the logical slot moves.
 */
export const setAbsoluteCellPosition = (
  element: HTMLElement,
  nextLeft: number,
  nextTop: number,
): void => {
  if (keepPaintedOnDestWrite) {
    writeDestKeepingPaintedBox(element, nextLeft, nextTop);
    return;
  }

  const prevLeft = parsePx(element.style.left);
  const prevTop = parsePx(element.style.top);
  const dLeft = nextLeft - prevLeft;
  const dTop = nextTop - prevTop;

  if (flipCompensationEnabled) {
    compensateFlipTransform(element, dLeft, dTop);
  }

  element.style.left = `${nextLeft}px`;
  element.style.top = `${nextTop}px`;
};
