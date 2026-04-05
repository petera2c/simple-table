import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { SimpleTableConfig } from "../../types/SimpleTableConfig";
import { CustomTheme } from "../../types/CustomTheme";
import { FilterCondition } from "../../types/FilterTypes";
import { SectionRenderer } from "./SectionRenderer";
import { HeaderRenderContext } from "../../utils/headerCellRenderer";
import { CellRenderContext } from "../../utils/bodyCellRenderer";
import { createTableFooter } from "../../utils/footer/createTableFooter";
import { createColumnEditor } from "../../utils/columnEditor/createColumnEditor";
import {
  createHorizontalScrollbar,
  cleanupHorizontalScrollbar,
} from "../../utils/horizontalScrollbarRenderer";
import {
  createStickyParentsContainer,
  cleanupStickyParentsContainer,
} from "../../utils/stickyParentsRenderer";
import { DimensionManager } from "../../managers/DimensionManager";
import type { SectionScrollController } from "../../managers/SectionScrollController";
import { SortManager } from "../../managers/SortManager";
import { FilterManager } from "../../managers/FilterManager";
import { SelectionManager } from "../../managers/SelectionManager";
import { RowSelectionManager } from "../../managers/RowSelectionManager";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils/sectionWidths";
import { canDisplaySection } from "../../utils/generalUtils";

export interface TableRendererDeps {
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
  getCollapsedHeaders?: () => Set<Accessor>;
  getCollapsedRows: () => Map<string, number>;
  getExpandedRows: () => Map<string, number>;
  getHeaders: () => HeaderObject[];
  getRowStateMap: () => Map<string | number, any>;
  headerRegistry: Map<string, any>;
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
  internalIsLoading: boolean;
  isResizing: boolean;
  localRows: any[];
  mainBodyRef: { current: HTMLDivElement | null };
  mainHeaderRef: { current: HTMLDivElement | null };
  onRender: () => void;
  pinnedLeftHeaderRef: { current: HTMLDivElement | null };
  pinnedLeftRef: { current: HTMLDivElement | null };
  pinnedRightHeaderRef: { current: HTMLDivElement | null };
  pinnedRightRef: { current: HTMLDivElement | null };
  positionOnlyBody?: boolean; /** When true, body sections use position-only updates for existing cells (scroll performance). */
  resolvedIcons: any;
  rowSelectionManager: RowSelectionManager | null;
  rowStateMap: Map<string | number, any>;
  sectionScrollController: SectionScrollController | null;
  selectionManager: SelectionManager | null;
  setCollapsedHeaders: (headers: Set<Accessor>) => void;
  setCollapsedRows: (rows: Map<string, number>) => void;
  setExpandedRows: (rows: Map<string, number>) => void;
  setHeaders: (headers: HeaderObject[]) => void;
  setIsResizing: (value: boolean) => void;
  setRowStateMap: (map: Map<string | number, any>) => void;
  sortManager: SortManager | null;
}

export class TableRenderer {
  private sectionRenderer: SectionRenderer;
  private footerInstance: ReturnType<typeof createTableFooter> | null = null;
  private columnEditorInstance: ReturnType<typeof createColumnEditor> | null =
    null;
  private horizontalScrollbarRef: { current: HTMLElement | null } = {
    current: null,
  };
  private scrollbarTimeoutId: number | null = null;
  private stickyParentsContainer: HTMLElement | null = null;
  private sectionScrollController: SectionScrollController | null = null;
  private renderScheduled: boolean = false;
  private pendingRenderCallback: (() => void) | null = null;

  constructor() {
    this.sectionRenderer = new SectionRenderer();
  }

  private scheduleRender(callback: () => void): void {
    if (!this.renderScheduled) {
      this.renderScheduled = true;
      this.pendingRenderCallback = callback;
      queueMicrotask(() => {
        this.renderScheduled = false;
        if (this.pendingRenderCallback) {
          this.pendingRenderCallback();
          this.pendingRenderCallback = null;
        }
      });
    }
  }

  invalidateCache(type?: "body" | "header" | "context" | "all"): void {
    this.sectionRenderer.invalidateCache(type);
  }

  renderHeader(
    container: HTMLElement,
    calculatedHeaderHeight: number,
    maxHeaderDepth: number,
    deps: TableRendererDeps,
  ): void {
    if (!container || deps.config.hideHeader) return;

    container.style.height = `${calculatedHeaderHeight}px`;

    // When no section has visible columns, apply minHeight so the header doesn't collapse
    // and the column editor / reset button remain accessible.
    const hasAnyVisibleSection =
      canDisplaySection(deps.effectiveHeaders, "left") ||
      canDisplaySection(deps.effectiveHeaders, undefined) ||
      canDisplaySection(deps.effectiveHeaders, "right");
    container.style.minHeight = hasAnyVisibleSection ? "" : `${calculatedHeaderHeight}px`;
    container.setAttribute("aria-rowcount", String(1 + deps.localRows.length));
    container.setAttribute(
      "aria-colcount",
      String(deps.effectiveHeaders.length),
    );

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

    const sortState = deps.sortManager?.getState();
    const filterState = deps.filterManager?.getState();

    const headerSelectedRowCount =
      deps.rowSelectionManager?.getSelectedRowCount() ?? 0;
    const headerContext: HeaderRenderContext = {
      reverse: false,
      collapsedHeaders: deps.collapsedHeaders,
      getCollapsedHeaders: deps.getCollapsedHeaders,
      columnBorders: deps.config.columnBorders ?? false,
      columnReordering: deps.config.columnReordering ?? false,
      columnResizing: deps.config.columnResizing ?? false,
      containerWidth: dimensionState.containerWidth,
      mainSectionContainerWidth: mainWidth,
      enableHeaderEditing: deps.config.enableHeaderEditing,
      enableRowSelection: deps.config.enableRowSelection,
      selectedRowCount: headerSelectedRowCount,
      filters: filterState?.filters ?? {},
      icons: deps.resolvedIcons,
      selectedColumns:
        deps.config.selectableColumns && deps.selectionManager
          ? deps.selectionManager.getSelectedColumns()
          : new Set<number>(),
      columnsWithSelectedCells:
        deps.selectionManager &&
        (deps.config.selectableCells || deps.config.selectableColumns)
          ? deps.selectionManager.getColumnsWithSelectedCells()
          : new Set<number>(),
      sort: sortState?.sort ?? null,
      autoExpandColumns: deps.config.autoExpandColumns ?? false,
      essentialAccessors: deps.essentialAccessors,
      selectableColumns: deps.config.selectableColumns,
      headers: deps.effectiveHeaders,
      rows: deps.localRows,
      headerHeight: deps.customTheme.headerHeight,
      lastHeaderIndex: deps.effectiveHeaders.length - 1,
      onSort: (accessor: Accessor) => {
        if (deps.sortManager) {
          deps.sortManager.updateSort({ accessor });
        }
      },
      handleApplyFilter: (filter: FilterCondition) => {
        if (deps.filterManager) {
          deps.filterManager.updateFilter(filter);
        }
      },
      handleClearFilter: (accessor: Accessor) => {
        if (deps.filterManager) {
          deps.filterManager.clearFilter(accessor);
        }
      },
      handleSelectAll: (checked: boolean) => {
        deps.rowSelectionManager?.handleSelectAll(checked);
      },
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
          deps.setHeaders(value(deps.getHeaders()));
        } else {
          deps.setHeaders(value);
        }
        deps.onRender();
      },
      setIsResizing: (value: any) => {
        deps.setIsResizing(
          typeof value === "function" ? value(deps.isResizing) : value,
        );
      },
      onColumnWidthChange: deps.config.onColumnWidthChange,
      onColumnOrderChange: deps.config.onColumnOrderChange,
      onTableHeaderDragEnd: (headers: HeaderObject[]) => {
        deps.setHeaders(headers);
        deps.onRender();
      },
      onHeaderEdit: deps.config.onHeaderEdit,
      onColumnSelect: deps.config.onColumnSelect,
      selectColumns:
        deps.selectionManager && deps.config.selectableColumns
          ? (columnIndices: number[], isShiftKey?: boolean) => {
              deps.selectionManager!.selectColumns(columnIndices, isShiftKey);
              deps.onRender();
            }
          : (columnIndices: number[]) => {},
      setSelectedColumns:
        deps.selectionManager && deps.config.selectableColumns
          ? (value: Set<number> | ((prev: Set<number>) => Set<number>)) => {
              const prev = deps.selectionManager!.getSelectedColumns();
              const next = typeof value === "function" ? value(prev) : value;
              deps.selectionManager!.setSelectedColumns(next);
              deps.onRender();
            }
          : (value: any) => {},
      setSelectedCells: deps.selectionManager
        ? (value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
            const prev = deps.selectionManager!.getSelectedCells();
            const next = typeof value === "function" ? value(prev) : value;
            deps.selectionManager!.setSelectedCells(
              next instanceof Set ? next : new Set(),
            );
            deps.onRender?.();
          }
        : (value: any) => {},
      setInitialFocusedCell: deps.selectionManager
        ? (
            cell: { rowIndex: number; colIndex: number; rowId: string } | null,
          ) => {
            deps.selectionManager!.setInitialFocusedCell(cell ?? null);
            deps.onRender?.();
          }
        : (cell: any) => {},
      areAllRowsSelected: () =>
        deps.rowSelectionManager?.areAllRowsSelected() ?? false,
      draggedHeaderRef: deps.draggedHeaderRef,
      hoveredHeaderRef: deps.hoveredHeaderRef,
      headerRegistry: deps.headerRegistry,
      forceUpdate: () => deps.onRender(),
      mainBodyRef: deps.mainBodyRef,
      pinnedLeftRef: deps.pinnedLeftRef,
      pinnedRightRef: deps.pinnedRightRef,
    };

    const pinnedLeftHeaders = deps.effectiveHeaders.filter(
      (h) => h.pinned === "left",
    );
    const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
    const pinnedRightHeaders = deps.effectiveHeaders.filter(
      (h) => h.pinned === "right",
    );

    // Calculate startColIndex for each section to ensure global uniqueness
    let currentColIndex = 0;

    // Track which sections should exist (like React's component list)
    const sectionsToKeep: HTMLElement[] = [];

    if (pinnedLeftHeaders.length > 0) {
      const leftSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        pinned: "left",
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
        sectionWidth: leftWidth,
        startColIndex: currentColIndex,
      });
      deps.pinnedLeftHeaderRef.current = leftSection as HTMLDivElement;
      sectionsToKeep.push(leftSection);
      // Always append (appendChild moves existing nodes) so order stays left → main → right
      // when pinned-left appears after a frame with only main (avoids [main, left] in DOM).
      container.appendChild(leftSection as HTMLElement);
      // Update colIndex for next section
      currentColIndex = this.sectionRenderer.getNextColIndex("left");
    }

    if (mainHeaders.length > 0) {
      const mainSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
        sectionWidth: mainWidth,
        startColIndex: currentColIndex,
      });
      deps.mainHeaderRef.current = mainSection as HTMLDivElement;
      sectionsToKeep.push(mainSection);
      container.appendChild(mainSection as HTMLElement);
      // Update colIndex for next section
      currentColIndex = this.sectionRenderer.getNextColIndex("main");
    }

    if (pinnedRightHeaders.length > 0) {
      const rightSection = this.sectionRenderer.renderHeaderSection({
        headers: deps.effectiveHeaders,
        collapsedHeaders: deps.collapsedHeaders,
        pinned: "right",
        maxHeaderDepth,
        headerHeight: deps.customTheme.headerHeight,
        context: headerContext,
        sectionWidth: rightWidth,
        startColIndex: currentColIndex,
      });
      deps.pinnedRightHeaderRef.current = rightSection as HTMLDivElement;
      sectionsToKeep.push(rightSection);
      container.appendChild(rightSection as HTMLElement);
    }

    // Remove any orphaned sections (like React unmounting components)
    Array.from(container.children).forEach((child) => {
      if (!sectionsToKeep.includes(child as HTMLElement)) {
        child.remove();
      }
    });
  }

  renderBody(
    container: HTMLElement,
    processedResult: any,
    deps: TableRendererDeps,
  ): void {
    if (!container) return;

    // When no section has visible columns, apply minHeight so the table keeps its height
    // and the column editor / reset button remain accessible.
    const hasAnyVisibleBodySection =
      canDisplaySection(deps.effectiveHeaders, "left") ||
      canDisplaySection(deps.effectiveHeaders, undefined) ||
      canDisplaySection(deps.effectiveHeaders, "right");
    if (!hasAnyVisibleBodySection) {
      const totalHeight = processedResult?.heightMap?.totalHeight ?? 0;
      container.style.minHeight = `${totalHeight}px`;
    } else {
      container.style.minHeight = "";
    }

    const rowsToRender =
      processedResult.rowsToRender || processedResult.currentTableRows;
    const shouldShowEmptyState =
      !deps.internalIsLoading && processedResult.currentTableRows.length === 0;

    // Update SelectionManager with processed table rows; use minimal update when scroll-only for performance
    if (deps.selectionManager && processedResult.currentTableRows) {
      deps.selectionManager.updateConfig(
        {
          tableRows: processedResult.currentTableRows,
          headers: deps.effectiveHeaders,
          collapsedHeaders: deps.collapsedHeaders,
          selectableColumns: deps.config.selectableColumns ?? false,
        },
        { positionOnlyBody: deps.positionOnlyBody },
      );
    }

    if (shouldShowEmptyState) {
      container.innerHTML = "";
      const emptyWrapper = document.createElement("div");
      emptyWrapper.className = "st-empty-state-wrapper";

      if (typeof deps.config.tableEmptyStateRenderer === "string") {
        emptyWrapper.textContent = deps.config.tableEmptyStateRenderer;
      } else if (deps.config.tableEmptyStateRenderer instanceof HTMLElement) {
        emptyWrapper.appendChild(
          deps.config.tableEmptyStateRenderer.cloneNode(true),
        );
      } else {
        emptyWrapper.innerHTML =
          "<div class='st-empty-state'>No rows to display</div>";
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

    const selectedRowCount =
      deps.rowSelectionManager?.getSelectedRowCount() ?? 0;
    const maxHeaderDepth = dimensionState.maxHeaderDepth ?? 1;
    const bodyContext: CellRenderContext = {
      collapsedHeaders: deps.collapsedHeaders,
      collapsedRows: deps.getCollapsedRows(),
      expandedRows: deps.getExpandedRows(),
      expandedDepths: Array.from(deps.expandedDepths),
      selectedColumns: deps.selectionManager?.getSelectedColumns() ?? new Set(),
      rowsWithSelectedCells:
        deps.selectionManager?.getRowsWithSelectedCells() ?? new Set(),
      columnBorders: deps.config.columnBorders ?? false,
      enableRowSelection: deps.config.enableRowSelection,
      selectedRowCount,
      cellUpdateFlash: deps.config.cellUpdateFlash,
      useOddColumnBackground: deps.config.useOddColumnBackground,
      useHoverRowBackground: deps.config.useHoverRowBackground,
      useOddEvenRowBackground: deps.config.useOddEvenRowBackground,
      rowGrouping: deps.config.rowGrouping,
      headers: deps.effectiveHeaders,
      rowHeight: deps.customTheme.rowHeight,
      maxHeaderDepth,
      heightOffsets: processedResult.paginatedHeightOffsets,
      customTheme: deps.customTheme,
      containerWidth: dimensionState.containerWidth,
      mainSectionContainerWidth: mainWidth,
      onCellEdit: deps.config.onCellEdit,
      onCellClick: deps.config.onCellClick,
      onRowGroupExpand: deps.config.onRowGroupExpand,
      handleRowSelect: (rowId: string, checked: boolean) => {
        deps.rowSelectionManager?.handleRowSelect(rowId, checked);
      },
      cellRegistry: deps.cellRegistry,
      getCollapsedRows: () => deps.getCollapsedRows(),
      getExpandedRows: () => deps.getExpandedRows(),
      setCollapsedRows: (value: any) => {
        if (typeof value === "function") {
          deps.setCollapsedRows(value(deps.getCollapsedRows()));
        } else {
          deps.setCollapsedRows(value);
        }
        // Batch multiple state updates together
        this.scheduleRender(deps.onRender);
      },
      setExpandedRows: (value: any) => {
        if (typeof value === "function") {
          deps.setExpandedRows(value(deps.getExpandedRows()));
        } else {
          deps.setExpandedRows(value);
        }
        // Batch multiple state updates together
        this.scheduleRender(deps.onRender);
      },
      setRowStateMap: (value: any) => {
        if (typeof value === "function") {
          deps.setRowStateMap(value(deps.getRowStateMap()));
        } else {
          deps.setRowStateMap(value);
        }
        // Batch multiple state updates together
        this.scheduleRender(deps.onRender);
      },
      icons: deps.resolvedIcons,
      theme: deps.config.theme ?? "modern-light",
      rowButtons: deps.config.rowButtons,
      loadingStateRenderer: deps.config.loadingStateRenderer,
      errorStateRenderer: deps.config.errorStateRenderer,
      emptyStateRenderer: deps.config.emptyStateRenderer,
      getBorderClass: (cell: any) =>
        deps.selectionManager?.getBorderClass(cell) || "",
      isSelected: (cell: any) =>
        deps.selectionManager?.isSelected(cell) || false,
      isInitialFocusedCell: (cell: any) =>
        deps.selectionManager?.isInitialFocusedCell(cell) || false,
      isCopyFlashing: (cell: any) =>
        deps.selectionManager?.isCopyFlashing(cell) || false,
      isWarningFlashing: (cell: any) =>
        deps.selectionManager?.isWarningFlashing(cell) || false,
      handleMouseDown: (cell: any) =>
        deps.selectionManager?.handleMouseDown(cell),
      handleMouseOver: (cell: any) =>
        deps.selectionManager?.handleMouseOver(cell),
      isRowSelected: (rowId: string) =>
        deps.rowSelectionManager?.isRowSelected(rowId) ?? false,
      canExpandRowGroup: deps.config.canExpandRowGroup,
      isLoading: deps.internalIsLoading,
    };

    const pinnedLeftHeaders = deps.effectiveHeaders.filter(
      (h) => h.pinned === "left",
    );
    const mainHeaders = deps.effectiveHeaders.filter((h) => !h.pinned);
    const pinnedRightHeaders = deps.effectiveHeaders.filter(
      (h) => h.pinned === "right",
    );

    // Calculate startColIndex for each section to ensure global uniqueness
    let currentColIndex = 0;

    // Track which sections should exist (like React's component list)
    const sectionsToKeep: HTMLElement[] = [];

    if (pinnedLeftHeaders.length > 0) {
      const leftSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        pinned: "left",
        context: bodyContext,
        sectionWidth: leftWidth,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.paginatedHeightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
        startColIndex: currentColIndex,
        positionOnly: deps.positionOnlyBody,
        fullTableRows: processedResult.currentTableRows,
        renderedStartIndex: processedResult.renderedStartIndex,
        renderedEndIndex: processedResult.renderedEndIndex,
      });
      deps.pinnedLeftRef.current = leftSection as HTMLDivElement;
      sectionsToKeep.push(leftSection);
      container.appendChild(leftSection as HTMLElement);
      // Update colIndex for next section
      currentColIndex = this.sectionRenderer.getNextColIndex("left");
    }

    if (mainHeaders.length > 0) {
      const mainSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        context: bodyContext,
        sectionWidth: mainWidth,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.paginatedHeightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
        startColIndex: currentColIndex,
        positionOnly: deps.positionOnlyBody,
        fullTableRows: processedResult.currentTableRows,
        renderedStartIndex: processedResult.renderedStartIndex,
        renderedEndIndex: processedResult.renderedEndIndex,
      });
      deps.mainBodyRef.current = mainSection as HTMLDivElement;
      sectionsToKeep.push(mainSection);
      container.appendChild(mainSection as HTMLElement);
      // Update colIndex for next section
      currentColIndex = this.sectionRenderer.getNextColIndex("main");
    }

    if (pinnedRightHeaders.length > 0) {
      const rightSection = this.sectionRenderer.renderBodySection({
        headers: deps.effectiveHeaders,
        rows: rowsToRender,
        collapsedHeaders: deps.collapsedHeaders,
        pinned: "right",
        context: bodyContext,
        sectionWidth: rightWidth,
        rowHeight: deps.customTheme.rowHeight,
        heightOffsets: processedResult.paginatedHeightOffsets,
        totalRowCount: processedResult.currentTableRows.length,
        startColIndex: currentColIndex,
        positionOnly: deps.positionOnlyBody,
        fullTableRows: processedResult.currentTableRows,
        renderedStartIndex: processedResult.renderedStartIndex,
        renderedEndIndex: processedResult.renderedEndIndex,
      });
      deps.pinnedRightRef.current = rightSection as HTMLDivElement;
      sectionsToKeep.push(rightSection);
      container.appendChild(rightSection as HTMLElement);
    }

    // Render sticky parents if enabled
    if (
      deps.config.enableStickyParents &&
      processedResult.stickyParents &&
      processedResult.stickyParents.length > 0
    ) {
      // Clean up old sticky parents container
      if (this.stickyParentsContainer) {
        cleanupStickyParentsContainer(
          this.stickyParentsContainer,
          deps.sectionScrollController ?? null,
        );
        this.stickyParentsContainer = null;
      }

      // Get scroll state
      const scrollTop = deps.mainBodyRef.current?.scrollTop ?? 0;
      const scrollbarWidth = deps.mainBodyRef.current
        ? deps.mainBodyRef.current.offsetWidth -
          deps.mainBodyRef.current.clientWidth
        : 0;

      // Create sticky parents container
      this.stickyParentsContainer = createStickyParentsContainer(
        {
          calculatedHeaderHeight: dimensionState.calculatedHeaderHeight,
          heightMap: processedResult.heightMap,
          partiallyVisibleRows: processedResult.partiallyVisibleRows || [],
          pinnedLeftColumns: pinnedLeftHeaders,
          pinnedLeftWidth: leftWidth,
          pinnedRightColumns: pinnedRightHeaders,
          pinnedRightWidth: rightWidth,
          scrollTop,
          scrollbarWidth,
          stickyParents: processedResult.stickyParents,
        },
        {
          collapsedHeaders: deps.collapsedHeaders,
          customTheme: deps.customTheme,
          editColumns: deps.config.editColumns ?? false,
          headers: deps.effectiveHeaders,
          rowHeight: deps.customTheme.rowHeight,
          heightOffsets: processedResult.paginatedHeightOffsets,
          cellRenderContext: bodyContext,
          sectionScrollController: deps.sectionScrollController ?? null,
        },
      );

      if (this.stickyParentsContainer) {
        sectionsToKeep.push(this.stickyParentsContainer);
        if (!container.contains(this.stickyParentsContainer)) {
          container.appendChild(this.stickyParentsContainer);
        }
      }
    } else {
      // Clean up sticky parents if disabled or no sticky parents
      if (this.stickyParentsContainer) {
        cleanupStickyParentsContainer(
          this.stickyParentsContainer,
          deps.sectionScrollController ?? null,
        );
        this.stickyParentsContainer = null;
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

    const hasCustomFooter = Boolean(deps.config.footerRenderer);
    const hasPaginationFooter = deps.config.shouldPaginate && !deps.config.hideFooter;

    if (!hasCustomFooter && !hasPaginationFooter) {
      container.innerHTML = "";
      return;
    }

    const rowsPerPage = deps.config.rowsPerPage ?? 10;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    if (hasCustomFooter) {
      const startRow = (currentPage - 1) * rowsPerPage + 1;
      const endRow = Math.min(currentPage * rowsPerPage, totalRows);
      const renderedContent = deps.config.footerRenderer!({
        currentPage,
        endRow,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        nextIcon: deps.resolvedIcons?.next,
        onNextPage: async () => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            if (deps.config.onNextPage) await deps.config.onNextPage(currentPage + 1);
          }
        },
        onPageChange,
        onPrevPage: () => {
          if (currentPage > 1) onPageChange(currentPage - 1);
        },
        prevIcon: deps.resolvedIcons?.prev,
        rowsPerPage,
        startRow,
        totalPages,
        totalRows,
      });

      container.innerHTML = "";
      if (renderedContent instanceof HTMLElement) {
        container.appendChild(renderedContent);
      } else if (typeof renderedContent === "string") {
        container.innerHTML = renderedContent;
      }
      this.footerInstance = null;
      return;
    }

    if (this.footerInstance) {
      this.footerInstance.update({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage,
        shouldPaginate: deps.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
        prevIcon: deps.resolvedIcons?.prev,
        nextIcon: deps.resolvedIcons?.next,
      });
    } else {
      container.innerHTML = "";
      const footer = createTableFooter({
        currentPage,
        hideFooter: deps.config.hideFooter ?? false,
        onPageChange,
        onNextPage: deps.config.onNextPage,
        onUserPageChange: deps.config.onPageChange,
        rowsPerPage,
        shouldPaginate: deps.config.shouldPaginate ?? false,
        totalPages,
        totalRows,
        prevIcon: deps.resolvedIcons?.prev,
        nextIcon: deps.resolvedIcons?.next,
      });
      this.footerInstance = footer;
      container.appendChild(footer.element);
    }
  }

  renderColumnEditor(
    contentWrapper: HTMLElement,
    columnEditorOpen: boolean,
    setColumnEditorOpen: (open: boolean) => void,
    mergedColumnEditorConfig: any,
    deps: TableRendererDeps,
  ): void {
    if (!contentWrapper) return;

    if (!deps.config.editColumns) {
      if (this.columnEditorInstance) {
        this.columnEditorInstance.destroy();
        this.columnEditorInstance = null;
      }
      return;
    }

    const resetColumns = () => {
      const defaultHeaders = deps.config.defaultHeaders;
      if (defaultHeaders) {
        const cloned = defaultHeaders.map((h: HeaderObject) => ({ ...h }));
        deps.setHeaders(cloned);
        deps.onRender();
      }
    };

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
        essentialAccessors: deps.essentialAccessors,
        setHeaders: (newHeaders: HeaderObject[]) => {
          deps.setHeaders(newHeaders);
          if (this.columnEditorInstance) {
            this.columnEditorInstance.update({
              headers: newHeaders,
            });
          }
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        resetColumns,
        setOpen: setColumnEditorOpen,
      });
    } else {
      const columnEditor = createColumnEditor({
        columnEditorText: mergedColumnEditorConfig.text,
        editColumns: deps.config.editColumns,
        headers: deps.headers,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        essentialAccessors: deps.essentialAccessors,
        setHeaders: (newHeaders: HeaderObject[]) => {
          deps.setHeaders(newHeaders);
          if (this.columnEditorInstance) {
            this.columnEditorInstance.update({
              headers: newHeaders,
            });
          }
          deps.onRender();
        },
        onColumnVisibilityChange: deps.config.onColumnVisibilityChange,
        onColumnOrderChange: deps.config.onColumnOrderChange,
        resetColumns,
        setOpen: setColumnEditorOpen,
      });
      this.columnEditorInstance = columnEditor;
      contentWrapper.appendChild(columnEditor.element);
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
    if (
      !wrapperContainer ||
      !deps.mainBodyRef.current ||
      !tableBodyContainerRef
    ) {
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
        cleanupHorizontalScrollbar(
          this.horizontalScrollbarRef.current,
          deps.sectionScrollController,
        );
        this.horizontalScrollbarRef.current = null;
      }
      if (this.scrollbarTimeoutId !== null) {
        clearTimeout(this.scrollbarTimeoutId);
        this.scrollbarTimeoutId = null;
      }
      return;
    }

    if (
      this.horizontalScrollbarRef.current &&
      wrapperContainer.contains(this.horizontalScrollbarRef.current)
    ) {
      return;
    }

    // Cancel any pending scrollbar creation
    if (this.scrollbarTimeoutId !== null) {
      clearTimeout(this.scrollbarTimeoutId);
      this.scrollbarTimeoutId = null;
    }

    // Create scrollbar only if it doesn't exist
    this.scrollbarTimeoutId = window.setTimeout(() => {
      if (
        !deps.mainBodyRef.current ||
        !tableBodyContainerRef ||
        !wrapperContainer
      ) {
        return;
      }

      // Double-check it wasn't created by another render
      if (
        this.horizontalScrollbarRef.current &&
        wrapperContainer.contains(this.horizontalScrollbarRef.current)
      ) {
        this.scrollbarTimeoutId = null;
        return;
      }

      this.sectionScrollController = deps.sectionScrollController ?? null;
      const scrollbar = createHorizontalScrollbar({
        mainBodyRef: deps.mainBodyRef.current,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef,
        editColumns: deps.config.editColumns ?? false,
        sectionScrollController: this.sectionScrollController,
      });

      if (scrollbar) {
        const contentWrapper = wrapperContainer.querySelector(
          ".st-content-wrapper",
        );
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
      cleanupHorizontalScrollbar(
        this.horizontalScrollbarRef.current,
        this.sectionScrollController,
      );
      this.horizontalScrollbarRef.current = null;
    }

    if (this.stickyParentsContainer) {
      cleanupStickyParentsContainer(
        this.stickyParentsContainer,
        this.sectionScrollController,
      );
      this.stickyParentsContainer = null;
    }
    this.sectionScrollController = null;
  }
}
