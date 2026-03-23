import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import { TableRenderer } from "./TableRenderer";
import { flattenRows } from "../../utils/rowFlattening";
import { processRows } from "../../utils/rowProcessing";
import { calculateContentHeight } from "../../hooks/contentHeight";
import { filterRowsWithQuickFilter } from "../../hooks/useQuickFilter";
import { calculateAggregatedRows } from "../../hooks/useAggregatedRows";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import { normalizeHeaderWidths } from "../../utils/headerWidthUtils";
import { applyAutoScaleToHeaders } from "../../managers/AutoScaleManager";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";
import {
  MergedColumnEditorConfig,
  ResolvedIcons,
} from "../initialization/TableInitializer";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils/sectionWidths";

export interface RenderContext {
  cellRegistry: Map<string, any>;
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  dimensionManager: DimensionManager | null;
  draggedHeaderRef: { current: HeaderObject | null };
  effectiveHeaders: HeaderObject[];
  expandedDepths: Set<number>;
  expandedRows: Map<string, number>;
  filterManager: FilterManager | null;
  getCollapsedRows: () => Map<string, number>;
  getCollapsedHeaders?: () => Set<Accessor>;
  getExpandedRows: () => Map<string, number>;
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
    sortKey: string;
    filterKey: string;
  };
}

export class RenderOrchestrator {
  private tableRenderer: TableRenderer;
  private lastHeadersRef: HeaderObject[] | null = null;
  private lastRowsRef: Row[] | null = null;
  private flattenedRowsCache: FlattenedRowsCache | null = null;

  constructor() {
    this.tableRenderer = new TableRenderer();
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    this.tableRenderer.invalidateCache(type);
    if (!type || type === "all" || type === "body") {
      this.flattenedRowsCache = null;
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
      const selectionHeader = createSelectionHeader(
        customTheme.selectionColumnWidth,
      );
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    if (containerWidth != null && containerWidth > 0) {
      return normalizeHeaderWidths(processedHeaders, { containerWidth });
    }
    return normalizeHeaderWidths(processedHeaders);
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
    // Invalidate caches when headers or rows change (by reference)
    if (this.lastHeadersRef !== context.headers) {
      this.invalidateCache("header");
      this.invalidateCache("context");
      this.lastHeadersRef = context.headers;
    }

    if (!context.dimensionManager) return;

    // Capture horizontal scroll at start so we can reapply after header/body render (DOM updates can reset it)
    const savedScrollLeft =
      context.mainBodyRef?.current?.scrollLeft ??
      context.mainHeaderRef?.current?.scrollLeft ??
      0;

    const dimensionState = context.dimensionManager.getState();

    const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } =
      dimensionState;

    let effectiveHeaders = this.computeEffectiveHeaders(
      context.headers,
      context.config,
      context.customTheme,
      containerWidth,
    );

    // Calculate pinned section widths from un-scaled headers first so auto-scale
    // knows exactly how much space is available for the main section.
    const {
      leftWidth: pinnedLeftWidth,
      rightWidth: pinnedRightWidth,
    } = recalculateAllSectionWidths({
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

    const {
      mainWidth,
      leftWidth,
      rightWidth,
      leftContentWidth,
      rightContentWidth,
    } = recalculateAllSectionWidths({
      headers: effectiveHeaders,
      containerWidth,
      collapsedHeaders: context.collapsedHeaders,
    });

    const mainSectionContainerWidth = containerWidth - leftWidth - rightWidth;

    // Match main: maxHeight overrides height for the container; when maxHeight is set, height prop is ignored
    const normalizeHeight = (v: string | number) =>
      typeof v === "number" ? `${v}px` : v;
    let maxHeightStyle = "";
    let heightStyle = "";
    if (context.config.maxHeight) {
      const normalizedMax = normalizeHeight(context.config.maxHeight);
      maxHeightStyle = `max-height: ${normalizedMax};`;
      heightStyle =
        dimensionState.contentHeight === undefined
          ? "height: auto;"
          : `height: ${normalizedMax};`;
    } else if (context.config.height) {
      heightStyle = `height: ${normalizeHeight(context.config.height)};`;
    }

    const { customTheme } = context;
    elements.rootElement.style.cssText = `
      ${maxHeightStyle}
      ${heightStyle}
      --st-main-section-width: ${mainSectionContainerWidth}px;
      --st-scrollbar-width: ${state.scrollbarWidth}px;
      --st-editor-width: ${context.config.editColumns ? COLUMN_EDIT_WIDTH : 0}px;
      --st-border-width: ${customTheme.borderWidth}px;
      --st-footer-height: ${customTheme.footerHeight}px;
    `;

    const columnResizing = context.config.columnResizing ?? false;
    elements.content.className = `st-content ${columnResizing ? "st-resizeable" : "st-not-resizeable"}`;
    elements.content.style.width = context.config.editColumns
      ? `calc(100% - ${COLUMN_EDIT_WIDTH}px)`
      : "100%";

    let effectiveRows = context.localRows;

    // Use sorted rows from SortManager (which already includes filtering)
    // The FilterManager updates the SortManager's input rows when filters change
    if (context.sortManager) {
      effectiveRows = context.sortManager.getSortedRows();
    } else if (context.filterManager) {
      // Fallback: if no sort manager but filter manager exists, use filtered rows
      effectiveRows = context.filterManager.getFilteredRows();
    }

    // Invalidate body and context cache when effective rows change (includes sorting/filtering)
    if (this.lastRowsRef !== effectiveRows) {
      this.invalidateCache("body");
      this.invalidateCache("context"); // Also invalidate context to update sort indicators
      this.lastRowsRef = effectiveRows;
    }

    if (context.internalIsLoading && effectiveRows.length === 0) {
      let rowsToShow = context.config.shouldPaginate
        ? (context.config.rowsPerPage ?? 10)
        : 10;
      if (state.isMainSectionScrollable) {
        rowsToShow += 1;
      }
      effectiveRows = Array.from({ length: rowsToShow }, () => ({}));
    }

    // Check if we can use cached flattened rows
    const sortState = context.sortManager?.getState();
    const filterState = context.filterManager?.getState();

    // Serialize sort and filter state for cache comparison
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
      this.flattenedRowsCache.deps.expandedRowsSize ===
        context.expandedRows.size &&
      this.flattenedRowsCache.deps.collapsedRowsSize ===
        context.collapsedRows.size &&
      this.flattenedRowsCache.deps.expandedDepthsSize ===
        context.expandedDepths.size &&
      this.flattenedRowsCache.deps.sortKey === sortKey &&
      this.flattenedRowsCache.deps.filterKey === filterKey;

    let aggregatedRows: Row[];
    let quickFilteredRows: Row[];
    let flattenResult: any;

    if (canUseCache && this.flattenedRowsCache) {
      aggregatedRows = this.flattenedRowsCache.aggregatedRows;
      quickFilteredRows = this.flattenedRowsCache.quickFilteredRows;
      flattenResult = this.flattenedRowsCache.flattenResult;
    } else {
      // SortManager already returns aggregated rows, so only aggregate if no SortManager
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

      // Cache the result
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
      totalRowCount:
        context.config.totalRowCount ?? flattenResult.paginatableRows.length,
      headerHeight: calculatedHeaderHeight,
      footerHeight:
        context.config.shouldPaginate && !context.config.hideFooter
          ? context.customTheme.footerHeight
          : undefined,
    });

    const processedResult = processRows({
      flattenedRows: flattenResult.flattenedRows,
      paginatableRows: flattenResult.paginatableRows,
      parentEndPositions: flattenResult.parentEndPositions,
      currentPage: state.currentPage,
      rowsPerPage: context.config.rowsPerPage ?? 10,
      shouldPaginate: context.config.shouldPaginate ?? false,
      serverSidePagination: context.config.serverSidePagination ?? false,
      contentHeight,
      rowHeight: context.customTheme.rowHeight,
      scrollTop: state.scrollTop,
      scrollDirection: state.scrollDirection,
      heightOffsets: flattenResult.heightOffsets,
      customTheme: context.customTheme,
      enableStickyParents: context.config.enableStickyParents ?? false,
      rowGrouping: context.config.rowGrouping,
    });

    context.rowSelectionManager?.updateConfig({
      tableRows: processedResult.currentTableRows,
    });

    this.renderHeader(
      elements.headerContainer,
      calculatedHeaderHeight,
      maxHeaderDepth,
      effectiveHeaders,
      context,
    );
    this.renderBody(
      elements.bodyContainer,
      processedResult,
      effectiveHeaders,
      context,
    );

    // Register header and body panes with section scroll controller, seed state from current scroll, then restore
    this.registerSectionPanes(context);
    const controller = context.sectionScrollController;
    if (controller) {
      controller.setSectionScrollLeft("main", savedScrollLeft);
      if (context.pinnedLeftRef.current != null) {
        controller.setSectionScrollLeft(
          "pinned-left",
          context.pinnedLeftRef.current.scrollLeft,
        );
      }
      if (context.pinnedRightRef.current != null) {
        controller.setSectionScrollLeft(
          "pinned-right",
          context.pinnedRightRef.current.scrollLeft,
        );
      }
      controller.restoreAll();
    }

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

  private renderHeader(
    headerContainer: HTMLElement,
    calculatedHeaderHeight: number,
    maxHeaderDepth: number,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    if (context.config.hideHeader) return;

    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderHeader(
      headerContainer,
      calculatedHeaderHeight,
      maxHeaderDepth,
      deps,
    );
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
      controller.registerPane(
        "pinned-left",
        context.pinnedLeftHeaderRef.current,
        "header",
      );
    }
    if (context.pinnedLeftRef.current) {
      controller.registerPane(
        "pinned-left",
        context.pinnedLeftRef.current,
        "body",
      );
    }
    if (context.mainHeaderRef.current) {
      controller.registerPane("main", context.mainHeaderRef.current, "header");
    }
    if (context.mainBodyRef.current) {
      controller.registerPane("main", context.mainBodyRef.current, "body");
    }
    if (context.pinnedRightHeaderRef.current) {
      controller.registerPane(
        "pinned-right",
        context.pinnedRightHeaderRef.current,
        "header",
      );
    }
    if (context.pinnedRightRef.current) {
      controller.registerPane(
        "pinned-right",
        context.pinnedRightRef.current,
        "body",
      );
    }
  }

  private buildRendererDeps(
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ) {
    return {
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
      getRowStateMap: context.getRowStateMap,
      positionOnlyBody: context.positionOnlyBody,
    };
  }

  cleanup(): void {
    this.tableRenderer.cleanup();
  }
}
