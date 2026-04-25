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
  TableInitializer,
  ResolvedIcons,
  MergedColumnEditorConfig,
} from "./initialization/TableInitializer";
import { DOMManager } from "./dom/DOMManager";
import { RenderOrchestrator, RenderContext, RenderState } from "./rendering/RenderOrchestrator";
import { TableAPIImpl, TableAPIContext } from "./api/TableAPIImpl";

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
    this.animationCoordinator.setEnabled(config.animations ?? true);
    if (config.animationDuration !== undefined) {
      this.animationCoordinator.setDuration(config.animationDuration);
    }
    if (config.animationEasing !== undefined) {
      this.animationCoordinator.setEasing(config.animationEasing);
    }

    this.rebuildRowIndexMap();
    this.initializeManagers();
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
  private captureAnimationSnapshot(): void {
    this.animationCoordinator.captureSnapshot({
      containers: this.getBodyContainers(),
      preLayouts: this.renderOrchestrator.getCurrentBodyLayouts(),
    });
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
      infiniteScrollThreshold: 200,
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

    elements.bodyContainer.addEventListener("scroll", this.handleScroll.bind(this));
    elements.bodyContainer.addEventListener("mouseleave", () => {
      this.clearHoveredRows();
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
        // Snapshot on every header change — including the chain of `setHeaders`
        // calls that fire while a header is being dragged — so each `dragover`
        // swap FLIP-animates the displaced columns smoothly out of the way.
        this.captureAnimationSnapshot();
        this.headers = deepClone(headers);
        this.renderOrchestrator.invalidateCache("header");
      },
      animationCoordinator: this.animationCoordinator,
      setCollapsedHeaders: (headers: Set<Accessor>) => {
        this.collapsedHeaders = headers;
      },
      setCollapsedRows: (
        rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
      ) => {
        this.collapsedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.collapsedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setExpandedRows: (
        rowsOrUpdater: Map<string, number> | ((prev: Map<string, number>) => Map<string, number>),
      ) => {
        this.expandedRows =
          typeof rowsOrUpdater === "function" ? rowsOrUpdater(this.expandedRows) : rowsOrUpdater;
        this.render("expansion");
      },
      setRowStateMap: (
        mapOrUpdater:
          | Map<string | number, any>
          | ((prev: Map<string | number, any>) => Map<string | number, any>),
      ) => {
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

    // FLIP play step. No-op when no snapshot is armed or when scroll-driven.
    // Position-only scroll renders deliberately skip play so out-going /
    // in-coming cells aren't FLIP-tweened during vertical scrolls. Every
    // other render — including the chain of mid-drag `setHeaders` renders
    // that fire on each `dragover` swap — runs play so columns being
    // displaced by the drag slide smoothly to their new slots.
    if (source !== "scroll-raf") {
      this.animationCoordinator.play({ containers: this.getBodyContainers() });
    }
  }

  update(config: Partial<SimpleTableConfig>): void {
    this.isUpdating = true;
    this.config = { ...this.config, ...config };

    if (config.animations !== undefined) {
      this.animationCoordinator.setEnabled(config.animations);
    }
    if (config.animationDuration !== undefined) {
      this.animationCoordinator.setDuration(config.animationDuration);
    }
    if (config.animationEasing !== undefined) {
      this.animationCoordinator.setEasing(config.animationEasing);
    }

    if (config.rows !== undefined) {
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
        // Snapshot on every header change so column visibility / reordering
        // from the column editor smoothly FLIPs into place.
        this.captureAnimationSnapshot();
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
