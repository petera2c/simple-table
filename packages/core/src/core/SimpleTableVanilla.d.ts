import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import "../styles/all-themes.css";
export declare class SimpleTableVanilla {
    private container;
    private config;
    private customTheme;
    private mergedColumnEditorConfig;
    private resolvedIcons;
    private domManager;
    private renderOrchestrator;
    private draggedHeaderRef;
    private hoveredHeaderRef;
    private localRows;
    private headers;
    /**
     * Pristine deep-cloned snapshot of the column definitions as configured
     * (constructor / update with `defaultHeaders`). `this.headers` shares object
     * references with `config.defaultHeaders` at mount, and the column editor
     * mutates header objects in place (e.g. `header.hide = true`) — so
     * `config.defaultHeaders` drifts with runtime state and cannot serve as the
     * reset target. `resetColumns()` restores from this snapshot instead, giving
     * a well-defined default: every column visible except those explicitly
     * configured with `hide: true` in the definitions.
     */
    private pristineDefaultHeaders;
    private essentialAccessors;
    /** Accessors of leaf columns that should size to content (width:"auto" or autoSizeColumns). */
    private autoSizeAccessors;
    /** Accessors awaiting a content-fit measurement on the next render. */
    private pendingAutoSize;
    /**
     * Natural (unexpanded) pixel width per leaf column, overriding the declared
     * width: the measured content width for `width: "auto"` columns and the
     * width the user explicitly set via drag-resize / double-click auto-fit.
     * With autoExpandColumns these feed the shrink floors used during column
     * resize — neighbors give up surplus (expanded) space but are never
     * squeezed below their natural width; past that point the section
     * overflows into horizontal scroll.
     */
    private naturalWidths;
    /** Guard against re-entrancy while the auto-size pass re-renders. */
    private isAutoSizing;
    private currentPage;
    private scrollTop;
    private scrollDirection;
    private isResizing;
    private isScrolling;
    /** True when this render is scroll-driven so body can use position-only updates for existing cells. */
    private _positionOnlyBody;
    private firstRenderDone;
    private internalIsLoading;
    private scrollbarWidth;
    private isMainSectionScrollable;
    private columnEditorOpen;
    private collapsedHeaders;
    private expandedDepths;
    private expandedRows;
    private collapsedRows;
    private rowStateMap;
    private announcement;
    private cellRegistry;
    private static nextHoverScopeId;
    /**
     * Unique id for this table instance. Scopes the module-level row-hover cell
     * map so multiple tables on one page with overlapping rowIds don't cross-hover.
     */
    private readonly hoverScopeId;
    private headerRegistry;
    private rowIndexMap;
    private animationCoordinator;
    /**
     * When true, the sort subscriber skips `captureAnimationSnapshot` so
     * live-update-driven reorder/visibility changes don't FLIP-animate.
     * User-initiated sorts leave this false and keep FLIP.
     */
    private suppressNextAnimationSnapshot;
    /** Lazily created once — callers often invoke getAPI() every live tick. */
    private cachedAPI;
    private autoScaleManager;
    private dimensionManager;
    private scrollManager;
    private sectionScrollController;
    private sortManager;
    private filterManager;
    private pivotManager;
    private selectionManager;
    private rowSelectionManager;
    private windowResizeManager;
    private handleOutsideClickManager;
    private scrollbarVisibilityManager;
    private expandedDepthsManager;
    private ariaAnnouncementManager;
    private mounted;
    private scrollRafId;
    private scrollEndTimeoutId;
    private lastScrollTop;
    private isUpdating;
    /** Set once the dev-only "too many unvirtualized rows" warning has fired, so it never repeats. */
    private hasWarnedUnvirtualizedRows;
    /** Pending deferred check for the unvirtualized-rows warning (lets external-scroll seeding settle first). */
    private unvirtualizedRowsCheckTimeoutId;
    /** Currently resolved external scroll parent (HTMLElement or window). Null when external scroll mode is inactive. */
    private resolvedScrollParent;
    /** Bound scroll handler attached to the external scroll parent. */
    private externalScrollListener;
    /** Bound resize handler attached to window when scrollParent is "window". */
    private externalWindowResizeListener;
    /** ResizeObserver watching the external scroll parent element. */
    private externalParentResizeObserver;
    /** Cached visible viewport height of the table inside the external parent. Fed into virtualization. */
    private externalViewportHeight;
    /**
     * rAF handle for retrying resolution of a configured-but-not-yet-resolvable
     * `scrollParent` (e.g. a getter pointing at a ref attached on a later commit
     * than this table's mount). Null when no retry is pending.
     */
    private externalScrollRetryRaf;
    /** Number of resolution retries attempted; bounded so we don't spin forever. */
    private externalScrollRetryCount;
    private static readonly EXTERNAL_SCROLL_MAX_RETRIES;
    /** True iff the body-container scroll listener is currently attached. */
    private bodyScrollListenerAttached;
    /** Bound mouseleave handler on the body container. */
    private bodyContainerMouseLeaveListener;
    /** Bound scroll handler attached to the body container (internal scroll mode). */
    private bodyContainerScrollListener;
    /**
     * When external scroll mode is active we briefly take control of the scroll
     * parent's `overscroll-behavior-y` to neutralize the browser's rubber-band /
     * scroll-chaining at the boundaries. Without this, pulling past the top or
     * bottom of the scroll parent visually translates the entire scroll content
     * layer (including the CSS-sticky header), causing the header to "disappear"
     * during overscroll bounces even though its layout position is unchanged.
     * We record the previous inline value so {@link detachExternalScrollWiring}
     * can restore it cleanly.
     */
    private overscrollBehaviorTarget;
    private overscrollBehaviorPrev;
    /**
     * Active accordion axis for the next render. Set by row/column collapse-
     * expand mutators (see {@link beginAccordionAnimation}) and consumed by the
     * cell renderers via the render context. Cleared in {@link render} after
     * each render so subsequent non-accordion renders (sort, scroll, etc.)
     * don't re-trigger the size transitions.
     */
    private pendingAccordionAxis;
    /** Pending timeout id used to remove the accordion CSS class. */
    private accordionCleanupTimerId;
    /**
     * Visible-leaf-headers key as of the last render that committed to the DOM.
     * Used by `setHeaders` to detect hide/show/pin/unpin and trigger the
     * accordion-horizontal animation. Comparing against `this.headers` directly
     * doesn't work because the column editor mutates header objects in place
     * (e.g. `header.hide = true`) BEFORE invoking setHeaders, so by the time
     * setHeaders runs, the prev and next trees already point to the same
     * mutated header instances.
     */
    private lastRenderedVisibilityKey;
    constructor(container: HTMLElement, config: SimpleTableConfig);
    private applyAnimationsConfig;
    private rebuildRowIndexMap;
    private getBodyContainers;
    private getHeaderContainers;
    /**
     * All cell-bearing containers — body sections AND header sections — that the
     * animation coordinator needs to inspect. Headers participate in FLIP for
     * column reorder so their cells slide to their new slot rather than
     * teleporting.
     */
    private getAnimatableContainers;
    /**
     * Capture pre-change cell positions for the FLIP animation, including
     * conceptual positions for cells outside the virtualization viewport so
     * incoming cells can animate from off-screen on column reorder/sort. The
     * `play` step that runs at the end of the next render consumes this
     * snapshot to inverse-transform cells from their old visual positions and
     * tween them to their new ones.
     *
     * Called on every layout-affecting state change — including the chain of
     * mid-drag `setHeaders` calls that fire on each `dragover` swap — so that
     * displaced columns slide smoothly out of the dragged column's way rather
     * than snapping into place.
     */
    /**
     * Build a key summarizing the leaf columns that will paint (accessor +
     * pinned section). Hidden leaves and excluded subtrees drop out; nested
     * children are flattened so a parent collapse/expand counts as a
     * visibility change at the leaf level too.
     */
    private buildVisibilityKey;
    /**
     * True when the visible-leaf-set (or its pinned-section assignment) for
     * `nextHeaders` differs from the last render that committed to the DOM.
     *
     * We deliberately compare against {@link lastRenderedVisibilityKey} rather
     * than `this.headers`: the column editor mutates header objects in place
     * before invoking setHeaders (e.g. `header.hide = true`, then
     * `setHeaders(deepClone(headers))`), and `this.headers` shares those
     * mutated references — so a prev-vs-next compare always reads the same
     * state and reports no change. Comparing to the last-rendered key sees
     * the user's actually-painted state and correctly detects hide/show and
     * pin/unpin changes.
     */
    private didColumnVisibilityChange;
    private captureAnimationSnapshot;
    /**
     * Push the visible vertical viewport into the animation coordinator when
     * external/page scroll is active (or clear it otherwise). Keeps the FLIP
     * distance-scaling viewport-relative so cells don't slide the full
     * conceptual distance when the table grows to its natural height.
     */
    private updateAnimationVerticalScroll;
    /**
     * Open the accordion animation window for the next render: capture a FLIP
     * snapshot, mark the active axis so cell renderers initialize incoming
     * cells at zero size, and add the CSS class that enables the size
     * transitions on `.st-cell` / `.st-header-cell`.
     *
     * The CSS class is removed after `duration + ACCORDION_CLEANUP_BUFFER_MS`
     * so non-accordion renders don't keep transitioning size on subsequent
     * inline-style writes.
     *
     * No-op when animations are disabled (which already includes the
     * prefers-reduced-motion check via {@link AnimationCoordinator.isEnabled}).
     */
    /**
     * Walk the CURRENT (pre-change) header tree and collect every accessor that
     * is renderable as a header cell given the current collapsed/hidden state —
     * group headers plus the leaf columns visible under them (honoring
     * `showWhen` and the collapsed set). Used by {@link beginAccordionAnimation}
     * to seed the animation coordinator's re-entry guard.
     */
    private collectAccordionRenderableAccessors;
    private beginAccordionAnimation;
    private initializeManagers;
    mount(): void;
    private setupManagers;
    private setupEventListeners;
    /**
     * Reconciles which element owns the vertical scroll listener based on the
     * current `scrollParent` config. Called on mount and whenever `update()`
     * could have changed the relevant inputs (`scrollParent` / `height` /
     * `maxHeight`). Idempotent — safe to call repeatedly.
     */
    private syncExternalScrollWiring;
    /**
     * Retry resolving a configured `scrollParent` on the next animation frame.
     * Used when the parent (typically a getter pointing at a ref) was not yet
     * resolvable when external wiring last ran. Bounded by
     * {@link SimpleTableVanilla.EXTERNAL_SCROLL_MAX_RETRIES} so a permanently
     * unresolvable parent doesn't spin forever.
     */
    private scheduleExternalScrollParentRetry;
    private ensureBodyScrollListenerAttached;
    private ensureBodyScrollListenerDetached;
    private attachExternalScrollWiring;
    private detachExternalScrollWiring;
    /**
     * Set `overscroll-behavior-y: none` on the resolved scroll parent (or
     * `document.documentElement` for `scrollParent: "window"`). This neutralizes
     * the browser's elastic rubber-band at the scroll boundaries, which would
     * otherwise translate the entire scroll content layer (including our
     * `position: sticky` header) during overscroll bounces — making the header
     * visually disappear off the top of the parent. `contain` only stops scroll
     * chaining; we need `none` to actually disable the elastic bounce on the
     * scroll container itself. Previous inline value is captured so we can
     * restore it on detach.
     */
    private applyOverscrollContainment;
    private restoreOverscrollBehavior;
    /**
     * Read the resolved scroll parent's computed `padding-top` and publish it
     * as `--st-external-scroll-padding-top` on the table root. The sticky
     * header CSS uses `top: calc(-1 * var(...))` so the header pins flush to
     * the parent's outer top edge instead of the padding edge, eliminating the
     * visible gap that CSS sticky would otherwise produce when the consumer
     * gives the scroll parent any top padding. Re-run on layout changes via
     * ResizeObserver / window resize.
     */
    private recomputeExternalScrollPaddingTop;
    /**
     * Recompute the visible portion of the table inside the external scroll
     * parent and push it into the DimensionManager so virtualization math
     * picks it up. Cheap; called on scroll, on parent/window resize, and on
     * every re-render where the resolved parent may have moved.
     */
    private recomputeExternalViewportHeight;
    private handleExternalResize;
    private handleExternalScroll;
    private handleScroll;
    private clearHoveredRows;
    private updateAriaLiveRegion;
    /** Row grouping used for flatten/expand while pivot is active (overrides consumer). */
    private getEffectiveRowGrouping;
    /**
     * Recompute pivot from filtered source rows and feed sort/selection managers.
     * When pivot is inactive, sort sees the filtered source rows directly.
     */
    private syncPivotPipeline;
    private getRenderContext;
    private getRenderState;
    /** A leaf column that should size to content (declared with width:"auto"). */
    private isAutoSizeLeaf;
    private computeAutoSizeAccessors;
    private getAutoSizeStyleRoot;
    /**
     * Rows that content-fit ("auto") measurement should sample. With client-side
     * pagination only the current page is rendered, so fit columns to the page's
     * rows rather than the entire dataset — otherwise off-page values inflate
     * every auto column's width.
     */
    private getAutoSizeRows;
    /**
     * Shrink floors for auto-expand column resize, keyed by accessor. Each
     * visible leaf's floor is its natural width — a user-set / content-measured
     * override when present, else the pixel width declared in the column
     * definitions — raised to at least its `minWidth` (or the global minimum).
     * Flexible declarations (fr / % / unmeasured "auto") have no pixel natural,
     * so they floor at `minWidth` alone.
     */
    private getShrinkFloors;
    /** Record user-set / measured widths as the columns' new natural widths. */
    private recordNaturalWidths;
    /** Immutably write measured pixel widths into the leaf headers. */
    private applyMeasuredWidths;
    /**
     * Measure and apply content-fit widths for any pending "auto" columns, then
     * re-render once at the final widths. Called at the end of render(); the
     * measurement reads the just-rendered (provisional-width) DOM and the
     * corrective render happens in the same synchronous task, so there is no
     * visible width snap.
     *
     * With autoExpandColumns, the measured width becomes the column's natural
     * width: the expand-only auto-scale pass in the corrective render stretches
     * columns to fill surplus container space, or leaves them at natural width
     * (horizontal scroll) when they don't fit.
     */
    private maybeAutoSizeColumns;
    /**
     * Re-run the content-fit measurement for all auto-size columns. Useful for
     * host frameworks (e.g. React) whose custom renderers mount asynchronously:
     * calling this from a layout effect (pre-paint) re-measures once the real
     * renderer DOM is present, so the column fits accurately without flicker.
     */
    refitAutoSizeColumns(): void;
    private render;
    /**
     * Dev-only safeguard. Schedules a one-shot, deferred check that warns when the
     * table is about to render a very large number of rows with no virtualization
     * active (no `height` / `maxHeight` and no bounded `scrollParent`). The check
     * is deferred so external-scroll viewport seeding (which can momentarily leave
     * `contentHeight` undefined on the first paint) has time to settle and we
     * don't cry wolf for a correctly-configured table. Compiled out of production
     * via the NODE_ENV guard. Never throws.
     */
    private maybeScheduleUnvirtualizedRowsWarning;
    private evaluateUnvirtualizedRowsWarning;
    update(config: Partial<SimpleTableConfig>): void;
    /** @deprecated Use {@link update} — same behavior. */
    updateConfig(config: Partial<SimpleTableConfig>): void;
    /**
     * Create, update, or destroy the RowSelectionManager when enableRowSelection
     * (and related props) change at runtime.
     */
    private syncRowSelectionManager;
    destroy(): void;
    getAPI(): TableAPI;
}
