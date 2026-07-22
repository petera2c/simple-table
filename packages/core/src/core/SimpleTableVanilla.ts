import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import ColumnDef, { Accessor, DEFAULT_SHOW_WHEN } from "../types/ColumnDef";
import Row from "../types/Row";
import { CustomTheme, areCustomThemesEqual } from "../types/CustomTheme";
import RowState from "../types/RowState";
import {
  normalizeConfig,
  normalizeConfigPatch,
  type SimpleTableConfigInput,
} from "../utils/normalizeConfig";

import { AnimationCoordinator } from "../managers/AnimationCoordinator";
import { AutoScaleManager } from "../managers/AutoScaleManager";
import { DimensionManager } from "../managers/DimensionManager";
import { ScrollManager } from "../managers/ScrollManager";
import { SectionScrollController } from "../managers/SectionScrollController";
import { SortManager } from "../managers/SortManager";
import { FilterManager } from "../managers/FilterManager";
import { PivotManager } from "../managers/PivotManager";
import { SelectionManager } from "../managers/SelectionManager";
import { RowSelectionManager } from "../managers/RowSelectionManager";
import type { PivotConfig } from "../types/PivotTypes";
import { shouldShowRowSelectionColumn } from "../utils/rowSelectionUtils";
import WindowResizeManager from "../hooks/windowResize";
import HandleOutsideClickManager from "../hooks/handleOutsideClick";
import ScrollbarVisibilityManager from "../hooks/scrollbarVisibility";
import ExpandedDepthsManager from "../hooks/expandedDepths";
import AriaAnnouncementManager from "../hooks/ariaAnnouncements";

import { calculateScrollbarWidth } from "../hooks/scrollbarWidth";
import { generateRowId, rowIdToString } from "../utils/rowUtils";
import { untrackCellByRow } from "../utils/bodyCell/styling";
import { deepClone } from "../utils/generalUtils";
import { isHeaderExcludedFromLayout } from "../utils/cellUtils";
import {
  calculateHeaderContentWidth,
  getAllVisibleLeafHeaders,
  getHeaderMinWidth,
  isAutoWidth,
} from "../utils/headerWidthUtils";
import {
  ACCORDION_ANIMATION_CLASS,
  ACCORDION_CLEANUP_BUFFER_MS,
  ACCORDION_DURATION_VAR,
  ACCORDION_EASING_VAR,
  type AccordionAxis,
} from "../utils/accordionAnimation";

import {
  TableInitializer,
  ResolvedIcons,
  MergedColumnEditorConfig,
} from "./initialization/TableInitializer";
import { DOMManager } from "./dom/DOMManager";
import { RenderOrchestrator, RenderContext, RenderState } from "./rendering/RenderOrchestrator";
import { TableAPIImpl, TableAPIContext } from "./api/TableAPIImpl";
import {
  getExternalScrollMetrics,
  getParentViewportHeight,
  resolveScrollParent,
  type ResolvedScrollParent,
} from "../utils/externalScroll";
import { UNVIRTUALIZED_ROW_WARNING_THRESHOLD } from "../consts/general-consts";

import "../styles/all-themes.css";

/**
 * True when running outside a production build. Guards dev-only diagnostics so
 * they're stripped by the consumer's bundler in production and never crash in
 * raw (non-bundled) browser usage where `process` is undefined.
 */
const isDevEnvironment = (): boolean => {
  try {
    const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
    return !!proc?.env && proc.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
};

export class SimpleTableVanilla {
  private container: HTMLElement;
  private config: SimpleTableConfig;
  private customTheme: CustomTheme;
  private mergedColumnEditorConfig: MergedColumnEditorConfig;
  private resolvedIcons: ResolvedIcons;

  private domManager: DOMManager;
  private renderOrchestrator: RenderOrchestrator;

  private draggedHeaderRef: { current: ColumnDef | null } = {
    current: null,
  };
  private hoveredHeaderRef: { current: ColumnDef | null } = {
    current: null,
  };

  private localRows: Row[] = [];
  private headers: ColumnDef[] = [];
  /**
   * Pristine deep-cloned snapshot of the column definitions as configured
   * (constructor / update with `columns`). `this.headers` shares object
   * references with `config.columns` at mount, and the column editor
   * mutates header objects in place (e.g. `header.hide = true`) — so
   * `config.columns` drifts with runtime state and cannot serve as the
   * reset target. `resetColumns()` restores from this snapshot instead, giving
   * a well-defined default: every column visible except those explicitly
   * configured with `hide: true` in the definitions.
   */
  private pristineDefaultHeaders: ColumnDef[] = [];
  private essentialAccessors: Set<string> = new Set();
  /** Accessors of leaf columns that should size to content (width:"auto" or autoSizeColumns). */
  private autoSizeAccessors: Set<Accessor> = new Set();
  /** Accessors awaiting a content-fit measurement on the next render. */
  private pendingAutoSize: Set<Accessor> = new Set();
  /**
   * Natural (unexpanded) pixel width per leaf column, overriding the declared
   * width: the measured content width for `width: "auto"` columns and the
   * width the user explicitly set via drag-resize / double-click auto-fit.
   * With autoExpandColumns these feed the shrink floors used during column
   * resize — neighbors give up surplus (expanded) space but are never
   * squeezed below their natural width; past that point the section
   * overflows into horizontal scroll.
   */
  private naturalWidths: Map<string, number> = new Map();
  /** Guard against re-entrancy while the auto-size pass re-renders. */
  private isAutoSizing: boolean = false;
  private currentPage: number = 1;
  private scrollTop: number = 0;
  private scrollDirection: "up" | "down" | "none" = "none";
  private isResizing: boolean = false;
  private isScrolling: boolean = false;
  /** True when this render is scroll-driven so body can use position-only updates for existing cells. */
  private _positionOnlyBody: boolean = false;
  private firstRenderDone: boolean = false;
  private internalIsLoading: boolean = false;
  private scrollbarWidth: number = 0;
  private isMainSectionScrollable: boolean = false;
  private columnEditorOpen: boolean = false;
  private collapsedHeaders: Set<Accessor> = new Set();
  private expandedDepths: Set<number> = new Set();
  private expandedRows: Map<string, number> = new Map();
  private collapsedRows: Map<string, number> = new Map();
  private rowStateMap: Map<string | number, RowState> = new Map();
  private announcement: string = "";

  private cellRegistry: Map<string, any> = new Map();
  private static nextHoverScopeId = 0;
  /**
   * Unique id for this table instance. Scopes the module-level row-hover cell
   * map so multiple tables on one page with overlapping rowIds don't cross-hover.
   */
  private readonly hoverScopeId: string = `st-hover-${++SimpleTableVanilla.nextHoverScopeId}`;
  private headerRegistry: Map<string, any> = new Map();
  private rowIndexMap: Map<string | number, number> = new Map();

  private animationCoordinator: AnimationCoordinator;
  /**
   * When true, the sort subscriber skips `captureAnimationSnapshot` so
   * live-update-driven reorder/visibility changes don't FLIP-animate.
   * User-initiated sorts leave this false and keep FLIP.
   */
  private suppressNextAnimationSnapshot = false;
  /** Lazily created once — callers often invoke getAPI() every live tick. */
  private cachedAPI: TableAPI | null = null;

  private autoScaleManager: AutoScaleManager | null = null;
  private dimensionManager: DimensionManager | null = null;
  private scrollManager: ScrollManager | null = null;
  private sectionScrollController: SectionScrollController | null = null;
  private sortManager: SortManager | null = null;
  private filterManager: FilterManager | null = null;
  private pivotManager: PivotManager | null = null;
  private selectionManager: SelectionManager | null = null;
  private rowSelectionManager: RowSelectionManager | null = null;
  private windowResizeManager: WindowResizeManager | null = null;
  private handleOutsideClickManager: HandleOutsideClickManager | null = null;
  private scrollbarVisibilityManager: ScrollbarVisibilityManager | null = null;
  private expandedDepthsManager: ExpandedDepthsManager | null = null;
  private ariaAnnouncementManager: AriaAnnouncementManager | null = null;

  private mounted: boolean = false;
  private scrollRafId: number | null = null;
  private scrollEndTimeoutId: number | null = null;
  private lastScrollTop: number = 0;
  private isUpdating: boolean = false;

  /** Set once the dev-only "too many unvirtualized rows" warning has fired, so it never repeats. */
  private hasWarnedUnvirtualizedRows: boolean = false;
  /** Pending deferred check for the unvirtualized-rows warning (lets external-scroll seeding settle first). */
  private unvirtualizedRowsCheckTimeoutId: number | null = null;

  /** Currently resolved external scroll parent (HTMLElement or window). Null when external scroll mode is inactive. */
  private resolvedScrollParent: ResolvedScrollParent = null;
  /** Bound scroll handler attached to the external scroll parent. */
  private externalScrollListener: ((e: Event) => void) | null = null;
  /** Bound resize handler attached to window when scrollParent is "window". */
  private externalWindowResizeListener: (() => void) | null = null;
  /** ResizeObserver watching the external scroll parent element. */
  private externalParentResizeObserver: ResizeObserver | null = null;
  /** Cached visible viewport height of the table inside the external parent. Fed into virtualization. */
  private externalViewportHeight: number = 0;
  /**
   * rAF handle for retrying resolution of a configured-but-not-yet-resolvable
   * `scrollParent` (e.g. a getter pointing at a ref attached on a later commit
   * than this table's mount). Null when no retry is pending.
   */
  private externalScrollRetryRaf: number | null = null;
  /** Number of resolution retries attempted; bounded so we don't spin forever. */
  private externalScrollRetryCount: number = 0;
  private static readonly EXTERNAL_SCROLL_MAX_RETRIES = 60;
  /** True iff the body-container scroll listener is currently attached. */
  private bodyScrollListenerAttached: boolean = false;
  /** Bound mouseleave handler on the body container. */
  private bodyContainerMouseLeaveListener: (() => void) | null = null;
  /** Bound scroll handler attached to the body container (internal scroll mode). */
  private bodyContainerScrollListener: ((e: Event) => void) | null = null;
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
  private overscrollBehaviorTarget: HTMLElement | null = null;
  private overscrollBehaviorPrev: string = "";

  /**
   * Active accordion axis for the next render. Set by row/column collapse-
   * expand mutators (see {@link beginAccordionAnimation}) and consumed by the
   * cell renderers via the render context. Cleared in {@link render} after
   * each render so subsequent non-accordion renders (sort, scroll, etc.)
   * don't re-trigger the size transitions.
   */
  private pendingAccordionAxis: AccordionAxis = null;
  /** Pending timeout id used to remove the accordion CSS class. */
  private accordionCleanupTimerId: number | null = null;
  /**
   * Visible-leaf-headers key as of the last render that committed to the DOM.
   * Used by `setHeaders` to detect hide/show/pin/unpin and trigger the
   * accordion-horizontal animation. Comparing against `this.headers` directly
   * doesn't work because the column editor mutates header objects in place
   * (e.g. `header.hide = true`) BEFORE invoking setHeaders, so by the time
   * setHeaders runs, the prev and next trees already point to the same
   * mutated header instances.
   */
  private lastRenderedVisibilityKey: string | null = null;

  constructor(container: HTMLElement, config: SimpleTableConfigInput) {
    this.container = container;
    // Collapse consumer aliases (`columns`, `enablePagination`, …) before any
    // internal reads — `this.config` is the only shape the rest of the class uses.
    this.config = normalizeConfig(config);
    const resolved = this.config;

    this.customTheme = TableInitializer.mergeCustomTheme(resolved);
    this.mergedColumnEditorConfig = TableInitializer.mergeColumnEditorConfig(resolved);
    this.resolvedIcons = TableInitializer.resolveIcons(resolved);

    this.localRows = [...resolved.rows];
    this.headers = [...resolved.columns];
    this.pristineDefaultHeaders = deepClone(resolved.columns);
    this.columnEditorOpen = resolved.enableColumnEditorInitOpen ?? false;
    this.internalIsLoading = resolved.isLoading ?? false;

    // Apply pivot before measuring headers / collapsed state so the first paint
    // uses generated columns when `pivot` is configured at mount.
    this.pivotManager = new PivotManager({
      sourceRows: this.localRows,
      fieldHeaders: this.pristineDefaultHeaders,
      pivot: resolved.pivot ?? null,
    });
    const initialPivot = this.pivotManager.getState();
    if (initialPivot.active) {
      this.headers = initialPivot.headers;
    }

    this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);
    this.collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(this.headers);
    this.expandedDepths = TableInitializer.getInitialExpandedDepths({
      ...resolved,
      rowGrouping: this.getEffectiveRowGrouping(),
    });

    this.autoSizeAccessors = this.computeAutoSizeAccessors();
    this.pendingAutoSize = new Set(this.autoSizeAccessors);

    this.domManager = new DOMManager();
    this.renderOrchestrator = new RenderOrchestrator();

    this.animationCoordinator = new AnimationCoordinator();
    this.applyAnimationsConfig(config.animations);

    // Authoritative portal/renderer teardown: core signals the host discard
    // callback at every permanent host-element removal site so framework
    // adapters can unmount renderer subtrees (React portals, etc.). The
    // animation coordinator owns the ghost/FLIP/shrink removal paths; the
    // render orchestrator owns the full-wipe (invalidateCache "all") path.
    this.animationCoordinator.setOnHostDiscard(config.onRendererHostDiscard);
    this.renderOrchestrator.setOnRendererHostDiscard(config.onRendererHostDiscard);

    this.rebuildRowIndexMap();
    this.initializeManagers();
  }

  private applyAnimationsConfig(animations: SimpleTableConfig["animations"]): void {
    this.animationCoordinator.setEnabled(animations?.enabled ?? true);
    if (animations?.duration !== undefined) {
      this.animationCoordinator.setDuration(animations.duration);
    }
    if (animations?.easing !== undefined) {
      this.animationCoordinator.setEasing(animations.easing);
    }
  }

  private rebuildRowIndexMap(): void {
    this.rowIndexMap.clear();
    this.localRows.forEach((row, index) => {
      const rowIdArray = generateRowId({
        row,
        getRowId: this.config.getRowId,
        depth: 0,
        index,
        rowPath: [index],
        rowIndexPath: [index],
      });
      const rowIdKey = rowIdToString(rowIdArray);
      this.rowIndexMap.set(rowIdKey, index);
    });
  }

  private getBodyContainers(): HTMLElement[] {
    const refs = this.domManager.getRefs();
    return [
      refs.mainBodyRef.current,
      refs.pinnedLeftRef.current,
      refs.pinnedRightRef.current,
    ].filter((el): el is HTMLDivElement => el !== null);
  }

  private getHeaderContainers(): HTMLElement[] {
    const refs = this.domManager.getRefs();
    return [
      refs.mainHeaderRef.current,
      refs.pinnedLeftHeaderRef.current,
      refs.pinnedRightHeaderRef.current,
    ].filter((el): el is HTMLDivElement => el !== null);
  }

  /**
   * All cell-bearing containers — body sections AND header sections — that the
   * animation coordinator needs to inspect. Headers participate in FLIP for
   * column reorder so their cells slide to their new slot rather than
   * teleporting.
   */
  private getAnimatableContainers(): HTMLElement[] {
    return [...this.getBodyContainers(), ...this.getHeaderContainers()];
  }

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
  private buildVisibilityKey(headers: ColumnDef[]): string {
    const parts: string[] = [];
    const walk = (header: ColumnDef, pinnedAncestor: string | undefined): void => {
      if (isHeaderExcludedFromLayout(header)) return;
      const pinned = header.pinned ?? pinnedAncestor ?? "main";
      if (header.children && header.children.length > 0) {
        for (const child of header.children) walk(child, pinned);
      } else {
        parts.push(`${String(header.accessor)}:${pinned}`);
      }
    };
    for (const header of headers) walk(header, undefined);
    return parts.join("|");
  }

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
  private didColumnVisibilityChange(nextHeaders: ColumnDef[]): boolean {
    const nextKey = this.buildVisibilityKey(nextHeaders);
    return this.lastRenderedVisibilityKey !== null && nextKey !== this.lastRenderedVisibilityKey;
  }

  private captureAnimationSnapshot(): void {
    // Skip the (potentially large) full-section pre-layout build when
    // animations are disabled — captureSnapshot would discard the result
    // anyway, but the argument is evaluated eagerly before the bail-out.
    const preLayouts = this.animationCoordinator.isEnabled()
      ? this.renderOrchestrator.getCurrentBodyLayouts()
      : undefined;
    // In external/page-scroll mode the body container has no internal vertical
    // overflow, so the FLIP scaler can't read the visible viewport from it.
    // Feed the real visible viewport (the same metrics that drive
    // virtualization) so sort slides stay bounded to the on-screen area.
    this.updateAnimationVerticalScroll();
    this.animationCoordinator.captureSnapshot({
      containers: this.getAnimatableContainers(),
      preLayouts,
    });
  }

  /**
   * Push the visible vertical viewport into the animation coordinator when
   * external/page scroll is active (or clear it otherwise). Keeps the FLIP
   * distance-scaling viewport-relative so cells don't slide the full
   * conceptual distance when the table grows to its natural height.
   */
  private updateAnimationVerticalScroll(): void {
    if (!this.resolvedScrollParent) {
      this.animationCoordinator.setExternalVerticalScroll(null);
      return;
    }
    const tableRoot = this.domManager.getElements()?.rootElement ?? this.container;
    const metrics = getExternalScrollMetrics(this.resolvedScrollParent, tableRoot);
    if (!metrics || metrics.visibleViewportHeight <= 0 || metrics.tableTotalHeight <= 0) {
      this.animationCoordinator.setExternalVerticalScroll(null);
      return;
    }
    this.animationCoordinator.setExternalVerticalScroll({
      clientHeight: metrics.visibleViewportHeight,
      scrollHeight: metrics.tableTotalHeight,
      scrollTop: metrics.relativeScrollTop,
    });
  }

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
  private collectAccordionRenderableAccessors(): Set<string> {
    const set = new Set<string>();
    const visit = (header: ColumnDef): void => {
      if (isHeaderExcludedFromLayout(header)) return;
      set.add(String(header.accessor));
      if (!header.children || header.children.length === 0) return;
      const isCollapsed = this.collapsedHeaders.has(header.accessor);
      for (const child of header.children) {
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        const childVisible = isCollapsed
          ? showWhen === "parentCollapsed" || showWhen === "always"
          : showWhen === "parentExpanded" || showWhen === "always";
        if (childVisible) visit(child);
      }
    };
    for (const header of this.headers) visit(header);
    return set;
  }

  private beginAccordionAnimation(axis: AccordionAxis): void {
    if (!this.animationCoordinator.isEnabled()) return;
    if (axis === null) return;
    if (axis === "vertical" && (this.getEffectiveRowGrouping()?.length ?? 0) > 0) return;
    this.captureAnimationSnapshot();
    // Record which columns are renderable in the current (pre-change) layout so
    // the grow-from-zero gate can tell a freshly-expanded column apart from one
    // that merely re-enters the virtualization band after the collapse clamps
    // scrollLeft. Only meaningful for the horizontal (column) accordion.
    this.animationCoordinator.setAccordionPreVisibleAccessors(
      axis === "horizontal" ? this.collectAccordionRenderableAccessors() : null,
    );
    this.pendingAccordionAxis = axis;

    const duration = this.animationCoordinator.getDuration();
    const easing = this.animationCoordinator.getEasing();
    // Apply to `.simple-table-root` (not the user-supplied outer container) so
    // the CSS scope and the test/marketing surface match the documented root.
    const root = this.domManager.getElements()?.rootElement ?? this.container;
    root.style.setProperty(ACCORDION_DURATION_VAR, `${duration}ms`);
    root.style.setProperty(ACCORDION_EASING_VAR, easing);
    root.classList.add(ACCORDION_ANIMATION_CLASS);

    if (this.accordionCleanupTimerId !== null) {
      window.clearTimeout(this.accordionCleanupTimerId);
    }
    this.accordionCleanupTimerId = window.setTimeout(() => {
      root.classList.remove(ACCORDION_ANIMATION_CLASS);
      root.style.removeProperty(ACCORDION_DURATION_VAR);
      root.style.removeProperty(ACCORDION_EASING_VAR);
      this.accordionCleanupTimerId = null;
    }, duration + ACCORDION_CLEANUP_BUFFER_MS);
  }

  private initializeManagers(): void {
    this.ariaAnnouncementManager = new AriaAnnouncementManager();
    this.ariaAnnouncementManager.subscribe((message) => {
      this.announcement = message;
      this.updateAriaLiveRegion();
    });

    this.expandedDepthsManager = new ExpandedDepthsManager(
      this.config.expandAll ?? true,
      this.getEffectiveRowGrouping(),
    );
    this.expandedDepthsManager.subscribe((depths) => {
      this.beginAccordionAnimation("vertical");
      this.expandedDepths = depths;
      this.render("expandedDepthsManager");
    });

    const announce = (message: string) => {
      if (this.ariaAnnouncementManager) {
        this.ariaAnnouncementManager.announce(message);
      }
    };

    const pivotState = this.pivotManager?.getState();
    const initialSortRows =
      pivotState?.active ? pivotState.pivotedRows : this.localRows;
    const initialSortGrouping =
      pivotState?.active ? pivotState.rowGrouping : this.config.rowGrouping;

    this.sortManager = new SortManager({
      headers: this.headers,
      tableRows: initialSortRows,
      externalSortHandling: this.config.externalSortHandling || false,
      // Read from live config at invocation time so callback props updated via
      // update() (e.g. a React re-render with a fresh closure) aren't stale.
      onSortChange: (sort) => this.config.onSortChange?.(sort),
      rowGrouping: initialSortGrouping,
      initialSortColumn: this.config.initialSortColumn,
      initialSortDirection: this.config.initialSortDirection,
      announce,
    });

    this.sortManager.subscribe(() => {
      if (this.suppressNextAnimationSnapshot) {
        // Live-driven reorder: skip FLIP play so we don't thrash retained cells
        // or interrupt a user-initiated sort animation.
        this.render("live-sort");
        return;
      }
      this.captureAnimationSnapshot();
      this.render("sortManager");
    });

    // Filters always run against source rows / field catalog. Pivot reshapes
    // the filtered result before sort + render.
    this.filterManager = new FilterManager({
      rows: this.localRows,
      headers: this.pristineDefaultHeaders,
      externalFilterHandling: this.config.externalFilterHandling || false,
      onFilterChange: (filters) => this.config.onFilterChange?.(filters),
      announce,
    });

    this.filterManager.subscribe((filterState) => {
      this.syncPivotPipeline(filterState.filteredRows);
      this.render("filterManager");
    });

    // Initialize SelectionManager with empty tableRows (will be updated during render)
    this.selectionManager = new SelectionManager({
      selectableCells: this.config.selectableCells ?? false,
      selectableColumns: this.config.selectableColumns ?? false,
      headers: this.headers,
      tableRows: [],
      onCellEdit: (props) => this.config.onCellEdit?.(props),
      cellRegistry: this.cellRegistry,
      collapsedHeaders: this.collapsedHeaders,
      rowHeight: this.customTheme.rowHeight,
      enableRowSelection: shouldShowRowSelectionColumn(this.config),
      copyHeadersToClipboard: this.config.copyHeadersToClipboard,
      customTheme: this.customTheme,
      tableRoot: this.container,
      onSelectionDragEnd: () => {
        this.renderOrchestrator.invalidateCache("context");
        this.renderOrchestrator.invalidateCache("body");
        this.render("selectionDragEnd");
      },
    });
  }

  mount(): void {
    if (this.mounted) {
      console.warn("SimpleTableVanilla: Table is already mounted");
      return;
    }

    this.domManager.createDOMStructure(this.container, this.config);
    this.mounted = true;
    this.setupManagers();
  }

  private setupManagers(): void {
    const refs = this.domManager.getRefs();
    const elements = this.domManager.getElements();

    if (!refs.tableBodyContainerRef.current || !elements) return;

    this.scrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);

    const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
      this.headers,
      this.config,
      this.customTheme,
    );

    this.dimensionManager = new DimensionManager({
      effectiveHeaders,
      headerHeight: this.customTheme.headerHeight,
      rowHeight: this.customTheme.rowHeight,
      height: this.config.height,
      maxHeight: this.config.maxHeight,
      // For server-side pagination the local rows are just the current page (and
      // are often empty on the first mount while the page is loading), so the
      // full data size lives in `totalRowCount`. Mirror RenderOrchestrator's
      // height math (`config.totalRowCount ?? rows.length`) so the root is
      // bounded — and the body gets an inner scrollbar — once the data overflows
      // maxHeight, regardless of how many rows are present locally.
      totalRowCount: this.config.totalRowCount ?? this.localRows.length,
      footerHeight:
        (this.config.enablePagination || this.config.footerRenderer) && !this.config.hideFooter
          ? this.customTheme.footerHeight
          : undefined,
      containerElement: refs.tableBodyContainerRef.current,
    });

    this.dimensionManager.subscribe(() => {
      this.render("dimensionManager");
      if (!this.firstRenderDone) {
        this.firstRenderDone = true;
        // In external/window scroll mode the mount-time viewport measurement ran
        // before this first render populated the body, so it fell back to the
        // parent viewport height (a provisional). Now that the table has its real
        // laid-out height, re-measure to the precise visible intersection (e.g.
        // when the table is only partially in view). Deferred to the next frame
        // so the recompute's state update doesn't re-enter render() synchronously.
        if (this.resolvedScrollParent && typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(() => {
            if (this.mounted) this.recomputeExternalViewportHeight();
          });
        }
        if (this.config.onTableReady) {
          this.config.onTableReady();
        }
      }
    });

    this.scrollManager = new ScrollManager({
      onLoadMore: this.config.onLoadMore,
      infiniteScrollThreshold: this.config.infiniteScrollThreshold ?? 200,
    });

    const renderHeaderForScroll = (scrollLeft: number) => {
      const header = this.domManager.getRefs().mainHeaderRef.current;
      const sel = this.selectionManager;
      const liveSelection =
        sel && (this.config.selectableCells || this.config.selectableColumns)
          ? {
              columnsWithSelectedCells: sel.getColumnsWithSelectedCells(),
              selectedColumns: sel.getSelectedColumns(),
            }
          : undefined;
      (header as any)?.__renderHeaderCells?.(scrollLeft, liveSelection);
    };

    this.sectionScrollController = new SectionScrollController({
      // Body virtualization is heavier: the controller throttles this to every N px.
      onMainSectionScrollLeft: (scrollLeft) => {
        renderHeaderForScroll(scrollLeft);
        const body = this.domManager.getRefs().mainBodyRef.current;
        (body as any)?.__renderBodyCells?.(scrollLeft);
      },
    });

    if (this.config.autoExpandColumns) {
      this.autoScaleManager = new AutoScaleManager(
        {
          autoExpandColumns: this.config.autoExpandColumns,
          containerWidth: this.dimensionManager.getState().containerWidth,
          pinnedLeftWidth: 0,
          pinnedRightWidth: 0,
          mainBodyRef: refs.mainBodyRef,
          isResizing: this.isResizing,
          collapsedHeaders: this.collapsedHeaders,
        },
        () => {
          this.render("autoScaleManager");
        },
      );
    }

    if (refs.headerContainerRef.current && refs.tableBodyContainerRef.current) {
      this.scrollbarVisibilityManager = new ScrollbarVisibilityManager({
        headerContainer: refs.headerContainerRef.current,
        mainSection: refs.tableBodyContainerRef.current,
        scrollbarWidth: this.scrollbarWidth,
      });

      this.scrollbarVisibilityManager.subscribe((isScrollable) => {
        this.isMainSectionScrollable = isScrollable;
        if (refs.tableBodyContainerRef.current) {
          this.scrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);
        }
        this.render("scrollbarVisibilityManager");
      });
    }

    this.windowResizeManager = new WindowResizeManager();
    this.windowResizeManager.addCallback(() => {
      if (refs.tableBodyContainerRef.current) {
        const newScrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);
        this.scrollbarWidth = newScrollbarWidth;
        this.scrollbarVisibilityManager?.setScrollbarWidth(newScrollbarWidth);
      }
      this.render("scrollbarWidth-change");
    });

    this.syncRowSelectionManager();

    if (this.selectionManager) {
      this.handleOutsideClickManager = new HandleOutsideClickManager({
        selectableColumns: this.config.selectableColumns ?? false,
        selectedCells: new Set(),
        selectedColumns: new Set(),
        setSelectedCells: (cells) => this.selectionManager!.setSelectedCells(cells),
        setSelectedColumns: (columns) => this.selectionManager!.setSelectedColumns(columns),
        getSelectedCells: () => this.selectionManager!.getSelectedCells(),
        getSelectedColumns: () => this.selectionManager!.getSelectedColumns(),
        onClearSelection: () => this.selectionManager!.clearSelection(),
      });
      this.handleOutsideClickManager.startListening();
    }

    this.setupEventListeners();

    // DimensionManager defers its first subscriber notification to the next frame
    // (ResizeObserver + rAF). Prime row caches only (no DOM) so imperative callers
    // (e.g. getVisibleRows right after mount) do not fall back to the full flattened list.
    if (this.dimensionManager) {
      this.renderOrchestrator.primeLastProcessedResult(
        this.getRenderContext(),
        this.getRenderState(),
      );
    }
  }

  private setupEventListeners(): void {
    const elements = this.domManager.getElements();
    if (!elements?.bodyContainer) return;

    this.bodyContainerMouseLeaveListener = () => {
      this.clearHoveredRows();
    };
    elements.bodyContainer.addEventListener("mouseleave", this.bodyContainerMouseLeaveListener);

    this.syncExternalScrollWiring();
  }

  /**
   * Reconciles which element owns the vertical scroll listener based on the
   * current `scrollParent` config. Called on mount and whenever `update()`
   * could have changed the relevant inputs (`scrollParent` / `height` /
   * `maxHeight`). Idempotent — safe to call repeatedly.
   */
  private syncExternalScrollWiring(): void {
    const elements = this.domManager.getElements();
    if (!elements?.bodyContainer) return;

    // A consumer "wants" external scroll mode whenever they pass a `scrollParent`
    // and don't constrain the table with `height`/`maxHeight`. This is computed
    // independently of whether the parent resolves *right now*: a getter form
    // (`() => ref.current?.parentElement`) intentionally resolves on a later
    // commit than this table's mount, so resolution can legitimately be null on
    // the first pass and become non-null on a subsequent frame.
    const noHeight =
      this.config.height === undefined || this.config.height === null || this.config.height === "";
    const noMaxHeight =
      this.config.maxHeight === undefined ||
      this.config.maxHeight === null ||
      this.config.maxHeight === "";
    const wantsExternal = this.config.scrollParent != null && noHeight && noMaxHeight;

    const nextParent: ResolvedScrollParent = wantsExternal
      ? resolveScrollParent(this.config.scrollParent)
      : null;

    if (nextParent !== this.resolvedScrollParent) {
      this.detachExternalScrollWiring();
    }

    if (nextParent) {
      this.externalScrollRetryCount = 0;
      this.attachExternalScrollWiring(nextParent);
      this.ensureBodyScrollListenerDetached(elements.bodyContainer);
      this.recomputeExternalViewportHeight();
    } else if (wantsExternal) {
      // External scroll requested but the parent isn't resolvable yet. Seed a
      // provisional viewport (the window height) so virtualization stays ON in
      // the meantime — otherwise `contentHeight` is undefined and EVERY row
      // renders at once, which can freeze the page for large datasets. Then
      // retry resolving the real parent on subsequent frames; once it resolves,
      // `recomputeExternalViewportHeight` replaces this provisional value.
      this.ensureBodyScrollListenerDetached(elements.bodyContainer);
      const provisional = typeof window !== "undefined" ? window.innerHeight : 0;
      if (provisional > 0 && this.externalViewportHeight !== provisional) {
        this.externalViewportHeight = provisional;
        this.dimensionManager?.updateConfig({ externalViewportHeight: provisional });
      }
      this.scheduleExternalScrollParentRetry();
    } else {
      this.externalScrollRetryCount = 0;
      this.ensureBodyScrollListenerAttached(elements.bodyContainer);
      this.externalViewportHeight = 0;
      if (this.dimensionManager) {
        this.dimensionManager.updateConfig({ externalViewportHeight: undefined });
      }
    }
  }

  /**
   * Retry resolving a configured `scrollParent` on the next animation frame.
   * Used when the parent (typically a getter pointing at a ref) was not yet
   * resolvable when external wiring last ran. Bounded by
   * {@link SimpleTableVanilla.EXTERNAL_SCROLL_MAX_RETRIES} so a permanently
   * unresolvable parent doesn't spin forever.
   */
  private scheduleExternalScrollParentRetry(): void {
    if (this.externalScrollRetryRaf !== null) return;
    if (this.externalScrollRetryCount >= SimpleTableVanilla.EXTERNAL_SCROLL_MAX_RETRIES) return;
    if (typeof requestAnimationFrame === "undefined") return;
    this.externalScrollRetryRaf = requestAnimationFrame(() => {
      this.externalScrollRetryRaf = null;
      if (!this.mounted) return;
      this.externalScrollRetryCount++;
      this.syncExternalScrollWiring();
    });
  }

  private ensureBodyScrollListenerAttached(bodyContainer: HTMLElement): void {
    if (this.bodyScrollListenerAttached) return;
    this.bodyContainerScrollListener = (e: Event) => this.handleScroll(e);
    bodyContainer.addEventListener("scroll", this.bodyContainerScrollListener);
    this.bodyScrollListenerAttached = true;
  }

  private ensureBodyScrollListenerDetached(bodyContainer: HTMLElement): void {
    if (!this.bodyScrollListenerAttached) return;
    if (this.bodyContainerScrollListener) {
      bodyContainer.removeEventListener("scroll", this.bodyContainerScrollListener);
      this.bodyContainerScrollListener = null;
    }
    this.bodyScrollListenerAttached = false;
  }

  private attachExternalScrollWiring(parent: ResolvedScrollParent): void {
    if (!parent) return;
    this.resolvedScrollParent = parent;

    const handler = (e: Event) => this.handleExternalScroll(e);
    this.externalScrollListener = handler;
    parent.addEventListener("scroll", handler, { passive: true });

    if (typeof Window !== "undefined" && parent instanceof Window) {
      const resizeHandler = () => this.handleExternalResize();
      this.externalWindowResizeListener = resizeHandler;
      parent.addEventListener("resize", resizeHandler, { passive: true });
    } else if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => this.handleExternalResize());
      ro.observe(parent as HTMLElement);
      this.externalParentResizeObserver = ro;
    }

    this.recomputeExternalScrollPaddingTop();
    this.applyOverscrollContainment(parent);
  }

  private detachExternalScrollWiring(): void {
    const parent = this.resolvedScrollParent;
    if (parent && this.externalScrollListener) {
      parent.removeEventListener("scroll", this.externalScrollListener);
    }
    this.externalScrollListener = null;

    if (
      parent &&
      this.externalWindowResizeListener &&
      typeof Window !== "undefined" &&
      parent instanceof Window
    ) {
      parent.removeEventListener("resize", this.externalWindowResizeListener);
    }
    this.externalWindowResizeListener = null;

    if (this.externalParentResizeObserver) {
      this.externalParentResizeObserver.disconnect();
      this.externalParentResizeObserver = null;
    }

    this.resolvedScrollParent = null;

    // Clear the padding-top CSS variable so a subsequent transition into
    // bounded-height mode doesn't leave stale offset state on the root.
    const elements = this.domManager.getElements();
    if (elements) {
      elements.rootElement.style.removeProperty("--st-external-scroll-padding-top");
    }

    this.restoreOverscrollBehavior();
  }

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
  private applyOverscrollContainment(parent: ResolvedScrollParent): void {
    const target: HTMLElement | null =
      typeof Window !== "undefined" && parent instanceof Window
        ? typeof document !== "undefined"
          ? document.documentElement
          : null
        : (parent as HTMLElement | null);
    if (!target) return;
    this.overscrollBehaviorTarget = target;
    this.overscrollBehaviorPrev = target.style.overscrollBehaviorY;
    target.style.overscrollBehaviorY = "none";
  }

  private restoreOverscrollBehavior(): void {
    if (!this.overscrollBehaviorTarget) return;
    this.overscrollBehaviorTarget.style.overscrollBehaviorY = this.overscrollBehaviorPrev;
    this.overscrollBehaviorTarget = null;
    this.overscrollBehaviorPrev = "";
  }

  /**
   * Read the resolved scroll parent's computed `padding-top` and publish it
   * as `--st-external-scroll-padding-top` on the table root. The sticky
   * header CSS uses `top: calc(-1 * var(...))` so the header pins flush to
   * the parent's outer top edge instead of the padding edge, eliminating the
   * visible gap that CSS sticky would otherwise produce when the consumer
   * gives the scroll parent any top padding. Re-run on layout changes via
   * ResizeObserver / window resize.
   */
  private recomputeExternalScrollPaddingTop(): void {
    const elements = this.domManager.getElements();
    if (!elements) return;
    const parent = this.resolvedScrollParent;
    let paddingTop = 0;
    if (parent && typeof HTMLElement !== "undefined" && parent instanceof HTMLElement) {
      const cs = getComputedStyle(parent);
      paddingTop = parseFloat(cs.paddingTop) || 0;
    }
    elements.rootElement.style.setProperty("--st-external-scroll-padding-top", `${paddingTop}px`);
  }

  /**
   * Recompute the visible portion of the table inside the external scroll
   * parent and push it into the DimensionManager so virtualization math
   * picks it up. Cheap; called on scroll, on parent/window resize, and on
   * every re-render where the resolved parent may have moved.
   */
  private recomputeExternalViewportHeight(): void {
    if (!this.resolvedScrollParent) return;
    const elements = this.domManager.getElements();
    const tableRoot = elements?.rootElement ?? this.container;
    const metrics = getExternalScrollMetrics(this.resolvedScrollParent, tableRoot);
    if (!metrics) return;
    let next = metrics.visibleViewportHeight;
    // Before the first render the table has no laid-out height, so the
    // table∩viewport intersection is 0. Feeding 0 disables virtualization
    // (contentHeight becomes undefined → every row renders at once, a long
    // blocking paint that looks blank/unfilled on load until a scroll triggers
    // virtualization). Seed with the parent's own viewport height so the first
    // paint is already virtualized; the post-first-render / scroll recompute
    // then refines this to the precise visible intersection.
    if (next <= 0) {
      next = getParentViewportHeight(this.resolvedScrollParent);
    }
    if (next <= 0 || next === this.externalViewportHeight) return;
    this.externalViewportHeight = next;
    if (this.dimensionManager) {
      this.dimensionManager.updateConfig({ externalViewportHeight: next });
    }
  }

  private handleExternalResize(): void {
    this.recomputeExternalViewportHeight();
    this.recomputeExternalScrollPaddingTop();
    this.render("external-scroll-resize");
  }

  private handleExternalScroll(_e: Event): void {
    const parent = this.resolvedScrollParent;
    if (!parent) return;
    const elements = this.domManager.getElements();
    const tableRoot = elements?.rootElement ?? this.container;
    const metrics = getExternalScrollMetrics(parent, tableRoot);
    if (!metrics) return;

    const newScrollTop = metrics.relativeScrollTop;

    this.isScrolling = true;

    if (this.scrollEndTimeoutId !== null) {
      clearTimeout(this.scrollEndTimeoutId);
    }
    this.scrollEndTimeoutId = window.setTimeout(() => {
      this.isScrolling = false;
      this.scrollEndTimeoutId = null;
      requestAnimationFrame(() => {
        this.render("scroll-end");
      });
    }, 150);

    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }

    this.scrollRafId = requestAnimationFrame(() => {
      const direction: "up" | "down" | "none" =
        newScrollTop > this.lastScrollTop
          ? "down"
          : newScrollTop < this.lastScrollTop
            ? "up"
            : "none";

      this.scrollTop = newScrollTop;
      this.scrollDirection = direction;
      this.lastScrollTop = newScrollTop;

      // Visible viewport height can change as the table enters / leaves the
      // parent's viewport (partial intersection at top or bottom). Push the
      // current value into the DimensionManager so contentHeight tracks it.
      if (metrics.visibleViewportHeight !== this.externalViewportHeight) {
        this.externalViewportHeight = metrics.visibleViewportHeight;
        if (this.dimensionManager) {
          this.dimensionManager.updateConfig({
            externalViewportHeight: metrics.visibleViewportHeight,
          });
        }
      }

      if (this.scrollManager) {
        if (this.config.onLoadMore) {
          // Compare against the table's bottom (not the parent's), so onLoadMore
          // fires when the user has scrolled close to the end of the table even
          // when the parent has more content below it.
          const containerHeight = metrics.visibleViewportHeight;
          const contentHeight =
            metrics.relativeScrollTop +
            metrics.visibleViewportHeight +
            Math.max(0, metrics.distanceFromTableBottom);
          this.scrollManager.handleScroll(newScrollTop, 0, containerHeight, contentHeight);
        } else {
          this.scrollManager.handleScroll(newScrollTop, 0, 0, 0);
        }
      }

      this.render("scroll-raf");

      this.scrollRafId = null;
    });
  }

  private handleScroll(e: Event): void {
    const element = e.currentTarget as HTMLDivElement;
    const newScrollTop = element.scrollTop;

    // Set scrolling state immediately
    this.isScrolling = true;

    // Clear previous scroll end timeout
    if (this.scrollEndTimeoutId !== null) {
      clearTimeout(this.scrollEndTimeoutId);
    }

    // Set up timeout to detect when scrolling ends; run one full render so selection/content are correct
    this.scrollEndTimeoutId = window.setTimeout(() => {
      this.isScrolling = false;
      this.scrollEndTimeoutId = null;
      // Defer full render out of the timer callback so the stack stays thin (INP / long-task
      // attribution) and the browser can apply scroll geometry before we mutate layout again.
      requestAnimationFrame(() => {
        this.render("scroll-end");
      });
    }, 150);

    // Cancel any pending RAF
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }

    // Use RAF to throttle scroll updates
    this.scrollRafId = requestAnimationFrame(() => {
      // Calculate scroll direction
      const direction: "up" | "down" | "none" =
        newScrollTop > this.lastScrollTop
          ? "down"
          : newScrollTop < this.lastScrollTop
            ? "up"
            : "none";

      // Update state
      this.scrollTop = newScrollTop;
      this.scrollDirection = direction;
      this.lastScrollTop = newScrollTop;

      // Use scroll manager if available
      if (this.scrollManager) {
        if (this.config.onLoadMore) {
          const containerHeight = element.clientHeight;
          const contentHeight = element.scrollHeight;
          this.scrollManager.handleScroll(
            newScrollTop,
            element.scrollLeft,
            containerHeight,
            contentHeight,
          );
        } else {
          this.scrollManager.handleScroll(newScrollTop, element.scrollLeft, 0, 0);
        }
      }

      // Trigger re-render for virtualization
      this.render("scroll-raf");

      this.scrollRafId = null;
    });
  }

  private clearHoveredRows(): void {
    document.querySelectorAll(".st-row.hovered").forEach((el) => {
      el.classList.remove("hovered");
    });
  }

  private updateAriaLiveRegion(): void {
    const elements = this.domManager.getElements();
    if (elements?.ariaLiveRegion) {
      elements.ariaLiveRegion.textContent = this.announcement;
    }
  }

  /** Row grouping used for flatten/expand while pivot is active (overrides consumer). */
  private getEffectiveRowGrouping(): Accessor[] | undefined {
    const pivotState = this.pivotManager?.getState();
    if (pivotState?.active) {
      return pivotState.rowGrouping;
    }
    return this.config.rowGrouping;
  }

  /**
   * Recompute pivot from filtered source rows and feed sort/selection managers.
   * When pivot is inactive, sort sees the filtered source rows directly.
   */
  private syncPivotPipeline(filteredSourceRows?: Row[]): void {
    if (!this.pivotManager) return;

    const sourceRows =
      filteredSourceRows ?? this.filterManager?.getFilteredRows() ?? this.localRows;
    const wasActive = this.pivotManager.isActive();

    this.pivotManager.updateConfig({
      sourceRows,
      fieldHeaders: this.pristineDefaultHeaders,
      pivot: this.config.pivot ?? null,
    });

    const state = this.pivotManager.getState();

    if (state.active) {
      this.headers = state.headers;
      this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);
      this.sortManager?.updateConfig({
        tableRows: state.pivotedRows,
        headers: state.headers,
        rowGrouping: state.rowGrouping,
      });
      this.selectionManager?.updateConfig({ headers: state.headers });
      if (!wasActive) {
        this.expandedDepthsManager?.updateRowGrouping(state.rowGrouping);
        this.collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(state.headers);
      } else {
        this.expandedDepthsManager?.updateRowGrouping(state.rowGrouping);
      }
      if (this.dimensionManager) {
        const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
          this.headers,
          this.config,
          this.customTheme,
        );
        this.dimensionManager.updateConfig({ effectiveHeaders });
      }
    } else {
      if (wasActive) {
        this.headers = deepClone(this.pristineDefaultHeaders);
        this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);
        this.collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(this.headers);
        this.expandedDepthsManager?.updateRowGrouping(this.config.rowGrouping);
        if (this.dimensionManager) {
          const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
            this.headers,
            this.config,
            this.customTheme,
          );
          this.dimensionManager.updateConfig({ effectiveHeaders });
        }
      }
      this.sortManager?.updateConfig({
        tableRows: sourceRows,
        headers: this.headers,
        rowGrouping: this.config.rowGrouping,
      });
      this.selectionManager?.updateConfig({ headers: this.headers });
    }
  }

  private getRenderContext(): RenderContext {
    const refs = this.domManager.getRefs();
    const pivotState = this.pivotManager?.getState();
    const effectiveConfig =
      pivotState?.active
        ? { ...this.config, rowGrouping: pivotState.rowGrouping }
        : this.config;
    const effectiveLocalRows =
      pivotState?.active ? pivotState.pivotedRows : this.localRows;

    return {
      accordionAxis: this.pendingAccordionAxis,
      config: effectiveConfig,
      customTheme: this.customTheme,
      resolvedIcons: this.resolvedIcons,
      effectiveHeaders: [],
      essentialAccessors: this.essentialAccessors,
      headers: this.headers,
      localRows: effectiveLocalRows,
      collapsedHeaders: this.collapsedHeaders,
      collapsedRows: this.collapsedRows,
      expandedRows: this.expandedRows,
      expandedDepths: this.expandedDepths,
      isResizing: this.isResizing,
      internalIsLoading: this.internalIsLoading,
      // Inject the constructor for nested grid tables. Supplying it here (rather
      // than letting nestedGridRowRenderer import this class) breaks the module
      // cycle SimpleTableVanilla → RenderOrchestrator → TableRenderer →
      // SectionRenderer → nestedGridRowRenderer → SimpleTableVanilla.
      createNestedTable: (container, nestedConfig) =>
        new SimpleTableVanilla(container, nestedConfig),
      cellRegistry: this.cellRegistry,
      hoverScopeId: this.hoverScopeId,
      headerRegistry: this.headerRegistry,
      draggedHeaderRef: this.draggedHeaderRef,
      hoveredHeaderRef: this.hoveredHeaderRef,
      mainBodyRef: refs.mainBodyRef,
      pinnedLeftRef: refs.pinnedLeftRef,
      pinnedRightRef: refs.pinnedRightRef,
      mainHeaderRef: refs.mainHeaderRef,
      pinnedLeftHeaderRef: refs.pinnedLeftHeaderRef,
      pinnedRightHeaderRef: refs.pinnedRightHeaderRef,
      dimensionManager: this.dimensionManager,
      scrollManager: this.scrollManager,
      sectionScrollController: this.sectionScrollController,
      sortManager: this.sortManager,
      filterManager: this.filterManager,
      selectionManager: this.selectionManager,
      rowSelectionManager: this.rowSelectionManager,
      rowStateMap: this.rowStateMap,
      positionOnlyBody: this._positionOnlyBody,
      // Drives the virtualization window (calculateContentHeight) in external
      // scroll mode. Gate purely on a positive cached viewport — NOT on
      // `resolvedScrollParent` — so the provisional viewport seeded before a
      // late-resolving `scrollParent` getter attaches still enables
      // virtualization. Without this, the first render before the parent
      // resolves has no content height and renders every row at once.
      // `externalViewportHeight` is reset to 0 whenever external mode is off,
      // so `> 0` already excludes the internal-scroll case.
      externalViewportHeight:
        this.externalViewportHeight > 0 ? this.externalViewportHeight : undefined,
      onRender: () => this.render("resizeHandler-onRender"),
      getShrinkFloors: () => this.getShrinkFloors(),
      onAutoExpandNaturalWidths: (widths: Map<string, number>) => this.recordNaturalWidths(widths),
      setIsResizing: (value: boolean) => {
        this.isResizing = value;
        if (this.autoScaleManager && value === false) {
          const refs = this.domManager.getRefs();
          const containerWidth =
            refs.tableBodyContainerRef?.current?.clientWidth ??
            refs.mainBodyRef?.current?.clientWidth ??
            this.dimensionManager?.getState().containerWidth ??
            0;
          this.autoScaleManager.updateConfig({
            isResizing: false,
            containerWidth,
          });
        }
      },
      setHeaders: (headers: ColumnDef[]) => {
        // When the visible/pinned set of columns changed (hide/show, pin/unpin),
        // open the accordion-horizontal animation window so incoming cells
        // grow from width 0 and outgoing cells shrink to width 0 in their
        // current section. Otherwise (drag-reorder within the same section
        // / set), just snapshot for plain FLIP.
        const visibilityChanged = this.didColumnVisibilityChange(headers);
        if (visibilityChanged) {
          this.beginAccordionAnimation("horizontal");
        } else {
          this.captureAnimationSnapshot();
        }
        this.headers = deepClone(headers);
        this.renderOrchestrator.invalidateCache("header");
      },
      animationCoordinator: this.animationCoordinator,
      setCollapsedHeaders: (headers: Set<Accessor>) => {
        this.beginAccordionAnimation("horizontal");
        this.collapsedHeaders = headers;
      },
      setCollapsedRows: (
        rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
      ) => {
        this.beginAccordionAnimation("vertical");
        this.collapsedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.collapsedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setExpandedRows: (
        rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
      ) => {
        this.beginAccordionAnimation("vertical");
        this.expandedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.expandedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setRowStateMap: (
        mapOrUpdater:
          | Map<string | number, any>
          | ((prev: Map<string | number, any>) => Map<string | number, any>),
      ) => {
        // Capture a snapshot before mutating the row-state map so body cells
        // around the appearing/disappearing state row FLIP into their new
        // positions in sync with the state row's grow-in/out animation.
        // Without this, the state row would expand smoothly but every other
        // row would snap, producing a visual desync.
        this.beginAccordionAnimation("vertical");
        this.rowStateMap =
          typeof mapOrUpdater === "function" ? mapOrUpdater(this.rowStateMap) : mapOrUpdater;
        this.render("rowStateMap");
      },
      getCollapsedRows: () => this.collapsedRows,
      getCollapsedHeaders: () => this.collapsedHeaders,
      getExpandedRows: () => this.expandedRows,
      getHeaders: () => this.headers,
      getPristineDefaultHeaders: () => this.pristineDefaultHeaders,
      getRowStateMap: () => this.rowStateMap,
      setColumnEditorOpen: (open: boolean) => {
        this.columnEditorOpen = open;
      },
      setCurrentPage: (page: number) => {
        if (
          page !== this.currentPage &&
          this.config.enablePagination &&
          !this.config.serverSidePagination
        ) {
          // Re-fit "auto" columns to the new page's rendered rows.
          this.autoSizeAccessors.forEach((accessor) => this.pendingAutoSize.add(accessor));
        }
        this.currentPage = page;
      },
    };
  }

  private getRenderState(): RenderState {
    return {
      currentPage: this.currentPage,
      scrollTop: this.scrollTop,
      scrollDirection: this.scrollDirection,
      scrollbarWidth: this.scrollbarWidth,
      isMainSectionScrollable: this.isMainSectionScrollable,
      columnEditorOpen: this.columnEditorOpen,
    };
  }

  /** A leaf column that should size to content (declared with width:"auto"). */
  private isAutoSizeLeaf(header: ColumnDef): boolean {
    if (header.isSelectionColumn) return false;
    return isAutoWidth(header);
  }

  private computeAutoSizeAccessors(): Set<Accessor> {
    const set = new Set<Accessor>();
    const leaves = getAllVisibleLeafHeaders(this.headers, this.collapsedHeaders);
    for (const leaf of leaves) {
      if (this.isAutoSizeLeaf(leaf)) set.add(leaf.accessor);
    }
    return set;
  }

  private getAutoSizeStyleRoot(): ParentNode | null {
    // Prefer body, but empty tables clear body sections — fall back to the
    // header so auto-size can still borrow font/padding metrics.
    const refs = this.domManager.getRefs();
    const anchor =
      refs.mainBodyRef?.current ??
      refs.mainHeaderRef?.current ??
      refs.pinnedLeftHeaderRef?.current ??
      refs.pinnedRightHeaderRef?.current;
    if (!anchor) return null;
    return anchor.closest(".simple-table-root") ?? anchor;
  }

  /**
   * Rows that content-fit ("auto") measurement should sample. With client-side
   * pagination only the current page is rendered, so fit columns to the page's
   * rows rather than the entire dataset — otherwise off-page values inflate
   * every auto column's width.
   */
  private getAutoSizeRows(): Row[] {
    if (this.config.enablePagination && !this.config.serverSidePagination) {
      const processed = this.renderOrchestrator.getLastProcessedResult();
      if (processed) {
        const pageRows = processed.currentTableRows
          .filter((tr) => tr.row && !tr.stateIndicator && !tr.isLoadingSkeleton && !tr.nestedTable)
          .map((tr) => tr.row);
        if (pageRows.length > 0) return pageRows;
      }
    }
    return this.localRows;
  }

  /**
   * Shrink floors for auto-expand column resize, keyed by accessor. Each
   * visible leaf's floor is its natural width — a user-set / content-measured
   * override when present, else the pixel width declared in the column
   * definitions — raised to at least its `minWidth` (or the global minimum).
   * Flexible declarations (fr / % / unmeasured "auto") have no pixel natural,
   * so they floor at `minWidth` alone.
   */
  private getShrinkFloors(): Map<string, number> {
    const declared = new Map<string, number>();
    const visitDeclared = (h: ColumnDef): void => {
      if (h.children && h.children.length > 0) {
        h.children.forEach(visitDeclared);
      }
      if (typeof h.width === "number") {
        declared.set(String(h.accessor), h.width);
      } else if (typeof h.width === "string" && h.width.trim().endsWith("px")) {
        const px = parseFloat(h.width);
        if (Number.isFinite(px)) declared.set(String(h.accessor), px);
      }
    };
    this.pristineDefaultHeaders.forEach(visitDeclared);

    const floors = new Map<string, number>();
    const leaves = getAllVisibleLeafHeaders(this.headers, this.collapsedHeaders);
    for (const leaf of leaves) {
      const key = String(leaf.accessor);
      const natural = this.naturalWidths.get(key) ?? declared.get(key);
      floors.set(key, Math.max(natural ?? 0, getHeaderMinWidth(leaf)));
    }
    return floors;
  }

  /** Record user-set / measured widths as the columns' new natural widths. */
  private recordNaturalWidths(widths: Map<string, number>): void {
    widths.forEach((width, accessor) => this.naturalWidths.set(accessor, width));
  }

  /** Immutably write measured pixel widths into the leaf headers. */
  private applyMeasuredWidths(widths: Map<Accessor, number>): void {
    const apply = (h: ColumnDef): ColumnDef => {
      const next = { ...h };
      // Apply before recursing: `singleRowChildren` / collapsed parents are
      // visible leaves that still carry children, and must receive their
      // measured width (same set that `computeAutoSizeAccessors` collected).
      if (widths.has(h.accessor)) {
        next.width = widths.get(h.accessor) as number;
      }
      if (h.children && h.children.length > 0) {
        next.children = h.children.map(apply);
      }
      return next;
    };
    this.headers = this.headers.map(apply);
    // Measured content widths are the columns' natural widths (the shrink
    // floors for auto-expand resize).
    widths.forEach((width, accessor) => this.naturalWidths.set(String(accessor), width));
  }

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
  private maybeAutoSizeColumns(): void {
    if (this.isAutoSizing || this.pendingAutoSize.size === 0) return;

    // Need some rendered header DOM to borrow style metrics (padding/font)
    // from. The measurement itself no longer requires each pending column's
    // own header cell — columns virtualized out of the horizontal band are
    // measured from their data so their width matches what they'd get when
    // rendered (container-size independent).
    const styleRoot = this.getAutoSizeStyleRoot();
    const ready = Boolean(
      styleRoot instanceof HTMLElement && styleRoot.querySelector(".st-header-cell"),
    );
    if (!ready) return;

    this.isAutoSizing = true;
    try {
      const leaves = getAllVisibleLeafHeaders(this.headers, this.collapsedHeaders);
      const leafByAccessor = new Map(leaves.map((leaf) => [leaf.accessor, leaf]));

      const autoSizeRows = this.getAutoSizeRows();
      const widths = new Map<Accessor, number>();
      for (const accessor of this.pendingAutoSize) {
        const leaf = leafByAccessor.get(accessor);
        if (!leaf) continue;
        // Sampling/outlier tuning uses internal defaults; per-column control is
        // via the header's `maxWidth` / `minWidth` / `autoSizeMode`.
        //
        // `settled` is informational for callers that care; we still apply the
        // best-effort width now. We do NOT keep unsettled accessors pending —
        // retrying on every subsequent render is a common infinite-loop source
        // when measurement is provisional (async portals / loading skeletons).
        // Re-measure only via explicit re-queue: rows change, isLoading flip,
        // or `refitAutoSizeColumns()`.
        const { width } = calculateHeaderContentWidth(accessor, {
          rows: autoSizeRows,
          header: leaf,
          styleRoot,
          theme: this.config.theme,
          autoSizeMode: leaf.autoSizeMode,
          sortIcon: this.resolvedIcons.sortUp,
          expandIcon: this.resolvedIcons.expand,
          onRendererHostDiscard: this.config.onRendererHostDiscard,
        });
        widths.set(accessor, width);
      }

      // Always clear — one measure pass per pending set. Never leave accessors
      // pending across renders.
      this.pendingAutoSize.clear();
      if (widths.size === 0) return;

      // Avoid a corrective re-render when nothing changed.
      let changed = false;
      for (const [accessor, width] of widths) {
        const leaf = leafByAccessor.get(accessor);
        const current =
          typeof leaf?.width === "number"
            ? leaf.width
            : this.naturalWidths.get(String(accessor));
        if (current !== width) {
          changed = true;
          break;
        }
      }
      if (!changed) return;

      this.applyMeasuredWidths(widths);
      this.renderOrchestrator.invalidateCache("header");

      const elements = this.domManager.getElements();
      const refs = this.domManager.getRefs();
      if (elements) {
        this.renderOrchestrator.render(
          elements,
          refs,
          this.getRenderContext(),
          this.getRenderState(),
          this.mergedColumnEditorConfig,
        );
      }

      if (this.config.onColumnWidthChange) {
        this.config.onColumnWidthChange(this.headers);
      }
    } finally {
      this.isAutoSizing = false;
    }
  }

  /**
   * Re-run the content-fit measurement for all auto-size columns. Useful for
   * host frameworks (e.g. React) whose custom renderers mount asynchronously:
   * calling this from a layout effect (pre-paint) re-measures once the real
   * renderer DOM is present, so the column fits accurately without flicker.
   */
  public refitAutoSizeColumns(): void {
    if (this.autoSizeAccessors.size === 0) return;
    this.autoSizeAccessors.forEach((accessor) => this.pendingAutoSize.add(accessor));
    this.render("auto-size-refit");
  }

  private render(source?: string): void {
    if (!this.mounted) return;

    // Skip renders triggered by manager updates during an update() call
    // The update() method will call render at the end
    if (this.isUpdating && source !== "update") {
      return;
    }

    // During scroll use position-only body updates; full update on scroll-end or other triggers
    this._positionOnlyBody = source === "scroll-raf" && this.isScrolling === true;

    const elements = this.domManager.getElements();
    const refs = this.domManager.getRefs();

    if (!elements) return;

    this.renderOrchestrator.render(
      elements,
      refs,
      this.getRenderContext(),
      this.getRenderState(),
      this.mergedColumnEditorConfig,
    );

    // Resolve any "auto" columns to a measured pixel width. This runs
    // synchronously within the same task as the render above, so the corrective
    // re-render paints once at the final width (no flicker).
    this.maybeAutoSizeColumns();

    // Accordion axis is one-shot per collapse/expand toggle: clear it after
    // the render that consumed it so subsequent renders (sort, scroll,
    // resize, etc.) don't apply zero-size initial styles to cells they
    // happen to create.
    this.pendingAccordionAxis = null;

    // Snapshot the visible-leaf-set we just painted so the next setHeaders
    // can detect a hide/show/pin/unpin change against the user-perceived
    // state (rather than against `this.headers`, whose objects the column
    // editor mutates in place before calling setHeaders).
    this.lastRenderedVisibilityKey = this.buildVisibilityKey(this.headers);

    // FLIP play step. No-op when no snapshot is armed or when scroll-driven.
    // Position-only scroll renders deliberately skip play so out-going /
    // in-coming cells aren't FLIP-tweened during vertical scrolls. Live-sort
    // reorders (from updateData) also skip play so they don't interrupt an
    // in-flight user sort or thrash retained-cell cleanup every tick.
    // Every other render — including the chain of mid-drag `setHeaders` renders
    // that fire on each `dragover` swap — runs play so columns being
    // displaced by the drag slide smoothly to their new slots.
    if (source !== "scroll-raf" && source !== "live-sort") {
      this.animationCoordinator.play({ containers: this.getAnimatableContainers() });
    }

    this.maybeScheduleUnvirtualizedRowsWarning();
  }

  /**
   * Dev-only safeguard. Schedules a one-shot, deferred check that warns when the
   * table is about to render a very large number of rows with no virtualization
   * active (no `height` / `maxHeight` and no bounded `scrollParent`). The check
   * is deferred so external-scroll viewport seeding (which can momentarily leave
   * `contentHeight` undefined on the first paint) has time to settle and we
   * don't cry wolf for a correctly-configured table. Compiled out of production
   * via the NODE_ENV guard. Never throws.
   */
  private maybeScheduleUnvirtualizedRowsWarning(): void {
    if (!isDevEnvironment()) return;
    if (this.hasWarnedUnvirtualizedRows) return;
    if (this.unvirtualizedRowsCheckTimeoutId !== null) return;
    if (typeof window === "undefined") return;
    // Consumer explicitly opted out of virtualization — don't warn.
    if (this.config.enableVirtualization === false) return;

    // Cheap synchronous pre-check: only arm the deferred confirmation when this
    // render already looks unvirtualized with a large dataset. Healthy
    // (virtualized) tables short-circuit here and never schedule a timer.
    if (this.dimensionManager?.getContentHeight() !== undefined) return;
    const renderedRowCount =
      this.renderOrchestrator.getLastProcessedResult()?.currentTableRows.length ?? 0;
    if (renderedRowCount < UNVIRTUALIZED_ROW_WARNING_THRESHOLD) return;

    // Defer the actual warning so external-scroll viewport seeding (which can
    // momentarily leave contentHeight undefined on the first paint) has time to
    // settle before we decide it's a real misconfiguration.
    this.unvirtualizedRowsCheckTimeoutId = window.setTimeout(() => {
      this.unvirtualizedRowsCheckTimeoutId = null;
      this.evaluateUnvirtualizedRowsWarning();
    }, 400);
  }

  private evaluateUnvirtualizedRowsWarning(): void {
    if (this.hasWarnedUnvirtualizedRows || !this.mounted) return;
    if (this.config.enableVirtualization === false) return;

    // `contentHeight === undefined` is precisely the signal that virtualization
    // is OFF and every row is rendered to the DOM. A number means a viewport
    // (own height, maxHeight, or external scroll parent) is bounding the render.
    const contentHeight = this.dimensionManager?.getContentHeight();
    if (contentHeight !== undefined) return;

    const renderedRowCount =
      this.renderOrchestrator.getLastProcessedResult()?.currentTableRows.length ?? 0;
    if (renderedRowCount < UNVIRTUALIZED_ROW_WARNING_THRESHOLD) return;

    this.hasWarnedUnvirtualizedRows = true;

    const hasScrollParent = this.config.scrollParent != null;
    const parentHint = hasScrollParent
      ? ' A `scrollParent` is set but did not produce a bounded viewport — make sure it is an element whose visible height is smaller than its content (e.g. a fixed/max height with `overflow: auto`), or use `"window"`.'
      : "";

    // eslint-disable-next-line no-console
    console.warn(
      `[simple-table] Rendering ${renderedRowCount} rows without virtualization. ` +
        `This can cause slow renders and high memory use. To virtualize, set \`height\` ` +
        `or \`maxHeight\` on the table, or pass a bounded \`scrollParent\`.${parentHint}`,
    );
  }

  update(config: Partial<SimpleTableConfigInput>): void {
    this.isUpdating = true;
    const patch = normalizeConfigPatch(config);
    this.config = { ...this.config, ...patch };
    // Rebind so the rest of this method reads normalized keys (`columns`, etc.).
    config = patch as Partial<SimpleTableConfigInput>;

    if (config.animations !== undefined) {
      this.applyAnimationsConfig(config.animations);
    }

    if (config.onRendererHostDiscard !== undefined) {
      this.animationCoordinator.setOnHostDiscard(config.onRendererHostDiscard);
      this.renderOrchestrator.setOnRendererHostDiscard(config.onRendererHostDiscard);
    }

    if (config.rows !== undefined) {
      // Snapshot before swapping the rows reference so the FLIP `play` at the
      // end of the ensuing render can interpolate every cell from its old
      // visual spot to its new one. Without this, callers like the dynamic
      // nested-table example (which calls update({ rows }) once a child fetch
      // resolves to swap a loading-state row out for a nested-grid row) would
      // see body cells around the change snap instead of slide.
      // Skip until after the first render so initial mount doesn't try to
      // animate from an empty snapshot.
      if (this.firstRenderDone) {
        this.captureAnimationSnapshot();
      }
      this.localRows = [...config.rows];
      this.rebuildRowIndexMap();

      if (this.filterManager) {
        this.filterManager.updateConfig({ rows: this.localRows });
      }
      // Pivot + sort are synced from filtered source rows (filter subscribe also
      // fires when rows change if FilterManager notifies; call explicitly too).
      this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
      // SelectionManager will be updated with processed rows during render

      // Re-fit auto-size columns against the new data (content width may change).
      this.autoSizeAccessors.forEach((accessor) => this.pendingAutoSize.add(accessor));
    }

    if (config.pivot !== undefined && config.rows === undefined) {
      // Rows update already synced the pipeline; pivot-only updates recompute here.
      this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
    }

    if (config.rows !== undefined || config.totalRowCount !== undefined) {
      // The DimensionManager owns `contentHeight`, which gates the root between a
      // fixed height and `height: auto` (and therefore whether the body gets an
      // inner scrollbar). It must track the same row count as the height math in
      // RenderOrchestrator. Without this, a serverSidePagination table that
      // mounts with an empty rows array stays stuck on its initial (0-row) count:
      // once the first page loads and overflows maxHeight, the root never becomes
      // bounded, so rows and the footer get clipped instead of scrolling.
      this.dimensionManager?.updateConfig({
        totalRowCount: this.config.totalRowCount ?? this.localRows.length,
      });
    }

    if (config.columns !== undefined && !this.isResizing) {
      // Snapshot before mutating headers so the FLIP `play` at the end of the
      // ensuing render can inverse-transform from the old layout to the new
      // one — works the same whether the caller is reordering programmatically
      // or via an in-flight header drag.
      //
      // Skip entirely while `isResizing`: mid-drag parent re-renders often push
      // a fresh columns tree with stale widths, which would replace
      // this.headers, clear naturalWidths, and fight the in-progress resize.
      this.captureAnimationSnapshot();
      this.pristineDefaultHeaders = deepClone(config.columns);
      // Field catalog drives filters; visible headers come from pivot when active.
      if (this.filterManager) {
        this.filterManager.updateConfig({ headers: this.pristineDefaultHeaders });
      }
      if (this.pivotManager?.isActive()) {
        this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
      } else {
        this.headers = [...config.columns];
        this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);
        if (this.sortManager) {
          this.sortManager.updateConfig({ headers: this.headers });
        }
        if (this.selectionManager) {
          this.selectionManager.updateConfig({ headers: this.headers });
        }
        if (this.dimensionManager) {
          const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
            this.headers,
            this.config,
            this.customTheme,
          );
          this.dimensionManager.updateConfig({ effectiveHeaders });
        }
      }
      this.autoSizeAccessors = this.computeAutoSizeAccessors();
      this.pendingAutoSize = new Set(this.autoSizeAccessors);
      // New column definitions supersede measured / user-set natural widths.
      this.naturalWidths.clear();
    }

    if (config.isLoading !== undefined) {
      const wasLoading = this.internalIsLoading;
      this.internalIsLoading = config.isLoading;
      // Leaving the loading state reveals real cellRenderer / headerRenderer
      // DOM (replacing skeletons). Re-queue auto columns so widths can settle
      // from painted content instead of staying on a provisional measure.
      if (wasLoading && !config.isLoading && this.autoSizeAccessors.size > 0) {
        this.autoSizeAccessors.forEach((accessor) => this.pendingAutoSize.add(accessor));
      }
    }

    if (config.theme !== undefined) {
      this.domManager.updateTheme(config.theme);
    }

    if (config.footerPosition !== undefined) {
      this.domManager.syncFooterPosition(this.config.footerPosition);
    }

    // Custom footers are reused across scroll-driven renders when pagination
    // inputs are unchanged. Bust that cache on intentional updates that can
    // change footer content without changing totalRows (e.g. skeleton → data
    // with the same length, or external loading state via footerRenderKey).
    if (
      config.rows !== undefined ||
      config.footerRenderer !== undefined ||
      config.footerRenderKey !== undefined
    ) {
      this.renderOrchestrator.invalidateCustomFooterCache();
    }

    if (config.customTheme !== undefined) {
      const previousTheme = this.customTheme;
      this.customTheme = TableInitializer.mergeCustomTheme(this.config);

      if (!areCustomThemesEqual(previousTheme, this.customTheme)) {
        if (this.selectionManager) {
          this.selectionManager.updateConfig({
            customTheme: this.customTheme,
            rowHeight: this.customTheme.rowHeight,
          });
        }

        this.dimensionManager?.updateConfig({
          headerHeight: this.customTheme.headerHeight,
          rowHeight: this.customTheme.rowHeight,
          footerHeight:
            (this.config.enablePagination || this.config.footerRenderer) && !this.config.hideFooter
              ? this.customTheme.footerHeight
              : undefined,
        });

        if (this.config.enablePagination && previousTheme.rowHeight !== this.customTheme.rowHeight) {
          this.currentPage = 1;
        }

        this.renderOrchestrator.invalidateCache("all");
      }
    }

    if (
      (config.selectableColumns !== undefined || config.selectableCells !== undefined) &&
      this.selectionManager
    ) {
      this.selectionManager.updateConfig({
        selectableColumns: this.config.selectableColumns ?? false,
        selectableCells: this.config.selectableCells ?? false,
      });
    }

    if (
      config.enableRowSelection !== undefined ||
      config.rowSelectionMode !== undefined ||
      config.selectRowOnClick !== undefined ||
      config.showRowSelectionColumn !== undefined ||
      config.rowButtons !== undefined ||
      config.onRowSelectionChange !== undefined ||
      config.selectableCells !== undefined
    ) {
      this.syncRowSelectionManager();
      // Selection column presence affects cell-selection column indices
      this.selectionManager?.updateConfig({
        enableRowSelection: shouldShowRowSelectionColumn(this.config),
      });
      // Header set may gain/lose the selection column
      if (
        config.enableRowSelection !== undefined ||
        config.showRowSelectionColumn !== undefined ||
        config.rowButtons !== undefined
      ) {
        this.renderOrchestrator.invalidateCache("header");
        this.renderOrchestrator.invalidateCache("all");
        if (this.dimensionManager) {
          const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
            this.headers,
            this.config,
            this.customTheme,
          );
          this.dimensionManager.updateConfig({ effectiveHeaders });
        }
      }
    }

    if (config.height !== undefined || config.maxHeight !== undefined) {
      // The DimensionManager owns `contentHeight`, which drives the root's
      // fixed-vs-auto height and the internal scroll viewport. Without this, a
      // changed `height`/`maxHeight` prop (e.g. switching the calc() expression)
      // left the manager on its stale value, so the scrollbar never updated.
      this.dimensionManager?.updateConfig({
        height: this.config.height,
        maxHeight: this.config.maxHeight,
      });
    }

    if (
      config.scrollParent !== undefined ||
      config.height !== undefined ||
      config.maxHeight !== undefined
    ) {
      this.syncExternalScrollWiring();
    }

    if (
      (config.onLoadMore !== undefined || config.infiniteScrollThreshold !== undefined) &&
      this.scrollManager
    ) {
      this.scrollManager.updateConfig({
        onLoadMore: this.config.onLoadMore,
        infiniteScrollThreshold: this.config.infiniteScrollThreshold ?? 200,
      });
    }

    this.isUpdating = false;
    this.render("update");
  }

  /** @deprecated Use {@link update} — same behavior. */
  updateConfig(config: Partial<SimpleTableConfig>): void {
    this.update(config);
  }

  /**
   * Create, update, or destroy the RowSelectionManager when enableRowSelection
   * (and related props) change at runtime.
   */
  private syncRowSelectionManager(): void {
    if (this.config.enableRowSelection) {
      const shared = {
        onRowSelectionChange: this.config.onRowSelectionChange,
        enableRowSelection: true as const,
        rowSelectionMode: this.config.rowSelectionMode ?? ("multiple" as const),
        selectRowOnClick: this.config.selectRowOnClick ?? false,
        showRowSelectionColumn: this.config.showRowSelectionColumn !== false,
        selectableCells: this.config.selectableCells ?? false,
        tableRoot: this.container,
      };

      if (!this.rowSelectionManager) {
        this.rowSelectionManager = new RowSelectionManager({
          tableRows: this.renderOrchestrator.getLastProcessedResult()?.currentTableRows ?? [],
          ...shared,
        });
        this.rowSelectionManager.subscribe(() => {
          this.render("rowSelectionManager");
        });
      } else {
        this.rowSelectionManager.updateConfig(shared);
      }
    } else if (this.rowSelectionManager) {
      this.rowSelectionManager.destroy();
      this.rowSelectionManager = null;
    }
  }

  destroy(): void {
    this.mounted = false;
    this.firstRenderDone = false;

    // Clean up RAF and timeouts
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.scrollEndTimeoutId !== null) {
      clearTimeout(this.scrollEndTimeoutId);
      this.scrollEndTimeoutId = null;
    }
    if (this.externalScrollRetryRaf !== null) {
      cancelAnimationFrame(this.externalScrollRetryRaf);
      this.externalScrollRetryRaf = null;
    }
    if (this.unvirtualizedRowsCheckTimeoutId !== null) {
      clearTimeout(this.unvirtualizedRowsCheckTimeoutId);
      this.unvirtualizedRowsCheckTimeoutId = null;
    }

    this.detachExternalScrollWiring();
    const elements = this.domManager.getElements();
    if (elements?.bodyContainer) {
      this.ensureBodyScrollListenerDetached(elements.bodyContainer);
      if (this.bodyContainerMouseLeaveListener) {
        elements.bodyContainer.removeEventListener(
          "mouseleave",
          this.bodyContainerMouseLeaveListener,
        );
        this.bodyContainerMouseLeaveListener = null;
      }
    }
    if (this.accordionCleanupTimerId !== null) {
      window.clearTimeout(this.accordionCleanupTimerId);
      this.accordionCleanupTimerId = null;
    }
    const root = this.domManager.getElements()?.rootElement ?? this.container;
    root.classList.remove(ACCORDION_ANIMATION_CLASS);
    root.style.removeProperty(ACCORDION_DURATION_VAR);
    root.style.removeProperty(ACCORDION_EASING_VAR);

    this.dimensionManager?.destroy();
    this.scrollManager?.destroy();
    this.sectionScrollController?.destroy();
    this.sortManager?.destroy();
    this.filterManager?.destroy();
    this.pivotManager?.destroy();
    this.pivotManager = null;
    this.rowSelectionManager?.destroy();
    this.selectionManager?.destroy();
    this.autoScaleManager?.destroy();
    this.windowResizeManager?.destroy();
    this.handleOutsideClickManager?.destroy();
    this.scrollbarVisibilityManager?.destroy();
    this.expandedDepthsManager?.destroy();
    this.ariaAnnouncementManager?.destroy();
    this.animationCoordinator.destroy();

    // Release live-update registries so their `updateContent` closures (which
    // capture cell/header DOM nodes) no longer pin detached elements in memory.
    this.cellRegistry.clear();
    this.headerRegistry.clear();

    // Untrack this instance's still-visible cells from the module-level
    // rowCellsMap. Scoped to this table's DOM subtree so other live tables
    // sharing that map are unaffected. Scrolled-out cells were already
    // untracked during rendering.
    root.querySelectorAll<HTMLElement>("[data-row-id]").forEach((el) => {
      const rowId = el.getAttribute("data-row-id");
      if (rowId) untrackCellByRow(rowId, el);
    });

    this.renderOrchestrator.cleanup();
    this.domManager.destroy(this.container);
    this.cachedAPI = null;
  }

  getAPI(): TableAPI {
    if (this.cachedAPI) return this.cachedAPI;

    // Use `thiz` so that getter properties can read live instance state rather
    // than a snapshot captured at getAPI() call time. The API is cached: live
    // tickers commonly call getAPI() every interval, and each createAPI() used
    // to allocate a fresh updateData coalescer — which defeated coalescing and
    // thrashed full re-sorts on every tick.
    const thiz = this;
    const context: TableAPIContext = {
      get config() {
        return thiz.config;
      },
      get localRows() {
        return thiz.localRows;
      },
      get effectiveHeaders() {
        return thiz.renderOrchestrator.computeEffectiveHeaders(
          thiz.headers,
          thiz.config,
          thiz.customTheme,
        );
      },
      get headers() {
        return thiz.headers;
      },
      getPristineDefaultHeaders: () => thiz.pristineDefaultHeaders,
      get essentialAccessors() {
        return thiz.essentialAccessors;
      },
      get customTheme() {
        return thiz.customTheme;
      },
      get currentPage() {
        return thiz.currentPage;
      },
      getCurrentPage: () => this.currentPage,
      get expandedRows() {
        return thiz.expandedRows;
      },
      get collapsedRows() {
        return thiz.collapsedRows;
      },
      get expandedDepths() {
        return thiz.expandedDepths;
      },
      clearExpandedRows: () => {
        thiz.expandedRows = new Map();
      },
      clearCollapsedRows: () => {
        thiz.collapsedRows = new Map();
      },
      get rowStateMap() {
        return thiz.rowStateMap;
      },
      get headerRegistry() {
        return thiz.headerRegistry;
      },
      get cellRegistry() {
        return thiz.cellRegistry;
      },
      isCellAnimating: (cellId: string) => this.animationCoordinator.isInFlight(cellId),
      hasAnimatingCells: () => this.animationCoordinator.hasInFlight(),
      get columnEditorOpen() {
        return thiz.columnEditorOpen;
      },
      getCachedFlattenResult: () => this.renderOrchestrator.getCachedFlattenResult(),
      getCachedProcessedResult: () => this.renderOrchestrator.getLastProcessedResult(),
      get expandedDepthsManager() {
        return thiz.expandedDepthsManager;
      },
      get selectionManager() {
        return thiz.selectionManager;
      },
      get rowSelectionManager() {
        return thiz.rowSelectionManager;
      },
      get sortManager() {
        return thiz.sortManager;
      },
      get filterManager() {
        return thiz.filterManager;
      },
      getEffectiveRowGrouping: () => this.getEffectiveRowGrouping(),
      setPivot: (pivotConfig: PivotConfig | null) => {
        this.config = { ...this.config, pivot: pivotConfig };
        this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
        this.config.onPivotChange?.(pivotConfig);
        this.renderOrchestrator.invalidateCache("header");
        this.renderOrchestrator.invalidateCache("body");
        this.render("setPivot");
      },
      getPivot: () => this.pivotManager?.getPivot() ?? this.config.pivot ?? null,
      getPivotHeaders: () => {
        const state = this.pivotManager?.getState();
        if (state?.active) return state.headers;
        return this.headers;
      },
      getPivotedRows: () => {
        const state = this.pivotManager?.getState();
        if (state?.active) return state.pivotedRows;
        return this.localRows;
      },
      onRender: () => this.render("columnEditor-onRender"),
      invalidateRowsCache: () => {
        this.renderOrchestrator.invalidateCache("body");
      },
      runWithoutAnimationSnapshot: (fn: () => void) => {
        this.suppressNextAnimationSnapshot = true;
        try {
          fn();
        } finally {
          this.suppressNextAnimationSnapshot = false;
        }
      },
      setHeaders: (headers: ColumnDef[]) => {
        // Same trigger as the renderContext.setHeaders path: open the
        // accordion-horizontal animation window when the visible/pinned set
        // changed (hide/show/pin/unpin from the column editor). Pure
        // reorders fall through to the plain-snapshot FLIP path.
        const visibilityChanged = this.didColumnVisibilityChange(headers);
        if (visibilityChanged) {
          this.beginAccordionAnimation("horizontal");
        } else {
          this.captureAnimationSnapshot();
        }
        this.headers = deepClone(headers);
        this.renderOrchestrator.invalidateCache("header");
      },
      setCurrentPage: (page: number) => {
        this.currentPage = page;
      },
      setColumnEditorOpen: (open: boolean) => {
        this.columnEditorOpen = open;

        this.render("columnEditor-toggle");
      },
    };

    this.cachedAPI = TableAPIImpl.createAPI(context);
    return this.cachedAPI;
  }
}
