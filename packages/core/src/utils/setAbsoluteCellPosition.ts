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

export const setFlipCompensationEnabled = (enabled: boolean): void => {
  flipCompensationEnabled = enabled;
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

const looksLikeActiveFlip = (element: HTMLElement, styleTransform: string): boolean => {
  if (styleTransform && styleTransform !== "none") return true;
  return element.style.willChange === "transform";
};

/**
 * When `left`/`top` change under an active FLIP, counter-shift the translate so
 * the painted position stays put until the next `play()` invert/transition.
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

  let tx = 0;
  let ty = 0;
  let found = false;

  const styleParsed = parseCssTranslate(styleTransform);
  if (styleParsed && (Math.abs(styleParsed.x) > 0.5 || Math.abs(styleParsed.y) > 0.5)) {
    tx = styleParsed.x;
    ty = styleParsed.y;
    found = true;
  }

  if (!found) {
    const computed =
      typeof getComputedStyle !== "undefined" ? getComputedStyle(element).transform : "";
    const computedParsed = parseCssTranslate(computed);
    if (computedParsed) {
      tx = computedParsed.x;
      ty = computedParsed.y;
      found = true;
      element.style.transition = "none";
    }
  }

  if (!found) return false;

  element.style.transform = `translate3d(${tx - dLeft}px, ${ty - dTop}px, 0)`;
  return true;
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
