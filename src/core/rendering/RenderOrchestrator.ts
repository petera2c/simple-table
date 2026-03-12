import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager, ScrollSyncConfig } from "../../managers/ScrollManager";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import { TableRenderer } from "./TableRenderer";
import { flattenRows } from "../../utils/rowFlattening";
import { processRows } from "../../utils/rowProcessing";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { calculateContentHeight } from "../../hooks/contentHeight";
import { filterRowsWithQuickFilter } from "../../hooks/useQuickFilter";
import { calculateAggregatedRows } from "../../hooks/useAggregatedRows";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import { normalizeHeaderWidths } from "../../utils/headerWidthUtils";
import { applyAutoScaleToHeaders } from "../../managers/AutoScaleManager";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";
import { MergedColumnEditorConfig, ResolvedIcons } from "../initialization/TableInitializer";

export interface RenderContext {
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  resolvedIcons: ResolvedIcons;
  effectiveHeaders: HeaderObject[];
  headers: HeaderObject[];
  localRows: Row[];
  collapsedHeaders: Set<Accessor>;
  collapsedRows: Map<string, number>;
  expandedRows: Map<string, number>;
  expandedDepths: Set<number>;
  isResizing: boolean;
  internalIsLoading: boolean;
  cellRegistry: Map<string, any>;
  headerRegistry: Map<string, any>;
  draggedHeaderRef: { current: HeaderObject | null };
  hoveredHeaderRef: { current: HeaderObject | null };
  mainBodyRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  dimensionManager: DimensionManager | null;
  scrollManager: ScrollManager | null;
  sortManager: SortManager | null;
  filterManager: FilterManager | null;
  selectionManager: SelectionManager | null;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, RowState>;
  onRender: () => void;
  setIsResizing: (value: boolean) => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setCurrentPage: (page: number) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
  setColumnEditorOpen: (open: boolean) => void;
  getCollapsedRows: () => Map<string, number>;
  getExpandedRows: () => Map<string, number>;
  getRowStateMap: () => Map<string | number, RowState>;
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
    quickFilter: any;
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
      const selectionHeader = createSelectionHeader(customTheme.selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    if (containerWidth != null && containerWidth > 0) {
      return normalizeHeaderWidths(processedHeaders, { containerWidth });
    }
    return normalizeHeaderWidths(processedHeaders);
  }

  render(
    elements: {
      rootElement: HTMLElement;
      content: HTMLElement;
      contentWrapper: HTMLElement;
      headerContainer: HTMLElement;
      bodyContainer: HTMLElement;
      footerContainer: HTMLElement;
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

    let dimensionState = context.dimensionManager.getState();

    const fallbackContainerWidth =
      dimensionState.containerWidth ||
      context.mainBodyRef?.current?.clientWidth ||
      (context.mainBodyRef?.current?.parentElement?.clientWidth ?? 0);
    if (fallbackContainerWidth > 0 && dimensionState.containerWidth === 0) {
      dimensionState = { ...dimensionState, containerWidth: fallbackContainerWidth };
    }

    const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } = dimensionState;

    let effectiveHeaders = this.computeEffectiveHeaders(
      context.headers,
      context.config,
      context.customTheme,
      containerWidth,
    );

    if (context.config.autoExpandColumns && containerWidth > 0) {
      effectiveHeaders = applyAutoScaleToHeaders(effectiveHeaders, {
        autoExpandColumns: true,
        containerWidth,
        pinnedLeftWidth: 0,
        pinnedRightWidth: 0,
        mainBodyRef: context.mainBodyRef ?? { current: null },
        isResizing: context.isResizing ?? false,
      });
    }

    const { mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        collapsedHeaders: context.collapsedHeaders,
      });

    const mainSectionContainerWidth = containerWidth - leftWidth - rightWidth;

    elements.rootElement.style.cssText = `
      ${context.config.maxHeight ? `max-height: ${typeof context.config.maxHeight === "number" ? context.config.maxHeight + "px" : context.config.maxHeight};` : ""}
      ${context.config.height ? `height: ${typeof context.config.height === "number" ? context.config.height + "px" : context.config.height};` : ""}
      --st-main-section-width: ${mainSectionContainerWidth}px;
      --st-scrollbar-width: ${state.scrollbarWidth}px;
      --st-editor-width: ${context.config.editColumns ? COLUMN_EDIT_WIDTH : 0}px;
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
      let rowsToShow = context.config.shouldPaginate ? (context.config.rowsPerPage ?? 10) : 10;
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

    const canUseCache =
      this.flattenedRowsCache &&
      this.flattenedRowsCache.deps.rowsRef === effectiveRows &&
      this.flattenedRowsCache.deps.quickFilter === context.config.quickFilter &&
      this.flattenedRowsCache.deps.expandedRowsSize === context.expandedRows.size &&
      this.flattenedRowsCache.deps.collapsedRowsSize === context.collapsedRows.size &&
      this.flattenedRowsCache.deps.expandedDepthsSize === context.expandedDepths.size &&
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
          quickFilter: context.config.quickFilter,
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
      totalRowCount: context.config.totalRowCount ?? flattenResult.paginatableRows.length,
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
    this.renderBody(elements.bodyContainer, processedResult, effectiveHeaders, context);

    // Set up scroll synchronization after body is rendered
    this.setupScrollSync(context);

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

  private setupScrollSync(context: RenderContext): void {
    if (!context.scrollManager) return;

    const configs: ScrollSyncConfig[] = [];

    // Body → Header sync for pinned left section
    if (context.pinnedLeftRef.current) {
      configs.push({
        sourceElement: context.pinnedLeftRef.current,
        targetSelector: ".st-header-pinned-left",
      });
    }

    // Header → Body sync for pinned left section
    if (context.pinnedLeftHeaderRef.current) {
      configs.push({
        sourceElement: context.pinnedLeftHeaderRef.current,
        targetSelector: ".st-body-pinned-left",
      });
    }

    // Body → Header sync for main section
    if (context.mainBodyRef.current) {
      configs.push({
        sourceElement: context.mainBodyRef.current,
        targetSelector: ".st-header-main",
      });
    }

    // Header → Body sync for main section
    if (context.mainHeaderRef.current) {
      configs.push({
        sourceElement: context.mainHeaderRef.current,
        targetSelector: ".st-body-main",
      });
    }

    // Body → Header sync for pinned right section
    if (context.pinnedRightRef.current) {
      configs.push({
        sourceElement: context.pinnedRightRef.current,
        targetSelector: ".st-header-pinned-right",
      });
    }

    // Header → Body sync for pinned right section
    if (context.pinnedRightHeaderRef.current) {
      configs.push({
        sourceElement: context.pinnedRightHeaderRef.current,
        targetSelector: ".st-body-pinned-right",
      });
    }

    if (configs.length > 0) {
      context.scrollManager.setupScrollSync(configs);
    }
  }

  private buildRendererDeps(effectiveHeaders: HeaderObject[], context: RenderContext) {
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
      getExpandedRows: context.getExpandedRows,
      getRowStateMap: context.getRowStateMap,
    };
  }

  cleanup(): void {
    this.tableRenderer.cleanup();
  }
}
