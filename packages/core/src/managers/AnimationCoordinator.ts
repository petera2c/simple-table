import { getRenderedCells as getBodyRenderedCells } from "../utils/bodyCell/eventTracking";
import { getRenderedCells as getHeaderRenderedCells } from "../utils/headerCell/eventTracking";

const DEFAULT_DURATION = 400;
/**
 * Easing for incoming + persistent cells. Decelerating curve: the cell
 * approaches its final position smoothly. The visible portion of an
 * INCOMING slide is the last leg of the journey (cell entering the
 * viewport and settling into its final spot), so a decelerating curve
 * reads naturally as the cell "arriving".
 */
const DEFAULT_EASING = "ease-out";
/**
 * Easing for outgoing (retained) cells. Accelerating curve: the cell
 * leaves slowly and exits quickly. The visible portion of an outgoing
 * slide is the first leg of the journey (cell at its old position,
 * sliding toward the viewport edge), so back-loading spatial progress
 * keeps the cell on-screen for most of the animation instead of flicking
 * off in the first frame.
 */
const OUTGOING_EASING = "ease-in";
const MIN_DELTA = 0.5;
const SAFETY_TIMEOUT_SLACK = 80;
const RETAINED_CLASS = "st-cell-animating-out";
const RETAINED_ATTR = "data-animating-out";
/**
 * Marker on retained ghost cells whose only animation is a CSS-driven
 * width/height shrink (no FLIP transform). The `play()` per-cell loop must
 * skip them — its retained-cell branch removes any cell with a zero FLIP
 * delta immediately, which would tear the ghost out of the DOM before the
 * accordion CSS transition can play.
 */
const SHRINKING_OUT_ATTR = "data-shrinking-out";

/**
 * Curve-shape factor for the off-screen portion of the FLIP journey. Larger
 * values squeeze cells in the medium-distance regime more aggressively
 * while still letting truly-extreme cells fan out near the asymptote;
 * smaller values flatten the curve so most off-screen cells pile up near
 * the asymptote (loses the "this row is going further than that one"
 * signal). Does NOT change the asymptote — that's controlled by
 * `maxOvershoot` inside `scaleFlipDistance` (currently `clientSize`,
 * giving an asymptote of ~2× viewport).
 */
const OFFSCREEN_COMPRESSION_FACTOR = 10;

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
  /**
   * The container element the cell was rendered in at snapshot time. Used by
   * the renderer to detect cross-container moves (e.g. pin / unpin shifts a
   * column from `.st-body-main` to `.st-body-pinned-left`): the snapshot's
   * `left`/`top` are in the source container's coordinate frame, so a FLIP
   * applied in the destination container would slide the cell from a wrong
   * visual origin. When the renderer sees the cell ended up in a different
   * container, it treats it as a fresh cell (accordion grow from 0) instead
   * of trying to FLIP across coordinate frames.
   *
   * `null` for `preLayouts` entries (conceptual positions for off-screen
   * rows) — those are used only for in-band FLIP-in animations on sort,
   * never for cross-container detection.
   */
  sourceContainer: HTMLElement | null;
  /**
   * Page-coord origin of {@link sourceContainer} captured at snapshot time
   * (`getBoundingClientRect().left/top`). Combined with the container's
   * page origin at {@link play} time, lets the FLIP delta compensate for
   * the container's OWN shift on the page — which happens when an
   * adjacent section changes width (e.g. pin/unpin moves the main body
   * sideways because the pinned-left section just grew/shrank).
   *
   * Without this correction the inverse transform is computed only in
   * container-local style coordinates, so siblings whose style.left
   * shrunk to fill the gap left behind end up visually starting at
   * (newContainerLeft + newStyleLeft + |reflow|) — i.e. roughly TWICE
   * the visible reflow distance — and the user sees them slide much
   * further than the column actually moved.
   *
   * Zero for `preLayouts` entries (no live container at capture time);
   * those are conceptual destinations and the layout-shift correction
   * doesn't apply.
   */
  sourceContainerLeft: number;
  sourceContainerTop: number;
  left: number;
  top: number;
  /**
   * The cell's `style.top` at capture time (pre-render). Stored alongside the
   * visual position so {@link play} can detect cells whose logical destination
   * didn't actually move during this render and let their in-flight transition
   * continue uninterrupted instead of cancelling + restarting it (which would
   * freeze the cell for 2 rAFs and reset the easing curve, producing a
   * perceptible velocity discontinuity even though the position is preserved).
   */
  styleTop: number;
  styleLeft: number;
  /**
   * True only when `top`/`left` was read from `getBoundingClientRect` of a
   * cell that was already mid-flight at capture time. In that case the
   * snapshot is the cell's *real visual* position — already bounded by the
   * viewport (the rect of an off-screen translated cell never reports a
   * value outside the parent's overflow region the user can see) — so
   * compressing it via {@link scaleFlipDistance} would re-position the cell
   * away from where the user is currently seeing it, producing a
   * 100–700 px positional snap on every interruption sort.
   *
   * False for everything else: preLayout entries (conceptual positions for
   * off-screen rows that are tens of thousands of pixels off-screen) AND
   * non-in-flight DOM cells (whose `style.top`/`left` is the *logical*
   * destination position, not a viewport-bounded visual one — a column at
   * index 29 in a wide table can legitimately have `style.left = 6480` even
   * though it is way off-screen). Both cases need scaling so an unscaled
   * FLIP doesn't leave the cell invisible until the last few percent of
   * the animation.
   */
  fromDom: boolean;
}

interface InFlightCell {
  element: HTMLElement;
  cleanupTimeout: number;
  transitionEndHandler: (event: TransitionEvent) => void;
  isRetained: boolean;
}

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
  /**
   * One-shot synthetic origins for incoming cells that have no entry in the
   * captured snapshot (e.g. rows/columns that did not exist in the pre-render
   * state because they were inside a collapsed group). Used by accordion
   * animations so a newly-visible cell unfolds from its parent's position
   * rather than appearing in place. Cleared at the end of {@link play}.
   */
  private incomingOrigins: Map<string, CellPosition> | null = null;
  private inFlight: Map<string, InFlightCell> = new Map();
  /** Outgoing cells the renderer handed off; keyed per container so play() finds them. */
  private retainedCells: Map<HTMLElement, Map<string, HTMLElement>> = new Map();
  private prefersReducedMotion: boolean;
  /**
   * Per-render cache of scroller layout metrics. Reading
   * `scrollHeight`/`clientHeight`/etc. after a style mutation forces a sync
   * layout flush; without this cache, scaleFlipDistance() forces a fresh
   * flush for every cell in the retain/play loops, turning a single sort
   * into hundreds of layout passes (observed: 513ms in `msRemove` for ~287
   * cells, growing across consecutive sorts as DOM size grows). The cache
   * is cleared at the boundaries of a render cycle (captureSnapshot start
   * and play end / cancel) since column count and section heights are
   * stable within a single sort.
   */
  private scrollerMetricsCache: WeakMap<HTMLElement, ScrollerMetrics> = new WeakMap();

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

  getDuration(): number {
    return this.duration;
  }

  getEasing(): string {
    return this.easing;
  }

  /**
   * Register synthetic pre-change origins for incoming cells that did not
   * exist in the captured snapshot. {@link play} consults this map before
   * giving up on a cell that has no `before` snapshot entry; matching cells
   * FLIP from the override origin to their final position.
   *
   * The map is consumed by the next `play()` call and cleared, so callers
   * must set it after `captureSnapshot` and before the render that creates
   * the corresponding cells.
   */
  setIncomingOrigins(origins: Map<string, CellPosition> | null): void {
    if (!this.isEnabled()) {
      this.incomingOrigins = null;
      return;
    }
    this.incomingOrigins = origins && origins.size > 0 ? origins : null;
  }

  /**
   * Read scroller layout metrics for `container`, caching the result for the
   * remainder of the current render cycle. Subsequent calls in the same
   * cycle (e.g. for every cell in a retain or play loop) skip the DOM read,
   * which would otherwise force a synchronous layout flush after each style
   * mutation in the loop.
   */
  private getScrollerMetrics(container: HTMLElement): ScrollerMetrics {
    let metrics = this.scrollerMetricsCache.get(container);
    if (!metrics) {
      metrics = readScrollerMetrics(container);
      this.scrollerMetricsCache.set(container, metrics);
    }
    return metrics;
  }

  private clearScrollerMetricsCache(): void {
    this.scrollerMetricsCache = new WeakMap();
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

    // New render cycle starting — drop any scroller-metric cache from the
    // previous cycle so retainCell/play see fresh dimensions if the table
    // (or surrounding layout) actually resized between runs.
    this.clearScrollerMetricsCache();

    const next = new Map<string, CellSnapshot>();

    for (const container of args.containers) {
      if (!container) continue;

      // Read the container's page-coord origin ONCE per container per
      // capture so every cell snapshot in this container shares the same
      // anchor. Used by play() to correct the FLIP delta for the
      // container's own shift between capture and play (e.g. main body
      // slides sideways when pinned-left resizes during a pin/unpin).
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerTop = containerRect.top;

      // 1. DOM-rendered cells: read live position (handles in-flight transforms).
      const cells = collectRenderedCells(container);
      cells.forEach((element, cellId) => {
        if (!next.has(cellId)) {
          next.set(
            cellId,
            this.readPosition(cellId, element, container, containerLeft, containerTop),
          );
        }
      });

      // 2. Already-retained cells from a prior animation: read live visual pos.
      const retained = this.retainedCells.get(container);
      if (retained) {
        retained.forEach((element, cellId) => {
          if (!next.has(cellId)) {
            next.set(
              cellId,
              this.readPosition(cellId, element, container, containerLeft, containerTop),
            );
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
            // preLayouts entries are conceptual destinations for off-screen
            // rows that aren't in the DOM. styleTop/styleLeft mirror the
            // logical position itself — that way the "skip cells whose
            // logical destination didn't change" check works for cells that
            // come INTO the DOM via this codepath without misclassifying them.
            // fromDom=false signals to play() that this position is conceptual
            // (potentially tens of thousands of pixels off-screen) and should
            // be compressed via scaleFlipDistance.
            //
            // sourceContainer is null and the container origins are 0:
            // play() interprets this as "no container-shift correction".
            next.set(cellId, {
              sourceContainer: null,
              sourceContainerLeft: 0,
              sourceContainerTop: 0,
              left: pos.left,
              top: pos.top,
              styleTop: pos.top,
              styleLeft: pos.left,
              fromDom: false,
            });
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
   * Whether the captured snapshot has an entry for the given cellId. The
   * accordion expand path uses this to detect "newly visible" cells (no
   * pre-change layout) so it can initialize them at zero size and let the
   * CSS transition grow them to full size.
   */
  hasSnapshotEntry(cellId: string): boolean {
    return Boolean(this.snapshot?.has(cellId));
  }

  /**
   * True when the snapshot has an entry for `cellId` AND the cell was
   * rendered in `currentContainer` at snapshot time. Returns false when the
   * cell came from a different container (cross-section pin/unpin) — its
   * snapshot position is in another container's coordinate frame, so a
   * FLIP applied locally would slide from a wrong visual origin and the
   * destination renderer should treat the cell as fresh (accordion grow
   * from 0 instead).
   *
   * Snapshot entries with `sourceContainer === null` (preLayouts /
   * conceptual positions) are treated as same-container so the existing
   * sort/reorder FLIP-from-off-screen behavior is preserved.
   */
  hasSnapshotEntryInContainer(cellId: string, currentContainer: HTMLElement): boolean {
    const entry = this.snapshot?.get(cellId);
    if (!entry) return false;
    if (entry.sourceContainer === null) return true;
    return entry.sourceContainer === currentContainer;
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
    const metrics = this.getScrollerMetrics(container);
    const clippedTop = scaleFlipDistance(newPosition.top, oldTop, newPosition.height, metrics, "y");
    const clippedLeft = scaleFlipDistance(
      newPosition.left,
      oldLeft,
      newPosition.width,
      metrics,
      "x",
    );

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
   * Take ownership of a retained (outgoing) ghost element so the renderer can
   * promote it back to a live cell — rather than tearing it down and creating
   * a fresh node — when its row becomes visible again. Returns the element
   * with its retained-only attributes/state stripped, or `null` if no ghost
   * is currently retained for this id in the container.
   *
   * Reusing the ghost preserves DOM continuity: the next play() step reads
   * the cell's mid-flight visual position from the snapshot (captured before
   * the render) and FLIPs it from there to its new live destination, so the
   * row glides instead of disappearing and a freshly created replacement
   * doesn't pop into existence at a clipped FLIP entry point.
   */
  claimRetainedForReuse(cellId: string, container: HTMLElement): HTMLElement | null {
    const map = this.retainedCells.get(container);
    if (!map) return null;
    const element = map.get(cellId);
    if (!element) return null;
    // Shrink-out ghosts have width/height pinned to 0 by inline style and
    // are mid-CSS-transition; reclaiming them and snapping the size back to
    // the final value via `updateBodyCellElement` would jump the cell from
    // 0 → final in one frame instead of growing it. Tear the ghost down so
    // the renderer creates a fresh cell. Also drop the snapshot entry the
    // ghost contributed in `captureSnapshot` (retained-cell branch); that
    // entry's positions were the cell's pre-shrink layout, but the user
    // perceives the column as "newly appearing" — `hasSnapshotEntryInContainer`
    // would otherwise return true and the renderer would skip the
    // accordion grow-from-0 path.
    if (element.hasAttribute(SHRINKING_OUT_ATTR)) {
      this.cancelInFlight(cellId);
      map.delete(cellId);
      this.snapshot?.delete(cellId);
      element.remove();
      return null;
    }
    this.cancelInFlight(cellId);
    map.delete(cellId);
    element.classList.remove(RETAINED_CLASS);
    element.removeAttribute(RETAINED_ATTR);
    element.id = cellId;
    element.style.pointerEvents = "";
    return element;
  }

  /**
   * Hand off a cell that the renderer would otherwise remove for an accordion
   * shrink-out (column hide / pin-out from this section): the cell stays in
   * place and its size in the named axis is animated to zero by the
   * `.st-accordion-animating` CSS transition (width/height). Removed from the
   * DOM after the transition completes.
   *
   * Used when there is no destination position for the cell in the current
   * section's post-render layout — either because the column was hidden or
   * because it moved to a different pinned section. In the moved-section
   * case, the destination section creates a fresh cell that grows from zero
   * width via the existing accordion incoming-cell path, so the visual
   * effect is a synchronized shrink-here / grow-there pair rather than a
   * cross-container slide (which would require translating coordinates
   * between two different container coordinate frames).
   */
  shrinkOutCell(args: {
    cellId: string;
    element: HTMLElement;
    container: HTMLElement;
    axis: "horizontal" | "vertical";
  }): void {
    const { cellId, element, container, axis } = args;
    // Tear down any previous in-flight transition for this id (FLIP from a
    // prior sort, or an earlier shrink-out that's somehow still tracked) so
    // we don't leak its cleanup timeout when we overwrite the inFlight slot.
    this.cancelInFlight(cellId);
    let map = this.retainedCells.get(container);
    if (!map) {
      map = new Map();
      this.retainedCells.set(container, map);
    }

    // Drop a stale ghost with the same id to avoid leaking DOM (e.g. user
    // toggles the same column on and off rapidly during the animation).
    const existing = map.get(cellId);
    if (existing && existing !== element) {
      this.cancelInFlight(cellId);
      existing.remove();
    }

    if (element.id) element.removeAttribute("id");
    element.classList.add(RETAINED_CLASS);
    element.setAttribute(RETAINED_ATTR, "true");
    element.setAttribute(SHRINKING_OUT_ATTR, "true");
    element.style.pointerEvents = "none";
    if (axis === "horizontal") {
      element.style.width = "0px";
    } else {
      element.style.height = "0px";
    }

    map.set(cellId, element);

    // The accordion CSS transition (width/height) is on `.st-cell` /
    // `.st-header-cell` while `.st-accordion-animating` is set on the root.
    // We don't get a `transitionend` handle to it from the FLIP transform
    // listener, so use a duration-based timeout for cleanup.
    const cleanupTimeout = window.setTimeout(() => {
      const m = this.retainedCells.get(container);
      if (m && m.get(cellId) === element) {
        m.delete(cellId);
      }
      element.remove();
    }, this.duration + SAFETY_TIMEOUT_SLACK);

    // Reuse the inFlight bookkeeping so cancel() and discardRetainedIfPresent
    // can tear the timeout down cleanly.
    this.inFlight.set(cellId, {
      element,
      cleanupTimeout,
      transitionEndHandler: () => {},
      isRetained: true,
    });
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
    const incomingOrigins = this.incomingOrigins;
    this.snapshot = null;
    this.incomingOrigins = null;

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
    // Per-play page-coord origin cache for each container we touch. Reading
    // `getBoundingClientRect()` once per container per play call lets every
    // cell in the consider() loop subtract the SAME container shift from
    // its FLIP delta without re-paying the layout cost N times. The
    // container's page origin only changes at layout boundaries, so it's
    // safe to share within a single play.
    const containerOriginCache = new Map<HTMLElement, { left: number; top: number }>();
    const getPlayContainerOrigin = (element: HTMLElement): { left: number; top: number } => {
      let cached = containerOriginCache.get(element);
      if (!cached) {
        const rect = element.getBoundingClientRect();
        cached = { left: rect.left, top: rect.top };
        containerOriginCache.set(element, cached);
      }
      return cached;
    };

    const consider = (
      element: HTMLElement,
      cellId: string,
      isRetained: boolean,
      container: HTMLElement,
    ) => {
      if (seen.has(cellId)) return;
      // Shrink-out ghosts are driven entirely by the accordion CSS
      // width/height transition — they don't move position so the FLIP
      // transform delta would be 0, and the retained-no-delta branch
      // below removes the cell instantly. Mark seen and skip so the
      // shrink animation gets to play out.
      if (isRetained && element.hasAttribute(SHRINKING_OUT_ATTR)) {
        seen.add(cellId);
        return;
      }
      let before = snapshot.get(cellId);
      // Accordion incoming origin: if this is an active (non-retained) cell
      // that has no snapshot entry but a synthetic origin was supplied (e.g.
      // a row that just appeared because its parent grouping row expanded),
      // use the origin as a virtual pre-change position so the cell FLIPs
      // from the parent's slot rather than appearing in place.
      if (!before && !isRetained && incomingOrigins) {
        const origin = incomingOrigins.get(cellId);
        if (origin) {
          before = {
            sourceContainer: null,
            sourceContainerLeft: 0,
            sourceContainerTop: 0,
            left: origin.left,
            top: origin.top,
            styleTop: origin.top,
            styleLeft: origin.left,
            fromDom: false,
          };
        }
      }
      if (!before) {
        return;
      }
      // Cross-container snapshot: the cell was rendered in a different
      // container at snapshot time (e.g. pin/unpin moved a column from
      // `.st-body-main` to `.st-body-pinned-left`). The snapshot's
      // left/top are in the other container's coordinate frame, so a
      // FLIP applied here would slide from a visually wrong origin. Skip;
      // the destination cell renderer treats this as a fresh cell and
      // grows it from width 0 via the accordion path while the source
      // section's renderer shrinks the old cell to width 0.
      if (!isRetained && before.sourceContainer !== null && before.sourceContainer !== container) {
        seen.add(cellId);
        return;
      }
      // Skip cells with an open inline editor (animating breaks input focus).
      if (element.querySelector(".st-cell-editing")) return;

      const currentLeft = parsePx(element.style.left);
      const currentTop = parsePx(element.style.top);

      // If this cell is already animating toward the same logical destination
      // (style.top/left unchanged across the captureSnapshot → render boundary),
      // leave the in-flight transition running. Restarting it would freeze the
      // cell for 2 rAFs, reset the easing curve back to its fast start, and
      // produce a visible velocity discontinuity — exactly the "jump" users see
      // when triggering a sort while another sort is mid-animation. The new
      // FLIP transform would be identical to the live computed transform
      // anyway, so the cancel + restart adds nothing but a stutter.
      if (
        !isRetained &&
        this.inFlight.has(cellId) &&
        Math.abs(before.styleTop - currentTop) < MIN_DELTA &&
        Math.abs(before.styleLeft - currentLeft) < MIN_DELTA
      ) {
        seen.add(cellId);
        return;
      }

      // Scale the FLIP "before" position so cells sliding in from far
      // off-screen take a bounded but proportional journey on each axis.
      // Without scaling, a row whose pre-sort conceptual top was 14970
      // sliding to currentTop=0 would start ~15k pixels below the viewport
      // — with ease-out it stays off-screen for most of the animation,
      // leaving the viewport empty until the last few percent. Same
      // failure mode horizontally for far-column reorders.
      //
      // Two cases skip scaling:
      //
      // 1. Retained (outgoing) cells — `retainCell` already scaled their
      //    `style.top/left` at hand-off time, so we'd be double-scaling.
      //
      // 2. `before.fromDom === true` snapshots, which `readPosition` only
      //    sets for cells that were *already mid-flight* at capture. Their
      //    `before.top/left` came from `getBoundingClientRect`, so it is
      //    the cell's real visual position bounded to the viewport.
      //    Compressing it would re-position the cell away from where the
      //    user is currently seeing it, producing a 100–700 px positional
      //    snap on every interruption sort.
      //
      // Non-in-flight DOM cells fall through to the scaling path: their
      // `style.top/left` is the *logical* destination (potentially tens
      // of thousands of pixels off-screen for far columns), same regime
      // as preLayout entries. For these we need the cell's own size;
      // prefer the inline style (no layout) over offsetHeight/offsetWidth
      // (forces layout).
      const skipScale = isRetained || before.fromDom;
      const cellHeight = skipScale ? 0 : parsePx(element.style.height) || element.offsetHeight || 0;
      const cellWidth = skipScale ? 0 : parsePx(element.style.width) || element.offsetWidth || 0;
      const playMetrics = skipScale ? null : this.getScrollerMetrics(container);
      const beforeTopClipped =
        skipScale || !playMetrics
          ? before.top
          : scaleFlipDistance(before.top, currentTop, cellHeight, playMetrics, "y");
      const beforeLeftClipped =
        skipScale || !playMetrics
          ? before.left
          : scaleFlipDistance(before.left, currentLeft, cellWidth, playMetrics, "x");

      // Container-shift correction. The FLIP delta above is computed in
      // container-local style coordinates, but the inverse transform is
      // applied in page coordinates. When the container itself moved on
      // the page between snapshot and play (e.g. main body shifts right
      // because pinned-left just grew during a pin), the cell's visual
      // page position post-render = newContainerLeft + currentLeft, but
      // its visual pre-render position was oldContainerLeft + before.left.
      // The needed visual delta is therefore:
      //
      //   dx_visual = (oldContainerLeft + before.left) - (newContainerLeft + currentLeft)
      //             = (before.left - currentLeft) - (newContainerLeft - oldContainerLeft)
      //             = dx_styleSpace - containerShift
      //
      // Without subtracting `containerShift`, siblings whose style.left
      // shrunk to fill the gap left by a pinned-out column appear to
      // animate roughly twice the actual visible reflow distance.
      //
      // Skipped for snapshots with no source container (preLayouts /
      // synthetic incoming origins): those are conceptual positions that
      // never had a real container anchor.
      let containerShiftX = 0;
      let containerShiftY = 0;
      if (before.sourceContainer !== null) {
        // Cross-container case is rejected above; here sourceContainer
        // either equals `container` (siblings reflowing in their own
        // section) or is the same container for a retained ghost.
        const playOrigin = getPlayContainerOrigin(container);
        containerShiftX = playOrigin.left - before.sourceContainerLeft;
        containerShiftY = playOrigin.top - before.sourceContainerTop;
      }

      const dxRaw = beforeLeftClipped - currentLeft;
      const dyRaw = beforeTopClipped - currentTop;
      const dx = dxRaw - containerShiftX;
      const dy = dyRaw - containerShiftY;
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
        retained.forEach((element, cellId) => {
          consider(element, cellId, true, container);
        });
      }

      // Active cells: incoming + persistent.
      const cells = collectRenderedCells(container);
      cells.forEach((element, cellId) => {
        consider(element, cellId, false, container);
      });
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
    this.incomingOrigins = null;
    this.clearScrollerMetricsCache();
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

  private readPosition(
    cellId: string,
    element: HTMLElement,
    sourceContainer: HTMLElement,
    sourceContainerLeft: number,
    sourceContainerTop: number,
  ): CellSnapshot {
    const styleTop = parsePx(element.style.top);
    const styleLeft = parsePx(element.style.left);
    const inFlight = this.inFlight.get(cellId);
    if (inFlight) {
      const rect = element.getBoundingClientRect();
      const parent = element.offsetParent as HTMLElement | null;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        return {
          sourceContainer,
          sourceContainerLeft,
          sourceContainerTop,
          left: rect.left - parentRect.left + parent.scrollLeft,
          top: rect.top - parentRect.top + parent.scrollTop,
          styleTop,
          styleLeft,
          fromDom: true,
        };
      }
      return {
        sourceContainer,
        sourceContainerLeft,
        sourceContainerTop,
        left: rect.left,
        top: rect.top,
        styleTop,
        styleLeft,
        fromDom: true,
      };
    }
    // Non-in-flight branch: style.top/left is the cell's *logical*
    // destination, not a viewport-bounded visual position. For columns far
    // off-screen this can be tens of thousands of pixels away from the
    // current viewport — same regime as a preLayout entry — so we leave
    // fromDom=false and let play() compress the FLIP via scaleFlipDistance.
    return {
      sourceContainer,
      sourceContainerLeft,
      sourceContainerTop,
      left: styleLeft,
      top: styleTop,
      styleTop,
      styleLeft,
      fromDom: false,
    };
  }

  private startTransition(cellId: string, element: HTMLElement, isRetained: boolean): void {
    // Outgoing (retained) cells use an ease-in curve so the visible portion
    // of their slide (cell at its old visible position → viewport edge) is
    // back-loaded in time. Incoming + persistent cells stay on the
    // configured easing (defaults to a punchy ease-out that decelerates them
    // smoothly into their final visible position).
    const easing = isRetained ? OUTGOING_EASING : this.easing;
    element.style.transition = `transform ${this.duration}ms ${easing}`;
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
type ScrollerMetrics = {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
  clientWidth: number;
  scrollWidth: number;
  scrollLeft: number;
};

const readScrollerMetrics = (container: HTMLElement): ScrollerMetrics => {
  const yScroller = container.parentElement;
  return {
    clientHeight: yScroller ? yScroller.clientHeight : 0,
    scrollHeight: yScroller ? yScroller.scrollHeight : 0,
    scrollTop: yScroller ? yScroller.scrollTop : 0,
    clientWidth: container.clientWidth,
    scrollWidth: container.scrollWidth,
    scrollLeft: container.scrollLeft,
  };
};

const scaleFlipDistance = (
  distantPos: number,
  anchorPos: number,
  cellSize: number,
  metrics: ScrollerMetrics,
  axis: FlipAxis,
): number => {
  const clientSize = axis === "y" ? metrics.clientHeight : metrics.clientWidth;
  const scrollSize = axis === "y" ? metrics.scrollHeight : metrics.scrollWidth;
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
  const scrollOffset = axis === "y" ? metrics.scrollTop : metrics.scrollLeft;
  if (distantPos >= scrollOffset - cellBuffer && distantPos <= scrollOffset + clientSize) {
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
