import { getRenderedCells as getBodyRenderedCells } from "../utils/bodyCell/eventTracking";
import { getRenderedCells as getHeaderRenderedCells } from "../utils/headerCell/eventTracking";

/**
 * The renderer keeps two independent per-container WeakMaps of rendered cells —
 * one for body sections, one for header sections — because the two render
 * pipelines are otherwise unrelated. The animation coordinator just wants
 * "every cell currently mounted in this container", so we transparently merge
 * both registries here. A given container only ever appears in one registry
 * (body or header), so the merge is effectively a single lookup that picks the
 * non-empty side.
 */
const collectRenderedCells = (container: HTMLElement): Map<string, HTMLElement> => {
  const body = getBodyRenderedCells(container);
  const header = getHeaderRenderedCells(container);
  if (body.size === 0) return header;
  if (header.size === 0) return body;
  const merged = new Map<string, HTMLElement>(body);
  header.forEach((el, id) => merged.set(id, el));
  return merged;
};

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
      const cells = collectRenderedCells(container);
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
    const oldTop = parsePx(element.style.top);
    const oldLeft = parsePx(element.style.left);

    // Scale the visual destination on each axis so the slide journey is
    // bounded but proportional to the true conceptual journey. Without
    // scaling, a row sorted from position 0 to position 499 of a virtualized
    // 500-row table would try to slide ~16k pixels vertically in the
    // animation window — under ease-out it crosses the 500px viewport in the
    // first ~30ms and the cell appears to teleport. The same problem exists
    // horizontally: a column moved across a virtualized 30-column table can
    // need to slide ~6k pixels and would look identically broken. The
    // scaling also gives cells with very different conceptual destinations
    // visibly different slide distances, so they fan out instead of marching
    // off-screen in lockstep.
    const clippedTop = scaleFlipDistance(newPosition.top, oldTop, newPosition.height, container, "y");
    const clippedLeft = scaleFlipDistance(newPosition.left, oldLeft, newPosition.width, container, "x");

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

    element.style.left = `${clippedLeft}px`;
    element.style.top = `${clippedTop}px`;
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
      // Nothing to play. Drop only retained cells that aren't already
      // mid-animation; in-flight ghosts have a transition running and will
      // clean themselves up on transitionend. Wiping them here would kill
      // the slide-out for renders triggered by ResizeObserver / scrollbar
      // visibility / dimension recompute that fire during an animation.
      this.retainedCells.forEach((map) => {
        map.forEach((element, cellId) => {
          if (!this.inFlight.has(cellId)) {
            element.remove();
            map.delete(cellId);
          }
        });
      });
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

    const consider = (
      element: HTMLElement,
      cellId: string,
      isRetained: boolean,
      container: HTMLElement,
    ) => {
      if (seen.has(cellId)) return;
      const before = snapshot.get(cellId);
      if (!before) return;
      // Skip cells with an open inline editor (animating breaks input focus).
      if (element.querySelector(".st-cell-editing")) return;

      const currentLeft = parsePx(element.style.left);
      const currentTop = parsePx(element.style.top);

      // For incoming cells (newly created live cells), scale the FLIP
      // "before" position so cells sliding in from far off-screen take a
      // bounded but proportional journey on each axis. Without scaling, a
      // row whose pre-sort conceptual top was 14970 sliding to currentTop=0
      // would start ~15k pixels below the viewport — with ease-out it stays
      // off-screen for most of the animation, leaving the viewport empty
      // until the last few percent. The horizontal axis has the same
      // failure mode for far-column reorders. Retained cells already had
      // their style.top/left scaled at retainCell time, so we don't re-scale
      // here.
      const beforeTopClipped = isRetained
        ? before.top
        : scaleFlipDistance(before.top, currentTop, element.offsetHeight || 0, container, "y");
      const beforeLeftClipped = isRetained
        ? before.left
        : scaleFlipDistance(before.left, currentLeft, element.offsetWidth || 0, container, "x");

      const dx = beforeLeftClipped - currentLeft;
      const dy = beforeTopClipped - currentTop;
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
        retained.forEach((element, cellId) => consider(element, cellId, true, container));
      }

      // Active cells: incoming + persistent.
      const cells = collectRenderedCells(container);
      cells.forEach((element, cellId) => consider(element, cellId, false, container));
    }

    // FLIP "First" frame: apply inverse transforms synchronously so cells
    // appear at their old positions. We then need the browser to actually
    // PAINT this inverted state before we trigger the transition — otherwise
    // both the inverted write and the identity write happen before the same
    // paint, the browser only ever paints the identity state, and the
    // transition fires from identity → identity (no visual movement).
    for (const { cellId, element, dx, dy } of pending) {
      this.cancelInFlight(cellId);
      element.style.transition = "none";
      element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      element.style.willChange = "transform";
    }

    if (pending.length === 0) return;

    // Double RAF: rAF #1 callback runs BEFORE the next paint, so the browser
    // hasn't yet committed the inverted transform to a painted frame. rAF #2
    // is scheduled from inside #1 and fires AFTER #1's frame has painted —
    // so by the time `startTransition` runs, the browser's last painted
    // computed transform is `translate3d(dx, dy, 0)` and the new write to
    // `translate3d(0, 0, 0)` triggers a real interpolation.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const { cellId, element, isRetained } of pending) {
          if (!element.isConnected) continue;
          this.startTransition(cellId, element, isRetained);
        }
      });
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
    // Suppress hit-testing on cells that are mid-slide. Without this, an
    // animating header sliding under a dragging cursor will keep firing
    // dragover events on whichever animating cell the cursor is currently
    // intersecting, causing rapid back-and-forth swaps (visible flicker
    // during drag-and-drop reorder). Restored in finishElement once the
    // transition resolves. Retained (outgoing) cells already had pointer
    // events suppressed in retainCell.
    if (!isRetained) {
      element.style.pointerEvents = "none";
    }

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
    // Re-enable hit-testing now that the cell has settled. See
    // startTransition for the rationale.
    element.style.pointerEvents = "";
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

/**
 * Compression factor for the off-screen portion of the FLIP journey. Larger
 * values squeeze the off-screen overshoot more aggressively (cells with very
 * different conceptual destinations end up closer in slide distance); smaller
 * values give more visual spread. Tuned so that a row sorting to the bottom
 * of a typical 500-row dataset slides ~1.7× viewport while preserving the
 * sense that it's heading "really far".
 */
const OFFSCREEN_COMPRESSION_FACTOR = 10;

type FlipAxis = "x" | "y";

/**
 * Scale a FLIP journey along a given axis so the visible slide is bounded
 * but its length is proportional to the cell's true conceptual journey,
 * preserving the sign and a clear sense of "this cell is going further than
 * that one".
 *
 * Returns the new coordinate to assign to the FLIP endpoint (the outgoing
 * ghost's `style.top` / `style.left`, or the snapshot `before.top` /
 * `before.left` for an incoming cell).
 *
 * The journey is split into two regimes:
 *
 *   1. **In-viewport range** (|delta| ≤ viewportSize + cellSize):
 *      The cell is sliding to/from a position inside or just past the visible
 *      band, so we use the true delta untouched. Small reorders, partial-move
 *      sorts and persistent in-viewport cells are unaffected.
 *
 *   2. **Off-screen overshoot** (|delta| > visibleRange):
 *      The cell is sliding to/from a far conceptual position that's invisible
 *      anyway. We let the slide overshoot the visible edge by an amount that
 *      grows with the true delta but smoothly asymptotes at `maxOvershoot`,
 *      so cells with vastly different true journeys still slide *different*
 *      distances (no piling-up), and cells with truly extreme conceptual
 *      positions (e.g. a million pixels) stay bounded.
 *
 * The asymptotic formula is `maxOvershoot * extra / (extra + visibleRange * k)`
 * which is 0 when `extra = 0`, approaches `maxOvershoot` as `extra → ∞`, and
 * has no discontinuity at the boundary.
 *
 * No-op when there's no scrolling along the requested axis (small datasets,
 * pinned panes, or header sections in the vertical case).
 *
 * Vertical and horizontal use different scrollers because the table's layout
 * splits scrolling responsibilities: the body section element (`.st-body-main`
 * and pinned variants) is the *horizontal* scroller, while its parent
 * (`.st-body-container`) is the *vertical* scroller. Header sections only
 * scroll horizontally.
 */
const scaleFlipDistance = (
  distantPos: number,
  anchorPos: number,
  cellSize: number,
  container: HTMLElement,
  axis: FlipAxis,
): number => {
  const scroller: HTMLElement | null =
    axis === "y" ? container.parentElement : container;
  if (!scroller) return distantPos;

  const clientSize = axis === "y" ? scroller.clientHeight : scroller.clientWidth;
  const scrollSize = axis === "y" ? scroller.scrollHeight : scroller.scrollWidth;
  if (clientSize <= 0 || scrollSize <= clientSize) return distantPos;

  const delta = distantPos - anchorPos;
  const absDelta = Math.abs(delta);
  if (absDelta === 0) return distantPos;

  const cellBuffer = cellSize > 0 ? cellSize : 0;

  // If `distantPos` is itself inside the visible viewport, it's a real visible
  // position (a surviving cell's actual previous spot, or a real new spot we
  // want a retained ghost to slide into) — not a far-off conceptual one.
  // Compressing it would pull the cell AWAY from the viewport edge and hide
  // the only on-screen portion of the journey. Pass it through unchanged.
  // (Without this guard, a cell sliding from a visible position to an
  // off-screen position "disappears" mid-animation: |delta| exceeds
  // visibleRange, so the compression below pulls the visible end-point past
  // the section's overflow clip and the cell is never painted.)
  const scrollOffset = axis === "y" ? scroller.scrollTop : scroller.scrollLeft;
  if (
    distantPos >= scrollOffset - cellBuffer &&
    distantPos <= scrollOffset + clientSize
  ) {
    return distantPos;
  }

  // Threshold below which we pass the journey through unchanged. Cells whose
  // true delta fits within the visible band + one cell of overshoot are
  // already on-screen and don't need scaling.
  const visibleRange = clientSize + cellBuffer;
  if (absDelta <= visibleRange) return distantPos;

  // Off-screen extra distance, smoothly compressed and asymptotic to
  // `maxOvershoot`. With maxOvershoot = clientSize, the longest possible
  // visible slide is ~2× viewport size (visibleRange + maxOvershoot).
  const maxOvershoot = clientSize;
  const extra = absDelta - visibleRange;
  const compressed = (maxOvershoot * extra) / (extra + visibleRange * OFFSCREEN_COMPRESSION_FACTOR);
  const scaledMagnitude = visibleRange + compressed;
  return anchorPos + Math.sign(delta) * scaledMagnitude;
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
