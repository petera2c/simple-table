import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import { CustomTheme, areCustomThemesEqual } from "../types/CustomTheme";
import RowState from "../types/RowState";

import { AnimationCoordinator } from "../managers/AnimationCoordinator";
import { AutoScaleManager } from "../managers/AutoScaleManager";
import { DimensionManager } from "../managers/DimensionManager";
import { ScrollManager } from "../managers/ScrollManager";
import { SectionScrollController } from "../managers/SectionScrollController";
import { SortManager } from "../managers/SortManager";
import { FilterManager } from "../managers/FilterManager";
import { SelectionManager } from "../managers/SelectionManager";
import { RowSelectionManager } from "../managers/RowSelectionManager";
import WindowResizeManager from "../hooks/windowResize";
import HandleOutsideClickManager from "../hooks/handleOutsideClick";
import ScrollbarVisibilityManager from "../hooks/scrollbarVisibility";
import ExpandedDepthsManager from "../hooks/expandedDepths";
import AriaAnnouncementManager from "../hooks/ariaAnnouncements";

import { calculateScrollbarWidth } from "../hooks/scrollbarWidth";
import { generateRowId, rowIdToString } from "../utils/rowUtils";
import { deepClone } from "../utils/generalUtils";
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
  isExternalScrollActive,
  resolveScrollParent,
  type ResolvedScrollParent,
} from "../utils/externalScroll";

import "../styles/all-themes.css";

export class SimpleTableVanilla {
  private container: HTMLElement;
  private config: SimpleTableConfig;
  private customTheme: CustomTheme;
  private mergedColumnEditorConfig: MergedColumnEditorConfig;
  private resolvedIcons: ResolvedIcons;

  private domManager: DOMManager;
  private renderOrchestrator: RenderOrchestrator;

  private draggedHeaderRef: { current: HeaderObject | null } = {
    current: null,
  };
  private hoveredHeaderRef: { current: HeaderObject | null } = {
    current: null,
  };

  private localRows: Row[] = [];
  private headers: HeaderObject[] = [];
  private essentialAccessors: Set<string> = new Set();
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
  private headerRegistry: Map<string, any> = new Map();
  private rowIndexMap: Map<string | number, number> = new Map();

  private animationCoordinator: AnimationCoordinator;

  private autoScaleManager: AutoScaleManager | null = null;
  private dimensionManager: DimensionManager | null = null;
  private scrollManager: ScrollManager | null = null;
  private sectionScrollController: SectionScrollController | null = null;
  private sortManager: SortManager | null = null;
  private filterManager: FilterManager | null = null;
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
  /** True iff the body-container scroll listener is currently attached. */
  private bodyScrollListenerAttached: boolean = false;
  /** Bound mouseleave handler on the body container. */
  private bodyContainerMouseLeaveListener: (() => void) | null = null;
  /** Bound scroll handler attached to the body container (internal scroll mode). */
  private bodyContainerScrollListener: ((e: Event) => void) | null = null;
  /** One-shot warning for sticky-parents limitation under external scroll. */
  private warnedExternalStickyParents: boolean = false;

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

  constructor(container: HTMLElement, config: SimpleTableConfig) {
    this.container = container;
    this.config = config;

    this.customTheme = TableInitializer.mergeCustomTheme(config);
    this.mergedColumnEditorConfig = TableInitializer.mergeColumnEditorConfig(config);
    this.resolvedIcons = TableInitializer.resolveIcons(config);

    this.localRows = [...config.rows];
    this.headers = [...config.defaultHeaders];
    this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);
    this.columnEditorOpen = config.editColumnsInitOpen ?? false;
    this.internalIsLoading = config.isLoading ?? false;

    this.collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(config.defaultHeaders);
    this.expandedDepths = TableInitializer.getInitialExpandedDepths(config);

    this.domManager = new DOMManager();
    this.renderOrchestrator = new RenderOrchestrator();

    this.animationCoordinator = new AnimationCoordinator();
    this.applyAnimationsConfig(config.animations);

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
  private buildVisibilityKey(headers: HeaderObject[]): string {
    const parts: string[] = [];
    const walk = (header: HeaderObject, pinnedAncestor: string | undefined): void => {
      if (header.hide || header.excludeFromRender) return;
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
  private didColumnVisibilityChange(nextHeaders: HeaderObject[]): boolean {
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
    this.animationCoordinator.captureSnapshot({
      containers: this.getAnimatableContainers(),
      preLayouts,
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
  private beginAccordionAnimation(axis: AccordionAxis): void {
    if (!this.animationCoordinator.isEnabled()) return;
    if (axis === null) return;
    this.captureAnimationSnapshot();
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
      this.config.rowGrouping,
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

    this.sortManager = new SortManager({
      headers: this.headers,
      tableRows: this.localRows,
      externalSortHandling: this.config.externalSortHandling || false,
      onSortChange: this.config.onSortChange,
      rowGrouping: this.config.rowGrouping,
      initialSortColumn: this.config.initialSortColumn,
      initialSortDirection: this.config.initialSortDirection,
      announce,
    });

    this.sortManager.subscribe((state) => {
      this.captureAnimationSnapshot();
      this.render("sortManager");
    });

    this.filterManager = new FilterManager({
      rows: this.localRows,
      headers: this.headers,
      externalFilterHandling: this.config.externalFilterHandling || false,
      onFilterChange: this.config.onFilterChange,
      announce,
    });

    this.filterManager.subscribe((filterState) => {
      if (this.sortManager) {
        this.sortManager.updateConfig({ tableRows: filterState.filteredRows });
      }
      this.render("filterManager");
    });

    // Initialize SelectionManager with empty tableRows (will be updated during render)
    this.selectionManager = new SelectionManager({
      selectableCells: this.config.selectableCells ?? false,
      selectableColumns: this.config.selectableColumns ?? false,
      headers: this.headers,
      tableRows: [],
      onCellEdit: this.config.onCellEdit,
      cellRegistry: this.cellRegistry,
      collapsedHeaders: this.collapsedHeaders,
      rowHeight: this.customTheme.rowHeight,
      enableRowSelection: this.config.enableRowSelection,
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
      totalRowCount: this.localRows.length,
      footerHeight:
        (this.config.shouldPaginate || this.config.footerRenderer) && !this.config.hideFooter
          ? this.customTheme.footerHeight
          : undefined,
      containerElement: refs.tableBodyContainerRef.current,
    });

    this.dimensionManager.subscribe(() => {
      this.render("dimensionManager");
      if (!this.firstRenderDone) {
        this.firstRenderDone = true;
        if (this.config.onGridReady) {
          this.config.onGridReady();
        }
      }
    });

    this.scrollManager = new ScrollManager({
      onLoadMore: this.config.onLoadMore,
      infiniteScrollThreshold: this.config.infiniteScrollThreshold ?? 200,
    });

    this.sectionScrollController = new SectionScrollController({
      onMainSectionScrollLeft: (scrollLeft) => {
        const refs = this.domManager.getRefs();
        const header = refs.mainHeaderRef.current;
        const body = refs.mainBodyRef.current;
        const sel = this.selectionManager;
        const liveSelection =
          sel && (this.config.selectableCells || this.config.selectableColumns)
            ? {
                columnsWithSelectedCells: sel.getColumnsWithSelectedCells(),
                selectedColumns: sel.getSelectedColumns(),
              }
            : undefined;
        (header as any)?.__renderHeaderCells?.(scrollLeft, liveSelection);
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

    if (this.config.enableRowSelection) {
      this.rowSelectionManager = new RowSelectionManager({
        tableRows: [],
        onRowSelectionChange: this.config.onRowSelectionChange,
        enableRowSelection: true,
      });
      this.rowSelectionManager.subscribe(() => {
        this.render("rowSelectionManager");
      });
    }

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

    const externalActive = isExternalScrollActive(
      this.config.scrollParent,
      this.config.height,
      this.config.maxHeight,
    );
    const nextParent: ResolvedScrollParent = externalActive
      ? resolveScrollParent(this.config.scrollParent)
      : null;

    if (nextParent !== this.resolvedScrollParent) {
      this.detachExternalScrollWiring();
    }

    if (nextParent) {
      this.attachExternalScrollWiring(nextParent);
      this.ensureBodyScrollListenerDetached(elements.bodyContainer);
      this.recomputeExternalViewportHeight();
    } else {
      this.ensureBodyScrollListenerAttached(elements.bodyContainer);
      this.externalViewportHeight = 0;
      if (this.dimensionManager) {
        this.dimensionManager.updateConfig({ externalViewportHeight: undefined });
      }
    }

    this.maybeWarnStickyParentsConflict(externalActive);
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
  }

  private detachExternalScrollWiring(): void {
    const parent = this.resolvedScrollParent;
    if (parent && this.externalScrollListener) {
      parent.removeEventListener("scroll", this.externalScrollListener);
    }
    this.externalScrollListener = null;

    if (parent && this.externalWindowResizeListener && typeof Window !== "undefined" && parent instanceof Window) {
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
    elements.rootElement.style.setProperty(
      "--st-external-scroll-padding-top",
      `${paddingTop}px`,
    );
  }

  private maybeWarnStickyParentsConflict(externalActive: boolean): void {
    if (!externalActive) return;
    if (!this.config.enableStickyParents) return;
    if (this.warnedExternalStickyParents) return;
    this.warnedExternalStickyParents = true;
    console.warn(
      "SimpleTable: `enableStickyParents` is not supported when `scrollParent` is in use " +
        "(external scroll mode). Sticky parent rows will not stick to the viewport. " +
        "Use `height` or `maxHeight` for sticky parent behavior.",
    );
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
    const next = metrics.visibleViewportHeight;
    if (next === this.externalViewportHeight) return;
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
            metrics.relativeScrollTop + metrics.visibleViewportHeight + Math.max(0, metrics.distanceFromTableBottom);
          this.scrollManager.handleScroll(
            newScrollTop,
            0,
            containerHeight,
            contentHeight,
          );
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

  private getRenderContext(): RenderContext {
    const refs = this.domManager.getRefs();
    return {
      accordionAxis: this.pendingAccordionAxis,
      config: this.config,
      customTheme: this.customTheme,
      resolvedIcons: this.resolvedIcons,
      effectiveHeaders: [],
      essentialAccessors: this.essentialAccessors,
      headers: this.headers,
      localRows: this.localRows,
      collapsedHeaders: this.collapsedHeaders,
      collapsedRows: this.collapsedRows,
      expandedRows: this.expandedRows,
      expandedDepths: this.expandedDepths,
      isResizing: this.isResizing,
      internalIsLoading: this.internalIsLoading,
      cellRegistry: this.cellRegistry,
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
      externalViewportHeight:
        this.resolvedScrollParent && this.externalViewportHeight > 0
          ? this.externalViewportHeight
          : undefined,
      onRender: () => this.render("resizeHandler-onRender"),
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
      setHeaders: (headers: HeaderObject[]) => {
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
      getRowStateMap: () => this.rowStateMap,
      setColumnEditorOpen: (open: boolean) => {
        this.columnEditorOpen = open;
      },
      setCurrentPage: (page: number) => {
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
    // in-coming cells aren't FLIP-tweened during vertical scrolls. Every
    // other render — including the chain of mid-drag `setHeaders` renders
    // that fire on each `dragover` swap — runs play so columns being
    // displaced by the drag slide smoothly to their new slots.
    if (source !== "scroll-raf") {
      this.animationCoordinator.play({ containers: this.getAnimatableContainers() });
    }
  }

  update(config: Partial<SimpleTableConfig>): void {
    this.isUpdating = true;
    this.config = { ...this.config, ...config };

    if (config.animations !== undefined) {
      this.applyAnimationsConfig(config.animations);
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
      if (this.sortManager) {
        this.sortManager.updateConfig({ tableRows: this.localRows });
      }
      // SelectionManager will be updated with processed rows during render
    }

    if (config.defaultHeaders !== undefined) {
      // Snapshot before mutating headers so the FLIP `play` at the end of the
      // ensuing render can inverse-transform from the old layout to the new
      // one — works the same whether the caller is reordering programmatically
      // or via an in-flight header drag.
      this.captureAnimationSnapshot();
      this.headers = [...config.defaultHeaders];
      this.essentialAccessors = TableInitializer.buildEssentialAccessors(this.headers);

      if (this.filterManager) {
        this.filterManager.updateConfig({ headers: this.headers });
      }
      if (this.sortManager) {
        this.sortManager.updateConfig({ headers: this.headers });
      }
      if (this.selectionManager) {
        this.selectionManager.updateConfig({ headers: this.headers });
      }
    }

    if (config.isLoading !== undefined) {
      this.internalIsLoading = config.isLoading;
    }

    if (config.theme !== undefined) {
      this.domManager.updateTheme(config.theme);
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
            (this.config.shouldPaginate || this.config.footerRenderer) && !this.config.hideFooter
              ? this.customTheme.footerHeight
              : undefined,
        });

        if (this.config.shouldPaginate && previousTheme.rowHeight !== this.customTheme.rowHeight) {
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

    if (config.enableStickyParents !== undefined) {
      this.warnedExternalStickyParents = false;
      this.maybeWarnStickyParentsConflict(
        isExternalScrollActive(this.config.scrollParent, this.config.height, this.config.maxHeight),
      );
    }

    this.isUpdating = false;
    this.render("update");
  }

  /** @deprecated Use {@link update} — same behavior. */
  updateConfig(config: Partial<SimpleTableConfig>): void {
    this.update(config);
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
    this.rowSelectionManager?.destroy();
    this.selectionManager?.destroy();
    this.autoScaleManager?.destroy();
    this.windowResizeManager?.destroy();
    this.handleOutsideClickManager?.destroy();
    this.scrollbarVisibilityManager?.destroy();
    this.expandedDepthsManager?.destroy();
    this.ariaAnnouncementManager?.destroy();
    this.animationCoordinator.destroy();

    this.renderOrchestrator.cleanup();
    this.domManager.destroy(this.container);
  }

  getAPI(): TableAPI {
    const effectiveHeaders = this.renderOrchestrator.computeEffectiveHeaders(
      this.headers,
      this.config,
      this.customTheme,
    );

    // Use `thiz` so that getter properties can read live instance state rather
    // than a snapshot captured at getAPI() call time.
    const thiz = this;
    const context: TableAPIContext = {
      config: this.config,
      localRows: this.localRows,
      effectiveHeaders,
      get headers() {
        return thiz.headers;
      },
      essentialAccessors: this.essentialAccessors,
      customTheme: this.customTheme,
      currentPage: this.currentPage,
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
      rowStateMap: this.rowStateMap,
      headerRegistry: this.headerRegistry,
      cellRegistry: this.cellRegistry,
      columnEditorOpen: this.columnEditorOpen,
      getCachedFlattenResult: () => this.renderOrchestrator.getCachedFlattenResult(),
      getCachedProcessedResult: () => this.renderOrchestrator.getLastProcessedResult(),
      expandedDepthsManager: this.expandedDepthsManager,
      selectionManager: this.selectionManager,
      sortManager: this.sortManager,
      filterManager: this.filterManager,
      onRender: () => this.render("columnEditor-onRender"),
      setHeaders: (headers: HeaderObject[]) => {
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

    return TableAPIImpl.createAPI(context);
  }
}
