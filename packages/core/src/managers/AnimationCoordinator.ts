import { getRenderedCells as getBodyRenderedCells } from "../utils/bodyCell/eventTracking";
import { getRenderedCells as getHeaderRenderedCells } from "../utils/headerCell/eventTracking";
import {
  parseCssTranslate,
  setFlipCompensationEnabled,
} from "../utils/setAbsoluteCellPosition";
import { CELL_SLIDE_ANIM_ID, CellSlideAnimator } from "./CellSlideAnimator";
import { isNearViewport, parkAndStagger, type ParkBand } from "../utils/parkAndStagger";

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
/** Marks a cell mid-FLIP so CSS can drop opaque fills (headers pass through). */
const FLIP_ACTIVE_CLASS = "st-flip-active";
/**
 * Marker on retained ghost cells whose only animation is a CSS-driven
 * width/height shrink (no FLIP transform). The `play()` per-cell loop must
 * skip them — its retained-cell branch removes any cell with a zero FLIP
 * delta immediately, which would tear the ghost out of the DOM before the
 * accordion CSS transition can play.
 */
const SHRINKING_OUT_ATTR = "data-shrinking-out";


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
   * viewport — so parking it would move the cell away from where it currently
   * looks. Far conceptual positions (preLayout / logical style.top) are parked
   * just outside the visible band instead.
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
  /**
   * Accessors that were already renderable (visible leaf/group columns) in the
   * pre-change layout for an in-flight accordion-horizontal toggle. Set once
   * per collapse/expand render and consumed by the renderers' grow-from-zero
   * gate so a column that merely re-enters the virtualization band (because the
   * collapsed group shrank the content width and clamped scrollLeft) is NOT
   * mistaken for a freshly-expanded column and animated from width 0.
   *
   * Header cells have no full pre-change conceptual layout the way body cells do
   * (see SectionRenderer.getCurrentBodyLayouts), so `hasSnapshotEntry` alone
   * can't tell "newly visible" apart from "scrolled back into view". This set
   * supplies the missing pre-change visibility signal. Cleared at the end of
   * {@link play}.
   */
  private accordionPreVisibleAccessors: Set<string> | null = null;
  private inFlight: Map<string, InFlightCell> = new Map();
  /** Outgoing cells the renderer handed off; keyed per container so play() finds them. */
  private retainedCells: Map<HTMLElement, Map<string, HTMLElement>> = new Map();
  private prefersReducedMotion: boolean;
  /**
   * Per-render cache of scroller layout metrics. Reading
   * `scrollHeight`/`clientHeight`/etc. after a style mutation forces a sync
   * layout flush; without this cache, park-and-stagger reads force a fresh
   * flush for every cell in the retain/play loops, turning a single sort
   * into hundreds of layout passes (observed: 513ms in `msRemove` for ~287
   * cells, growing across consecutive sorts as DOM size grows). The cache
   * is cleared at the boundaries of a render cycle (captureSnapshot start
   * and play end / cancel) since column count and section heights are
   * stable within a single sort.
   */
  private scrollerMetricsCache: WeakMap<HTMLElement, ScrollerMetrics> = new WeakMap();

  /**
   * Vertical scroller metrics override for external/page-scroll mode. When the
   * table has no internal vertical overflow (it grows to its natural height and
   * a parent element / the window scrolls), the body container's own
   * clientHeight/scrollHeight no longer describe the visible viewport, so
   * {@link parkAndStagger} can't park the slide and sort cells travel the
   * full conceptual distance. The vanilla table pushes the real visible
   * viewport here (from the same `getExternalScrollMetrics` the virtualizer
   * uses) so the y-axis park matches the on-screen viewport. `null`
   * when external scroll is inactive — internal scroller metrics are used as-is.
   */
  private externalVerticalScroll: {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
  } | null = null;

  /**
   * The currently-scheduled (not-yet-started) FLIP frame. play() defers the
   * transition start by two animation frames so the inverted "First" frame
   * gets painted before the transition fires. Spam-clicking sort triggers a
   * full re-render + play() inside that two-frame window: without coalescing,
   * the stale chain's startTransition zeroes the transforms the newer cycle
   * just inverted (a frame early), so the final transition animates
   * identity→identity and nothing visibly moves — and many captured nodes are
   * detached by the intervening render before they ever transition. Tracking
   *     the pending frame lets a new play() cancel the prior cycle and reset the
   * transforms it left behind, so only the latest sort animates.
   */
  private scheduledFlip: {
    rafId: number;
    pending: Array<{ cellId: string; element: HTMLElement; isRetained: boolean }>;
    /** Monotonic id so a cancelled double-rAF callback can detect it is stale. */
    generation: number;
  } | null = null;
  private flipGeneration = 0;

  /**
   * True while the user is mid column-header drag-reorder. Motion is owned
   * by {@link CellSlideAnimator} (not CSS-transition invert).
   */
  private columnReordering = false;

  /** Shared slide helper for column-drag and sort/play position moves. */
  private readonly cellSlideAnimator = new CellSlideAnimator();


  /**
   * Invoked immediately BEFORE a retained/ghost element is permanently removed
   * from the DOM (FLIP/shrink/cancel/destroy teardown). Lets framework adapters
   * tear down renderer subtrees (React portals, etc.) mounted into the element
   * before it's discarded. NOT called on reuse/reparent paths
   * ({@link claimRetainedForReuse} success), so a reclaimed ghost keeps its
   * content.
   */
  private onHostDiscard?: (host: HTMLElement) => void;

  constructor(opts: AnimationCoordinatorOptions = {}) {
    this.duration = opts.duration ?? DEFAULT_DURATION;
    this.easing = opts.easing ?? DEFAULT_EASING;
    this.prefersReducedMotion = readPrefersReducedMotion();
    this.cellSlideAnimator.setDuration(this.duration);
  }

  /**
   * Register the callback fired before a ghost/retained element is permanently
   * removed (see {@link onHostDiscard}). Additive: passing `undefined` disables it.
   */
  setOnHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void {
    this.onHostDiscard = cb;
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
      this.cellSlideAnimator.setDuration(duration);
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

  /**
   * Enter/leave column-header drag-reorder mode. Motion is owned by
   * {@link CellSlideAnimator}. Flip compensation is OFF so left writes
   * stay plain; the animator applies hold+tween after those writes.
   */
  setColumnReordering(active: boolean): void {
    if (this.columnReordering === active) return;
    this.columnReordering = active;
    this.cellSlideAnimator.setActive(active);
    setFlipCompensationEnabled(!active);
  }

  isColumnReordering(): boolean {
    return this.columnReordering;
  }

  /**
   * Snapshot header visuals before mid-drag style.left rewrites.
   * Call instead of {@link captureSnapshot} while column-dragging.
   */
  beginColumnReorder(root: ParentNode): void {
    if (!this.isEnabled() || !this.columnReordering) return;
    this.cellSlideAnimator.beginOrderChange(root);
  }

  /**
   * Retarget WAAPI after style.left rewrites (same task, before paint).
   * Call instead of {@link play} while column-dragging.
   */
  commitColumnReorder(root: ParentNode): void {
    if (!this.isEnabled() || !this.columnReordering) return;
    this.cellSlideAnimator.commitOrderChange(root);
  }

  isInFlight(cellId: string): boolean {
    return this.inFlight.has(cellId);
  }

  /** True while any FLIP / retained-cell / column-reorder transition is running. */
  hasInFlight(): boolean {
    return this.inFlight.size > 0 || this.cellSlideAnimator.hasInFlight();
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
   * Register the set of accessors that were renderable in the pre-change layout
   * of an accordion-horizontal toggle. Must be set after `captureSnapshot` and
   * before the render that creates cells. Consumed and cleared by the next
   * {@link play}. Pass `null` (e.g. for vertical/row accordions) to disable the
   * re-entry guard so behavior is unchanged.
   */
  setAccordionPreVisibleAccessors(accessors: Set<string> | null): void {
    if (!this.isEnabled()) {
      this.accordionPreVisibleAccessors = null;
      return;
    }
    this.accordionPreVisibleAccessors = accessors && accessors.size > 0 ? accessors : null;
  }

  /**
   * True when `accessor` was already a renderable column before the current
   * accordion-horizontal toggle. Renderers use this to skip the grow-from-zero
   * animation for columns that only re-entered the virtualization band rather
   * than genuinely becoming visible from an expand.
   */
  wasRenderableBeforeAccordion(accessor: string): boolean {
    return this.accordionPreVisibleAccessors?.has(accessor) ?? false;
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
      const base = readScrollerMetrics(container);
      // In external/page-scroll mode the body container has no internal
      // vertical overflow, so its clientHeight/scrollHeight describe the full
      // table rather than the visible viewport. Substitute the real visible
      // viewport (vertical axis only — the body section is still the
      // horizontal scroller) so park-and-stagger can bound the slide.
      metrics = this.externalVerticalScroll
        ? {
            ...base,
            clientHeight: this.externalVerticalScroll.clientHeight,
            scrollHeight: this.externalVerticalScroll.scrollHeight,
            scrollTop: this.externalVerticalScroll.scrollTop,
          }
        : base;
      this.scrollerMetricsCache.set(container, metrics);
    }
    return metrics;
  }

  /**
   * Supply (or clear) the vertical scroller metrics override used by
   * park-and-stagger in external/page-scroll mode. Must be set before
   * `captureSnapshot`/`retainCell`/`play` so slides park against the real
   * visible viewport. Pass `null` to fall back to the body
   * container's own metrics (internal scroll).
   */
  setExternalVerticalScroll(
    metrics: { clientHeight: number; scrollHeight: number; scrollTop: number } | null,
  ): void {
    this.externalVerticalScroll = metrics;
    // Drop any cached merge so the next read picks up the new override.
    this.clearScrollerMetricsCache();
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
            // fromDom=false signals that this position is conceptual
            // (potentially far off-screen) and should be parked just outside
            // the visible band.
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
   * Whether a vertical position transition should be animated. Rows that live
   * only in the virtualization padding band (above/below the visible viewport)
   * should teleport rather than FLIP — otherwise a mid-scroll sort animates
   * hundreds of off-screen rows through the viewport at once.
   */
  shouldAnimateVerticalTransition(args: {
    beforeTop: number;
    afterTop: number;
    cellHeight: number;
    container: HTMLElement;
  }): boolean {
    const metrics = this.getScrollerMetrics(args.container);
    const wasVisible = isRowTopInVerticalViewport(args.beforeTop, args.cellHeight, metrics);
    const willBeVisible = isRowTopInVerticalViewport(args.afterTop, args.cellHeight, metrics);
    return wasVisible || willBeVisible;
  }

  /**
   * Whether a horizontal position transition should be animated. Same viewport
   * gate as {@link shouldAnimateVerticalTransition} but for column slides.
   */
  shouldAnimateHorizontalTransition(args: {
    beforeLeft: number;
    afterLeft: number;
    cellWidth: number;
    container: HTMLElement;
  }): boolean {
    const metrics = this.getScrollerMetrics(args.container);
    const wasVisible = isColumnLeftInHorizontalViewport(args.beforeLeft, args.cellWidth, metrics);
    const willBeVisible = isColumnLeftInHorizontalViewport(args.afterLeft, args.cellWidth, metrics);
    return wasVisible || willBeVisible;
  }

  /**
   * Whether a cell's position change should participate in FLIP animation.
   * Only axes that actually moved are checked against the viewport gate —
   * a vertical sort must not inherit "visible" from an unchanged horizontal
   * position (which would retain/mount every column in every padding-band row).
   */
  shouldAnimateTransition(args: {
    beforeTop: number;
    afterTop: number;
    beforeLeft: number;
    afterLeft: number;
    cellHeight: number;
    cellWidth: number;
    container: HTMLElement;
  }): boolean {
    const vertMoved = Math.abs(args.beforeTop - args.afterTop) >= MIN_DELTA;
    const horizMoved = Math.abs(args.beforeLeft - args.afterLeft) >= MIN_DELTA;
    if (
      vertMoved &&
      this.shouldAnimateVerticalTransition({
        beforeTop: args.beforeTop,
        afterTop: args.afterTop,
        cellHeight: args.cellHeight,
        container: args.container,
      })
    ) {
      return true;
    }
    if (
      horizMoved &&
      this.shouldAnimateHorizontalTransition({
        beforeLeft: args.beforeLeft,
        afterLeft: args.afterLeft,
        cellWidth: args.cellWidth,
        container: args.container,
      })
    ) {
      return true;
    }
    return false;
  }

  /**
   * Whether an incoming cell (in the snapshot but not previously in the DOM)
   * should be mounted for this sort/reorder render. Padding-band rows that
   * never intersect the visible viewport are deferred to the next scroll
   * render so they do not pop into existence at animation start.
   */
  shouldMountIncomingCell(args: {
    cellId: string;
    afterTop: number;
    afterLeft: number;
    cellHeight: number;
    cellWidth: number;
    container: HTMLElement;
  }): boolean {
    const entry = this.snapshot?.get(args.cellId);
    if (!entry) return true;
    const metrics = this.getScrollerMetrics(args.container);
    // Mount when the destination or pre-change position intersects the
    // visible viewport. Unlike {@link shouldAnimateTransition}, movement
    // between the two is NOT required — a row can enter the band at the
    // same absolute `top` after a sort (stable/equal keys) and still needs
    // its DOM cell; skipping mount left the first visible slot empty.
    const wasVisibleY = isRowTopInVerticalViewport(entry.styleTop, args.cellHeight, metrics);
    const willBeVisibleY = isRowTopInVerticalViewport(args.afterTop, args.cellHeight, metrics);
    const wasVisibleX = isColumnLeftInHorizontalViewport(entry.styleLeft, args.cellWidth, metrics);
    const willBeVisibleX = isColumnLeftInHorizontalViewport(
      args.afterLeft,
      args.cellWidth,
      metrics,
    );
    return wasVisibleY || willBeVisibleY || wasVisibleX || willBeVisibleX;
  }

  /**
   * Whether the cell currently paints inside the body scrollers' clip rects.
   * Outgoing retain decisions use this as a fallback when {@link shouldAnimateTransition}
   * rejects a cell based on `style.top`/`style.left` alone: virtualization padding
   * rows can sit with their leading edge outside the scroll band while still being
   * partially visible on screen (common at the bottom when scrolled to the end).
   */
  isCellRenderedInScrollerViewport(element: HTMLElement, container: HTMLElement): boolean {
    const cellRect = element.getBoundingClientRect();
    if (cellRect.width === 0 && cellRect.height === 0) return false;

    const hScrollerRect = container.getBoundingClientRect();
    const horizontalVisible =
      cellRect.right > hScrollerRect.left && cellRect.left < hScrollerRect.right;

    const vScroller = this.externalVerticalScroll
      ? null // external mode: vertical clip follows the page viewport below
      : container.parentElement;
    if (!vScroller) {
      // Fall back to the horizontal section clip only.
      return horizontalVisible;
    }
    const vScrollerRect = vScroller.getBoundingClientRect();
    const verticalVisible =
      cellRect.bottom > vScrollerRect.top && cellRect.top < vScrollerRect.bottom;

    return horizontalVisible && verticalVisible;
  }

  /**
   * Whether an outgoing DOM cell at a vertical scroll extreme (top or bottom of
   * the dataset) should be retained even when {@link shouldAnimateTransition}
   * rejects it on leading-edge grounds. Virtualization keeps a few overscan
   * rows mounted above/below the strict viewport at max scroll; those rows
   * must still slide out as ghosts when a sort evicts them.
   */
  shouldRetainDomCellAtScrollExtrema(cellId: string, container: HTMLElement): boolean {
    const entry = this.snapshot?.get(cellId);
    // Live DOM cells always have a source container; preLayout-only entries do not.
    if (!entry || entry.sourceContainer === null) return false;

    const metrics = this.getScrollerMetrics(container);
    if (metrics.scrollHeight <= metrics.clientHeight) return false;

    const atBottom = metrics.scrollTop + metrics.clientHeight >= metrics.scrollHeight - 1;
    const atTop = metrics.scrollTop <= 1;
    if (!atBottom && !atTop) return false;

    const slack = metrics.clientHeight;
    if (atBottom && entry.styleTop >= metrics.scrollTop - slack) return true;
    if (atTop && entry.styleTop <= metrics.scrollTop + slack) return true;
    return false;
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
      this.onHostDiscard?.(existing);
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
      this.onHostDiscard?.(element);
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
      this.onHostDiscard?.(existing);
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
      this.onHostDiscard?.(element);
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
    this.onHostDiscard?.(element);
    element.remove();
  }

  /**
   * Apply the FLIP invert + play step to every cell present in the snapshot
   * that is now in the DOM (either as an actively rendered cell or as a
   * retained cell). Clears the snapshot.
   */
  play(args: { containers: Array<HTMLElement | null | undefined> }): void {
    // Column-drag uses {@link commitColumnReorder} — never the general FLIP path.
    if (this.columnReordering) {
      this.snapshot = null;
      return;
    }
    const snapshot = this.snapshot;
    const incomingOrigins = this.incomingOrigins;
    this.snapshot = null;
    this.incomingOrigins = null;
    // NOTE: do NOT clear `accordionPreVisibleAccessors` here. A single
    // collapse/expand toggle can produce a follow-up micro-render (e.g. the
    // collapsed group shrinks the content width, clamping scrollLeft, which
    // re-renders the columns that just scrolled back into view) that runs
    // AFTER this play() but is still part of the same accordion window. Those
    // re-entering columns must still see the pre-change visibility set so they
    // aren't mistaken for freshly-expanded columns. The set is recomputed at
    // the start of every horizontal toggle and reset to null on vertical
    // toggles, and it's only consulted while `accordionAxis` is active, so
    // letting it outlive a single play() is safe.

    if (!this.isEnabled() || !snapshot) {
      // Nothing to play. Drop only retained cells that aren't already
      // mid-animation; in-flight ghosts have a transition running and will
      // clean themselves up on transitionend. Wiping them here would kill
      // the slide-out for renders triggered by ResizeObserver / scrollbar
      // visibility / dimension recompute that fire during an animation.
      this.retainedCells.forEach((map) => {
        map.forEach((element, cellId) => {
          if (!this.inFlight.has(cellId)) {
            this.onHostDiscard?.(element);
            element.remove();
            map.delete(cellId);
          }
        });
      });
      return;
    }

    type Candidate = {
      cellId: string;
      element: HTMLElement;
      isRetained: boolean;
      container: HTMLElement;
      beforeLeft: number;
      beforeTop: number;
      currentLeft: number;
      currentTop: number;
      cellWidth: number;
      cellHeight: number;
      destUnchanged: boolean;
      sourceContainer: HTMLElement | null;
      sourceContainerLeft: number;
    };
    type Pending = {
      cellId: string;
      element: HTMLElement;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      isRetained: boolean;
      destUnchanged: boolean;
    };
    const candidates: Candidate[] = [];
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
      // Skip cells with an open inline editor (animating breaks input focus).
      if (element.querySelector(".st-cell-editing")) return;

      const currentLeft = parsePx(element.style.left);
      const currentTop = parsePx(element.style.top);
      const cellHeight = parsePx(element.style.height) || element.offsetHeight || 0;
      const cellWidth = parsePx(element.style.width) || element.offsetWidth || 0;

      if (!before && !isRetained) {
        const metrics = this.getScrollerMetrics(container);
        const midY = metrics.scrollTop + metrics.clientHeight / 2;
        const fromAfter = currentTop <= midY;
        const originTop = fromAfter
          ? metrics.scrollTop + metrics.clientHeight + cellHeight
          : metrics.scrollTop - cellHeight;
        before = {
          sourceContainer: null,
          sourceContainerLeft: 0,
          sourceContainerTop: 0,
          left: currentLeft,
          top: originTop,
          styleTop: originTop,
          styleLeft: currentLeft,
          fromDom: false,
        };
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

      // If this cell is already animating toward the same logical destination
      // (style.top/left unchanged across the captureSnapshot → render boundary),
      // leave the in-flight transition running. Restarting it would freeze the
      // cell for 2 rAFs, reset the easing curve back to its fast start, and
      // produce a visible velocity discontinuity — exactly the "jump" users see
      // when triggering a sort while another sort is mid-animation.
      if (
        !isRetained &&
        Math.abs(before.styleTop - currentTop) < MIN_DELTA &&
        Math.abs(before.styleLeft - currentLeft) < MIN_DELTA &&
        (this.inFlight.has(cellId) || this.hasRunningCellSlide(element))
      ) {
        seen.add(cellId);
        return;
      }
      const destUnchanged =
        Math.abs(before.styleLeft - currentLeft) < MIN_DELTA &&
        Math.abs(before.styleTop - currentTop) < MIN_DELTA;

      candidates.push({
        cellId,
        element,
        isRetained,
        container,
        beforeLeft: before.left,
        beforeTop: before.top,
        currentLeft,
        currentTop,
        cellWidth,
        cellHeight,
        destUnchanged,
        sourceContainer: before.sourceContainer,
        sourceContainerLeft: before.sourceContainerLeft,
      });
      seen.add(cellId);
    };

    for (const container of args.containers) {
      if (!container) continue;

      const retained = this.retainedCells.get(container);
      if (retained) {
        retained.forEach((element, cellId) => {
          consider(element, cellId, true, container);
        });
      }

      const cells = collectRenderedCells(container);
      cells.forEach((element, cellId) => {
        consider(element, cellId, false, container);
      });
    }

    const byContainer = new Map<HTMLElement, Candidate[]>();
    for (const candidate of candidates) {
      const list = byContainer.get(candidate.container);
      if (list) list.push(candidate);
      else byContainer.set(candidate.container, [candidate]);
    }

    for (const [container, group] of byContainer) {
      const metrics = this.getScrollerMetrics(container);
      const yBand: ParkBand = {
        scrollOffset: metrics.scrollTop,
        clientSize: metrics.clientHeight,
      };
      const xBand: ParkBand = {
        scrollOffset: metrics.scrollLeft,
        clientSize: metrics.clientWidth,
      };
      const yHoldBand: ParkBand = {
        scrollOffset: yBand.scrollOffset - yBand.clientSize,
        clientSize: yBand.clientSize * 3,
      };
      const xHoldBand: ParkBand = {
        scrollOffset: xBand.scrollOffset - xBand.clientSize,
        clientSize: xBand.clientSize * 3,
      };
      const originY = parkAndStagger(
        group.map((c) => {
          let forceSide: "before" | "after" | undefined;
          if (c.sourceContainer === null && !c.isRetained) {
            if (c.currentTop < c.beforeTop - MIN_DELTA) forceSide = "after";
            else if (c.currentTop > c.beforeTop + MIN_DELTA) forceSide = "before";
          }
          return {
            id: c.cellId,
            truePos: c.beforeTop,
            cellSize: c.cellHeight,
            forceSide,
            holdTruePos:
              c.sourceContainer !== null &&
              isNearViewport(c.beforeTop, c.cellHeight, yHoldBand),
          };
        }),
        yBand,
      );
      const destY = parkAndStagger(
        group.map((c) => ({ id: c.cellId, truePos: c.currentTop, cellSize: c.cellHeight })),
        yBand,
      );
      const originX = parkAndStagger(
        group.map((c) => {
          let forceSide: "before" | "after" | undefined;
          if (c.sourceContainer === null && !c.isRetained) {
            if (c.currentLeft < c.beforeLeft - MIN_DELTA) forceSide = "after";
            else if (c.currentLeft > c.beforeLeft + MIN_DELTA) forceSide = "before";
          }
          return {
            id: c.cellId,
            truePos: c.beforeLeft,
            cellSize: c.cellWidth,
            forceSide,
            holdTruePos:
              c.sourceContainer !== null &&
              isNearViewport(c.beforeLeft, c.cellWidth, xHoldBand),
          };
        }),
        xBand,
      );
      const destX = parkAndStagger(
        group.map((c) => ({ id: c.cellId, truePos: c.currentLeft, cellSize: c.cellWidth })),
        xBand,
      );

      for (const candidate of group) {
        const parkedFromX = originX.get(candidate.cellId) ?? candidate.beforeLeft;
        const parkedToX = destX.get(candidate.cellId) ?? candidate.currentLeft;
        const parkedFromY = originY.get(candidate.cellId) ?? candidate.beforeTop;
        const parkedToY = destY.get(candidate.cellId) ?? candidate.currentTop;

        let containerShiftX = 0;
        if (candidate.sourceContainer !== null) {
          const playOrigin = getPlayContainerOrigin(container);
          containerShiftX = playOrigin.left - candidate.sourceContainerLeft;
        }

        let fromX = parkedFromX - candidate.currentLeft - containerShiftX;
        let fromY = parkedFromY - candidate.currentTop;
        let toX = parkedToX - candidate.currentLeft;
        let toY = parkedToY - candidate.currentTop;

        const isIncoming = candidate.sourceContainer === null && !candidate.isRetained;
        if (
          isIncoming &&
          Math.abs(fromX - toX) < MIN_DELTA &&
          Math.abs(fromY - toY) < MIN_DELTA
        ) {
          const midY = yBand.scrollOffset + yBand.clientSize / 2;
          const originY =
            candidate.currentTop <= midY
              ? yBand.scrollOffset + yBand.clientSize + candidate.cellHeight
              : yBand.scrollOffset - candidate.cellHeight;
          fromY = originY - candidate.currentTop;
        }

        const fromNearY = isNearViewport(candidate.beforeTop, candidate.cellHeight, yBand);
        const fromNearX = isNearViewport(candidate.beforeLeft, candidate.cellWidth, xBand);
        const toNearY = isNearViewport(candidate.currentTop, candidate.cellHeight, yBand);
        const toNearX = isNearViewport(candidate.currentLeft, candidate.cellWidth, xBand);
        if (
          !isIncoming &&
          fromNearX &&
          fromNearY &&
          toNearX &&
          toNearY &&
          Math.abs(candidate.beforeLeft - candidate.currentLeft) < MIN_DELTA &&
          Math.abs(candidate.beforeTop - candidate.currentTop) < MIN_DELTA
        ) {
          if (candidate.isRetained) {
            this.cancelInFlight(candidate.cellId);
            this.retainedCells.get(container)?.delete(candidate.cellId);
            this.onHostDiscard?.(candidate.element);
            candidate.element.remove();
          }
          continue;
        }

        if (Math.abs(fromX - toX) < MIN_DELTA && Math.abs(fromY - toY) < MIN_DELTA) {
          if (candidate.isRetained) {
            this.cancelInFlight(candidate.cellId);
            this.retainedCells.get(container)?.delete(candidate.cellId);
            this.onHostDiscard?.(candidate.element);
            candidate.element.remove();
          }
          continue;
        }

        pending.push({
          cellId: candidate.cellId,
          element: candidate.element,
          fromX,
          fromY,
          toX,
          toY,
          isRetained: candidate.isRetained,
          destUnchanged: candidate.destUnchanged,
        });
      }
    }

    if (this.scheduledFlip) {
      cancelAnimationFrame(this.scheduledFlip.rafId);
      const nextPendingIds = new Set(pending.map((p) => p.cellId));
      for (const { cellId, element, isRetained } of this.scheduledFlip.pending) {
        if (nextPendingIds.has(cellId) || seen.has(cellId)) {
          continue;
        }
        this.bakeLiveTransform(element);
        const live = parseCssTranslate(element.style.transform || "");
        if (live && hasNonIdentityTranslate(element.style.transform || "")) {
          pending.push({
            cellId,
            element,
            fromX: live.x,
            fromY: live.y,
            toX: 0,
            toY: 0,
            isRetained,
            destUnchanged: true,
          });
          seen.add(cellId);
          nextPendingIds.add(cellId);
        } else {
          element.style.transition = "none";
          element.style.transform = "";
          element.style.willChange = "";
          element.style.pointerEvents = "";
          element.classList.remove(FLIP_ACTIVE_CLASS);
        }
      }
      this.scheduledFlip = null;
    }

    if (pending.length === 0) return;

    for (const item of pending) {
      const { cellId, element } = item;
      let { fromX, fromY } = item;
      const wasInFlight = this.inFlight.has(cellId);
      if (wasInFlight) {
        element.style.transition = "none";
        if (!hasNonIdentityTranslate(element.style.transform || "")) {
          const computed = getComputedStyle(element).transform;
          if (computed && computed !== "none") {
            element.style.transform = computed;
          }
        }
      } else {
        element.style.transition = "none";
      }
      const priorTransform = element.style.transform || "";
      const liveTranslate = parseCssTranslate(priorTransform);
      if (liveTranslate && hasNonIdentityTranslate(priorTransform)) {
        const matchesSnapshot =
          Math.abs(liveTranslate.x - fromX) <= 1 && Math.abs(liveTranslate.y - fromY) <= 1;
        if ((wasInFlight && item.destUnchanged) || (!wasInFlight && matchesSnapshot)) {
          fromX = liveTranslate.x;
          fromY = liveTranslate.y;
        }
      }
      this.startCellSlide({
        cellId,
        element,
        fromX,
        fromY,
        toX: item.toX,
        toY: item.toY,
        isRetained: item.isRetained,
      });
    }
  }

  /**
   * Snap scheduled + in-flight FLIPs to their destinations without clearing
   * an armed snapshot. Used between rapid column-drag swaps so each swap
   * starts from settled style.left (grid-aligned) instead of compounding
   * mid-flight visual dx.
   */
  private settleInFlight(): void {
    if (this.scheduledFlip) {
      cancelAnimationFrame(this.scheduledFlip.rafId);
      for (const { element } of this.scheduledFlip.pending) {
        element.style.transition = "none";
        element.style.transform = "";
        element.style.willChange = "";
        element.style.pointerEvents = "";
        element.classList.remove(FLIP_ACTIVE_CLASS);
      }
      this.scheduledFlip = null;
    }
    const entries = Array.from(this.inFlight.entries());
    this.inFlight.clear();
    for (const [cellId, entry] of entries) {
      window.clearTimeout(entry.cleanupTimeout);
      entry.element.removeEventListener("transitionend", entry.transitionEndHandler);
      this.finishElement(cellId, entry.element, entry.isRetained);
    }
  }

  /**
   * Cancel every in-flight transition and clear any armed snapshot. Active
   * cells snap to their final positions; retained cells are removed from the
   * DOM so we don't leak nodes.
   */
  cancel(): void {
    this.snapshot = null;
    this.incomingOrigins = null;
    this.accordionPreVisibleAccessors = null;
    this.clearScrollerMetricsCache();
    this.settleInFlight();
    // Clean up any retained cells that weren't in flight (e.g. cell was
    // retained but never reached the play step).
    this.retainedCells.forEach((map) => {
      map.forEach((element) => {
        this.onHostDiscard?.(element);
        element.remove();
      });
      map.clear();
    });
    this.retainedCells.clear();
  }

  destroy(): void {
    this.setColumnReordering(false);
    this.cellSlideAnimator.destroy();
    this.cancel();
  }

  private readVisualPosition(
    element: HTMLElement,
    sourceContainer: HTMLElement,
    sourceContainerLeft: number,
    sourceContainerTop: number,
    styleTop: number,
    styleLeft: number,
  ): CellSnapshot {
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

  private readPosition(
    cellId: string,
    element: HTMLElement,
    sourceContainer: HTMLElement,
    sourceContainerLeft: number,
    sourceContainerTop: number,
  ): CellSnapshot {
    const styleTop = parsePx(element.style.top);
    const styleLeft = parsePx(element.style.left);
    // Use the live visual position whenever a FLIP transform is still on the
    // element — including the double-rAF gap where invert is applied but
    // `inFlight` is not set yet, and stranded-invert cases where scheduledFlip
    // was cleared without clearing transforms. Capturing logical style.left
    // here is what makes rapid reorders "jump then animate".
    //
    // During an active CSS transition, `style.transform` is already identity
    // while the *computed* matrix is mid-slide. Prefer computed / `.st-flip-active`
    // so a recycled-or-missed inFlight entry cannot fall through to style.left.
    const markedFlipping = element.classList.contains(FLIP_ACTIVE_CLASS);
    const styleTransform = element.style.transform || "";
    const hasStyleTranslate = hasNonIdentityTranslate(styleTransform);
    let computedTranslate: { x: number; y: number } | null = null;
    if (
      !hasStyleTranslate &&
      (markedFlipping || this.inFlight.has(cellId)) &&
      typeof getComputedStyle !== "undefined"
    ) {
      computedTranslate = parseCssTranslate(getComputedStyle(element).transform);
    }
    if (
      this.inFlight.has(cellId) ||
      markedFlipping ||
      hasStyleTranslate ||
      (computedTranslate &&
        (Math.abs(computedTranslate.x) > MIN_DELTA || Math.abs(computedTranslate.y) > MIN_DELTA))
    ) {
      if (hasStyleTranslate) {
        const live = parseCssTranslate(styleTransform);
        if (live) {
          return {
            sourceContainer,
            sourceContainerLeft,
            sourceContainerTop,
            left: styleLeft + live.x,
            top: styleTop + live.y,
            styleTop,
            styleLeft,
            fromDom: true,
          };
        }
      }
      if (
        computedTranslate &&
        (Math.abs(computedTranslate.x) > MIN_DELTA || Math.abs(computedTranslate.y) > MIN_DELTA)
      ) {
        return {
          sourceContainer,
          sourceContainerLeft,
          sourceContainerTop,
          left: styleLeft + computedTranslate.x,
          top: styleTop + computedTranslate.y,
          styleTop,
          styleLeft,
          fromDom: true,
        };
      }
      return this.readVisualPosition(
        element,
        sourceContainer,
        sourceContainerLeft,
        sourceContainerTop,
        styleTop,
        styleLeft,
      );
    }
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

  /**
   * Hold the cell at (fromX, fromY) relative to its layout box, then slide to (toX, toY).
   */
  private startCellSlide(args: {
    cellId: string;
    element: HTMLElement;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    isRetained: boolean;
  }): void {
    const { cellId, element, fromX, fromY, toX, toY, isRetained } = args;
    if (!element.isConnected) return;

    const prior = this.inFlight.get(cellId);
    if (prior) {
      window.clearTimeout(prior.cleanupTimeout);
      prior.element.removeEventListener("transitionend", prior.transitionEndHandler);
      this.inFlight.delete(cellId);
    }

    const easing = isRetained ? OUTGOING_EASING : this.easing;
    const duration = this.duration;

    if (!isRetained) {
      const isHeaderCell =
        cellId.startsWith("header-") || cellId.includes(":header") || cellId.endsWith("-header");
      if (!isHeaderCell) {
        element.style.pointerEvents = "none";
      }
    }

    const started = this.cellSlideAnimator.animate({
      element,
      id: cellId,
      fromX,
      fromY,
      toX,
      toY,
      duration,
      easing,
      onFinish: () => {
        this.finalizeCell(cellId, element, "slide");
      },
    });
    if (!started) {
      return;
    }

    const cleanupTimeout = window.setTimeout(() => {
      const tryFinalize = () => {
        if (this.isFlipStillInProgress(element)) {
          const entry = this.inFlight.get(cellId);
          if (entry) {
            entry.cleanupTimeout = window.setTimeout(tryFinalize, SAFETY_TIMEOUT_SLACK);
          }
          return;
        }
        this.finalizeCell(cellId, element, "timeout");
      };
      tryFinalize();
    }, duration + SAFETY_TIMEOUT_SLACK);

    this.inFlight.set(cellId, {
      element,
      cleanupTimeout,
      transitionEndHandler: () => {},
      isRetained,
    });
  }

  private hasRunningCellSlide(element: HTMLElement): boolean {
    if (typeof element.getAnimations !== "function") return false;
    return element.getAnimations().some((anim) => {
      const id = (anim as Animation & { id?: string }).id;
      return (
        (id === CELL_SLIDE_ANIM_ID || id === "st-column-reorder") &&
        (anim.playState === "running" || anim.playState === "paused")
      );
    });
  }

  /**
   * True when a cell still has a running or paused transform animation.
   */
  private isFlipStillInProgress(element: HTMLElement): boolean {
    if (typeof element.getAnimations === "function") {
      for (const anim of element.getAnimations()) {
        if (anim.playState === "paused") return true;
        if (anim.playState !== "running") continue;
        const timing = anim.effect?.getComputedTiming?.();
        const duration = timing?.duration;
        const current = anim.currentTime;
        if (
          typeof duration === "number" &&
          Number.isFinite(duration) &&
          typeof current === "number" &&
          Number.isFinite(current) &&
          current < duration - 0.5
        ) {
          return true;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Write the painted translate into `style.transform` (transition:none) so
   * the visual position survives animation cancel/pause and left/top writes.
   *
   * Prefer the computed matrix over getBoundingClientRect/offsetParent math:
   * the matrix is already in style.left/top space (what FLIP compensation
   * expects). Rect−offsetParent often disagrees by ~1–2px (borders, scroll,
   * subpixels) and that error shows up as a hitch on every interrupt reorder.
   *
   * Does NOT force layout (`offsetWidth`). Callers that need a flush after a
   * batch of bakes should use {@link flushLayoutOnce} once.
   */
  private bakeLiveTransform(element: HTMLElement): void {
    if (typeof getComputedStyle !== "undefined") {
      const computed = getComputedStyle(element).transform;
      const parsed = parseCssTranslate(computed);
      if (parsed && (Math.abs(parsed.x) > MIN_DELTA || Math.abs(parsed.y) > MIN_DELTA)) {
        element.style.transition = "none";
        // Normalize to translate3d so later compensation/parsers stay consistent
        // (getComputedStyle returns matrix(...)).
        element.style.transform = `translate3d(${parsed.x}px, ${parsed.y}px, 0)`;
        element.style.willChange = "transform";
        element.classList.add(FLIP_ACTIVE_CLASS);
        return;
      }
    }

    const parent = element.offsetParent as HTMLElement | null;
    if (!parent || typeof element.getBoundingClientRect !== "function") return;

    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const visualLeft = rect.left - parentRect.left + parent.scrollLeft;
    const visualTop = rect.top - parentRect.top + parent.scrollTop;
    const dx = visualLeft - parsePx(element.style.left);
    const dy = visualTop - parsePx(element.style.top);
    if (Math.abs(dx) < MIN_DELTA && Math.abs(dy) < MIN_DELTA) return;
    element.style.transition = "none";
    element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    element.style.willChange = "transform";
    element.classList.add(FLIP_ACTIVE_CLASS);
  }

  /** One forced layout after a batch of transform writes (never per-cell). */
  private flushLayoutOnce(): void {
    if (typeof document === "undefined") return;
    void document.documentElement.offsetHeight;
  }


  private cancelInFlight(cellId: string, options?: { skipBake?: boolean }): void {
    const entry = this.inFlight.get(cellId);
    if (!entry) return;
    window.clearTimeout(entry.cleanupTimeout);
    entry.element.removeEventListener("transitionend", entry.transitionEndHandler);
    // Skip re-bake when capture/play already froze a non-identity translate
    // into style (transition:none). A second bake via rect/offsetParent was
    // introducing a ~1–2px hitch on every interrupt reorder.
    const styleTransform = entry.element.style.transform || "";
    const alreadyFrozen =
      (entry.element.style.transition === "none" ||
        entry.element.style.transition === "") &&
      hasNonIdentityTranslate(styleTransform);
    if (!options?.skipBake && !alreadyFrozen) {
      this.bakeLiveTransform(entry.element);
    }
    const el = entry.element;
    if (typeof el.getAnimations === "function") {
      for (const anim of el.getAnimations()) {
        try {
          anim.cancel();
        } catch {
          // ignore
        }
      }
    }
    this.inFlight.delete(cellId);
  }

  private finalizeCell(cellId: string, element: HTMLElement, reason = "unknown"): void {
    if (!element.isConnected) {
      const stale = this.inFlight.get(cellId);
      if (stale) {
        window.clearTimeout(stale.cleanupTimeout);
        stale.element.removeEventListener("transitionend", stale.transitionEndHandler);
        this.inFlight.delete(cellId);
      }
      this.retainedCells.forEach((map) => {
        if (map.get(cellId) === element) map.delete(cellId);
      });
      return;
    }
    if (reason === "timeout" && this.isFlipStillInProgress(element)) {
      const entry = this.inFlight.get(cellId);
      if (entry) {
        window.clearTimeout(entry.cleanupTimeout);
        entry.cleanupTimeout = window.setTimeout(
          () => this.finalizeCell(cellId, element, "timeout"),
          SAFETY_TIMEOUT_SLACK,
        );
      }
      return;
    }

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
      this.onHostDiscard?.(element);
      element.remove();
      return;
    }
    element.style.transition = "";
    element.style.transform = "";
    element.style.willChange = "";
    element.classList.remove(FLIP_ACTIVE_CLASS);
    // Re-enable hit-testing now that the cell has settled.
    element.style.pointerEvents = "";
    if (
      element.classList.contains("st-header-cell") ||
      element.classList.contains("st-header-cell-container")
    ) {
      // Clear matching body cells even after dragend (residual FLIPs).
      this.syncColumnBodyTransform(element, "", "");
    }
  }

  /**
   * Clear residual transforms on body cells for a finished header column
   * (e.g. after a programmatic horizontal FLIP). Column-drag bodies are
   * owned by {@link CellSlideAnimator} and clear themselves.
   */
  private syncColumnBodyTransform(
    headerEl: HTMLElement,
    transform: string,
    transition: string,
  ): void {
    const accessor = headerEl.getAttribute("data-accessor");
    if (!accessor) return;
    const root = headerEl.closest(".simple-table-root") ?? headerEl.ownerDocument;
    if (!root) return;
    const nodes = root.querySelectorAll<HTMLElement>(".st-cell[data-accessor]");
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el.getAttribute("data-accessor") !== accessor) continue;
      if (el.classList.contains("st-header-cell")) continue;
      el.style.transition = transition;
      el.style.transform = transform;
      if (transform) {
        el.style.willChange = "transform";
        el.classList.add(FLIP_ACTIVE_CLASS);
      } else {
        el.style.willChange = "";
        el.classList.remove(FLIP_ACTIVE_CLASS);
      }
    }
  }

  private isCellRetained(element: HTMLElement): boolean {
    return element.hasAttribute(RETAINED_ATTR);
  }
}

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

/** True when the row's top edge falls inside the visible viewport. */
const isRowTopInVerticalViewport = (
  top: number,
  _cellHeight: number,
  metrics: ScrollerMetrics,
): boolean => {
  const clientSize = metrics.clientHeight;
  const scrollSize = metrics.scrollHeight;
  if (clientSize <= 0 || scrollSize <= clientSize) return true;
  const vpTop = metrics.scrollTop;
  const vpBottom = metrics.scrollTop + clientSize;
  return top >= vpTop && top < vpBottom;
};

/** True when the column's left edge falls inside the visible viewport. */
const isColumnLeftInHorizontalViewport = (
  left: number,
  _cellWidth: number,
  metrics: ScrollerMetrics,
): boolean => {
  const clientSize = metrics.clientWidth;
  const scrollSize = metrics.scrollWidth;
  if (clientSize <= 0 || scrollSize <= clientSize) return true;
  const vpLeft = metrics.scrollLeft;
  const vpRight = metrics.scrollLeft + clientSize;
  return left >= vpLeft && left < vpRight;
};

const parsePx = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** True when an inline transform is a non-zero translate (active FLIP invert / mid-slide). */
const hasNonIdentityTranslate = (transform: string): boolean => {
  if (!transform || transform === "none") return false;
  if (transform.includes("translate3d(0px, 0px, 0px)")) return false;
  if (transform.includes("translate3d(0, 0, 0)")) return false;
  if (/translate3d?\(/i.test(transform)) return true;
  // Freeze path writes getComputedStyle's matrix(...) form.
  const parsed = parseCssTranslate(transform);
  return Boolean(parsed && (Math.abs(parsed.x) > MIN_DELTA || Math.abs(parsed.y) > MIN_DELTA));
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
