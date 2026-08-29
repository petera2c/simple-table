import ColumnDef, { Accessor } from "../../types/ColumnDef";
import { FilterCondition } from "../../types/FilterTypes";
import { HeaderRenderContext } from "../../utils/headerCellRenderer";
import { CellRenderContext } from "../../utils/bodyCellRenderer";
import { flattenHeaders } from "../../utils/headerUtils";
import { getMainSectionViewportWidth } from "../../utils/resizeUtils/sectionWidths";
import type { TableRendererDeps } from "./TableRendererDeps";

export interface SectionWidths {
  mainWidth: number;
  leftWidth: number;
  rightWidth: number;
  containerWidth: number;
}

export const buildHeaderCellContext = (
  deps: TableRendererDeps,
  widths: SectionWidths,
): HeaderRenderContext => {
  const headerSelectedRowCount = deps.rowSelectionManager?.getSelectedRowCount() ?? 0;
  const sortState = deps.sortManager?.getState();
  const filterState = deps.filterManager?.getState();

  return {
    reverse: false,
    collapsedHeaders: deps.collapsedHeaders,
    getCollapsedHeaders: deps.getCollapsedHeaders,
    columnBorders: deps.config.columnBorders ?? false,
    columnReordering: deps.config.columnReordering ?? false,
    columnResizing: deps.config.columnResizing ?? false,
    containerWidth: widths.containerWidth,
    mainSectionContainerWidth: widths.mainWidth,
    mainSectionViewportWidth: getMainSectionViewportWidth({
      containerWidth: widths.containerWidth,
      leftWidth: widths.leftWidth,
      rightWidth: widths.rightWidth,
    }),
    enableVirtualization: deps.config.enableVirtualization !== false,
    enableHeaderEditing: deps.config.enableHeaderEditing,
    enableRowSelection: deps.config.enableRowSelection,
    rowSelectionMode: deps.config.rowSelectionMode ?? "multiple",
    selectedRowCount: headerSelectedRowCount,
    filters: filterState?.filters ?? {},
    icons: deps.resolvedIcons,
    selectedColumns:
      deps.config.selectableColumns && deps.selectionManager
        ? deps.selectionManager.getSelectedColumns()
        : new Set<number>(),
    columnsWithSelectedCells:
      deps.selectionManager && (deps.config.selectableCells || deps.config.selectableColumns)
        ? deps.selectionManager.getColumnsWithSelectedCells()
        : new Set<number>(),
    sort: sortState?.sort ?? null,
    autoExpandColumns: deps.config.autoExpandColumns ?? false,
    getShrinkFloors: deps.getShrinkFloors,
    onAutoExpandNaturalWidths: deps.onAutoExpandNaturalWidths,
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
    getHeaders: () => deps.getHeaders(),
    handleSelectAll: (checked: boolean) => {
      deps.rowSelectionManager?.handleSelectAll(checked);
    },
    setCollapsedHeaders: (value: any) => {
      if (typeof value === "function") {
        const base = deps.getCollapsedHeaders ? deps.getCollapsedHeaders() : deps.collapsedHeaders;
        deps.setCollapsedHeaders(value(base));
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
      deps.setIsResizing(typeof value === "function" ? value(deps.isResizing) : value);
    },
    onColumnWidthChange: deps.config.onColumnWidthChange,
    onColumnOrderChange: deps.config.onColumnOrderChange,
    onTableHeaderDragEnd: (headers: ColumnDef[]) => {
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
        : (_columnIndices: number[]) => {},
    setSelectedColumns:
      deps.selectionManager && deps.config.selectableColumns
        ? (value: Set<number> | ((prev: Set<number>) => Set<number>)) => {
            const prev = deps.selectionManager!.getSelectedColumns();
            const next = typeof value === "function" ? value(prev) : value;
            deps.selectionManager!.setSelectedColumns(next);
            deps.onRender();
          }
        : (_value: any) => {},
    setSelectedCells: deps.selectionManager
      ? (value: Set<string> | ((prev: Set<string>) => Set<string>)) => {
          const prev = deps.selectionManager!.getSelectedCells();
          const next = typeof value === "function" ? value(prev) : value;
          deps.selectionManager!.setSelectedCells(next instanceof Set ? next : new Set());
          deps.onRender?.();
        }
      : (_value: any) => {},
    setInitialFocusedCell: deps.selectionManager
      ? (cell: { rowIndex: number; colIndex: number; rowId: string } | null) => {
          deps.selectionManager!.setInitialFocusedCell(cell ?? null);
          deps.onRender?.();
        }
      : (_cell: any) => {},
    areAllRowsSelected: () => deps.rowSelectionManager?.areAllRowsSelected() ?? false,
    draggedHeaderRef: deps.draggedHeaderRef,
    hoveredHeaderRef: deps.hoveredHeaderRef,
    headerRegistry: deps.headerRegistry,
    forceUpdate: () => deps.onRender(),
    mainBodyRef: deps.mainBodyRef,
    pinnedLeftRef: deps.pinnedLeftRef,
    pinnedRightRef: deps.pinnedRightRef,
    accordionAxis: deps.accordionAxis,
    animationCoordinator: deps.animationCoordinator,
    onRendererHostDiscard: deps.config.onRendererHostDiscard,
  };
};

export const buildBodyCellContext = (
  deps: TableRendererDeps,
  widths: SectionWidths,
  processedResult: any,
  scheduleRender: (callback: () => void) => void,
): CellRenderContext => {
  const selectedRowCount = deps.rowSelectionManager?.getSelectedRowCount() ?? 0;
  const maxHeaderDepth = deps.dimensionManager?.getState().maxHeaderDepth ?? 1;
  const rowHeaderAccessor = flattenHeaders(deps.effectiveHeaders).find(
    (h) => !h.isSelectionColumn,
  )?.accessor;

  return {
    collapsedHeaders: deps.collapsedHeaders,
    collapsedRows: deps.getCollapsedRows(),
    expandedRows: deps.getExpandedRows(),
    expandedDepths: Array.from(deps.expandedDepths),
    selectedColumns: deps.selectionManager?.getSelectedColumns() ?? new Set(),
    rowsWithSelectedCells: deps.selectionManager?.getRowsWithSelectedCells() ?? new Set(),
    columnBorders: deps.config.columnBorders ?? false,
    enableRowSelection: deps.config.enableRowSelection,
    selectRowOnClick: deps.config.selectRowOnClick ?? false,
    rowSelectionMode: deps.config.rowSelectionMode ?? "multiple",
    selectedRowCount,
    activeRowId: deps.rowSelectionManager?.getActiveRowId() ?? null,
    cellUpdateFlash: deps.config.cellUpdateFlash,
    oddColumnBackground: deps.config.oddColumnBackground,
    hoverRowBackground: deps.config.hoverRowBackground ?? true,
    hoverScopeId: deps.hoverScopeId,
    oddEvenRowBackground: deps.config.oddEvenRowBackground,
    getRowClass: deps.config.getRowClass,
    rowGrouping: deps.config.rowGrouping,
    headers: deps.effectiveHeaders,
    rowHeaderAccessor,
    rowHeight: deps.customTheme.rowHeight,
    maxHeaderDepth,
    heightOffsets: processedResult.paginatedHeightOffsets,
    customTheme: deps.customTheme,
    containerWidth: widths.containerWidth,
    mainSectionContainerWidth: widths.mainWidth,
    mainSectionViewportWidth: getMainSectionViewportWidth({
      containerWidth: widths.containerWidth,
      leftWidth: widths.leftWidth,
      rightWidth: widths.rightWidth,
    }),
    enableVirtualization: deps.config.enableVirtualization !== false,
    onCellEdit: deps.config.onCellEdit,
    onCellClick: deps.config.onCellClick,
    onRowGroupExpand: deps.config.onRowGroupExpand,
    handleRowSelect: (rowId: string, checked: boolean) => {
      deps.rowSelectionManager?.handleRowSelect(rowId, checked);
    },
    handleToggleRow: (rowId: string) => {
      deps.rowSelectionManager?.handleToggleRow(rowId);
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
      scheduleRender(deps.onRender);
    },
    setExpandedRows: (value: any) => {
      if (typeof value === "function") {
        deps.setExpandedRows(value(deps.getExpandedRows()));
      } else {
        deps.setExpandedRows(value);
      }
      scheduleRender(deps.onRender);
    },
    setRowStateMap: (value: any) => {
      if (typeof value === "function") {
        deps.setRowStateMap(value(deps.getRowStateMap()));
      } else {
        deps.setRowStateMap(value);
      }
      scheduleRender(deps.onRender);
    },
    forceUpdate: () => deps.onRender(),
    icons: deps.resolvedIcons,
    theme: deps.config.theme ?? "modern-light",
    rowButtons: deps.config.rowButtons,
    loadingStateRenderer: deps.config.loadingStateRenderer,
    errorStateRenderer: deps.config.errorStateRenderer,
    emptyStateRenderer: deps.config.emptyStateRenderer,
    createNestedTable: deps.createNestedTable,
    getBorderClass: (cell) => deps.selectionManager?.getBorderClass(cell) || "",
    isSelected: (cell) => deps.selectionManager?.isSelected(cell) || false,
    isInitialFocusedCell: (cell) => deps.selectionManager?.isInitialFocusedCell(cell) || false,
    isCopyFlashing: (cell) => deps.selectionManager?.isCopyFlashing(cell) || false,
    isWarningFlashing: (cell) => deps.selectionManager?.isWarningFlashing(cell) || false,
    handleMouseDown: (cell) => deps.selectionManager?.handleMouseDown(cell),
    handleMouseOver: (cell, clientX: number, clientY: number) =>
      deps.selectionManager?.handleMouseOver(cell, clientX, clientY),
    onRendererHostDiscard: deps.config.onRendererHostDiscard,
    isRowSelected: (rowId: string) => deps.rowSelectionManager?.isRowSelected(rowId) ?? false,
    canExpandRowGroup: deps.config.canExpandRowGroup,
    isLoading: deps.internalIsLoading,
    accordionAxis: deps.accordionAxis,
  };
};
