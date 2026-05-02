import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager, type DimensionManagerState } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import type { AnimationCoordinator, CellPosition } from "../../managers/AnimationCoordinator";
import type { AccordionAxis } from "../../utils/accordionAnimation";
import { TableRenderer } from "./TableRenderer";
import { flattenRows, FlattenRowsResult } from "../../utils/rowFlattening";
import {
  processRows,
  ProcessRowsResult,
  recomputeProcessRowsViewport,
  type ProcessRowsScrollReuseBase,
} from "../../utils/rowProcessing";
import { calculateContentHeight } from "../../hooks/contentHeight";
import { filterRowsWithQuickFilter } from "../../hooks/useQuickFilter";
import { calculateAggregatedRows } from "../../hooks/useAggregatedRows";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import { normalizeHeaderWidths } from "../../utils/headerWidthUtils";
import { applyAutoScaleToHeaders } from "../../managers/AutoScaleManager";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";
import { MergedColumnEditorConfig, ResolvedIcons } from "../initialization/TableInitializer";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils/sectionWidths";

export interface RenderContext {
  /**
   * Active accordion animation axis for this render. Set on row-grouping or
   * nested-column collapse/expand toggles (see
   * {@link SimpleTableVanilla.beginAccordionAnimation}). Cell renderers use it
   * to initialize incoming cells at zero size in the named axis so the CSS
   * size transition can grow them while sibling cells FLIP into place.
   */
  accordionAxis?: AccordionAxis;
  animationCoordinator?: AnimationCoordinator;
  cellRegistry: Map<string, any>;
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  dimensionManager: DimensionManager | null;
  draggedHeaderRef: { current: HeaderObject | null };
  effectiveHeaders: HeaderObject[];
  essentialAccessors: Set<string>;
  expandedDepths: Set<number>;
  expandedRows: Map<string, number>;
  filterManager: FilterManager | null;
  getCollapsedRows: () => Map<string, number>;
  getCollapsedHeaders?: () => Set<Accessor>;
  getExpandedRows: () => Map<string, number>;
  getHeaders: () => HeaderObject[];
  getRowStateMap: () => Map<string | number, RowState>;
  headerRegistry: Map<string, any>;
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
  internalIsLoading: boolean;
  isResizing: boolean;
  localRows: Row[];
  mainBodyRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  onRender: () => void;
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  resolvedIcons: ResolvedIcons;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, RowState>;
  scrollManager: ScrollManager | null;
  sectionScrollController: SectionScrollController | null;
  selectionManager: SelectionManager | null;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setColumnEditorOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setIsResizing: (value: boolean) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
  sortManager: SortManager | null;
  /** When true, body cells that stay visible get only position updates (no content/selection recalc). Used during vertical scroll for performance. */
  positionOnlyBody?: boolean;
}

export interface RenderState {
  currentPage: number;
  scrollTop: number;
  scrollDirection: "up" | "down" | "none";
  scrollbarWidth: number;
  isMainSectionScrollable: boolean;
  columnEditorOpen: boolean;
}

interface FlattenedRowsCache {
  aggregatedRows: Row[];
  quickFilteredRows: Row[];
  flattenResult: any;
  deps: {
    rowsRef: Row[];
    /** Value-based key so cache only hits when quickFilter text/mode actually match (avoids stale 8-row cache when typing). */
    quickFilterKey: string;
    expandedRowsSize: number;
    collapsedRowsSize: number;
    expandedDepthsSize: number;
    rowStateMapSize: number;
    sortKey: string;
    filterKey: string;
  };
}

export class RenderOrchestrator {
  private tableRenderer: TableRenderer;
  private lastHeadersRef: HeaderObject[] | null = null;
  private lastRowsRef: Row[] | null = null;
  private flattenedRowsCache: FlattenedRowsCache | null = null;
  private lastProcessedResult: ProcessRowsResult | null = null;
  /** Fingerprint for skipping pagination + height-map work on vertical scroll frames. */
  private processRowsScrollReuseKey: string | null = null;
  private processRowsScrollReuseBase: ProcessRowsScrollReuseBase | null = null;
  /** Last painted virtual row range on scroll-raf; when unchanged, DOM work is redundant (native scroll moves content). */
  private lastScrollRafPaintedRange: { start: number; end: number } | null = null;
  /** Reuse normalized headers across scroll frames when layout inputs are unchanged. */
  private scrollRafHeadersMemo: {
    headersRef: HeaderObject[];
    containerWidth: number;
    collapsedKey: string;
    effectiveHeaders: HeaderObject[];
  } | null = null;

  constructor() {
    this.tableRenderer = new TableRenderer();
  }

  getCachedFlattenResult(): FlattenRowsResult | null {
    return this.flattenedRowsCache?.flattenResult ?? null;
  }

  getLastProcessedResult(): ProcessRowsResult | null {
    return this.lastProcessedResult;
  }

  /** See {@link TableRenderer.getCurrentBodyLayouts}. */
  getCurrentBodyLayouts(): Map<HTMLElement, Map<string, CellPosition>> {
    return this.tableRenderer.getCurrentBodyLayouts();
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    this.tableRenderer.invalidateCache(type);
    if (!type || type === "all" || type === "body") {
      this.flattenedRowsCache = null;
      this.lastProcessedResult = null;
    }
    if (!type || type === "all" || type === "body" || type === "context") {
      this.processRowsScrollReuseKey = null;
      this.processRowsScrollReuseBase = null;
      this.lastScrollRafPaintedRange = null;
      this.scrollRafHeadersMemo = null;
    }
    if (!type || type === "all" || type === "header") {
      this.lastScrollRafPaintedRange = null;
      this.scrollRafHeadersMemo = null;
    }
  }

  computeEffectiveHeaders(
    headers: HeaderObject[],
    config: SimpleTableConfig,
    customTheme: CustomTheme,
    containerWidth?: number,
  ): HeaderObject[] {
    let processedHeaders = [...headers];

    if (config.enableRowSelection && !headers?.[0]?.isSelectionColumn) {
      const selectionHeader = createSelectionHeader(customTheme.selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    if (containerWidth != null && containerWidth > 0) {
      return normalizeHeaderWidths(processedHeaders, { containerWidth });
    }
    return normalizeHeaderWidths(processedHeaders);
  }

  /**
   * Warms flattened/processed row caches so imperative APIs (e.g. getVisibleRows) are
   * correct before the first ResizeObserver-driven render, without mutating the DOM.
   */
  primeLastProcessedResult(context: RenderContext, state: RenderState): void {
    const snapshot = this.buildRowModelSnapshot(context, state);
    if (!snapshot) return;
    this.lastProcessedResult = snapshot.processedResult;
    context.rowSelectionManager?.updateConfig({
      tableRows: snapshot.processedResult.currentTableRows,
    });
  }

  private buildRowModelSnapshot(
    context: RenderContext,
    state: RenderState,
  ): {
    dimensionState: DimensionManagerState;
    containerWidth: number;
    effectiveHeaders: HeaderObject[];
    calculatedHeaderHeight: number;
    maxHeaderDepth: number;
    flattenResult: FlattenRowsResult;
    processedResult: ProcessRowsResult;
  } | null {
    if (this.lastHeadersRef !== context.headers) {
      this.invalidateCache("header");
      this.invalidateCache("context");
      this.lastHeadersRef = context.headers;
    }

    if (!context.dimensionManager) return null;

    const dimensionState = context.dimensionManager.getState();

    const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } = dimensionState;

    const collapsedKey =
      context.collapsedHeaders.size === 0
        ? ""
        : [...context.collapsedHeaders].map(String).sort().join("\0");

    let effectiveHeaders: HeaderObject[];
    if (
      context.positionOnlyBody &&
      context.config.autoExpandColumns !== true &&
      this.scrollRafHeadersMemo &&
      this.scrollRafHeadersMemo.headersRef === context.headers &&
      this.scrollRafHeadersMemo.containerWidth === containerWidth &&
      this.scrollRafHeadersMemo.collapsedKey === collapsedKey
    ) {
      effectiveHeaders = this.scrollRafHeadersMemo.effectiveHeaders;
    } else {
      effectiveHeaders = this.computeEffectiveHeaders(
        context.headers,
        context.config,
        context.customTheme,
        containerWidth,
      );
      if (context.config.autoExpandColumns !== true) {
        this.scrollRafHeadersMemo = {
          headersRef: context.headers,
          containerWidth,
          collapsedKey,
          effectiveHeaders,
        };
      } else {
        this.scrollRafHeadersMemo = null;
      }
    }

    const { leftWidth: pinnedLeftWidth, rightWidth: pinnedRightWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        collapsedHeaders: context.collapsedHeaders,
      });

    if (context.config.autoExpandColumns && containerWidth > 0) {
      effectiveHeaders = applyAutoScaleToHeaders(effectiveHeaders, {
        autoExpandColumns: true,
        containerWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        mainBodyRef: context.mainBodyRef ?? { current: null },
        isResizing: context.isResizing ?? false,
      });
    }

    let effectiveRows = context.localRows;

    if (context.sortManager) {
      effectiveRows = context.sortManager.getSortedRows();
    } else if (context.filterManager) {
      effectiveRows = context.filterManager.getFilteredRows();
    }

    if (this.lastRowsRef !== effectiveRows) {
      this.invalidateCache("body");
      this.invalidateCache("context");
      this.lastRowsRef = effectiveRows;
    }

    if (context.internalIsLoading && effectiveRows.length === 0) {
      let rowsToShow = context.config.shouldPaginate ? (context.config.rowsPerPage ?? 10) : 10;
      if (state.isMainSectionScrollable) {
        rowsToShow += 1;
      }
      effectiveRows = Array.from({ length: rowsToShow }, () => ({}));
    }

    const sortState = context.sortManager?.getState();
    const filterState = context.filterManager?.getState();

    const sortKey = sortState?.sort
      ? `${sortState.sort.key.accessor}-${sortState.sort.direction}`
      : "none";
    const filterKey = JSON.stringify(filterState?.filters || {});

    const q = context.config.quickFilter;
    const quickFilterKey = q ? `${q.text ?? ""}|${q.mode ?? "simple"}` : "";

    const canUseCache =
      this.flattenedRowsCache &&
      this.flattenedRowsCache.deps.rowsRef === effectiveRows &&
      this.flattenedRowsCache.deps.quickFilterKey === quickFilterKey &&
      this.flattenedRowsCache.deps.expandedRowsSize === context.expandedRows.size &&
      this.flattenedRowsCache.deps.collapsedRowsSize === context.collapsedRows.size &&
      this.flattenedRowsCache.deps.expandedDepthsSize === context.expandedDepths.size &&
      this.flattenedRowsCache.deps.rowStateMapSize === context.rowStateMap.size &&
      this.flattenedRowsCache.deps.sortKey === sortKey &&
      this.flattenedRowsCache.deps.filterKey === filterKey;

    let aggregatedRows: Row[];
    let quickFilteredRows: Row[];
    let flattenResult: FlattenRowsResult;

    if (canUseCache && this.flattenedRowsCache) {
      aggregatedRows = this.flattenedRowsCache.aggregatedRows;
      quickFilteredRows = this.flattenedRowsCache.quickFilteredRows;
      flattenResult = this.flattenedRowsCache.flattenResult;
    } else {
      aggregatedRows = context.sortManager
        ? effectiveRows
        : calculateAggregatedRows({
            rows: effectiveRows,
            headers: context.headers,
            rowGrouping: context.config.rowGrouping,
          });

      quickFilteredRows = filterRowsWithQuickFilter({
        rows: aggregatedRows,
        headers: effectiveHeaders,
        quickFilter: context.config.quickFilter,
      });

      flattenResult = flattenRows({
        rows: quickFilteredRows,
        rowGrouping: context.config.rowGrouping,
        getRowId: context.config.getRowId,
        expandedRows: context.expandedRows,
        collapsedRows: context.collapsedRows,
        expandedDepths: context.expandedDepths,
        rowStateMap: context.rowStateMap,
        hasLoadingRenderer: Boolean(context.config.loadingStateRenderer),
        hasErrorRenderer: Boolean(context.config.errorStateRenderer),
        hasEmptyRenderer: Boolean(context.config.emptyStateRenderer),
        headers: effectiveHeaders,
        rowHeight: context.customTheme.rowHeight,
        headerHeight: context.customTheme.headerHeight,
        customTheme: context.customTheme,
      });

      this.flattenedRowsCache = {
        aggregatedRows,
        quickFilteredRows,
        flattenResult,
        deps: {
          rowsRef: effectiveRows,
          quickFilterKey,
          expandedRowsSize: context.expandedRows.size,
          collapsedRowsSize: context.collapsedRows.size,
          expandedDepthsSize: context.expandedDepths.size,
          rowStateMapSize: context.rowStateMap.size,
          sortKey,
          filterKey,
        },
      };
    }

    const contentHeight = calculateContentHeight({
      height: context.config.height,
      maxHeight: context.config.maxHeight,
      rowHeight: context.customTheme.rowHeight,
      shouldPaginate: context.config.shouldPaginate ?? false,
      rowsPerPage: context.config.rowsPerPage ?? 10,
      totalRowCount: context.config.totalRowCount ?? flattenResult.paginatableRows.length,
      headerHeight: calculatedHeaderHeight,
      footerHeight:
        (context.config.shouldPaginate || context.config.footerRenderer) &&
        !context.config.hideFooter
          ? context.customTheme.footerHeight
          : undefined,
    });

    const shouldPaginate = context.config.shouldPaginate ?? false;
    const rowsPerPage = context.config.rowsPerPage ?? 10;
    const serverSidePagination = context.config.serverSidePagination ?? false;
    const totalRowCountForHeight =
      context.config.totalRowCount ?? flattenResult.paginatableRows.length;
    const rowGroupingKey = context.config.rowGrouping?.join("\0") ?? "";
    const heightOffsetsLen = flattenResult.heightOffsets?.length ?? 0;
    let heightOffsetsChecksum = 0;
    if (flattenResult.heightOffsets) {
      for (const [, extra] of flattenResult.heightOffsets) {
        heightOffsetsChecksum += extra;
      }
    }

    const scrollReuseKey =
      contentHeight === undefined
        ? ""
        : `${canUseCache ? 1 : 0}|${contentHeight}|${state.currentPage}|${rowsPerPage}|${shouldPaginate}|${serverSidePagination}|${context.customTheme.rowHeight}|${calculatedHeaderHeight}|${totalRowCountForHeight}|${context.config.enableStickyParents ?? false}|${rowGroupingKey}|${flattenResult.flattenedRows.length}|${heightOffsetsLen}|${heightOffsetsChecksum}`;

    const scrollReuseEligible =
      Boolean(context.positionOnlyBody) &&
      contentHeight !== undefined &&
      this.processRowsScrollReuseKey !== null &&
      this.processRowsScrollReuseBase !== null &&
      this.processRowsScrollReuseKey === scrollReuseKey;

    let processedResult: ProcessRowsResult;

    if (scrollReuseEligible && this.processRowsScrollReuseBase) {
      processedResult = recomputeProcessRowsViewport(this.processRowsScrollReuseBase, {
        contentHeight,
        rowHeight: context.customTheme.rowHeight,
        scrollTop: state.scrollTop,
        scrollDirection: state.scrollDirection,
        enableStickyParents: context.config.enableStickyParents ?? false,
        rowGrouping: context.config.rowGrouping,
      });
    } else {
      processedResult = processRows({
        flattenedRows: flattenResult.flattenedRows,
        paginatableRows: flattenResult.paginatableRows,
        parentEndPositions: flattenResult.parentEndPositions,
        currentPage: state.currentPage,
        rowsPerPage,
        shouldPaginate,
        serverSidePagination,
        contentHeight,
        rowHeight: context.customTheme.rowHeight,
        scrollTop: state.scrollTop,
        scrollDirection: state.scrollDirection,
        heightOffsets: flattenResult.heightOffsets,
        customTheme: context.customTheme,
        enableStickyParents: context.config.enableStickyParents ?? false,
        rowGrouping: context.config.rowGrouping,
      });

      if (contentHeight !== undefined) {
        this.processRowsScrollReuseKey = scrollReuseKey;
        this.processRowsScrollReuseBase = {
          currentTableRows: processedResult.currentTableRows,
          paginatedHeightOffsets: processedResult.paginatedHeightOffsets,
          heightMap: processedResult.heightMap,
          allFlattenedRows: processedResult.allFlattenedRows,
          pageStartIndex: processedResult.pageStartIndex,
        };
      } else {
        this.processRowsScrollReuseKey = null;
        this.processRowsScrollReuseBase = null;
      }
    }

    return {
      dimensionState,
      containerWidth,
      effectiveHeaders,
      calculatedHeaderHeight,
      maxHeaderDepth,
      flattenResult,
      processedResult,
    };
  }

  render(
    elements: {
      bodyContainer: HTMLElement;
      content: HTMLElement;
      contentWrapper: HTMLElement;
      footerContainer: HTMLElement;
      headerContainer: HTMLElement;
      rootElement: HTMLElement;
      wrapperContainer: HTMLElement;
    },
    refs: {
      mainBodyRef: { current: HTMLDivElement | null };
      tableBodyContainerRef: { current: HTMLDivElement | null };
    },
    context: RenderContext,
    state: RenderState,
    mergedColumnEditorConfig: MergedColumnEditorConfig,
  ): void {
    const savedScrollLeft =
      context.mainBodyRef?.current?.scrollLeft ?? context.mainHeaderRef?.current?.scrollLeft ?? 0;

    const snapshot = this.buildRowModelSnapshot(context, state);
    if (!snapshot) return;

    const {
      dimensionState,
      containerWidth,
      effectiveHeaders,
      calculatedHeaderHeight,
      maxHeaderDepth,
      flattenResult,
      processedResult,
    } = snapshot;
    this.lastProcessedResult = processedResult;

    const verticalScrollFastPath = context.positionOnlyBody === true;

    if (
      verticalScrollFastPath &&
      this.lastScrollRafPaintedRange !== null &&
      processedResult.renderedStartIndex === this.lastScrollRafPaintedRange.start &&
      processedResult.renderedEndIndex === this.lastScrollRafPaintedRange.end
    ) {
      return;
    }

    context.rowSelectionManager?.updateConfig({
      tableRows: processedResult.currentTableRows,
    });

    const { mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        collapsedHeaders: context.collapsedHeaders,
      });

    const mainSectionContainerWidth = containerWidth - leftWidth - rightWidth;

    if (!verticalScrollFastPath) {
      // Match main: maxHeight overrides height for the container; when maxHeight is set, height prop is ignored
      const normalizeHeight = (v: string | number) => (typeof v === "number" ? `${v}px` : v);
      const rootStyle = elements.rootElement.style;
      // Never assign style.cssText on the root: consumers (e.g. theme builders) set
      // --st-* tokens via setProperty; a full cssText replace would wipe them every render.
      if (context.config.maxHeight) {
        const normalizedMax = normalizeHeight(context.config.maxHeight);
        rootStyle.maxHeight = normalizedMax;
        rootStyle.height =
          dimensionState.contentHeight === undefined ? "auto" : normalizedMax;
      } else {
        rootStyle.removeProperty("max-height");
        if (context.config.height) {
          rootStyle.height = normalizeHeight(context.config.height);
        } else {
          rootStyle.removeProperty("height");
        }
      }

      const { customTheme } = context;
      rootStyle.setProperty("--st-main-section-width", `${mainSectionContainerWidth}px`);
      rootStyle.setProperty("--st-scrollbar-width", `${state.scrollbarWidth}px`);
      rootStyle.setProperty(
        "--st-editor-width",
        `${context.config.editColumns ? COLUMN_EDIT_WIDTH : 0}px`,
      );
      rootStyle.setProperty("--st-border-width", `${customTheme.borderWidth}px`);
      rootStyle.setProperty("--st-footer-height", `${customTheme.footerHeight}px`);

      const columnResizing = context.config.columnResizing ?? false;
      elements.content.className = `st-content ${columnResizing ? "st-resizeable" : "st-not-resizeable"}`;
      elements.content.style.width = context.config.editColumns
        ? `calc(100% - ${COLUMN_EDIT_WIDTH}px)`
        : "100%";

      this.renderHeader(
        elements.headerContainer,
        calculatedHeaderHeight,
        maxHeaderDepth,
        effectiveHeaders,
        context,
      );
    }

    this.renderBody(elements.bodyContainer, processedResult, effectiveHeaders, context);

    if (verticalScrollFastPath) {
      this.lastScrollRafPaintedRange = {
        start: processedResult.renderedStartIndex,
        end: processedResult.renderedEndIndex,
      };
    } else {
      this.lastScrollRafPaintedRange = null;
    }

    // Register header and body panes with section scroll controller, seed state from current scroll, then restore
    this.registerSectionPanes(context);
    const controller = context.sectionScrollController;
    if (controller) {
      controller.setSectionScrollLeft("main", savedScrollLeft);
      if (context.pinnedLeftRef.current != null) {
        controller.setSectionScrollLeft("pinned-left", context.pinnedLeftRef.current.scrollLeft);
      }
      if (context.pinnedRightRef.current != null) {
        controller.setSectionScrollLeft("pinned-right", context.pinnedRightRef.current.scrollLeft);
      }
      controller.restoreAll();
    }

    if (!verticalScrollFastPath) {
      this.renderFooter(
        elements.footerContainer,
        context.config.totalRowCount ?? flattenResult.paginatableRows.length,
        state.currentPage,
        effectiveHeaders,
        context,
      );
      this.renderColumnEditor(
        elements.contentWrapper,
        state.columnEditorOpen,
        mergedColumnEditorConfig,
        effectiveHeaders,
        context,
      );
      this.renderHorizontalScrollbar(
        elements.wrapperContainer,
        mainWidth,
        leftWidth,
        rightWidth,
        leftContentWidth,
        rightContentWidth,
        refs.tableBodyContainerRef.current,
        effectiveHeaders,
        context,
      );
    }
  }

  private renderHeader(
    headerContainer: HTMLElement,
    calculatedHeaderHeight: number,
    maxHeaderDepth: number,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    if (context.config.hideHeader) return;

    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderHeader(headerContainer, calculatedHeaderHeight, maxHeaderDepth, deps);
  }

  private renderBody(
    bodyContainer: HTMLElement,
    processedResult: any,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderBody(bodyContainer, processedResult, deps);
  }

  private renderFooter(
    footerContainer: HTMLElement,
    totalRows: number,
    currentPage: number,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderFooter(
      footerContainer,
      totalRows,
      currentPage,
      (page: number) => {
        context.setCurrentPage(page);
        context.onRender();
      },
      deps,
    );
  }

  private renderColumnEditor(
    contentWrapper: HTMLElement,
    columnEditorOpen: boolean,
    mergedColumnEditorConfig: MergedColumnEditorConfig,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderColumnEditor(
      contentWrapper,
      columnEditorOpen,
      (open: boolean) => {
        context.setColumnEditorOpen(open);
        context.onRender();
      },
      mergedColumnEditorConfig,
      deps,
    );
  }

  private renderHorizontalScrollbar(
    wrapperContainer: HTMLElement,
    mainBodyWidth: number,
    pinnedLeftWidth: number,
    pinnedRightWidth: number,
    pinnedLeftContentWidth: number,
    pinnedRightContentWidth: number,
    tableBodyContainer: HTMLDivElement | null,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    if (!context.mainBodyRef.current || !tableBodyContainer) return;

    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderHorizontalScrollbar(
      wrapperContainer,
      mainBodyWidth,
      pinnedLeftWidth,
      pinnedRightWidth,
      pinnedLeftContentWidth,
      pinnedRightContentWidth,
      tableBodyContainer,
      deps,
    );
  }

  private registerSectionPanes(context: RenderContext): void {
    const controller = context.sectionScrollController;
    if (!controller) return;

    if (context.pinnedLeftHeaderRef.current) {
      controller.registerPane("pinned-left", context.pinnedLeftHeaderRef.current, "header");
    }
    if (context.pinnedLeftRef.current) {
      controller.registerPane("pinned-left", context.pinnedLeftRef.current, "body");
    }
    if (context.mainHeaderRef.current) {
      controller.registerPane("main", context.mainHeaderRef.current, "header");
    }
    if (context.mainBodyRef.current) {
      controller.registerPane("main", context.mainBodyRef.current, "body");
    }
    if (context.pinnedRightHeaderRef.current) {
      controller.registerPane("pinned-right", context.pinnedRightHeaderRef.current, "header");
    }
    if (context.pinnedRightRef.current) {
      controller.registerPane("pinned-right", context.pinnedRightRef.current, "body");
    }
  }

  private buildRendererDeps(effectiveHeaders: HeaderObject[], context: RenderContext) {
    return {
      accordionAxis: context.accordionAxis,
      animationCoordinator: context.animationCoordinator,
      config: context.config,
      customTheme: context.customTheme,
      resolvedIcons: context.resolvedIcons,
      effectiveHeaders,
      headers: context.headers,
      localRows: context.localRows,
      collapsedHeaders: context.collapsedHeaders,
      collapsedRows: context.collapsedRows,
      expandedRows: context.expandedRows,
      expandedDepths: context.expandedDepths,
      isResizing: context.isResizing,
      internalIsLoading: context.internalIsLoading,
      cellRegistry: context.cellRegistry,
      headerRegistry: context.headerRegistry,
      draggedHeaderRef: context.draggedHeaderRef,
      hoveredHeaderRef: context.hoveredHeaderRef,
      mainBodyRef: context.mainBodyRef,
      pinnedLeftRef: context.pinnedLeftRef,
      pinnedRightRef: context.pinnedRightRef,
      mainHeaderRef: context.mainHeaderRef,
      pinnedLeftHeaderRef: context.pinnedLeftHeaderRef,
      pinnedRightHeaderRef: context.pinnedRightHeaderRef,
      dimensionManager: context.dimensionManager,
      sectionScrollController: context.sectionScrollController,
      sortManager: context.sortManager,
      filterManager: context.filterManager,
      selectionManager: context.selectionManager,
      rowSelectionManager: context.rowSelectionManager,
      rowStateMap: context.rowStateMap,
      onRender: context.onRender,
      setIsResizing: context.setIsResizing,
      setHeaders: context.setHeaders,
      setCollapsedHeaders: context.setCollapsedHeaders,
      setCollapsedRows: context.setCollapsedRows,
      setExpandedRows: context.setExpandedRows,
      setRowStateMap: context.setRowStateMap,
      getCollapsedRows: context.getCollapsedRows,
      getCollapsedHeaders: context.getCollapsedHeaders,
      getExpandedRows: context.getExpandedRows,
      getHeaders: context.getHeaders,
      getRowStateMap: context.getRowStateMap,
      positionOnlyBody: context.positionOnlyBody,
      essentialAccessors: context.essentialAccessors,
    };
  }

  cleanup(): void {
    this.tableRenderer.cleanup();
  }
}
