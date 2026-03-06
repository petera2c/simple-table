import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import Row from "../../types/Row";
import RowState from "../../types/RowState";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import { TableRenderer } from "./TableRenderer";
import { flattenRows } from "../../utils/rowFlattening";
import { processRows } from "../../utils/rowProcessing";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { calculateContentHeight } from "../../hooks/contentHeight";
import { filterRowsWithQuickFilter } from "../../hooks/useQuickFilter";
import { calculateAggregatedRows } from "../../hooks/useAggregatedRows";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
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
  dimensionManager: DimensionManager | null;
  scrollManager: ScrollManager | null;
  rowStateMap: Map<string | number, RowState>;
  onRender: () => void;
  setIsResizing: (value: boolean) => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
}

export interface RenderState {
  currentPage: number;
  scrollTop: number;
  scrollDirection: "up" | "down" | "none";
  scrollbarWidth: number;
  isMainSectionScrollable: boolean;
  columnEditorOpen: boolean;
}

export class RenderOrchestrator {
  private tableRenderer: TableRenderer;

  constructor() {
    this.tableRenderer = new TableRenderer();
  }

  computeEffectiveHeaders(
    headers: HeaderObject[],
    config: SimpleTableConfig,
    customTheme: CustomTheme,
  ): HeaderObject[] {
    let processedHeaders = [...headers];

    if (config.enableRowSelection && !headers?.[0]?.isSelectionColumn) {
      const selectionHeader = createSelectionHeader(customTheme.selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    return processedHeaders;
  }

  render(
    elements: {
      rootElement: HTMLElement;
      content: HTMLElement;
      headerContainer: HTMLElement;
      bodyContainer: HTMLElement;
      footerContainer: HTMLElement;
      columnEditorContainer: HTMLElement;
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
    const effectiveHeaders = this.computeEffectiveHeaders(
      context.headers,
      context.config,
      context.customTheme,
    );

    const dimensionState = context.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: context.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };

    const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } = dimensionState;

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
    if (context.internalIsLoading && context.localRows.length === 0) {
      let rowsToShow = context.config.shouldPaginate ? (context.config.rowsPerPage ?? 10) : 10;
      if (state.isMainSectionScrollable) {
        rowsToShow += 1;
      }
      effectiveRows = Array.from({ length: rowsToShow }, () => ({}));
    }

    const aggregatedRows = calculateAggregatedRows({
      rows: effectiveRows,
      headers: context.headers,
      rowGrouping: context.config.rowGrouping,
    });

    const quickFilteredRows = filterRowsWithQuickFilter({
      rows: aggregatedRows,
      headers: effectiveHeaders,
      quickFilter: context.config.quickFilter,
    });

    const flattenResult = flattenRows({
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
      flattenResult.paginatableRows.length,
      state.currentPage,
      effectiveHeaders,
      context,
    );
    this.renderColumnEditor(
      elements.columnEditorContainer,
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
        context.onRender();
      },
      deps,
    );
  }

  private renderColumnEditor(
    columnEditorContainer: HTMLElement,
    columnEditorOpen: boolean,
    mergedColumnEditorConfig: MergedColumnEditorConfig,
    effectiveHeaders: HeaderObject[],
    context: RenderContext,
  ): void {
    const deps = this.buildRendererDeps(effectiveHeaders, context);
    this.tableRenderer.renderColumnEditor(
      columnEditorContainer,
      columnEditorOpen,
      (open: boolean) => {
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

    const configs = [];

    // Set up scroll sync for pinned left section
    if (context.pinnedLeftRef.current) {
      configs.push({
        sourceElement: context.pinnedLeftRef.current,
        targetSelector: ".st-header-pinned-left",
      });
    }

    // Set up scroll sync for main section
    if (context.mainBodyRef.current) {
      configs.push({
        sourceElement: context.mainBodyRef.current,
        targetSelector: ".st-header-main",
      });
    }

    // Set up scroll sync for pinned right section
    if (context.pinnedRightRef.current) {
      configs.push({
        sourceElement: context.pinnedRightRef.current,
        targetSelector: ".st-header-pinned-right",
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
      dimensionManager: context.dimensionManager,
      rowStateMap: context.rowStateMap,
      onRender: context.onRender,
      setIsResizing: context.setIsResizing,
      setHeaders: context.setHeaders,
      setCollapsedHeaders: context.setCollapsedHeaders,
      setCollapsedRows: context.setCollapsedRows,
      setExpandedRows: context.setExpandedRows,
      setRowStateMap: context.setRowStateMap,
    };
  }

  cleanup(): void {
    this.tableRenderer.cleanup();
  }
}
