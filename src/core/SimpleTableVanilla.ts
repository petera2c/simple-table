import { SimpleTableConfig } from "../types/SimpleTableConfig";
import { TableAPI } from "../types/TableAPI";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import TableRow from "../types/TableRow";
import SortColumn, { SortDirection } from "../types/SortColumn";
import { FilterCondition, TableFilterState } from "../types/FilterTypes";
import { ColumnVisibilityState } from "../types/ColumnVisibilityTypes";
import { CustomTheme, DEFAULT_CUSTOM_THEME } from "../types/CustomTheme";
import { DEFAULT_COLUMN_EDITOR_CONFIG } from "../types/ColumnEditorConfig";
import UpdateDataProps from "../types/UpdateCellProps";
import { SetHeaderRenameProps, ExportToCSVProps } from "../types/TableAPI";
import RowState from "../types/RowState";

import { TableStateManager } from "../managers/TableStateManager";
import { AutoScaleManager, applyAutoScaleToHeaders } from "../managers/AutoScaleManager";
import { DimensionManager } from "../managers/DimensionManager";
import { ScrollManager } from "../managers/ScrollManager";
import WindowResizeManager from "../hooks/windowResize";
import HandleOutsideClickManager from "../hooks/handleOutsideClick";
import ScrollbarVisibilityManager from "../hooks/scrollbarVisibility";
import ExpandedDepthsManager, { initializeExpandedDepths } from "../hooks/expandedDepths";
import AriaAnnouncementManager from "../hooks/ariaAnnouncements";

import { flattenRows } from "../utils/rowFlattening";
import { processRows } from "../utils/rowProcessing";
import { recalculateAllSectionWidths } from "../utils/resizeUtils";
import { calculateContentHeight } from "../hooks/contentHeight";
import { filterRowsWithQuickFilter } from "../hooks/useQuickFilter";
import { calculateAggregatedRows } from "../hooks/useAggregatedRows";
import { calculateScrollbarWidth } from "../hooks/scrollbarWidth";
import { generateRowId, rowIdToString } from "../utils/rowUtils";
import { createSelectionHeader } from "../utils/rowSelectionUtils";
import { checkDeprecatedProps } from "../utils/deprecatedPropsWarnings";
import { exportTableToCSV } from "../utils/csvExportUtils";
import { calculateColumnIndices } from "../utils/columnIndicesUtils";

import { createTableFooter } from "../utils/footer/createTableFooter";
import { createColumnEditor } from "../utils/columnEditor/createColumnEditor";
import {
  createHorizontalScrollbar,
  cleanupHorizontalScrollbar,
} from "../utils/horizontalScrollbarRenderer";
import {
  createAngleLeftIcon,
  createAngleRightIcon,
  createDescIcon,
  createAscIcon,
  createFilterIcon,
  createDragIcon,
} from "../icons";
import { COLUMN_EDIT_WIDTH } from "../consts/general-consts";

import "../styles/all-themes.css";

export class SimpleTableVanilla {
  private container: HTMLElement;
  private config: SimpleTableConfig;
  private customTheme: CustomTheme;
  private mergedColumnEditorConfig: any;
  private resolvedIcons: any;

  private rootElement: HTMLElement | null = null;
  private wrapperContainer: HTMLElement | null = null;
  private contentWrapper: HTMLElement | null = null;
  private headerContainer: HTMLElement | null = null;
  private bodyContainer: HTMLElement | null = null;
  private footerContainer: HTMLElement | null = null;
  private columnEditorContainer: HTMLElement | null = null;
  private ariaLiveRegion: HTMLElement | null = null;

  private mainBodyRef: { current: HTMLDivElement | null } = { current: null };
  private pinnedLeftRef: { current: HTMLDivElement | null } = { current: null };
  private pinnedRightRef: { current: HTMLDivElement | null } = { current: null };
  private headerContainerRef: { current: HTMLDivElement | null } = { current: null };
  private tableBodyContainerRef: { current: HTMLDivElement | null } = { current: null };
  private horizontalScrollbarRef: { current: HTMLElement | null } = { current: null };

  private draggedHeaderRef: { current: HeaderObject | null } = { current: null };
  private hoveredHeaderRef: { current: HeaderObject | null } = { current: null };

  private localRows: Row[] = [];
  private headers: HeaderObject[] = [];
  private effectiveHeaders: HeaderObject[] = [];
  private currentPage: number = 1;
  private scrollTop: number = 0;
  private scrollDirection: "up" | "down" | "none" = "none";
  private isResizing: boolean = false;
  private isScrolling: boolean = false;
  private internalIsLoading: boolean = false;
  private scrollbarWidth: number = 0;
  private isMainSectionScrollable: boolean = false;
  private columnEditorOpen: boolean = false;
  private activeHeaderDropdown: HeaderObject | null = null;
  private collapsedHeaders: Set<Accessor> = new Set();
  private expandedDepths: Set<number> = new Set();
  private expandedRows: Map<string, number> = new Map();
  private collapsedRows: Map<string, number> = new Map();
  private rowStateMap: Map<string | number, RowState> = new Map();
  private announcement: string = "";

  private cellRegistry: Map<string, any> = new Map();
  private headerRegistry: Map<string, any> = new Map();
  private rowIndexMap: Map<string | number, number> = new Map();

  private stateManager: TableStateManager | null = null;
  private autoScaleManager: AutoScaleManager | null = null;
  private dimensionManager: DimensionManager | null = null;
  private scrollManager: ScrollManager | null = null;
  private windowResizeManager: WindowResizeManager | null = null;
  private handleOutsideClickManager: HandleOutsideClickManager | null = null;
  private scrollbarVisibilityManager: ScrollbarVisibilityManager | null = null;
  private expandedDepthsManager: ExpandedDepthsManager | null = null;
  private ariaAnnouncementManager: AriaAnnouncementManager | null = null;

  private footerInstance: ReturnType<typeof createTableFooter> | null = null;
  private columnEditorInstance: ReturnType<typeof createColumnEditor> | null = null;

  private mounted: boolean = false;

  constructor(container: HTMLElement, config: SimpleTableConfig) {
    this.container = container;
    this.config = config;

    checkDeprecatedProps(config as any);

    this.customTheme = {
      ...DEFAULT_CUSTOM_THEME,
      ...config.customTheme,
    };

    this.mergedColumnEditorConfig = {
      text: config.columnEditorConfig?.text ?? config.columnEditorText ?? DEFAULT_COLUMN_EDITOR_CONFIG.text,
      searchEnabled: config.columnEditorConfig?.searchEnabled ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchEnabled,
      searchPlaceholder: config.columnEditorConfig?.searchPlaceholder ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchPlaceholder,
      searchFunction: config.columnEditorConfig?.searchFunction,
      rowRenderer: config.columnEditorConfig?.rowRenderer,
    };

    this.resolvedIcons = this.resolveIcons();

    this.localRows = [...config.rows];
    this.headers = [...config.defaultHeaders];
    this.columnEditorOpen = config.editColumnsInitOpen ?? false;
    this.internalIsLoading = config.isLoading ?? false;

    this.collapsedHeaders = this.getInitialCollapsedHeaders();
    this.expandedDepths = initializeExpandedDepths(
      config.expandAll ?? true,
      config.rowGrouping
    );

    this.rebuildRowIndexMap();
    this.initializeManagers();
  }

  private resolveIcons(): any {
    const defaultIcons = {
      drag: createDragIcon("st-drag-icon"),
      expand: createAngleRightIcon("st-expand-icon"),
      filter: createFilterIcon("st-header-icon"),
      headerCollapse: createAngleRightIcon("st-header-icon"),
      headerExpand: createAngleLeftIcon("st-header-icon"),
      next: createAngleRightIcon("st-next-prev-icon"),
      prev: createAngleLeftIcon("st-next-prev-icon"),
      sortDown: createDescIcon("st-header-icon"),
      sortUp: createAscIcon("st-header-icon"),
    };

    return {
      drag: this.config.icons?.drag ?? defaultIcons.drag,
      expand: this.config.icons?.expand ?? defaultIcons.expand,
      filter: this.config.icons?.filter ?? defaultIcons.filter,
      headerCollapse: this.config.icons?.headerCollapse ?? defaultIcons.headerCollapse,
      headerExpand: this.config.icons?.headerExpand ?? defaultIcons.headerExpand,
      next: this.config.icons?.next ?? defaultIcons.next,
      prev: this.config.icons?.prev ?? defaultIcons.prev,
      sortDown: this.config.icons?.sortDown ?? defaultIcons.sortDown,
      sortUp: this.config.icons?.sortUp ?? defaultIcons.sortUp,
    };
  }

  private getInitialCollapsedHeaders(): Set<Accessor> {
    const collapsed = new Set<Accessor>();
    const processHeaders = (hdrs: HeaderObject[]) => {
      hdrs.forEach((header) => {
        if (header.collapseDefault && header.collapsible) {
          collapsed.add(header.accessor);
        }
        if (header.children) {
          processHeaders(header.children);
        }
      });
    };
    processHeaders(this.config.defaultHeaders);
    return collapsed;
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

  private initializeManagers(): void {
    this.ariaAnnouncementManager = new AriaAnnouncementManager();
    this.ariaAnnouncementManager.subscribe((message) => {
      this.announcement = message;
      this.updateAriaLiveRegion();
    });

    this.expandedDepthsManager = new ExpandedDepthsManager(
      this.config.expandAll ?? true,
      this.config.rowGrouping
    );
    this.expandedDepthsManager.subscribe((depths) => {
      this.expandedDepths = depths;
      this.render();
    });
  }

  mount(): void {
    if (this.mounted) {
      console.warn("SimpleTableVanilla: Table is already mounted");
      return;
    }

    this.createDOMStructure();
    this.setupManagers();
    this.render();
    this.mounted = true;

    if (this.config.onGridReady) {
      this.config.onGridReady();
    }
  }

  private createDOMStructure(): void {
    const theme = this.config.theme ?? "modern-light";
    const className = this.config.className ?? "";
    const columnBorders = this.config.columnBorders ?? false;

    this.rootElement = document.createElement("div");
    this.rootElement.className = `simple-table-root st-wrapper theme-${theme} ${className} ${
      columnBorders ? "st-column-borders" : ""
    }`;
    this.rootElement.setAttribute("role", "grid");

    this.wrapperContainer = document.createElement("div");
    this.wrapperContainer.className = "st-wrapper-container";

    this.contentWrapper = document.createElement("div");
    this.contentWrapper.className = "st-content-wrapper";

    this.headerContainer = document.createElement("div");
    this.headerContainer.className = "st-header-container";
    this.headerContainerRef.current = this.headerContainer as HTMLDivElement;

    this.bodyContainer = document.createElement("div");
    this.bodyContainer.className = "st-body-container";
    this.tableBodyContainerRef.current = this.bodyContainer as HTMLDivElement;

    this.columnEditorContainer = document.createElement("div");
    this.columnEditorContainer.id = "st-column-editor-container";

    this.footerContainer = document.createElement("div");
    this.footerContainer.id = "st-footer-container";

    this.ariaLiveRegion = document.createElement("div");
    this.ariaLiveRegion.setAttribute("aria-live", "polite");
    this.ariaLiveRegion.setAttribute("aria-atomic", "true");
    this.ariaLiveRegion.className = "st-sr-only";

    this.contentWrapper.appendChild(this.headerContainer);
    this.contentWrapper.appendChild(this.bodyContainer);
    this.contentWrapper.appendChild(this.columnEditorContainer);

    this.wrapperContainer.appendChild(this.contentWrapper);
    this.wrapperContainer.appendChild(this.footerContainer);

    this.rootElement.appendChild(this.wrapperContainer);
    this.rootElement.appendChild(this.ariaLiveRegion);

    this.container.appendChild(this.rootElement);
  }

  private setupManagers(): void {
    if (!this.tableBodyContainerRef.current) return;

    this.scrollbarWidth = calculateScrollbarWidth(this.tableBodyContainerRef.current);

    this.dimensionManager = new DimensionManager({
      effectiveHeaders: this.effectiveHeaders,
      headerHeight: this.customTheme.headerHeight,
      rowHeight: this.customTheme.rowHeight,
      height: this.config.height,
      maxHeight: this.config.maxHeight,
      totalRowCount: this.localRows.length,
      footerHeight: this.config.shouldPaginate && !this.config.hideFooter ? this.customTheme.footerHeight : undefined,
      containerElement: this.tableBodyContainerRef.current,
    });

    this.dimensionManager.subscribe(() => {
      this.render();
    });

    this.scrollManager = new ScrollManager({
      onLoadMore: this.config.onLoadMore,
      infiniteScrollThreshold: 200,
    });

    this.scrollManager.subscribe(() => {
      this.render();
    });

    if (this.config.autoExpandColumns) {
      this.autoScaleManager = new AutoScaleManager(
        {
          autoExpandColumns: this.config.autoExpandColumns,
          containerWidth: this.dimensionManager.getState().containerWidth,
          pinnedLeftWidth: 0,
          pinnedRightWidth: 0,
          mainBodyRef: this.mainBodyRef,
          isResizing: this.isResizing,
        },
        () => {
          this.render();
        }
      );
    }

    if (this.headerContainerRef.current && this.tableBodyContainerRef.current) {
      this.scrollbarVisibilityManager = new ScrollbarVisibilityManager({
        headerContainer: this.headerContainerRef.current,
        mainSection: this.tableBodyContainerRef.current,
        scrollbarWidth: this.scrollbarWidth,
      });

      this.scrollbarVisibilityManager.subscribe((isScrollable) => {
        this.isMainSectionScrollable = isScrollable;
        this.render();
      });
    }

    this.windowResizeManager = new WindowResizeManager();
    this.windowResizeManager.addCallback(() => {
      if (this.tableBodyContainerRef.current) {
        const newScrollbarWidth = calculateScrollbarWidth(this.tableBodyContainerRef.current);
        this.scrollbarWidth = newScrollbarWidth;
        this.scrollbarVisibilityManager?.setScrollbarWidth(newScrollbarWidth);
      }
      this.render();
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.bodyContainer) return;

    this.bodyContainer.addEventListener("scroll", this.handleScroll.bind(this));
    this.bodyContainer.addEventListener("mouseleave", () => {
      this.clearHoveredRows();
    });
  }

  private handleScroll(e: Event): void {
    const element = e.currentTarget as HTMLDivElement;
    const newScrollTop = element.scrollTop;

    this.isScrolling = true;
    this.scrollTop = newScrollTop;

    const previousScrollTop = this.scrollTop;
    const direction: "up" | "down" | "none" =
      newScrollTop > previousScrollTop
        ? "down"
        : newScrollTop < previousScrollTop
        ? "up"
        : "none";

    this.scrollDirection = direction;

    setTimeout(() => {
      this.isScrolling = false;
      this.render();
    }, 150);

    this.render();
  }

  private clearHoveredRows(): void {
    document.querySelectorAll(".st-row.hovered").forEach((el) => {
      el.classList.remove("hovered");
    });
  }

  private updateAriaLiveRegion(): void {
    if (this.ariaLiveRegion) {
      this.ariaLiveRegion.textContent = this.announcement;
    }
  }

  private getAllRowsInternal(): TableRow[] {
    const flattenResult = flattenRows({
      rows: this.localRows,
      rowGrouping: this.config.rowGrouping,
      getRowId: this.config.getRowId,
      expandedRows: this.expandedRows,
      collapsedRows: this.collapsedRows,
      expandedDepths: this.expandedDepths,
      rowStateMap: this.rowStateMap,
      hasLoadingRenderer: Boolean(this.config.loadingStateRenderer),
      hasErrorRenderer: Boolean(this.config.errorStateRenderer),
      hasEmptyRenderer: Boolean(this.config.emptyStateRenderer),
      headers: this.effectiveHeaders,
      rowHeight: this.customTheme.rowHeight,
      headerHeight: this.customTheme.headerHeight,
      customTheme: this.customTheme,
    });
    return flattenResult.flattenedRows;
  }

  private computeEffectiveHeaders(): HeaderObject[] {
    let processedHeaders = [...this.headers];

    if (
      this.config.enableRowSelection &&
      !this.headers?.[0]?.isSelectionColumn
    ) {
      const selectionHeader = createSelectionHeader(this.customTheme.selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    return processedHeaders;
  }

  private render(): void {
    if (!this.mounted || !this.rootElement) return;

    this.effectiveHeaders = this.computeEffectiveHeaders();

    const dimensionState = this.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: this.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };

    const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } = dimensionState;

    const {
      mainWidth,
      leftWidth,
      rightWidth,
      leftContentWidth,
      rightContentWidth,
    } = recalculateAllSectionWidths({
      headers: this.effectiveHeaders,
      containerWidth,
      collapsedHeaders: this.collapsedHeaders,
    });

    const mainSectionContainerWidth = containerWidth - leftWidth - rightWidth;

    this.rootElement.style.cssText = `
      ${this.config.maxHeight ? `max-height: ${typeof this.config.maxHeight === "number" ? this.config.maxHeight + "px" : this.config.maxHeight};` : ""}
      ${this.config.height ? `height: ${typeof this.config.height === "number" ? this.config.height + "px" : this.config.height};` : ""}
      --st-main-section-width: ${mainSectionContainerWidth}px;
      --st-scrollbar-width: ${this.scrollbarWidth}px;
      --st-editor-width: ${this.config.editColumns ? COLUMN_EDIT_WIDTH : 0}px;
    `;

    let effectiveRows = this.localRows;
    if (this.internalIsLoading && this.localRows.length === 0) {
      let rowsToShow = this.config.shouldPaginate ? (this.config.rowsPerPage ?? 10) : 10;
      if (this.isMainSectionScrollable) {
        rowsToShow += 1;
      }
      effectiveRows = Array.from({ length: rowsToShow }, () => ({}));
    }

    const aggregatedRows = calculateAggregatedRows({
      rows: effectiveRows,
      headers: this.headers,
      rowGrouping: this.config.rowGrouping,
    });

    const quickFilteredRows = filterRowsWithQuickFilter({
      rows: aggregatedRows,
      headers: this.effectiveHeaders,
      quickFilter: this.config.quickFilter,
    });

    const flattenResult = flattenRows({
      rows: quickFilteredRows,
      rowGrouping: this.config.rowGrouping,
      getRowId: this.config.getRowId,
      expandedRows: this.expandedRows,
      collapsedRows: this.collapsedRows,
      expandedDepths: this.expandedDepths,
      rowStateMap: this.rowStateMap,
      hasLoadingRenderer: Boolean(this.config.loadingStateRenderer),
      hasErrorRenderer: Boolean(this.config.errorStateRenderer),
      hasEmptyRenderer: Boolean(this.config.emptyStateRenderer),
      headers: this.effectiveHeaders,
      rowHeight: this.customTheme.rowHeight,
      headerHeight: this.customTheme.headerHeight,
      customTheme: this.customTheme,
    });

    const contentHeight = calculateContentHeight({
      height: this.config.height,
      maxHeight: this.config.maxHeight,
      rowHeight: this.customTheme.rowHeight,
      shouldPaginate: this.config.shouldPaginate ?? false,
      rowsPerPage: this.config.rowsPerPage ?? 10,
      totalRowCount: this.config.totalRowCount ?? flattenResult.paginatableRows.length,
      headerHeight: calculatedHeaderHeight,
      footerHeight:
        this.config.shouldPaginate && !this.config.hideFooter
          ? this.customTheme.footerHeight
          : undefined,
    });

    const processedResult = processRows({
      flattenedRows: flattenResult.flattenedRows,
      paginatableRows: flattenResult.paginatableRows,
      parentEndPositions: flattenResult.parentEndPositions,
      currentPage: this.currentPage,
      rowsPerPage: this.config.rowsPerPage ?? 10,
      shouldPaginate: this.config.shouldPaginate ?? false,
      serverSidePagination: this.config.serverSidePagination ?? false,
      contentHeight,
      rowHeight: this.customTheme.rowHeight,
      scrollTop: this.scrollTop,
      scrollDirection: this.scrollDirection,
      heightOffsets: flattenResult.heightOffsets,
      customTheme: this.customTheme,
      enableStickyParents: this.config.enableStickyParents ?? false,
      rowGrouping: this.config.rowGrouping,
    });

    this.renderHeader(calculatedHeaderHeight, maxHeaderDepth);
    this.renderBody(processedResult);
    this.renderFooter(flattenResult.paginatableRows.length);
    this.renderColumnEditor();
    this.renderHorizontalScrollbar(mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth);
  }

  private renderHeader(calculatedHeaderHeight: number, maxHeaderDepth: number): void {
    if (!this.headerContainer || this.config.hideHeader) return;

    this.headerContainer.style.height = `${calculatedHeaderHeight}px`;
    this.headerContainer.innerHTML = `
      <div>Header rendering placeholder - implement with headerCellRenderer utility</div>
    `;
  }

  private renderBody(processedResult: any): void {
    if (!this.bodyContainer) return;

    const shouldShowEmptyState = !this.internalIsLoading && processedResult.currentTableRows.length === 0;

    if (shouldShowEmptyState) {
      this.bodyContainer.innerHTML = "";
      const emptyWrapper = document.createElement("div");
      emptyWrapper.className = "st-empty-state-wrapper";
      
      if (typeof this.config.tableEmptyStateRenderer === "string") {
        emptyWrapper.textContent = this.config.tableEmptyStateRenderer;
      } else if (this.config.tableEmptyStateRenderer instanceof HTMLElement) {
        emptyWrapper.appendChild(this.config.tableEmptyStateRenderer.cloneNode(true));
      } else {
        emptyWrapper.innerHTML = "<div class='st-empty-state'>No rows to display</div>";
      }
      
      this.bodyContainer.appendChild(emptyWrapper);
      return;
    }

    this.bodyContainer.innerHTML = `
      <div>Body rendering placeholder - implement with bodyCellRenderer utility</div>
    `;
  }

  private renderFooter(totalRows: number): void {
    if (!this.footerContainer) return;

    if (this.config.hideFooter || !this.config.shouldPaginate) {
      this.footerContainer.innerHTML = "";
      return;
    }

    const totalPages = Math.ceil(totalRows / (this.config.rowsPerPage ?? 10));

    if (this.footerInstance) {
      this.footerInstance.update({
        currentPage: this.currentPage,
        hideFooter: this.config.hideFooter ?? false,
        onPageChange: (page: number) => {
          this.currentPage = page;
          this.render();
        },
        onNextPage: this.config.onNextPage,
        onUserPageChange: this.config.onPageChange,
        rowsPerPage: this.config.rowsPerPage ?? 10,
        shouldPaginate: this.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
      });
    } else {
      this.footerContainer.innerHTML = "";
      const footer = createTableFooter({
        currentPage: this.currentPage,
        hideFooter: this.config.hideFooter ?? false,
        onPageChange: (page: number) => {
          this.currentPage = page;
          this.render();
        },
        onNextPage: this.config.onNextPage,
        onUserPageChange: this.config.onPageChange,
        rowsPerPage: this.config.rowsPerPage ?? 10,
        shouldPaginate: this.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
      });
      this.footerInstance = footer;
      this.footerContainer.appendChild(footer.element);
    }
  }

  private renderColumnEditor(): void {
    if (!this.columnEditorContainer) return;

    if (!this.config.editColumns) {
      this.columnEditorContainer.innerHTML = "";
      return;
    }

    if (this.columnEditorInstance) {
      this.columnEditorInstance.update({
        columnEditorText: this.mergedColumnEditorConfig.text,
        editColumns: this.config.editColumns,
        headers: this.headers,
        open: this.columnEditorOpen,
        searchEnabled: this.mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: this.mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: this.mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: this.mergedColumnEditorConfig,
        contextHeaders: this.headers,
        setHeaders: (newHeaders: HeaderObject[]) => {
          this.headers = newHeaders;
          this.render();
        },
        onColumnVisibilityChange: this.config.onColumnVisibilityChange,
        onColumnOrderChange: this.config.onColumnOrderChange,
        setOpen: (open: boolean) => {
          this.columnEditorOpen = open;
          this.render();
        },
      });
    } else {
      this.columnEditorContainer.innerHTML = "";
      const columnEditor = createColumnEditor({
        columnEditorText: this.mergedColumnEditorConfig.text,
        editColumns: this.config.editColumns,
        headers: this.headers,
        open: this.columnEditorOpen,
        searchEnabled: this.mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: this.mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: this.mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: this.mergedColumnEditorConfig,
        contextHeaders: this.headers,
        setHeaders: (newHeaders: HeaderObject[]) => {
          this.headers = newHeaders;
          this.render();
        },
        onColumnVisibilityChange: this.config.onColumnVisibilityChange,
        onColumnOrderChange: this.config.onColumnOrderChange,
        setOpen: (open: boolean) => {
          this.columnEditorOpen = open;
          this.render();
        },
      });
      this.columnEditorInstance = columnEditor;
      this.columnEditorContainer.appendChild(columnEditor.element);
    }
  }

  private renderHorizontalScrollbar(
    mainBodyWidth: number,
    pinnedLeftWidth: number,
    pinnedRightWidth: number,
    pinnedLeftContentWidth: number,
    pinnedRightContentWidth: number
  ): void {
    if (!this.wrapperContainer || !this.mainBodyRef.current || !this.tableBodyContainerRef.current) {
      return;
    }

    if (this.horizontalScrollbarRef.current) {
      cleanupHorizontalScrollbar(this.horizontalScrollbarRef.current);
      this.horizontalScrollbarRef.current = null;
    }

    setTimeout(() => {
      if (!this.mainBodyRef.current || !this.tableBodyContainerRef.current || !this.wrapperContainer) {
        return;
      }

      const scrollbar = createHorizontalScrollbar({
        mainBodyRef: this.mainBodyRef.current,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef: this.tableBodyContainerRef.current,
        editColumns: this.config.editColumns ?? false,
      });

      if (scrollbar) {
        const contentWrapper = this.wrapperContainer.querySelector(".st-content-wrapper");
        if (contentWrapper && contentWrapper.nextSibling) {
          this.wrapperContainer.insertBefore(scrollbar, contentWrapper.nextSibling);
        } else {
          this.wrapperContainer.appendChild(scrollbar);
        }
        this.horizontalScrollbarRef.current = scrollbar;
      }
    }, 1);
  }

  update(config: Partial<SimpleTableConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.rows !== undefined) {
      this.localRows = [...config.rows];
      this.rebuildRowIndexMap();
    }

    if (config.defaultHeaders !== undefined) {
      this.headers = [...config.defaultHeaders];
    }

    if (config.isLoading !== undefined) {
      this.internalIsLoading = config.isLoading;
    }

    if (config.customTheme !== undefined) {
      this.customTheme = {
        ...DEFAULT_CUSTOM_THEME,
        ...config.customTheme,
      };
    }

    this.render();
  }

  destroy(): void {
    this.mounted = false;

    this.dimensionManager?.destroy();
    this.scrollManager?.destroy();
    this.autoScaleManager?.destroy();
    this.windowResizeManager?.destroy();
    this.handleOutsideClickManager?.destroy();
    this.scrollbarVisibilityManager?.destroy();
    this.expandedDepthsManager?.destroy();
    this.ariaAnnouncementManager?.destroy();

    this.footerInstance?.destroy();
    this.columnEditorInstance?.destroy();

    if (this.horizontalScrollbarRef.current) {
      cleanupHorizontalScrollbar(this.horizontalScrollbarRef.current);
    }

    if (this.rootElement && this.container.contains(this.rootElement)) {
      this.container.removeChild(this.rootElement);
    }

    this.rootElement = null;
    this.wrapperContainer = null;
    this.contentWrapper = null;
    this.headerContainer = null;
    this.bodyContainer = null;
    this.footerContainer = null;
    this.columnEditorContainer = null;
    this.ariaLiveRegion = null;
  }

  getAPI(): TableAPI {
    return {
      updateData: (props: UpdateDataProps) => {
        const { rowIndex, accessor, newValue } = props;
        if (rowIndex >= 0 && rowIndex < this.localRows.length) {
          (this.localRows[rowIndex] as any)[accessor] = newValue;
          this.render();
        }
      },

      setHeaderRename: (props: SetHeaderRenameProps) => {
        const headerRegistry = this.headerRegistry.get(props.accessor as string);
        if (headerRegistry) {
          headerRegistry.setEditing(true);
        }
      },

      getVisibleRows: (): TableRow[] => {
        return [];
      },

      getAllRows: (): TableRow[] => {
        return this.getAllRowsInternal();
      },

      getHeaders: (): HeaderObject[] => {
        return this.effectiveHeaders;
      },

      exportToCSV: (props?: ExportToCSVProps) => {
        const flattenResult = flattenRows({
          rows: this.localRows,
          rowGrouping: this.config.rowGrouping,
          getRowId: this.config.getRowId,
          expandedRows: this.expandedRows,
          collapsedRows: this.collapsedRows,
          expandedDepths: this.expandedDepths,
          rowStateMap: this.rowStateMap,
          hasLoadingRenderer: Boolean(this.config.loadingStateRenderer),
          hasErrorRenderer: Boolean(this.config.errorStateRenderer),
          hasEmptyRenderer: Boolean(this.config.emptyStateRenderer),
          headers: this.effectiveHeaders,
          rowHeight: this.customTheme.rowHeight,
          headerHeight: this.customTheme.headerHeight,
          customTheme: this.customTheme,
        });
        exportTableToCSV(
          flattenResult.flattenedRows,
          this.effectiveHeaders,
          props?.filename,
          this.config.includeHeadersInCSVExport ?? true
        );
      },

      getSortState: (): SortColumn | null => {
        return null;
      },

      applySortState: async (props?: { accessor: Accessor; direction?: SortDirection }) => {
      },

      getFilterState: (): TableFilterState => {
        return {};
      },

      applyFilter: async (filter: FilterCondition) => {
      },

      clearFilter: async (accessor: Accessor) => {
      },

      clearAllFilters: async () => {
      },

      getCurrentPage: (): number => {
        return this.currentPage;
      },

      getTotalPages: (): number => {
        const flattenResult = flattenRows({
          rows: this.localRows,
          rowGrouping: this.config.rowGrouping,
          getRowId: this.config.getRowId,
          expandedRows: this.expandedRows,
          collapsedRows: this.collapsedRows,
          expandedDepths: this.expandedDepths,
          rowStateMap: this.rowStateMap,
          hasLoadingRenderer: Boolean(this.config.loadingStateRenderer),
          hasErrorRenderer: Boolean(this.config.errorStateRenderer),
          hasEmptyRenderer: Boolean(this.config.emptyStateRenderer),
          headers: this.effectiveHeaders,
          rowHeight: this.customTheme.rowHeight,
          headerHeight: this.customTheme.headerHeight,
          customTheme: this.customTheme,
        });
        return Math.ceil(flattenResult.paginatableRows.length / (this.config.rowsPerPage ?? 10));
      },

      setPage: async (page: number) => {
        this.currentPage = page;
        this.render();
        if (this.config.onPageChange) {
          await this.config.onPageChange(page);
        }
      },

      expandAll: () => {
        this.expandedDepthsManager?.expandAll();
      },

      collapseAll: () => {
        this.expandedDepthsManager?.collapseAll();
      },

      expandDepth: (depth: number) => {
        this.expandedDepthsManager?.expandDepth(depth);
      },

      collapseDepth: (depth: number) => {
        this.expandedDepthsManager?.collapseDepth(depth);
      },

      toggleDepth: (depth: number) => {
        this.expandedDepthsManager?.toggleDepth(depth);
      },

      setExpandedDepths: (depths: Set<number>) => {
        this.expandedDepths = depths;
        this.render();
      },

      getExpandedDepths: (): Set<number> => {
        return this.expandedDepths;
      },

      getGroupingProperty: (depth: number): Accessor | undefined => {
        return this.config.rowGrouping?.[depth];
      },

      getGroupingDepth: (property: Accessor): number => {
        return this.config.rowGrouping?.indexOf(property) ?? -1;
      },

      toggleColumnEditor: (open?: boolean) => {
        this.columnEditorOpen = open !== undefined ? open : !this.columnEditorOpen;
        this.render();
      },

      applyColumnVisibility: async (visibility: { [accessor: string]: boolean }) => {
        const updatedHeaders = this.headers.map((header) => {
          const accessor = header.accessor as string;
          if (accessor in visibility) {
            return { ...header, hide: !visibility[accessor] };
          }
          return header;
        });
        this.headers = updatedHeaders;
        this.render();
        if (this.config.onColumnVisibilityChange) {
          const visibilityState: ColumnVisibilityState = {};
          Object.entries(visibility).forEach(([accessor, visible]) => {
            visibilityState[accessor] = visible;
          });
          this.config.onColumnVisibilityChange(visibilityState);
        }
      },

      setQuickFilter: (text: string) => {
        if (this.config.quickFilter?.onChange) {
          this.config.quickFilter.onChange(text);
        }
      },
    };
  }
}
