/**
 * Slide cells from a remembered visual position to their new layout slot.
 *
 * 1. Snapshot style-space visual (left + top, including live translate)
 * 2. Render writes plain style.left / style.top
 * 3. Hold = parkedFrom − written, then animate to parkedTo − written
 *
 * Far-off true coordinates are parked just outside the viewport and staggered.
 * Mid-flight retargets cancel and replace. Column-drag bodies copy the header remain.
 */

import { parseCssTranslate } from "../utils/setAbsoluteCellPosition";
import { isNearViewport, parkAndStagger, type ParkBand } from "../utils/parkAndStagger";

const MIN_DELTA = 0.5;
const FLIP_ACTIVE_CLASS = "st-flip-active";
/** Marks animations owned by this helper so they can be cancelled without touching others. */
export const CELL_SLIDE_ANIM_ID = "st-cell-slide";

const parsePx = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export type CellSlideAnimatorOptions = {
  duration?: number;
};

export type CellSlideKeyframe = {
  element: HTMLElement;
  id: string;
  fromX: number;
  fromY: number;
  toX?: number;
  toY?: number;
  duration?: number;
  easing?: string;
  onFinish?: () => void;
};

type VisualSnap = {
  visualLeft: number;
  visualTop: number;
  styleLeft: number;
  styleTop: number;
};

const readVisualStyle = (el: HTMLElement): { left: number; top: number } => {
  const styleLeft = parsePx(el.style.left);
  const styleTop = parsePx(el.style.top);
  let tx = 0;
  let ty = 0;
  if (typeof getComputedStyle !== "undefined") {
    const parsed = parseCssTranslate(getComputedStyle(el).transform);
    if (parsed) {
      tx = parsed.x;
      ty = parsed.y;
    }
  } else {
    const parsed = parseCssTranslate(el.style.transform || "");
    if (parsed) {
      tx = parsed.x;
      ty = parsed.y;
    }
  }
  return { left: styleLeft + tx, top: styleTop + ty };
};

const cancelCellSlideAnims = (el: HTMLElement): void => {
  if (typeof el.getAnimations !== "function") return;
  for (const anim of el.getAnimations()) {
    const id = (anim as Animation & { id?: string }).id;
    if (id === CELL_SLIDE_ANIM_ID || id === "st-column-reorder") {
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
  el.style.pointerEvents = "";
  el.classList.remove(FLIP_ACTIVE_CLASS);
};

export class CellSlideAnimator {
  private active = false;
  private duration: number;
  /** Snapshot taken at beginOrderChange — visual before style.left/top rewrites. */
  private pendingSnap: Map<string, VisualSnap> | null = null;
  private running = new Set<string>();

  constructor(opts: CellSlideAnimatorOptions = {}) {
    this.duration = opts.duration ?? 400;
  }

  setDuration(duration: number): void {
    this.duration = duration;
  }

  setActive(active: boolean): void {
    this.active = active;
    if (!active) {
      this.pendingSnap = null;
      // Leave in-flight slides running through dragend / handoff.
    }
  }

  isActive(): boolean {
    return this.active;
  }

  hasInFlight(): boolean {
    return this.running.size > 0;
  }

  /**
   * Snapshot header visuals before mid-drag style.left rewrites.
   */
  beginOrderChange(root: ParentNode): void {
    if (!this.active) return;
    const snap = new Map<string, VisualSnap>();
    const headers = root.querySelectorAll<HTMLElement>(".st-header-cell[data-accessor]");
    for (let i = 0; i < headers.length; i++) {
      const el = headers[i];
      const accessor = el.getAttribute("data-accessor");
      if (!accessor || snap.has(accessor)) continue;
      const visual = readVisualStyle(el);
      snap.set(accessor, {
        visualLeft: visual.left,
        visualTop: visual.top,
        styleLeft: parsePx(el.style.left),
        styleTop: parsePx(el.style.top),
      });
    }
    this.pendingSnap = snap;
  }

  /**
   * After style.left rewrites: hold from parked origin toward parked dest.
   * Bodies get the same remain as their header.
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
    const hostEl = scrollHost as HTMLElement | null;
    const band: ParkBand = {
      scrollOffset: hostEl ? hostEl.scrollLeft : 0,
      clientSize: hostEl
        ? hostEl.clientWidth
        : typeof window !== "undefined"
          ? window.innerWidth
          : 0,
    };

    const headers = root.querySelectorAll<HTMLElement>(".st-header-cell[data-accessor]");
    type Move = {
      accessor: string;
      el: HTMLElement;
      fromLeft: number;
      toLeft: number;
      width: number;
    };
    const moves: Move[] = [];
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
        continue;
      }

      const width = parsePx(el.style.width) || 120;

      moves.push({
        accessor,
        el,
        fromLeft: prev.visualLeft,
        toLeft: newLeft,
        width,
      });
    }

    if (moves.length === 0) return;

    const originPark = parkAndStagger(
      moves.map((m) => ({
        id: m.accessor,
        truePos: m.fromLeft,
        cellSize: m.width,
        holdTruePos: true,
      })),
      band,
    );
    const destPark = parkAndStagger(
      moves.map((m) => ({
        id: m.accessor,
        truePos: m.toLeft,
        cellSize: m.width,
        holdTruePos: isNearViewport(m.toLeft, m.width, band),
      })),
      band,
    );

    const remains = new Map<string, { fromX: number; toX: number }>();
    for (const move of moves) {
      const parkedFrom = originPark.get(move.accessor) ?? move.fromLeft;
      const parkedTo = destPark.get(move.accessor) ?? move.toLeft;
      const fromX = parkedFrom - move.toLeft;
      const toX = parkedTo - move.toLeft;
      if (Math.abs(fromX - toX) < MIN_DELTA && Math.abs(fromX) < MIN_DELTA) {
        continue;
      }
      remains.set(move.accessor, { fromX, toX });
    }

    if (remains.size === 0) return;

    for (const [accessor, remain] of remains) {
      const header = headerByAccessor.get(accessor);
      if (!header) continue;
      this.animate({
        element: header,
        id: accessor,
        fromX: remain.fromX,
        fromY: 0,
        toX: remain.toX,
        toY: 0,
        easing: "linear",
        duration: Math.max(this.duration, Math.min(2500, Math.round(Math.abs(remain.fromX) * 3))),
      });
    }

    const bodyCells = root.querySelectorAll<HTMLElement>(".st-cell[data-accessor]");
    for (let i = 0; i < bodyCells.length; i++) {
      const el = bodyCells[i];
      if (el.classList.contains("st-header-cell")) continue;
      const accessor = el.getAttribute("data-accessor");
      if (!accessor || !remains.has(accessor)) continue;
      const remain = remains.get(accessor)!;
      this.animate({
        element: el,
        id: `body:${accessor}:${i}`,
        fromX: remain.fromX,
        fromY: 0,
        toX: remain.toX,
        toY: 0,
        easing: "linear",
        duration: Math.max(this.duration, Math.min(2500, Math.round(Math.abs(remain.fromX) * 3))),
      });
    }
  }

  /**
   * Run a hold+tween on one element. Cancels a prior slide on that node first.
   */
  animate(slide: CellSlideKeyframe): boolean {
    const el = slide.element;
    const fromX = slide.fromX;
    const fromY = slide.fromY;
    const toX = slide.toX ?? 0;
    const toY = slide.toY ?? 0;
    const id = slide.id;

    cancelCellSlideAnims(el);
    el.style.transition = "none";

    const dist = Math.hypot(fromX - toX, fromY - toY);
    if (dist < MIN_DELTA) {
      clearTransform(el);
      this.running.delete(id);
      slide.onFinish?.();
      return true;
    }

    const duration = slide.duration ?? this.duration;
    const easing = slide.easing ?? "ease-out";
    const from = `translate3d(${fromX}px, ${fromY}px, 0)`;
    const to = `translate3d(${toX}px, ${toY}px, 0)`;

    el.style.transform = from;
    el.style.willChange = "transform";
    el.style.pointerEvents = "none";
    el.classList.add(FLIP_ACTIVE_CLASS);
    this.running.add(id);

    if (typeof el.animate !== "function") {
      window.setTimeout(() => {
        if (Math.abs(toX) < MIN_DELTA && Math.abs(toY) < MIN_DELTA) {
          clearTransform(el);
        } else {
          el.style.transform = to;
        }
        this.running.delete(id);
        slide.onFinish?.();
      }, duration);
      return true;
    }

    const anim = el.animate([{ transform: from }, { transform: to }], {
      duration,
      easing,
      fill: "forwards",
    });
    anim.id = CELL_SLIDE_ANIM_ID;

    let finished = false;
    const finish = () => {
      if (finished) return;
      const current = el
        .getAnimations?.()
        .find((a) => (a as Animation & { id?: string }).id === CELL_SLIDE_ANIM_ID);
      if (current && current !== anim) return;
      finished = true;
      try {
        anim.commitStyles?.();
      } catch {
        // ignore
      }
      if (Math.abs(toX) < MIN_DELTA && Math.abs(toY) < MIN_DELTA) {
        clearTransform(el);
      }
      try {
        anim.cancel();
      } catch {
        // ignore
      }
      this.running.delete(id);
      slide.onFinish?.();
    };

    anim.onfinish = finish;
    anim.finished.then(finish).catch(() => {
      if (finished) return;
      if (!el.isConnected) {
        finished = true;
        this.running.delete(id);
        return;
      }
      const current = el
        .getAnimations?.()
        .find((a) => (a as Animation & { id?: string }).id === CELL_SLIDE_ANIM_ID);
      if (current && current !== anim) return;
      finished = true;
      this.running.delete(id);
      slide.onFinish?.();
    });
    return true;
  }

  destroy(): void {
    this.active = false;
    this.pendingSnap = null;
    this.running.clear();
  }
}

/** @deprecated Use {@link CellSlideAnimator}. */
export const ColumnReorderAnimator = CellSlideAnimator;
