import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import ColumnDef, { Accessor } from "../types/ColumnDef";
import Row from "../types/Row";
import type { RowData } from "../types/Row";
import { CustomTheme, areCustomThemesEqual } from "../types/CustomTheme";
import RowState from "../types/RowState";
import {
  normalizeConfig,
  normalizeConfigPatch,
  type SimpleTableConfigInput,
} from "../utils/normalizeConfig";

import { AnimationCoordinator } from "../managers/AnimationCoordinator";
import { AccordionController } from "../managers/AccordionController";
import { AutoScaleManager } from "../managers/AutoScaleManager";
import {
  AutoSizeManager,
  getAutoSizeMeasureRows,
  getAutoSizeStyleRoot,
} from "../managers/AutoSizeManager";
import { DimensionManager } from "../managers/DimensionManager";
import { ExternalScrollController } from "../managers/ExternalScrollController";
import type { ExternalScrollMetrics } from "../utils/externalScroll";
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

import {
  TableInitializer,
  ResolvedIcons,
  MergedColumnEditorConfig,
} from "./initialization/TableInitializer";
import { DOMManager } from "./dom/DOMManager";
import { RenderOrchestrator, RenderContext, RenderState } from "./rendering/RenderOrchestrator";
import { buildRenderContext } from "./rendering/buildRenderContext";
import { TableAPIImpl } from "./api/TableAPIImpl";
import { buildTableAPIContext } from "./api/buildTableAPIContext";
import { UNVIRTUALIZED_ROW_WARNING_THRESHOLD } from "../consts/general-consts";
import { clearHoveredRowsForScope } from "../utils/bodyCell/styling";

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
  private accordionController: AccordionController;
  private autoSizeManager: AutoSizeManager;
  private externalScrollController: ExternalScrollController;
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
  private scrollRafId: number | null = null;
  private scrollEndTimeoutId: number | null = null;
  private lastScrollTop: number = 0;
  private isUpdating: boolean = false;

  /** Set once the dev-only "too many unvirtualized rows" warning has fired, so it never repeats. */
  private hasWarnedUnvirtualizedRows: boolean = false;
  /** Pending deferred check for the unvirtualized-rows warning (lets external-scroll seeding settle first). */
  private unvirtualizedRowsCheckTimeoutId: number | null = null;
  /** Bound mouseleave handler on the body container. */
  private bodyContainerMouseLeaveListener: (() => void) | null = null;

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
   * Shared header write path for the render context and TableAPI. Accordion-
   * horizontal when the visible or pinned set changed; otherwise snapshot for FLIP.
   */
  private applyHeaders(headers: ColumnDef[]): void {
    if (this.accordionController.didColumnVisibilityChange(headers)) {
      this.accordionController.begin("horizontal");
    } else {
      this.accordionController.captureSnapshot();
    }
    this.headers = deepClone(headers);
    this.renderOrchestrator.invalidateCache("header");
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
      this.accordionController.begin("vertical");
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

    this.sortManager = new SortManager({
      headers: this.headers,
      tableRows: initialSortRows,
      externalSortHandling: this.config.externalSortHandling || false,
      // Read from live config at invocation time so callback props updated via
      // update() (e.g. a React re-render with a fresh closure) aren't stale.
      onSortChange: (sort) => this.config.onSortChange?.(sort),
      rowGrouping: this.getEffectiveRowGrouping(),
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
      this.accordionController.captureSnapshot();
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
      tableRoot: this.getTableRoot(),
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
    this.bindTableRoot();
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
        if (
          this.externalScrollController.getResolvedParent() &&
          typeof requestAnimationFrame !== "undefined"
        ) {
          requestAnimationFrame(() => {
            if (this.mounted) this.externalScrollController.recomputeViewportHeight();
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

    this.externalScrollController.sync();
  }

  /**
   * Scroll-coalesce path for an external `scrollParent`. Wiring lives on
   * ExternalScrollController; this keeps rAF / scroll-end / ScrollManager
   * updates in one place with {@link handleScroll}.
   */
  private handleExternalScrollMetrics(metrics: ExternalScrollMetrics): void {
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

      if (metrics.visibleViewportHeight !== this.externalScrollController.getViewportHeight()) {
        this.externalScrollController.setViewportHeight(metrics.visibleViewportHeight);
      }

      if (this.scrollManager) {
        if (this.config.onLoadMore) {
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

  /**
   * Pivot emits a flat matrix — disable consumer rowGrouping while active so
   * expand/collapse hierarchy does not wrap pivoted rows.
   */
  private getEffectiveRowGrouping(): Accessor[] | undefined {
    const pivotState = this.pivotManager?.getState();
    if (pivotState?.active) {
      return undefined;
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
        rowGrouping: undefined,
      });
      this.selectionManager?.updateConfig({ headers: state.headers });
      // Flat pivot — clear any expand depths from consumer rowGrouping.
      this.expandedDepthsManager?.updateRowGrouping(undefined);
      if (!wasActive) {
        this.collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(state.headers);
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
        ? { ...this.config, rowGrouping: undefined }
        : this.config;
    const effectiveLocalRows =
      pivotState?.active ? pivotState.pivotedRows : this.localRows;
    const viewportHeight = this.externalScrollController.getViewportHeight();

    return buildRenderContext({
      accordionAxis: this.accordionController.getPendingAxis(),
      animationCoordinator: this.animationCoordinator,
      cellRegistry: this.cellRegistry,
      collapsedHeaders: this.collapsedHeaders,
      collapsedRows: this.collapsedRows,
      config: effectiveConfig,
      customTheme: this.customTheme,
      dimensionManager: this.dimensionManager,
      draggedHeaderRef: this.draggedHeaderRef,
      essentialAccessors: this.essentialAccessors,
      expandedDepths: this.expandedDepths,
      expandedRows: this.expandedRows,
      filterManager: this.filterManager,
      headerRegistry: this.headerRegistry,
      headers: this.headers,
      hoverScopeId: this.hoverScopeId,
      hoveredHeaderRef: this.hoveredHeaderRef,
      internalIsLoading: this.internalIsLoading,
      isResizing: this.isResizing,
      localRows: effectiveLocalRows,
      createNestedTable: (container, nestedConfig) =>
        new SimpleTableVanilla<Row>(container, nestedConfig as SimpleTableConfigInput<Row>),
      mainBodyRef: refs.mainBodyRef,
      mainHeaderRef: refs.mainHeaderRef,
      pinnedLeftHeaderRef: refs.pinnedLeftHeaderRef,
      pinnedLeftRef: refs.pinnedLeftRef,
      pinnedRightHeaderRef: refs.pinnedRightHeaderRef,
      pinnedRightRef: refs.pinnedRightRef,
      positionOnlyBody: this._positionOnlyBody,
      externalViewportHeight: viewportHeight > 0 ? viewportHeight : undefined,
      resolvedIcons: this.resolvedIcons,
      rowSelectionManager: this.rowSelectionManager,
      rowStateMap: this.rowStateMap,
      scrollManager: this.scrollManager,
      sectionScrollController: this.sectionScrollController,
      selectionManager: this.selectionManager,
      sortManager: this.sortManager,
      onRender: () => this.render("resizeHandler-onRender"),
      getShrinkFloors: () =>
        this.autoSizeManager.getShrinkFloors(
          this.headers,
          this.collapsedHeaders,
          this.pristineDefaultHeaders,
        ),
      onAutoExpandNaturalWidths: (widths) => this.autoSizeManager.recordNaturalWidths(widths),
      setIsResizing: (value) => {
        this.isResizing = value;
        if (this.autoScaleManager && value === false) {
          const liveRefs = this.domManager.getRefs();
          const containerWidth =
            liveRefs.tableBodyContainerRef?.current?.clientWidth ??
            liveRefs.mainBodyRef?.current?.clientWidth ??
            this.dimensionManager?.getState().containerWidth ??
            0;
          this.autoScaleManager.updateConfig({
            isResizing: false,
            containerWidth,
          });
        }
      },
      setHeaders: (headers) => this.applyHeaders(headers),
      setCollapsedHeaders: (headers) => {
        this.accordionController.begin("horizontal");
        this.collapsedHeaders = headers;
      },
      setCollapsedRows: (rowsOrUpdater) => {
        this.accordionController.begin("vertical");
        this.collapsedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.collapsedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setExpandedRows: (rowsOrUpdater) => {
        this.accordionController.begin("vertical");
        this.expandedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.expandedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setRowStateMap: (mapOrUpdater) => {
        this.accordionController.begin("vertical");
        this.rowStateMap =
          typeof mapOrUpdater === "function" ? mapOrUpdater(this.rowStateMap) : mapOrUpdater;
        this.render("rowStateMap");
      },
      getCollapsedRows: () => this.collapsedRows,
      getCollapsedHeaders: () => this.collapsedHeaders,
      getExpandedRows: () => this.expandedRows,
      getHeaders: () => this.headers,
      getPristineDefaultHeaders: () => this.pristineDefaultHeaders,
      getPivot: () => this.pivotManager?.getPivot() ?? this.config.pivot ?? null,
      setPivot: (pivotConfig) => this.applyPivot(pivotConfig),
      getRowStateMap: () => this.rowStateMap,
      setColumnEditorOpen: (open) => {
        this.columnEditorOpen = open;
      },
      setCurrentPage: (page) => {
        if (
          page !== this.currentPage &&
          this.config.enablePagination &&
          !this.config.serverSidePagination
        ) {
          this.autoSizeManager.queuePendingFromAccessors();
        }
        this.currentPage = page;
      },
    });
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
      scrollTop: this.scrollTop,
      scrollDirection: this.scrollDirection,
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
    this.accordionController.clearPendingAxis();

    // FLIP play step. No-op when no snapshot is armed or when scroll-driven.
    // Position-only scroll renders deliberately skip play so out-going /
    // in-coming cells aren't FLIP-tweened during vertical scrolls. Live-sort
    // reorders (from updateData) also skip play so they don't interrupt an
    // in-flight user sort or thrash retained-cell cleanup every tick.
    // Every other render — including the chain of mid-drag `setHeaders` renders
    // that fire on each `dragover` swap — runs play so columns being
    // displaced by the drag slide smoothly to their new slots.
    if (source !== "scroll-raf" && source !== "live-sort") {
      this.accordionController.play();
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

  update(config: Partial<SimpleTableConfigInput<TData>>): void {
    this.isUpdating = true;
    const previousTheme = this.config.theme;
    const patch = normalizeConfigPatch(config as unknown as Partial<SimpleTableConfigInput>);
    this.config = { ...this.config, ...patch };

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
        this.accordionController.captureSnapshot();
      }
      this.localRows = [...config.rows] as Row[];
      this.rebuildRowIndexMap();

      if (this.filterManager) {
        this.filterManager.updateConfig({ rows: this.localRows });
      }
      // Pivot + sort are synced from filtered source rows (filter subscribe also
      // fires when rows change if FilterManager notifies; call explicitly too).
      this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
      // SelectionManager will be updated with processed rows during render

      // Re-fit auto-size columns against the new data (content width may change).
      this.autoSizeManager.queuePendingFromAccessors();
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
      this.accordionController.captureSnapshot();
      this.ingestColumnSnapshot(patch.columns as ColumnDef[]);
      // Field catalog drives filters; visible headers come from pivot when active.
      if (this.filterManager) {
        this.filterManager.updateConfig({ headers: this.pristineDefaultHeaders });
      }
      if (this.pivotManager?.isActive()) {
        this.syncPivotPipeline(this.filterManager?.getFilteredRows() ?? this.localRows);
      } else {
        this.headers = deepClone(this.pristineDefaultHeaders);
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
      this.autoSizeManager.recomputeAccessors(this.headers, this.collapsedHeaders);
      this.autoSizeManager.clearNaturalWidths();
    }

    if (config.isLoading !== undefined) {
      const wasLoading = this.internalIsLoading;
      this.internalIsLoading = config.isLoading;
      // Leaving the loading state reveals real cellRenderer / headerRenderer
      // DOM (replacing skeletons). Re-queue auto columns so widths can settle
      // from painted content instead of staying on a provisional measure.
      if (wasLoading && !config.isLoading && this.autoSizeManager.getAccessors().size > 0) {
        this.autoSizeManager.queuePendingFromAccessors();
      }
    }

    if (config.theme !== undefined) {
      this.domManager.updateTheme(config.theme);
      // Theme only swapped the root CSS class before, so custom cell/header/
      // footer renderers kept stale theme props (and memoization skipped
      // rebuilds). Tear down all rendered cells + context so the ensuing
      // render remounts everything with the new theme — consumers should not
      // need to remount the table themselves.
      if (config.theme !== previousTheme) {
        this.renderOrchestrator.invalidateCache("all");
        this.renderOrchestrator.invalidateCustomFooterCache();
      }
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
      this.externalScrollController.sync();
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
  updateConfig(config: Partial<SimpleTableConfigInput<TData>>): void {
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
        tableRoot: this.getTableRoot(),
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
    if (this.unvirtualizedRowsCheckTimeoutId !== null) {
      clearTimeout(this.unvirtualizedRowsCheckTimeoutId);
      this.unvirtualizedRowsCheckTimeoutId = null;
    }
    this.externalScrollController.destroy();
    const elements = this.domManager.getElements();
    if (elements?.bodyContainer) {
      if (this.bodyContainerMouseLeaveListener) {
        elements.bodyContainer.removeEventListener(
          "mouseleave",
          this.bodyContainerMouseLeaveListener,
        );
        this.bodyContainerMouseLeaveListener = null;
      }
    }
    this.accordionController.destroy();
    const root = this.domManager.getElements()?.rootElement ?? this.container;

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

  getAPI(): TableAPI<TData> {
    if (this.cachedAPI) return this.cachedAPI;

    this.cachedAPI = TableAPIImpl.createAPI(
      buildTableAPIContext({
        getConfig: () => this.config,
        getLocalRows: () => this.localRows,
        getHeaders: () => this.headers,
        applyHeaders: (headers) => this.applyHeaders(headers),
        getPristineDefaultHeaders: () => this.pristineDefaultHeaders,
        getEssentialAccessors: () => this.essentialAccessors,
        getCustomTheme: () => this.customTheme,
        getCurrentPage: () => this.currentPage,
        setCurrentPage: (page) => {
          this.currentPage = page;
        },
        getExpandedRows: () => this.expandedRows,
        getCollapsedRows: () => this.collapsedRows,
        getExpandedDepths: () => this.expandedDepths,
        clearExpandedRows: () => {
          this.expandedRows = new Map();
        },
        clearCollapsedRows: () => {
          this.collapsedRows = new Map();
        },
        getRowStateMap: () => this.rowStateMap,
        getHeaderRegistry: () => this.headerRegistry,
        getCellRegistry: () => this.cellRegistry,
        isCellAnimating: (cellId) => this.animationCoordinator.isInFlight(cellId),
        hasAnimatingCells: () => this.animationCoordinator.hasInFlight(),
        getColumnEditorOpen: () => this.columnEditorOpen,
        setColumnEditorOpen: (open) => {
          this.columnEditorOpen = open;
          this.render("columnEditor-toggle");
        },
        getExpandedDepthsManager: () => this.expandedDepthsManager,
        getSelectionManager: () => this.selectionManager,
        getRowSelectionManager: () => this.rowSelectionManager,
        getSortManager: () => this.sortManager,
        getFilterManager: () => this.filterManager,
        getCachedFlattenResult: () => this.renderOrchestrator.getCachedFlattenResult(),
        getCachedProcessedResult: () => this.renderOrchestrator.getLastProcessedResult(),
        getEffectiveRowGrouping: () => this.getEffectiveRowGrouping(),
        setPivot: (pivotConfig) => this.applyPivot(pivotConfig),
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
        runWithoutAnimationSnapshot: (fn) => {
          this.suppressNextAnimationSnapshot = true;
          try {
            fn();
          } finally {
            this.suppressNextAnimationSnapshot = false;
          }
        },
        computeEffectiveHeaders: () =>
          this.renderOrchestrator.computeEffectiveHeaders(
            this.headers,
            this.config,
            this.customTheme,
          ),
      }),
    ) as unknown as TableAPI<TData>;
    return this.cachedAPI;
  }
}
