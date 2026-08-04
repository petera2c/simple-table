/**
 * Dedicated column-drag reorder animator.
 *
 * Model (sortable-list retarget):
 * 1. beginOrderChange — snapshot style-space visual per accessor
 * 2. Render writes plain style.left (no invent / pinSettled)
 * 3. commitOrderChange — hold = snapVisual − newLeft, then WAAPI → 0
 *
 * Mid-flight retargets cancel and replace from the snap remain. Same-dest
 * accessors are left alone. Bodies get the same transform as headers.
 */

import { parseCssTranslate } from "../utils/setAbsoluteCellPosition";

const MIN_DELTA = 0.5;
const FLIP_ACTIVE_CLASS = "st-flip-active";
/** Marks WAAPI instances owned by this animator so we can cancel selectively. */
const ANIM_ID = "st-column-reorder";

const parsePx = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export type ColumnReorderAnimatorOptions = {
  duration?: number;
};

type VisualSnap = {
  visualLeft: number;
  styleLeft: number;
};

/**
 * Style-space visual X: style.left + live translate X.
 * Prefer getComputedStyle so mid-flight WAAPI remains are accurate.
 */
const readVisualStyleLeft = (el: HTMLElement): number => {
  const styleLeft = parsePx(el.style.left);
  let tx = 0;
  if (typeof getComputedStyle !== "undefined") {
    const parsed = parseCssTranslate(getComputedStyle(el).transform);
    if (parsed) tx = parsed.x;
  } else {
    const parsed = parseCssTranslate(el.style.transform || "");
    if (parsed) tx = parsed.x;
  }
  return styleLeft + tx;
};

const cancelColumnReorderAnims = (el: HTMLElement): void => {
  if (typeof el.getAnimations !== "function") return;
  for (const anim of el.getAnimations()) {
    if ((anim as Animation & { id?: string }).id === ANIM_ID) {
      try {
        anim.cancel();
      } catch {
        // ignore
      }
    }
  }
};

const clearTransform = (el: HTMLElement): void => {
  el.style.transition = "";
  el.style.transform = "";
  el.style.willChange = "";
  el.classList.remove(FLIP_ACTIVE_CLASS);
};

const isNearHorizontalViewport = (
  left: number,
  width: number,
  scrollLeft: number,
  clientWidth: number,
): boolean => {
  const buffer = Math.max(120, clientWidth * 0.25);
  return left + width >= scrollLeft - buffer && left <= scrollLeft + clientWidth + buffer;
};

export class ColumnReorderAnimator {
  private active = false;
  private duration: number;
  /** Snapshot taken at beginOrderChange — visual before style.left rewrites. */
  private pendingSnap: Map<string, VisualSnap> | null = null;
  private running = new Set<string>();

  constructor(opts: ColumnReorderAnimatorOptions = {}) {
    this.duration = opts.duration ?? 400;
  }

  setDuration(duration: number): void {
    this.duration = duration;
  }

  setActive(active: boolean): void {
    this.active = active;
    if (!active) {
      this.pendingSnap = null;
      // Leave in-flight WAAPIs running through dragend / handoff.
    }
  }

  isActive(): boolean {
    return this.active;
  }

  hasInFlight(): boolean {
    return this.running.size > 0;
  }

  /**
   * Call before header/body style.left rewrites for a mid-drag reorder.
   * Captures style-space visuals for every header leaf currently in the DOM.
   */
  beginOrderChange(root: ParentNode): void {
    if (!this.active) return;
    const snap = new Map<string, VisualSnap>();
    const headers = root.querySelectorAll<HTMLElement>(".st-header-cell[data-accessor]");
    for (let i = 0; i < headers.length; i++) {
      const el = headers[i];
      const accessor = el.getAttribute("data-accessor");
      if (!accessor || snap.has(accessor)) continue;
      snap.set(accessor, {
        visualLeft: readVisualStyleLeft(el),
        styleLeft: parsePx(el.style.left),
      });
    }
    this.pendingSnap = snap;
  }

  /**
   * Call after style.left rewrites in the same task (before paint).
   * Hold = pre-write visual − newLeft (never trust post-write live remain —
   * a naked left write has already shifted paint by the slot delta).
   */
  commitOrderChange(root: ParentNode): void {
    if (!this.active) {
      this.pendingSnap = null;
      return;
    }
    const snap = this.pendingSnap;
    this.pendingSnap = null;
    if (!snap || snap.size === 0) return;

    const scrollHost =
      (root as Element).querySelector?.(".st-body-main") ??
      (root as Element).querySelector?.(".st-header-main") ??
      null;
    const scrollLeft = scrollHost ? (scrollHost as HTMLElement).scrollLeft : 0;
    const clientWidth = scrollHost
      ? (scrollHost as HTMLElement).clientWidth
      : typeof window !== "undefined"
        ? window.innerWidth
        : 2000;

    const headers = root.querySelectorAll<HTMLElement>(".st-header-cell[data-accessor]");
    const remains = new Map<string, number>();
    const headerByAccessor = new Map<string, HTMLElement>();

    for (let i = 0; i < headers.length; i++) {
      const el = headers[i];
      const accessor = el.getAttribute("data-accessor");
      if (!accessor || headerByAccessor.has(accessor)) continue;
      headerByAccessor.set(accessor, el);

      const prev = snap.get(accessor);
      const newLeft = parsePx(el.style.left);
      if (!prev) continue;

      if (Math.abs(newLeft - prev.styleLeft) < MIN_DELTA) {
        // Same logical slot — do not restart a running slide.
        continue;
      }

      // Authoritative hold from pre-write snapshot only.
      const remain = prev.visualLeft - newLeft;
      const width = parsePx(el.style.width) || 120;
      const nearNow = isNearHorizontalViewport(newLeft, width, scrollLeft, clientWidth);
      const nearBefore = isNearHorizontalViewport(prev.styleLeft, width, scrollLeft, clientWidth);
      if (!nearNow && !nearBefore) {
        remains.set(accessor, 0);
        continue;
      }
      if (Math.abs(remain) < MIN_DELTA) {
        remains.set(accessor, 0);
        continue;
      }
      remains.set(accessor, remain);
    }

    if (remains.size === 0) return;

    for (const [accessor, remain] of remains) {
      const header = headerByAccessor.get(accessor);
      if (!header) continue;
      this.animateElement(header, remain, accessor);
    }

    const bodyCells = root.querySelectorAll<HTMLElement>(".st-cell[data-accessor]");
    for (let i = 0; i < bodyCells.length; i++) {
      const el = bodyCells[i];
      if (el.classList.contains("st-header-cell")) continue;
      const accessor = el.getAttribute("data-accessor");
      if (!accessor || !remains.has(accessor)) continue;
      this.animateElement(el, remains.get(accessor)!, accessor);
    }
  }

  destroy(): void {
    this.active = false;
    this.pendingSnap = null;
    this.running.clear();
  }

  private animateElement(el: HTMLElement, remainX: number, accessor: string): void {
    cancelColumnReorderAnims(el);
    el.style.transition = "none";

    const isHeader =
      el.classList.contains("st-header-cell") || el.classList.contains("st-header-cell-container");

    if (Math.abs(remainX) < MIN_DELTA) {
      clearTransform(el);
      if (isHeader) this.running.delete(accessor);
      return;
    }

    if (typeof el.animate !== "function") {
      el.style.transform = `translate3d(${remainX}px, 0, 0)`;
      el.classList.add(FLIP_ACTIVE_CLASS);
      return;
    }

    const duration = Math.max(
      this.duration,
      Math.min(2500, Math.round(Math.abs(remainX) * 3)),
    );

    // Hold paint at the pre-write visual, then tween to identity in-turn.
    el.style.transform = `translate3d(${remainX}px, 0, 0)`;
    el.style.willChange = "transform";
    el.classList.add(FLIP_ACTIVE_CLASS);
    if (isHeader) this.running.add(accessor);

    const anim = el.animate(
      [
        { transform: `translate3d(${remainX}px, 0, 0)` },
        { transform: "translate3d(0px, 0px, 0)" },
      ],
      {
        duration,
        easing: "linear",
        fill: "forwards",
      },
    );
    anim.id = ANIM_ID;

    const finish = () => {
      const current = el
        .getAnimations?.()
        .find((a) => (a as Animation & { id?: string }).id === ANIM_ID);
      if (current && current !== anim) return;
      try {
        // Write the end state into style before dropping the effect.
        anim.commitStyles?.();
      } catch {
        // ignore
      }
      clearTransform(el);
      try {
        anim.cancel();
      } catch {
        // ignore
      }
      if (isHeader) this.running.delete(accessor);
    };

    anim.onfinish = finish;
    anim.finished.then(finish).catch(() => {
      // Cancelled by a later retarget.
    });
  }
}
