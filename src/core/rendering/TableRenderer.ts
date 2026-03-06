import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import { FilterCondition } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { SectionRenderer } from "./SectionRenderer";
import { HeaderRenderContext } from "../../utils/headerCellRenderer";
import { CellRenderContext } from "../../utils/bodyCellRenderer";
import { createTableFooter } from "../../utils/footer/createTableFooter";
import { createColumnEditor } from "../../utils/columnEditor/createColumnEditor";
import {
  createHorizontalScrollbar,
  cleanupHorizontalScrollbar,
} from "../../utils/horizontalScrollbarRenderer";
import { DimensionManager } from "../../managers/DimensionManager";

export interface TableRendererDeps {
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  resolvedIcons: any;
  effectiveHeaders: HeaderObject[];
  headers: HeaderObject[];
  localRows: any[];
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
  rowStateMap: Map<string | number, any>;
  onRender: () => void;
  setIsResizing: (value: boolean) => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
}

export class TableRenderer {
  private sectionRenderer: SectionRenderer;
  private footerInstance: ReturnType<typeof createTableFooter> | null = null;
  private columnEditorInstance: ReturnType<typeof createColumnEditor> | null = null;
  private horizontalScrollbarRef: { current: HTMLElement | null } = { current: null };
  private scrollbarTimeoutId: number | null = null;

  constructor() {
    this.sectionRenderer = new SectionRenderer();
  }

  renderHeader(
    container: HTMLElement,
    calculatedHeaderHeight: number,
    maxHeaderDepth: number,
    deps: TableRendererDeps,
  ): void {
    if (!container || deps.config.hideHeader) return;

    container.style.height = `${calculatedHeaderHeight}px`;

    const dimensionState = deps.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: deps.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };

    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: deps.effectiveHeaders,
      containerWidth: dimensionState.containerWidth,
      collapsedHeaders: deps.collapsedHeaders,
    });

    container.style.width = `${leftWidth + mainWidth + rightWidth}px`;

    const headerContext: HeaderRenderContext = {
      collapsedHeaders: deps.collapsedHeaders,
      columnBorders: deps.config.columnBorders ?? false,
      columnReordering: deps.config.columnReordering ?? false,
      columnResizing: deps.config.columnResizing ?? false,
      containerWidth: dimensionState.containerWidth,
      enableHeaderEditing: deps.config.enableHeaderEditing,
      enableRowSelection: deps.config.enableRowSelection,
      filters: {},
      icons: deps.resolvedIcons,
      selectedColumns: new Set(),
      columnsWithSelectedCells: new Set(),
      sort: null,
      autoExpandColumns: deps.config.autoExpandColumns,
      selectableColumns: deps.config.selectableColumns,
      headers: deps.effectiveHeaders,
      rows: deps.localRows,
      headerHeight: deps.customTheme.headerHeight,
      lastHeaderIndex: deps.effectiveHeaders.length - 1,
      onSort: (accessor: Accessor) => {},
      handleApplyFilter: (filter: FilterCondition) => {},
      handleClearFilter: (accessor: Accessor) => {},
      handleSelectAll: (checked: boolean) => {},
      setCollapsedHeaders: (value: any) => {
        if (typeof value === "function") {
          deps.setCollapsedHeaders(value(deps.collapsedHeaders));
        } else {
          deps.setCollapsedHeaders(value);
        }
        deps.onRender();
      },
      setHeaders: (value: any) => {
        if (typeof value === "function") {
          deps.setHeaders(value(deps.headers));
        } else {
          deps.setHeaders(value);
        }
        deps.onRender();
      },
      setIsResizing: (value: any) => {
        deps.setIsResizing(typeof value === "function" ? value(deps.isResizing) : value);
      },
      onColumnWidthChange: deps.config.onColumnWidthChange,
      onColumnOrderChange: deps.config.onColumnOrderChange,
      onTableHeaderDragEnd: (headers: HeaderObject[]) => {
        deps.setHeaders(headers);
        deps.onRender();
      },
      onHeaderEdit: deps.config.onHeaderEdit,
      onColumnSelect: deps.config.onColumnSelect,
      selectColumns: (columnIndices: number[]) => {},
      setSelectedColumns: (value: any) => {},
      setSelectedCells: (value: any) => {},
      setInitialFocusedCell: (cell: any) => {},
      areAllRowsSelected: () => false,
      draggedHeaderRef: deps.draggedHeaderRef,
      hoveredHeaderRef: deps.hoveredHeaderRef,
      headerRegistry: deps.headerRegistry,
      forceUpdate: () => deps.onRender(),
      mainBodyRef: deps.mainBodyRef,
      pinnedLeftRef: deps.pinnedLeftRef,
      pinnedRightRef: deps.pinnedRightRef,
    };

    const pinnedLeftHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "left");
    const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
    const pinnedRightHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "right");

    // Track which sections should exist (like React's component list)
    const sectionsToKeep: HTMLElement[] = [];

    if (pinnedLeftHeaders.length > 0) {
      const leftSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        pinned: "left",
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
        sectionWidth: leftWidth,
      });
      sectionsToKeep.push(leftSection);
      if (!container.contains(leftSection)) {
        container.appendChild(leftSection);
      }
    }

    if (mainHeaders.length > 0) {
      const mainSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
      });
      sectionsToKeep.push(mainSection);
      if (!container.contains(mainSection)) {
        container.appendChild(mainSection);
      }
    }

    if (pinnedRightHeaders.length > 0) {
      const rightSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        pinned: "right",
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
        sectionWidth: rightWidth,
      });
      sectionsToKeep.push(rightSection);
      if (!container.contains(rightSection)) {
        container.appendChild(rightSection);
      }
    }

    // Remove any orphaned sections (like React unmounting components)
    Array.from(container.children).forEach((child) => {
      if (!sectionsToKeep.includes(child as HTMLElement)) {
        child.remove();
      }
    });
  }

  renderBody(container: HTMLElement, processedResult: any, deps: TableRendererDeps): void {
    if (!container) return;

    const rowsToRender = processedResult.rowsToRender || processedResult.currentTableRows;
    const shouldShowEmptyState =
      !deps.internalIsLoading && processedResult.currentTableRows.length === 0;

    if (shouldShowEmptyState) {
      container.innerHTML = "";
      const emptyWrapper = document.createElement("div");
      emptyWrapper.className = "st-empty-state-wrapper";

      if (typeof deps.config.tableEmptyStateRenderer === "string") {
        emptyWrapper.textContent = deps.config.tableEmptyStateRenderer;
      } else if (deps.config.tableEmptyStateRenderer instanceof HTMLElement) {
        emptyWrapper.appendChild(deps.config.tableEmptyStateRenderer.cloneNode(true));
      } else {
        emptyWrapper.innerHTML = "<div class='st-empty-state'>No rows to display</div>";
      }

      container.appendChild(emptyWrapper);
      return;
    }

    const dimensionState = deps.dimensionManager?.getState() ?? {
      containerWidth: 0,
      calculatedHeaderHeight: deps.customTheme.headerHeight,
      maxHeaderDepth: 1,
    };

    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: deps.effectiveHeaders,
      containerWidth: dimensionState.containerWidth,
      collapsedHeaders: deps.collapsedHeaders,
    });

    const bodyContext: CellRenderContext = {
      collapsedHeaders: deps.collapsedHeaders,
      collapsedRows: deps.collapsedRows,
      expandedRows: deps.expandedRows,
      expandedDepths: Array.from(deps.expandedDepths),
      selectedColumns: new Set(),
      rowsWithSelectedCells: new Set(),
      columnBorders: deps.config.columnBorders ?? false,
      enableRowSelection: deps.config.enableRowSelection,
      cellUpdateFlash: deps.config.cellUpdateFlash,
      useOddColumnBackground: deps.config.useOddColumnBackground,
      useHoverRowBackground: deps.config.useHoverRowBackground,
      useOddEvenRowBackground: deps.config.useOddEvenRowBackground,
      rowGrouping: deps.config.rowGrouping,
      headers: deps.effectiveHeaders,
      rowHeight: deps.customTheme.rowHeight,
      templateColumns: "",
      heightOffsets: processedResult.heightOffsets,
      customTheme: deps.customTheme,
      containerWidth: dimensionState.containerWidth,
      onCellEdit: deps.config.onCellEdit,
      onCellClick: deps.config.onCellClick,
      onRowGroupExpand: deps.config.onRowGroupExpand,
      handleRowSelect: (rowId: string, checked: boolean) => {},
      handleMouseDown: (cell: any) => {},
      handleMouseOver: (cell: any) => {},
      cellRegistry: deps.cellRegistry,
      setCollapsedRows: (value: any) => {
        if (typeof value === "function") {
          deps.setCollapsedRows(value(deps.collapsedRows));
        } else {
          deps.setCollapsedRows(value);
        }
        deps.onRender();
      },
      setExpandedRows: (value: any) => {
        if (typeof value === "function") {
          deps.setExpandedRows(value(deps.expandedRows));
        } else {
          deps.setExpandedRows(value);
        }
        deps.onRender();
      },
      setRowStateMap: (value: any) => {
        if (typeof value === "function") {
          deps.setRowStateMap(value(deps.rowStateMap));
        } else {
          deps.setRowStateMap(value);
        }
        deps.onRender();
      },
      icons: deps.resolvedIcons,
      theme: deps.config.theme ?? "modern-light",
      rowButtons: deps.config.rowButtons,
      getBorderClass: (cell: any) => "",
      isSelected: (cell: any) => false,
      isInitialFocusedCell: (cell: any) => false,
      isCopyFlashing: (cell: any) => false,
      isWarningFlashing: (cell: any) => false,
      isRowSelected: (rowId: string) => false,
      canExpandRowGroup: deps.config.canExpandRowGroup,
      isLoading: deps.internalIsLoading,
    };

    const pinnedLeftHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "left");
    const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
    const pinnedRightHeaders = deps.effectiveHeaders.filter((h) => h.pinned === "right");

    // Track which sections should exist (like React's component list)
    const sectionsToKeep: HTMLElement[] = [];

    if (pinnedLeftHeaders.length > 0) {
      const leftSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        pinned: "left",
        context: bodyContext,
        sectionWidth: leftWidth,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.heightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
      });
      sectionsToKeep.push(leftSection);
      if (!container.contains(leftSection)) {
        container.appendChild(leftSection);
      }
    }

    if (mainHeaders.length > 0) {
      const mainSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        context: bodyContext,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.heightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
      });
      deps.mainBodyRef.current = mainSection as HTMLDivElement;
      sectionsToKeep.push(mainSection);
      if (!container.contains(mainSection)) {
        container.appendChild(mainSection);
      }
    }

    if (pinnedRightHeaders.length > 0) {
      const rightSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        autoExpandColumns: deps.config.autoExpandColumns,
        pinned: "right",
        context: bodyContext,
        sectionWidth: rightWidth,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.heightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
      });
      sectionsToKeep.push(rightSection);
      if (!container.contains(rightSection)) {
        container.appendChild(rightSection);
      }
    }

    // Remove any orphaned sections (like React unmounting components)
    Array.from(container.children).forEach((child) => {
      if (!sectionsToKeep.includes(child as HTMLElement)) {
        child.remove();
      }
    });
  }

  renderFooter(
    container: HTMLElement,
    totalRows: number,
    currentPage: number,
    onPageChange: (page: number) => void,
    deps: TableRendererDeps,
  ): void {
    if (!container) return;

    if (deps.config.hideFooter || !deps.config.shouldPaginate) {
      container.innerHTML = "";
      return;
    }

    const totalPages = Math.ceil(totalRows / (deps.config.rowsPerPage ?? 10));

    if (this.footerInstance) {
      this.footerInstance.update({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage: deps.config.rowsPerPage ?? 10,
        shouldPaginate: deps.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
      });
    } else {
      container.innerHTML = "";
      const footer = createTableFooter({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage: deps.config.rowsPerPage ?? 10,
        shouldPaginate: deps.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
      });
      this.footerInstance = footer;
      container.appendChild(footer.element);
    }
  }

  renderColumnEditor(
    container: HTMLElement,
    columnEditorOpen: boolean,
    setColumnEditorOpen: (open: boolean) => void,
    mergedColumnEditorConfig: any,
    deps: TableRendererDeps,
  ): void {
    if (!container) return;

    if (!deps.config.editColumns) {
      container.innerHTML = "";
      return;
    }

    if (this.columnEditorInstance) {
      this.columnEditorInstance.update({
        columnEditorText: mergedColumnEditorConfig.text,
        editColumns: deps.config.editColumns,
        headers: deps.headers,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        contextHeaders: deps.headers,
        setHeaders: (newHeaders: HeaderObject[]) => {
          deps.setHeaders(newHeaders);
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        setOpen: setColumnEditorOpen,
      });
    } else {
      container.innerHTML = "";
      const columnEditor = createColumnEditor({
        columnEditorText: mergedColumnEditorConfig.text,
        editColumns: deps.config.editColumns,
        headers: deps.headers,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        contextHeaders: deps.headers,
        setHeaders: (newHeaders: HeaderObject[]) => {
          deps.setHeaders(newHeaders);
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        setOpen: setColumnEditorOpen,
      });
      this.columnEditorInstance = columnEditor;
      container.appendChild(columnEditor.element);
    }
  }

  renderHorizontalScrollbar(
    wrapperContainer: HTMLElement,
    mainBodyWidth: number,
    pinnedLeftWidth: number,
    pinnedRightWidth: number,
    pinnedLeftContentWidth: number,
    pinnedRightContentWidth: number,
    tableBodyContainerRef: HTMLDivElement,
    deps: TableRendererDeps,
  ): void {
    if (!wrapperContainer || !deps.mainBodyRef.current || !tableBodyContainerRef) {
      return;
    }

    // Check if horizontal scrolling is needed
    const clientWidth = deps.mainBodyRef.current.clientWidth;
    const scrollWidth = deps.mainBodyRef.current.scrollWidth;
    const threshold = 1;
    const isScrollable = scrollWidth - clientWidth > threshold;

    // If not scrollable, remove existing scrollbar if present
    if (!isScrollable) {
      if (this.horizontalScrollbarRef.current) {
        cleanupHorizontalScrollbar(this.horizontalScrollbarRef.current);
        this.horizontalScrollbarRef.current = null;
      }
      if (this.scrollbarTimeoutId !== null) {
        clearTimeout(this.scrollbarTimeoutId);
        this.scrollbarTimeoutId = null;
      }
      return;
    }

    // If scrollbar already exists, keep it (like React keeping component mounted)
    if (this.horizontalScrollbarRef.current && wrapperContainer.contains(this.horizontalScrollbarRef.current)) {
      return;
    }

    // Cancel any pending scrollbar creation
    if (this.scrollbarTimeoutId !== null) {
      clearTimeout(this.scrollbarTimeoutId);
      this.scrollbarTimeoutId = null;
    }

    // Create scrollbar only if it doesn't exist
    this.scrollbarTimeoutId = window.setTimeout(() => {
      if (!deps.mainBodyRef.current || !tableBodyContainerRef || !wrapperContainer) {
        return;
      }

      // Double-check it wasn't created by another render
      if (this.horizontalScrollbarRef.current && wrapperContainer.contains(this.horizontalScrollbarRef.current)) {
        this.scrollbarTimeoutId = null;
        return;
      }

      const scrollbar = createHorizontalScrollbar({
        mainBodyRef: deps.mainBodyRef.current,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef,
        editColumns: deps.config.editColumns ?? false,
      });

      if (scrollbar) {
        const contentWrapper = wrapperContainer.querySelector(".st-content-wrapper");
        if (contentWrapper && contentWrapper.nextSibling) {
          wrapperContainer.insertBefore(scrollbar, contentWrapper.nextSibling);
        } else {
          wrapperContainer.appendChild(scrollbar);
        }
        this.horizontalScrollbarRef.current = scrollbar;
      }
      
      this.scrollbarTimeoutId = null;
    }, 1);
  }

  cleanup(): void {
    this.sectionRenderer.cleanup();
    this.footerInstance?.destroy();
    this.columnEditorInstance?.destroy();

    // Cancel any pending scrollbar creation
    if (this.scrollbarTimeoutId !== null) {
      clearTimeout(this.scrollbarTimeoutId);
      this.scrollbarTimeoutId = null;
    }

    if (this.horizontalScrollbarRef.current) {
      cleanupHorizontalScrollbar(this.horizontalScrollbarRef.current);
      this.horizontalScrollbarRef.current = null;
    }
  }
}
