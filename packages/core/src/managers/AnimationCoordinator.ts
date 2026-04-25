import { getRenderedCells } from "../utils/bodyCell/eventTracking";

export interface AnimationCoordinatorOptions {
  duration?: number;
  easing?: string;
}

export interface CellPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface CellSnapshot {
  left: number;
  top: number;
}

interface InFlightCell {
  element: HTMLElement;
  cleanupTimeout: number;
  transitionEndHandler: (event: TransitionEvent) => void;
  isRetained: boolean;
}

const DEFAULT_DURATION = 240;
const DEFAULT_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const MIN_DELTA = 0.5;
const SAFETY_TIMEOUT_SLACK = 80;
const RETAINED_CLASS = "st-cell-animating-out";
const RETAINED_ATTR = "data-animating-out";

/**
 * FLIP-style animation coordinator for body cells with virtualization awareness.
 *
 * Triggered explicitly via {@link captureSnapshot} (before a layout-affecting
 * change) and {@link play} (after the renderer has placed cells at their new
 * positions).
 *
 * Three classes of cells participate in an animation:
 *   - Persistent cells (visible before AND after): the same DOM node moves to
 *     a new `top`/`left`; FLIP slides it from the old visual spot.
 *   - Incoming cells (off-screen before, in DOM after): the renderer creates
 *     them at their new position; if the snapshot has their pre-change
 *     position (computed for ALL rows, not just the band), FLIP slides them
 *     in from there. The portion that's outside the body's overflow clip is
 *     never painted, so cells appear to slide in from the viewport edge.
 *   - Outgoing cells (in DOM before, off-screen after): the renderer hands
 *     them to {@link retainCell} along with their post-change off-screen
 *     position; FLIP slides them out to that position, then removes them.
 */
export class AnimationCoordinator {
  private enabled = false;
  private duration: number;
  private easing: string;
  /** Pre-change positions for any cell we want to consider for animation. */
  private snapshot: Map<string, CellSnapshot> | null = null;
  private inFlight: Map<string, InFlightCell> = new Map();
  /** Outgoing cells the renderer handed off; keyed per container so play() finds them. */
  private retainedCells: Map<HTMLElement, Map<string, HTMLElement>> = new Map();
  private prefersReducedMotion: boolean;

  constructor(opts: AnimationCoordinatorOptions = {}) {
    this.duration = opts.duration ?? DEFAULT_DURATION;
    this.easing = opts.easing ?? DEFAULT_EASING;
    this.prefersReducedMotion = readPrefersReducedMotion();
  }

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) {
      this.cancel();
    }
  }

  setDuration(duration: number): void {
    if (Number.isFinite(duration) && duration > 0) {
      this.duration = duration;
    }
  }

  setEasing(easing: string): void {
    if (typeof easing === "string" && easing.length > 0) {
      this.easing = easing;
    }
  }

  isEnabled(): boolean {
    return this.enabled && !this.prefersReducedMotion;
  }

  isInFlight(cellId: string): boolean {
    return this.inFlight.has(cellId);
  }

  /**
   * Capture pre-change positions for cells we may want to animate.
   *
   * @param args.containers Body containers; rendered cells are read from the DOM.
   * @param args.preLayouts Optional per-container conceptual layout. Should
   *   include positions for ALL rows in the dataset (not just the visible
   *   band) so cells that newly enter the band can FLIP in from their actual
   *   pre-change location and cells that leave the band can FLIP out to it.
   */
  captureSnapshot(args: {
    containers: Array<HTMLElement | null | undefined>;
    preLayouts?: Map<HTMLElement, Map<string, CellPosition>>;
  }): void {
    if (!this.isEnabled()) {
      this.snapshot = null;
      return;
    }

    const next = new Map<string, CellSnapshot>();

    for (const container of args.containers) {
      if (!container) continue;

      // 1. DOM-rendered cells: read live position (handles in-flight transforms).
      const cells = getRenderedCells(container);
      cells.forEach((element, cellId) => {
        if (!next.has(cellId)) {
          next.set(cellId, this.readPosition(cellId, element));
        }
      });

      // 2. Already-retained cells from a prior animation: read live visual pos.
      const retained = this.retainedCells.get(container);
      if (retained) {
        retained.forEach((element, cellId) => {
          if (!next.has(cellId)) {
            next.set(cellId, this.readPosition(cellId, element));
          }
        });
      }

      // 3. Conceptual layout for cells not currently in DOM (off-screen rows).
      // The supplied layout takes a back seat to live DOM reads so in-flight
      // cells use their real visual position rather than a stale absolute one.
      const preLayout = args.preLayouts?.get(container);
      if (preLayout) {
        preLayout.forEach((pos, cellId) => {
          if (!next.has(cellId)) {
            next.set(cellId, { left: pos.left, top: pos.top });
          }
        });
      }
    }

    this.snapshot = next.size > 0 ? next : null;
  }

  /**
   * The renderer asks before removing a cell whether the coordinator wants to
   * keep it for an out-animation.
   */
  shouldRetain(cellId: string): boolean {
    return Boolean(this.snapshot?.has(cellId));
  }

  /**
   * Hand a cell that the renderer would otherwise remove to the coordinator.
   * The coordinator updates its absolute positioning to the post-change layout
   * and will animate it from the snapshotted pre-change visual position to
   * that new position during {@link play}, then remove it from the DOM.
   *
   * The new position can be off-screen (e.g. the row sorted to a position
   * outside the visible band) — the body container's `overflow: hidden`
   * naturally clips the cell as it slides past the viewport edge.
   */
  retainCell(args: {
    cellId: string;
    element: HTMLElement;
    container: HTMLElement;
    newPosition: CellPosition;
  }): void {
    const { cellId, element, container, newPosition } = args;

    let map = this.retainedCells.get(container);
    if (!map) {
      map = new Map();
      this.retainedCells.set(container, map);
    }

    // If we already have a retained cell with this id, drop it immediately so
    // we don't accumulate phantom DOM nodes (e.g. user mashes the same toggle).
    const existing = map.get(cellId);
    if (existing && existing !== element) {
      this.cancelInFlight(cellId);
      existing.remove();
    }

    // Strip the id so DOM lookups (e.g. document.getElementById, tests) prefer
    // the live cell that the renderer is about to create. The retained node is
    // still positioned absolutely and visually slides to its new spot.
    if (element.id) element.removeAttribute("id");
    element.classList.add(RETAINED_CLASS);
    element.setAttribute(RETAINED_ATTR, "true");

    element.style.left = `${newPosition.left}px`;
    element.style.top = `${newPosition.top}px`;
    element.style.width = `${newPosition.width}px`;
    element.style.height = `${newPosition.height}px`;
    // Disable pointer events on departing cells so they don't intercept clicks.
    element.style.pointerEvents = "none";

    map.set(cellId, element);
  }

  /**
   * Discard any retained cell with this id in the given container. Called by
   * the renderer when it's about to create a fresh cell with the same id, so
   * we don't have two DOM nodes claiming the same logical slot.
   */
  discardRetainedIfPresent(cellId: string, container: HTMLElement): void {
    const map = this.retainedCells.get(container);
    if (!map) return;
    const element = map.get(cellId);
    if (!element) return;
    this.cancelInFlight(cellId);
    map.delete(cellId);
    element.remove();
  }

  /**
   * Apply the FLIP invert + play step to every cell present in the snapshot
   * that is now in the DOM (either as an actively rendered cell or as a
   * retained cell). Clears the snapshot.
   */
  play(args: { containers: Array<HTMLElement | null | undefined> }): void {
    const snapshot = this.snapshot;
    this.snapshot = null;

    if (!this.isEnabled() || !snapshot) {
      // Nothing to play; clean up any leftover retained cells.
      this.retainedCells.forEach((map) => {
        map.forEach((element) => element.remove());
        map.clear();
      });
      this.retainedCells.clear();
      return;
    }

    type Pending = {
      cellId: string;
      element: HTMLElement;
      dx: number;
      dy: number;
      isRetained: boolean;
    };
    const pending: Pending[] = [];
    const seen = new Set<string>();

    const consider = (element: HTMLElement, cellId: string, isRetained: boolean) => {
      if (seen.has(cellId)) return;
      const before = snapshot.get(cellId);
      if (!before) return;
      // Skip cells with an open inline editor (animating breaks input focus).
      if (element.querySelector(".st-cell-editing")) return;

      const currentLeft = parsePx(element.style.left);
      const currentTop = parsePx(element.style.top);
      const dx = before.left - currentLeft;
      const dy = before.top - currentTop;
      if (Math.abs(dx) < MIN_DELTA && Math.abs(dy) < MIN_DELTA) {
        // No visual movement — if this was a retained cell with no movement
        // (a degenerate case), still drop it so we don't leak DOM.
        if (isRetained) element.remove();
        return;
      }

      pending.push({ cellId, element, dx, dy, isRetained });
      seen.add(cellId);
    };

    for (const container of args.containers) {
      if (!container) continue;

      // Retained (outgoing) cells animate first so we collect them.
      const retained = this.retainedCells.get(container);
      if (retained) {
        retained.forEach((element, cellId) => consider(element, cellId, true));
      }

      // Active cells: incoming + persistent.
      const cells = getRenderedCells(container);
      cells.forEach((element, cellId) => consider(element, cellId, false));
    }

    // FLIP "First" frame: apply inverse transforms synchronously so the next
    // paint shows cells at their old positions.
    for (const { cellId, element, dx, dy } of pending) {
      this.cancelInFlight(cellId);
      element.style.transition = "none";
      element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      element.style.willChange = "transform";
    }

    if (pending.length === 0) return;

    requestAnimationFrame(() => {
      for (const { cellId, element, isRetained } of pending) {
        if (!element.isConnected) continue;
        this.startTransition(cellId, element, isRetained);
      }
    });
  }

  /**
   * Cancel every in-flight transition and clear any armed snapshot. Active
   * cells snap to their final positions; retained cells are removed from the
   * DOM so we don't leak nodes.
   */
  cancel(): void {
    this.snapshot = null;
    const entries = Array.from(this.inFlight.entries());
    this.inFlight.clear();
    for (const [cellId, entry] of entries) {
      window.clearTimeout(entry.cleanupTimeout);
      entry.element.removeEventListener("transitionend", entry.transitionEndHandler);
      this.finishElement(cellId, entry.element, entry.isRetained);
    }
    // Clean up any retained cells that weren't in flight (e.g. cell was
    // retained but never reached the play step).
    this.retainedCells.forEach((map) => {
      map.forEach((element) => element.remove());
      map.clear();
    });
    this.retainedCells.clear();
  }

  destroy(): void {
    this.cancel();
  }

  private readPosition(cellId: string, element: HTMLElement): CellSnapshot {
    const inFlight = this.inFlight.get(cellId);
    if (inFlight) {
      const rect = element.getBoundingClientRect();
      const parent = element.offsetParent as HTMLElement | null;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        return {
          left: rect.left - parentRect.left + parent.scrollLeft,
          top: rect.top - parentRect.top + parent.scrollTop,
        };
      }
      return { left: rect.left, top: rect.top };
    }
    return {
      left: parsePx(element.style.left),
      top: parsePx(element.style.top),
    };
  }

  private startTransition(cellId: string, element: HTMLElement, isRetained: boolean): void {
    element.style.transition = `transform ${this.duration}ms ${this.easing}`;
    element.style.transform = "translate3d(0, 0, 0)";

    const transitionEndHandler = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      this.finalizeCell(cellId, element);
    };
    element.addEventListener("transitionend", transitionEndHandler);

    const cleanupTimeout = window.setTimeout(() => {
      this.finalizeCell(cellId, element);
    }, this.duration + SAFETY_TIMEOUT_SLACK);

    this.inFlight.set(cellId, {
      element,
      cleanupTimeout,
      transitionEndHandler,
      isRetained,
    });
  }

  private cancelInFlight(cellId: string): void {
    const entry = this.inFlight.get(cellId);
    if (!entry) return;
    window.clearTimeout(entry.cleanupTimeout);
    entry.element.removeEventListener("transitionend", entry.transitionEndHandler);
    this.inFlight.delete(cellId);
  }

  private finalizeCell(cellId: string, element: HTMLElement): void {
    const entry = this.inFlight.get(cellId);
    const isRetained = entry?.isRetained ?? this.isCellRetained(element);
    if (entry) {
      window.clearTimeout(entry.cleanupTimeout);
      entry.element.removeEventListener("transitionend", entry.transitionEndHandler);
      this.inFlight.delete(cellId);
    }
    this.finishElement(cellId, element, isRetained);
  }

  private finishElement(cellId: string, element: HTMLElement, isRetained: boolean): void {
    if (isRetained) {
      this.retainedCells.forEach((map) => {
        if (map.get(cellId) === element) map.delete(cellId);
      });
      element.remove();
      return;
    }
    element.style.transition = "";
    element.style.transform = "";
    element.style.willChange = "";
  }

  private isCellRetained(element: HTMLElement): boolean {
    return element.hasAttribute(RETAINED_ATTR);
  }
}

const parsePx = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readPrefersReducedMotion = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};
