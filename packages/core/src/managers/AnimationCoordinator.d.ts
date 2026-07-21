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
export declare class AnimationCoordinator {
    private enabled;
    private duration;
    private easing;
    /** Pre-change positions for any cell we want to consider for animation. */
    private snapshot;
    /**
     * One-shot synthetic origins for incoming cells that have no entry in the
     * captured snapshot (e.g. rows/columns that did not exist in the pre-render
     * state because they were inside a collapsed group). Used by accordion
     * animations so a newly-visible cell unfolds from its parent's position
     * rather than appearing in place. Cleared at the end of {@link play}.
     */
    private incomingOrigins;
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
    private accordionPreVisibleAccessors;
    private inFlight;
    /** Outgoing cells the renderer handed off; keyed per container so play() finds them. */
    private retainedCells;
    private prefersReducedMotion;
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
    private scrollerMetricsCache;
    /**
     * Vertical scroller metrics override for external/page-scroll mode. When the
     * table has no internal vertical overflow (it grows to its natural height and
     * a parent element / the window scrolls), the body container's own
     * clientHeight/scrollHeight no longer describe the visible viewport, so
     * {@link scaleFlipDistance} can't bound the FLIP journey and sort cells slide
     * the full conceptual distance. The vanilla table pushes the real visible
     * viewport here (from the same `getExternalScrollMetrics` the virtualizer
     * uses) so the y-axis FLIP scaling matches the on-screen viewport. `null`
     * when external scroll is inactive — internal scroller metrics are used as-is.
     */
    private externalVerticalScroll;
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
    private scheduledFlip;
    /**
     * Invoked immediately BEFORE a retained/ghost element is permanently removed
     * from the DOM (FLIP/shrink/cancel/destroy teardown). Lets framework adapters
     * tear down renderer subtrees (React portals, etc.) mounted into the element
     * before it's discarded. NOT called on reuse/reparent paths
     * ({@link claimRetainedForReuse} success), so a reclaimed ghost keeps its
     * content.
     */
    private onHostDiscard?;
    constructor(opts?: AnimationCoordinatorOptions);
    /**
     * Register the callback fired before a ghost/retained element is permanently
     * removed (see {@link onHostDiscard}). Additive: passing `undefined` disables it.
     */
    setOnHostDiscard(cb: ((host: HTMLElement) => void) | undefined): void;
    setEnabled(enabled: boolean): void;
    setDuration(duration: number): void;
    setEasing(easing: string): void;
    isEnabled(): boolean;
    isInFlight(cellId: string): boolean;
    /** True while any FLIP / retained-cell transition is still running. */
    hasInFlight(): boolean;
    getDuration(): number;
    getEasing(): string;
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
    setIncomingOrigins(origins: Map<string, CellPosition> | null): void;
    /**
     * Register the set of accessors that were renderable in the pre-change layout
     * of an accordion-horizontal toggle. Must be set after `captureSnapshot` and
     * before the render that creates cells. Consumed and cleared by the next
     * {@link play}. Pass `null` (e.g. for vertical/row accordions) to disable the
     * re-entry guard so behavior is unchanged.
     */
    setAccordionPreVisibleAccessors(accessors: Set<string> | null): void;
    /**
     * True when `accessor` was already a renderable column before the current
     * accordion-horizontal toggle. Renderers use this to skip the grow-from-zero
     * animation for columns that only re-entered the virtualization band rather
     * than genuinely becoming visible from an expand.
     */
    wasRenderableBeforeAccordion(accessor: string): boolean;
    /**
     * Read scroller layout metrics for `container`, caching the result for the
     * remainder of the current render cycle. Subsequent calls in the same
     * cycle (e.g. for every cell in a retain or play loop) skip the DOM read,
     * which would otherwise force a synchronous layout flush after each style
     * mutation in the loop.
     */
    private getScrollerMetrics;
    /**
     * Supply (or clear) the vertical scroller metrics override used by
     * {@link scaleFlipDistance} in external/page-scroll mode. Must be set before
     * `captureSnapshot`/`retainCell`/`play` so the whole FLIP cycle scales
     * against the real visible viewport. Pass `null` to fall back to the body
     * container's own metrics (internal scroll).
     */
    setExternalVerticalScroll(metrics: {
        clientHeight: number;
        scrollHeight: number;
        scrollTop: number;
    } | null): void;
    private clearScrollerMetricsCache;
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
    }): void;
    /**
     * The renderer asks before removing a cell whether the coordinator wants to
     * keep it for an out-animation.
     */
    shouldRetain(cellId: string): boolean;
    /**
     * Whether the captured snapshot has an entry for the given cellId. The
     * accordion expand path uses this to detect "newly visible" cells (no
     * pre-change layout) so it can initialize them at zero size and let the
     * CSS transition grow them to full size.
     */
    hasSnapshotEntry(cellId: string): boolean;
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
    hasSnapshotEntryInContainer(cellId: string, currentContainer: HTMLElement): boolean;
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
    }): boolean;
    /**
     * Whether a horizontal position transition should be animated. Same viewport
     * gate as {@link shouldAnimateVerticalTransition} but for column slides.
     */
    shouldAnimateHorizontalTransition(args: {
        beforeLeft: number;
        afterLeft: number;
        cellWidth: number;
        container: HTMLElement;
    }): boolean;
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
    }): boolean;
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
    }): boolean;
    /**
     * Whether the cell currently paints inside the body scrollers' clip rects.
     * Outgoing retain decisions use this as a fallback when {@link shouldAnimateTransition}
     * rejects a cell based on `style.top`/`style.left` alone: virtualization padding
     * rows can sit with their leading edge outside the scroll band while still being
     * partially visible on screen (common at the bottom when scrolled to the end).
     */
    isCellRenderedInScrollerViewport(element: HTMLElement, container: HTMLElement): boolean;
    /**
     * Whether an outgoing DOM cell at a vertical scroll extreme (top or bottom of
     * the dataset) should be retained even when {@link shouldAnimateTransition}
     * rejects it on leading-edge grounds. Virtualization keeps a few overscan
     * rows mounted above/below the strict viewport at max scroll; those rows
     * must still slide out as ghosts when a sort evicts them.
     */
    shouldRetainDomCellAtScrollExtrema(cellId: string, container: HTMLElement): boolean;
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
    }): void;
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
    claimRetainedForReuse(cellId: string, container: HTMLElement): HTMLElement | null;
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
    }): void;
    /**
     * Discard any retained cell with this id in the given container. Called by
     * the renderer when it's about to create a fresh cell with the same id, so
     * we don't have two DOM nodes claiming the same logical slot.
     */
    discardRetainedIfPresent(cellId: string, container: HTMLElement): void;
    /**
     * Apply the FLIP invert + play step to every cell present in the snapshot
     * that is now in the DOM (either as an actively rendered cell or as a
     * retained cell). Clears the snapshot.
     */
    play(args: {
        containers: Array<HTMLElement | null | undefined>;
    }): void;
    /**
     * Cancel every in-flight transition and clear any armed snapshot. Active
     * cells snap to their final positions; retained cells are removed from the
     * DOM so we don't leak nodes.
     */
    cancel(): void;
    destroy(): void;
    private readPosition;
    private startTransition;
    private cancelInFlight;
    private finalizeCell;
    private finishElement;
    private isCellRetained;
}
