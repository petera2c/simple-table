import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import ColumnDef, { Accessor } from "../types/ColumnDef";
import Row from "../types/Row";
import type { RowData } from "../types/Row";
import { CustomTheme } from "../types/CustomTheme";
import RowState from "../types/RowState";
import {
  normalizeConfig,
  type SimpleTableConfigInput,
} from "../utils/normalizeConfig";

import { AnimationCoordinator } from "../managers/AnimationCoordinator";
import { AccordionController } from "../managers/AccordionController";
import type { AutoScaleManager } from "../managers/AutoScaleManager";
import {
  AutoSizeManager,
  getAutoSizeMeasureRows,
  getAutoSizeStyleRoot,
} from "../managers/AutoSizeManager";
import type { DimensionManager } from "../managers/DimensionManager";
import { ExternalScrollController } from "../managers/ExternalScrollController";
import type { ExternalScrollMetrics } from "../utils/externalScroll";
import type { ScrollManager } from "../managers/ScrollManager";
import { ScrollRenderCoalescer } from "../managers/ScrollRenderCoalescer";
import type { SectionScrollController } from "../managers/SectionScrollController";
import type { SortManager } from "../managers/SortManager";
import type { FilterManager } from "../managers/FilterManager";
import { PivotManager } from "../managers/PivotManager";
import type { SelectionManager } from "../managers/SelectionManager";
import type { RowSelectionManager } from "../managers/RowSelectionManager";
import type { PivotConfig } from "../types/PivotTypes";
import type WindowResizeManager from "../hooks/windowResize";
import type HandleOutsideClickManager from "../hooks/handleOutsideClick";
import type ScrollbarVisibilityManager from "../hooks/scrollbarVisibility";
import type ExpandedDepthsManager from "../hooks/expandedDepths";
import type AriaAnnouncementManager from "../hooks/ariaAnnouncements";

import { generateRowId, rowIdToString } from "../utils/rowUtils";
import { clearHoveredRowsForScope } from "../utils/bodyCell/styling";
import { deepClone } from "../utils/generalUtils";

import {
  TableInitializer,
  ResolvedIcons,
  MergedColumnEditorConfig,
} from "./initialization/TableInitializer";
import { createDataManagers } from "./initialization/createDataManagers";
import { wireMountManagers } from "./initialization/wireMountManagers";
import { DOMManager } from "./dom/DOMManager";
import { RenderOrchestrator, RenderContext, RenderState } from "./rendering/RenderOrchestrator";
import { TableAPIImpl } from "./api/TableAPIImpl";
import { buildTableAPIContext } from "./api/buildTableAPIContext";
import { UnvirtualizedRowsWarning } from "./dev/UnvirtualizedRowsWarning";
import {
  getEffectiveRowGrouping as resolveEffectiveRowGrouping,
  syncPivotPipeline,
} from "./pipeline/syncPivotPipeline";
import type { VanillaLiveHost } from "./vanilla/VanillaLiveHost";
import { applyTableUpdate } from "./vanilla/applyTableUpdate";
import { createVanillaRenderContext } from "./vanilla/createVanillaRenderContext";
import { toTableAPIContextHost } from "./vanilla/toTableAPIContextHost";
import { getAnimatableContainers } from "./vanilla/tableContainers";
import { syncRowSelectionManager } from "./vanilla/syncRowSelectionManager";
import {
  destroyTableManagers,
  untrackCellsInRoot,
} from "./vanilla/destroyTableResources";
import "../styles/all-themes.css";

export class SimpleTableVanilla<TData extends RowData = Row> {
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
   * Last ingested column definitions. `resetColumns()` restores from this
   * snapshot. Runtime hide, width, and pin live on `this.headers`.
   */
  private pristineDefaultHeaders: ColumnDef[] = [];
  private essentialAccessors: Set<string> = new Set();
  private currentPage: number = 1;
  private isResizing: boolean = false;
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
  private accordionController: AccordionController;
  private autoSizeManager: AutoSizeManager;
  private externalScrollController: ExternalScrollController;
  private scrollCoalescer: ScrollRenderCoalescer;
  private unvirtualizedRowsWarning: UnvirtualizedRowsWarning;
  /**
   * When true, the sort subscriber skips `captureAnimationSnapshot` so
   * live-update-driven reorder/visibility changes don't FLIP-animate.
   * User-initiated sorts leave this false and keep FLIP.
   */
  private suppressNextAnimationSnapshot = false;
  /** Lazily created once — callers often invoke getAPI() every live tick. */
  private cachedAPI: TableAPI<TData> | null = null;

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
  private isUpdating: boolean = false;
  /** Bound mouseleave handler on the body container. */
  private bodyContainerMouseLeaveListener: (() => void) | null = null;
  private liveHost: VanillaLiveHost | null = null;

  constructor(container: HTMLElement, config: SimpleTableConfigInput<TData>) {
    this.container = container;
    // Collapse consumer aliases (`columns`, `enablePagination`, …) before any
    // internal reads — `this.config` is the only shape the rest of the class uses.
    this.config = normalizeConfig(config as unknown as SimpleTableConfigInput);
    const resolved = this.config;

    this.customTheme = TableInitializer.mergeCustomTheme(resolved);
    this.mergedColumnEditorConfig = TableInitializer.mergeColumnEditorConfig(resolved);
    this.resolvedIcons = TableInitializer.resolveIcons(resolved);

    this.localRows = [...resolved.rows];
    this.ingestColumnSnapshot(resolved.columns);
    this.headers = deepClone(this.pristineDefaultHeaders);
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

    this.domManager = new DOMManager();
    this.renderOrchestrator = new RenderOrchestrator();

    this.animationCoordinator = new AnimationCoordinator();
    this.applyAnimationsConfig(config.animations);

    this.autoSizeManager = new AutoSizeManager();
    this.autoSizeManager.recomputeAccessors(this.headers, this.collapsedHeaders);

    this.externalScrollController = new ExternalScrollController({
      getScrollParent: () => this.config.scrollParent,
      getHeight: () => this.config.height,
      getMaxHeight: () => this.config.maxHeight,
      getBodyContainer: () => this.domManager.getElements()?.bodyContainer ?? null,
      getRootElement: () => this.domManager.getElements()?.rootElement ?? null,
      getFallbackRoot: () => this.container,
      isMounted: () => this.mounted,
      getDimensionManager: () => this.dimensionManager,
      onInternalScroll: (e) => this.handleScroll(e),
      onExternalScroll: (metrics) => this.handleExternalScrollMetrics(metrics),
      onExternalResize: () => this.render("external-scroll-resize"),
    });

    this.accordionController = new AccordionController({
      animationCoordinator: this.animationCoordinator,
      getRoot: () => this.getTableRoot(),
      getAnimatableContainers: () => this.getAnimatableContainers(),
      getHeaders: () => this.headers,
      getCollapsedHeaders: () => this.collapsedHeaders,
      getEffectiveRowGrouping: () => this.getEffectiveRowGrouping(),
      getCurrentBodyLayouts: () => this.renderOrchestrator.getCurrentBodyLayouts(),
      getExternalVerticalScroll: () => this.externalScrollController.getVerticalScrollMetrics(),
    });

    this.scrollCoalescer = new ScrollRenderCoalescer({
      getScrollManager: () => this.scrollManager,
      shouldTrackInfiniteScroll: () => !!this.config.onLoadMore,
      onRender: (source) => this.render(source),
    });

    this.unvirtualizedRowsWarning = new UnvirtualizedRowsWarning({
      isMounted: () => this.mounted,
      isVirtualizationDisabled: () => this.config.enableVirtualization === false,
      getContentHeight: () => this.dimensionManager?.getContentHeight(),
      getRenderedRowCount: () =>
        this.renderOrchestrator.getLastProcessedResult()?.currentTableRows.length ?? 0,
      hasScrollParent: () => this.config.scrollParent != null,
    });

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

  /** Copy caller columns into `config.columns` and `pristineDefaultHeaders`. */
  private ingestColumnSnapshot(columns: ColumnDef[]): void {
    const ingested = deepClone(columns);
    this.config.columns = ingested;
    this.pristineDefaultHeaders = ingested;
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

  private getAnimatableContainers(): HTMLElement[] {
    return getAnimatableContainers(this.domManager);
  }

  /**
   * Shared header write path for the render context and TableAPI. Accordion-
   * horizontal when the visible or pinned set changed; column-drag uses the
   * dedicated reorder animator; otherwise snapshot for FLIP.
   */
  private applyHeaders(headers: ColumnDef[]): void {
    if (this.accordionController.didColumnVisibilityChange(headers)) {
      this.accordionController.begin("horizontal");
    } else if (
      this.draggedHeaderRef.current ||
      this.animationCoordinator.isColumnReordering()
    ) {
      const root = this.domManager.getElements()?.rootElement ?? this.container;
      this.animationCoordinator.beginColumnReorder(root);
    } else {
      this.accordionController.captureSnapshot();
    }
    this.headers = deepClone(headers);
    this.renderOrchestrator.invalidateCache("header");
  }

  private initializeManagers(): void {
    const created = createDataManagers({
      getConfig: () => this.config,
      getHeaders: () => this.headers,
      getPristineDefaultHeaders: () => this.pristineDefaultHeaders,
      getLocalRows: () => this.localRows,
      getCustomTheme: () => this.customTheme,
      getCollapsedHeaders: () => this.collapsedHeaders,
      getCellRegistry: () => this.cellRegistry,
      getTableRoot: () => this.getTableRoot(),
      getEffectiveRowGrouping: () => this.getEffectiveRowGrouping(),
      getPivotManager: () => this.pivotManager,
      onAnnouncement: (message) => {
        this.announcement = message;
        this.updateAriaLiveRegion();
      },
      onExpandedDepths: (depths) => {
        this.accordionController.begin("vertical");
        this.expandedDepths = depths;
        this.render("expandedDepthsManager");
      },
      onSortNotify: () => {
        if (this.suppressNextAnimationSnapshot) {
          this.render("live-sort");
          return;
        }
        this.accordionController.captureSnapshot();
        this.render("sortManager");
      },
      onFilterNotify: (filteredRows) => {
        this.syncPivotPipeline(filteredRows);
        this.render("filterManager");
      },
      onSelectionDragEnd: () => {
        this.renderOrchestrator.invalidateCache("context");
        this.renderOrchestrator.invalidateCache("body");
        this.render("selectionDragEnd");
      },
    });

    this.ariaAnnouncementManager = created.ariaAnnouncementManager;
    this.expandedDepthsManager = created.expandedDepthsManager;
    this.sortManager = created.sortManager;
    this.filterManager = created.filterManager;
    this.selectionManager = created.selectionManager;
  }

  mount(): void {
    if (this.mounted) {
      console.warn("SimpleTableVanilla: Table is already mounted");
      return;
    }

    this.domManager.createDOMStructure(this.container, this.config);
    this.mounted = true;
    this.bindTableRoot();
    this.setupManagers();
  }

  private setupManagers(): void {
    const refs = this.domManager.getRefs();
    const elements = this.domManager.getElements();

    if (!elements) return;

    const mounted = wireMountManagers(
      {
        getConfig: () => this.config,
        getCustomTheme: () => this.customTheme,
        getHeaders: () => this.headers,
        getCollapsedHeaders: () => this.collapsedHeaders,
        getLocalRowCount: () => this.localRows.length,
        getIsResizing: () => this.isResizing,
        getSelectionManager: () => this.selectionManager,
        getRenderOrchestrator: () => this.renderOrchestrator,
        onRender: (source) => this.render(source),
        onFirstDimensionPaint: () => {
          this.firstRenderDone = true;
          if (
            this.externalScrollController.getResolvedParent() &&
            typeof requestAnimationFrame !== "undefined"
          ) {
            requestAnimationFrame(() => {
              if (this.mounted) this.externalScrollController.recomputeViewportHeight();
            });
          }
          this.config.onTableReady?.();
        },
        onScrollbarVisibilityChange: (isScrollable, scrollbarWidth) => {
          this.isMainSectionScrollable = isScrollable;
          this.scrollbarWidth = scrollbarWidth;
          this.render("scrollbarVisibilityManager");
        },
        onScrollbarWidthChange: (scrollbarWidth) => {
          this.scrollbarWidth = scrollbarWidth;
        },
      },
      refs,
    );

    if (!mounted) return;

    this.dimensionManager = mounted.dimensionManager;
    this.scrollManager = mounted.scrollManager;
    this.sectionScrollController = mounted.sectionScrollController;
    this.autoScaleManager = mounted.autoScaleManager;
    this.scrollbarVisibilityManager = mounted.scrollbarVisibilityManager;
    this.windowResizeManager = mounted.windowResizeManager;
    this.handleOutsideClickManager = mounted.handleOutsideClickManager;
    this.scrollbarWidth = mounted.scrollbarWidth;

    this.syncRowSelectionManager();
    this.setupEventListeners();

    this.renderOrchestrator.primeLastProcessedResult(
      this.getRenderContext(),
      this.getRenderState(),
    );
  }

  private setupEventListeners(): void {
    const elements = this.domManager.getElements();
    if (!elements?.bodyContainer) return;

    this.bodyContainerMouseLeaveListener = () => {
      this.clearHoveredRows();
    };
    elements.bodyContainer.addEventListener("mouseleave", this.bodyContainerMouseLeaveListener);

    this.externalScrollController.sync();
  }

  private handleExternalScrollMetrics(metrics: ExternalScrollMetrics): void {
    this.scrollCoalescer.schedule({
      scrollTop: metrics.relativeScrollTop,
      scrollLeft: 0,
      containerHeight: metrics.visibleViewportHeight,
      contentHeight:
        metrics.relativeScrollTop +
        metrics.visibleViewportHeight +
        Math.max(0, metrics.distanceFromTableBottom),
      afterApply: () => {
        if (metrics.visibleViewportHeight !== this.externalScrollController.getViewportHeight()) {
          this.externalScrollController.setViewportHeight(metrics.visibleViewportHeight);
        }
      },
    });
  }

  private handleScroll(e: Event): void {
    const element = e.currentTarget as HTMLDivElement;
    this.scrollCoalescer.schedule({
      scrollTop: element.scrollTop,
      scrollLeft: element.scrollLeft,
      containerHeight: element.clientHeight,
      contentHeight: element.scrollHeight,
    });
  }

  private getTableRoot(): HTMLElement {
    return this.domManager.getElements()?.rootElement ?? this.container;
  }

  private bindTableRoot(): void {
    const tableRoot = this.getTableRoot();
    this.selectionManager?.updateConfig({ tableRoot });
    this.rowSelectionManager?.updateConfig({ tableRoot });
  }

  private clearHoveredRows(): void {
    clearHoveredRowsForScope(this.hoverScopeId);
  }

  private updateAriaLiveRegion(): void {
    const elements = this.domManager.getElements();
    if (elements?.ariaLiveRegion) {
      elements.ariaLiveRegion.textContent = this.announcement;
    }
  }

  private getEffectiveRowGrouping(): Accessor[] | undefined {
    return resolveEffectiveRowGrouping(
      this.pivotManager?.getState()?.active,
      this.config.rowGrouping,
    );
  }

  private syncPivotPipeline(filteredSourceRows?: Row[]): void {
    if (!this.pivotManager) return;
    const next = syncPivotPipeline({
      pivotManager: this.pivotManager,
      filterManager: this.filterManager,
      sortManager: this.sortManager,
      selectionManager: this.selectionManager,
      dimensionManager: this.dimensionManager,
      expandedDepthsManager: this.expandedDepthsManager,
      renderOrchestrator: this.renderOrchestrator,
      config: this.config,
      customTheme: this.customTheme,
      localRows: this.localRows,
      pristineDefaultHeaders: this.pristineDefaultHeaders,
      headers: this.headers,
      essentialAccessors: this.essentialAccessors,
      collapsedHeaders: this.collapsedHeaders,
      filteredSourceRows,
    });
    this.headers = next.headers;
    this.essentialAccessors = next.essentialAccessors;
    this.collapsedHeaders = next.collapsedHeaders;
  }

  private getRenderContext(): RenderContext {
    return createVanillaRenderContext(this.getLiveHost(), (container, nestedConfig) =>
      new SimpleTableVanilla<Row>(container, nestedConfig as SimpleTableConfigInput<Row>),
    );
  }

  private applyPivot(pivotConfig: PivotConfig | null): void {
    this.config = { ...this.config, pivot: pivotConfig };
    this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
    this.config.onPivotChange?.(pivotConfig);
    this.renderOrchestrator.invalidateCache("header");
    this.renderOrchestrator.invalidateCache("body");
    this.render("setPivot");
  }

  private getRenderState(): RenderState {
    return {
      currentPage: this.currentPage,
      scrollTop: this.scrollCoalescer.scrollTop,
      scrollDirection: this.scrollCoalescer.scrollDirection,
      scrollbarWidth: this.scrollbarWidth,
      isMainSectionScrollable: this.isMainSectionScrollable,
      columnEditorOpen: this.columnEditorOpen,
    };
  }

  private maybeAutoSizeColumns(): void {
    const nextHeaders = this.autoSizeManager.maybeMeasure({
      headers: this.headers,
      collapsedHeaders: this.collapsedHeaders,
      styleRoot: getAutoSizeStyleRoot(this.domManager.getRefs()),
      rows: getAutoSizeMeasureRows({
        enablePagination: this.config.enablePagination,
        serverSidePagination: this.config.serverSidePagination,
        currentTableRows: this.renderOrchestrator.getLastProcessedResult()?.currentTableRows,
        localRows: this.localRows,
      }),
      theme: this.config.theme,
      icons: this.resolvedIcons,
      onRendererHostDiscard: this.config.onRendererHostDiscard,
    });
    if (!nextHeaders) return;

    this.headers = nextHeaders;
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

    this.config.onColumnWidthChange?.(this.headers);
  }

  public refitAutoSizeColumns(): void {
    if (this.autoSizeManager.getAccessors().size === 0) return;
    this.autoSizeManager.queuePendingFromAccessors();
    this.render("auto-size-refit");
  }

  private render(source?: string): void {
    if (!this.mounted) return;

    // Skip renders triggered by manager updates during an update() call
    // The update() method will call render at the end
    if (this.isUpdating && source !== "update") {
      return;
    }

    // During scroll use position-only body updates; full update on scroll-end or other triggers.
    // Mid column-drag uses the same fast path — only left/top change.
    const columnDragging = Boolean(this.draggedHeaderRef.current);
    this._positionOnlyBody =
      (source === "scroll-raf" && this.scrollCoalescer.isScrolling === true) || columnDragging;

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
    this.accordionController.clearPendingAxis();
    this.accordionController.rememberRenderedHeaders(this.headers);

    // FLIP play step. No-op when no snapshot is armed or when scroll-driven.
    // Position-only scroll renders deliberately skip play so out-going /
    // in-coming cells aren't FLIP-tweened during vertical scrolls. Live-sort
    // reorders (from updateData) also skip play so they don't interrupt an
    // in-flight user sort or thrash retained-cell cleanup every tick.
    // Column-drag commits through CellSlideAnimator after left writes.
    if (source !== "scroll-raf" && source !== "live-sort") {
      if (columnDragging || this.animationCoordinator.isColumnReordering()) {
        const root = elements.rootElement ?? this.container;
        this.animationCoordinator.commitColumnReorder(root);
      } else {
        this.accordionController.play();
      }
    }

    this.unvirtualizedRowsWarning.schedule();
  }

  update(config: Partial<SimpleTableConfigInput<TData>>): void {
    this.isUpdating = true;
    applyTableUpdate(this.getLiveHost(), config);
    this.isUpdating = false;
    this.render("update");
  }

  /** @deprecated Use {@link update} — same behavior. */
  updateConfig(config: Partial<SimpleTableConfigInput<TData>>): void {
    this.update(config);
  }

  private syncRowSelectionManager(): void {
    syncRowSelectionManager({
      getConfig: () => this.config,
      getTableRoot: () => this.getTableRoot(),
      getRowSelectionManager: () => this.rowSelectionManager,
      setRowSelectionManager: (manager) => {
        this.rowSelectionManager = manager;
      },
      getLastProcessedResult: () => this.renderOrchestrator.getLastProcessedResult(),
      onRender: (source) => this.render(source),
    });
  }

  destroy(): void {
    this.mounted = false;
    this.firstRenderDone = false;
    this.liveHost = null;

    const elements = this.domManager.getElements();
    if (elements?.bodyContainer && this.bodyContainerMouseLeaveListener) {
      elements.bodyContainer.removeEventListener(
        "mouseleave",
        this.bodyContainerMouseLeaveListener,
      );
      this.bodyContainerMouseLeaveListener = null;
    }

    const root = this.domManager.getElements()?.rootElement ?? this.container;
    destroyTableManagers({
      scrollCoalescer: this.scrollCoalescer,
      unvirtualizedRowsWarning: this.unvirtualizedRowsWarning,
      externalScrollController: this.externalScrollController,
      accordionController: this.accordionController,
      dimensionManager: this.dimensionManager,
      scrollManager: this.scrollManager,
      sectionScrollController: this.sectionScrollController,
      sortManager: this.sortManager,
      filterManager: this.filterManager,
      pivotManager: this.pivotManager,
      rowSelectionManager: this.rowSelectionManager,
      selectionManager: this.selectionManager,
      autoScaleManager: this.autoScaleManager,
      windowResizeManager: this.windowResizeManager,
      handleOutsideClickManager: this.handleOutsideClickManager,
      scrollbarVisibilityManager: this.scrollbarVisibilityManager,
      expandedDepthsManager: this.expandedDepthsManager,
      ariaAnnouncementManager: this.ariaAnnouncementManager,
      animationCoordinator: this.animationCoordinator,
    });
    this.pivotManager = null;

    this.cellRegistry.clear();
    this.headerRegistry.clear();
    untrackCellsInRoot(root);

    this.renderOrchestrator.cleanup();
    this.domManager.destroy(this.container);
    this.cachedAPI = null;
  }

  getAPI(): TableAPI<TData> {
    if (this.cachedAPI) return this.cachedAPI;
    this.cachedAPI = TableAPIImpl.createAPI(
      buildTableAPIContext(toTableAPIContextHost(this.getLiveHost())),
    ) as unknown as TableAPI<TData>;
    return this.cachedAPI;
  }

  private getLiveHost(): VanillaLiveHost {
    if (this.liveHost) return this.liveHost;
    this.liveHost = {
      getConfig: () => this.config,
      setConfig: (config) => {
        this.config = config;
      },
      applyAnimationsConfig: (animations) => this.applyAnimationsConfig(animations),
      getCustomTheme: () => this.customTheme,
      setCustomTheme: (theme) => {
        this.customTheme = theme;
      },
      getInternalIsLoading: () => this.internalIsLoading,
      setInternalIsLoading: (value) => {
        this.internalIsLoading = value;
      },
      getCurrentPage: () => this.currentPage,
      setCurrentPage: (page) => {
        this.currentPage = page;
      },
      getFirstRenderDone: () => this.firstRenderDone,
      getIsResizing: () => this.isResizing,
      setIsResizing: (value) => {
        this.isResizing = value;
      },
      getLocalRows: () => this.localRows,
      setLocalRows: (rows) => {
        this.localRows = rows;
      },
      rebuildRowIndexMap: () => this.rebuildRowIndexMap(),
      getHeaders: () => this.headers,
      setHeaders: (headers) => {
        this.headers = headers;
      },
      getPristineDefaultHeaders: () => this.pristineDefaultHeaders,
      getEssentialAccessors: () => this.essentialAccessors,
      setEssentialAccessors: (accessors) => {
        this.essentialAccessors = accessors;
      },
      ingestColumnSnapshot: (columns) => this.ingestColumnSnapshot(columns),
      applyHeaders: (headers) => this.applyHeaders(headers),
      getCollapsedHeaders: () => this.collapsedHeaders,
      setCollapsedHeaders: (headers) => {
        this.collapsedHeaders = headers;
      },
      getCollapsedRows: () => this.collapsedRows,
      setCollapsedRows: (rows) => {
        this.collapsedRows = rows;
      },
      getExpandedRows: () => this.expandedRows,
      setExpandedRows: (rows) => {
        this.expandedRows = rows;
      },
      getExpandedDepths: () => this.expandedDepths,
      clearExpandedRows: () => {
        this.expandedRows = new Map();
      },
      clearCollapsedRows: () => {
        this.collapsedRows = new Map();
      },
      getRowStateMap: () => this.rowStateMap,
      setRowStateMap: (map) => {
        this.rowStateMap = map;
      },
      getColumnEditorOpen: () => this.columnEditorOpen,
      setColumnEditorOpen: (open) => {
        this.columnEditorOpen = open;
      },
      getCellRegistry: () => this.cellRegistry,
      getHeaderRegistry: () => this.headerRegistry,
      getHoverScopeId: () => this.hoverScopeId,
      getDraggedHeaderRef: () => this.draggedHeaderRef,
      getHoveredHeaderRef: () => this.hoveredHeaderRef,
      getResolvedIcons: () => this.resolvedIcons,
      getPositionOnlyBody: () => this._positionOnlyBody,
      getAnimationCoordinator: () => this.animationCoordinator,
      getAccordionController: () => this.accordionController,
      getAutoSizeManager: () => this.autoSizeManager,
      getAutoScaleManager: () => this.autoScaleManager,
      getDomManager: () => this.domManager,
      getRenderOrchestrator: () => this.renderOrchestrator,
      getDimensionManager: () => this.dimensionManager,
      getFilterManager: () => this.filterManager,
      getSortManager: () => this.sortManager,
      getPivotManager: () => this.pivotManager,
      getSelectionManager: () => this.selectionManager,
      getRowSelectionManager: () => this.rowSelectionManager,
      getScrollManager: () => this.scrollManager,
      getSectionScrollController: () => this.sectionScrollController,
      getExternalScrollController: () => this.externalScrollController,
      getExpandedDepthsManager: () => this.expandedDepthsManager,
      syncPivotPipeline: (rows) => this.syncPivotPipeline(rows),
      syncRowSelectionManager: () => this.syncRowSelectionManager(),
      captureSnapshot: () => this.accordionController.captureSnapshot(),
      beginAccordion: (axis) => this.accordionController.begin(axis),
      getEffectiveRowGrouping: () => this.getEffectiveRowGrouping(),
      applyPivot: (pivot) => this.applyPivot(pivot),
      onRender: (source) => this.render(source),
      isCellAnimating: (cellId) => this.animationCoordinator.isInFlight(cellId),
      hasAnimatingCells: () => this.animationCoordinator.hasInFlight(),
      runWithoutAnimationSnapshot: (fn) => {
        this.suppressNextAnimationSnapshot = true;
        try {
          fn();
        } finally {
          this.suppressNextAnimationSnapshot = false;
        }
      },
    };
    return this.liveHost;
  }
}
