import { ReactNode, useMemo } from "react";
import { TableStaticProvider, TableDynamicProvider, TableContextType } from "./TableContexts";

// Re-export everything from the new split contexts
export * from "./TableContexts";
export type { TableContextType } from "./TableContexts";

/**
 * Combined TableProvider that wraps both Static and Dynamic contexts
 * This maintains backward compatibility while enabling the split context optimization
 */
export const TableProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: TableContextType;
}) => {
  // Split the value into static and dynamic parts
  // Static values are memoized and only change when configuration changes
  const staticValue = useMemo(
    () => ({
      // Configuration
      allowAnimations: value.allowAnimations,
      autoExpandColumns: value.autoExpandColumns,
      canExpandRowGroup: value.canExpandRowGroup,
      cellUpdateFlash: value.cellUpdateFlash,
      columnBorders: value.columnBorders,
      columnReordering: value.columnReordering,
      columnResizing: value.columnResizing,
      copyHeadersToClipboard: value.copyHeadersToClipboard,
      editColumns: value.editColumns,
      enableHeaderEditing: value.enableHeaderEditing,
      enableRowSelection: value.enableRowSelection,
      includeHeadersInCSVExport: value.includeHeadersInCSVExport,
      rowHeight: value.rowHeight,
      headerHeight: value.headerHeight,
      rowIdAccessor: value.rowIdAccessor,
      scrollbarWidth: value.scrollbarWidth,
      selectableColumns: value.selectableColumns,
      shouldPaginate: value.shouldPaginate,
      theme: value.theme,
      useHoverRowBackground: value.useHoverRowBackground,
      useOddColumnBackground: value.useOddColumnBackground,
      useOddEvenRowBackground: value.useOddEvenRowBackground,

      // Refs (always stable)
      capturedPositionsRef: value.capturedPositionsRef,
      draggedHeaderRef: value.draggedHeaderRef,
      hoveredHeaderRef: value.hoveredHeaderRef,
      headerContainerRef: value.headerContainerRef,
      mainBodyRef: value.mainBodyRef,
      pinnedLeftRef: value.pinnedLeftRef,
      pinnedRightRef: value.pinnedRightRef,
      tableBodyContainerRef: value.tableBodyContainerRef,

      // Registries
      cellRegistry: value.cellRegistry,
      headerRegistry: value.headerRegistry,

      // Callbacks (should be memoized in parent)
      forceUpdate: value.forceUpdate,
      getBorderClass: value.getBorderClass,
      handleApplyFilter: value.handleApplyFilter,
      handleClearAllFilters: value.handleClearAllFilters,
      handleClearFilter: value.handleClearFilter,
      handleMouseDown: value.handleMouseDown,
      handleMouseOver: value.handleMouseOver,
      handleRowSelect: value.handleRowSelect,
      handleSelectAll: value.handleSelectAll,
      handleToggleRow: value.handleToggleRow,
      isCopyFlashing: value.isCopyFlashing,
      isInitialFocusedCell: value.isInitialFocusedCell,
      isRowSelected: value.isRowSelected,
      isSelected: value.isSelected,
      isWarningFlashing: value.isWarningFlashing,
      onCellEdit: value.onCellEdit,
      onCellClick: value.onCellClick,
      onColumnOrderChange: value.onColumnOrderChange,
      onColumnSelect: value.onColumnSelect,
      onHeaderEdit: value.onHeaderEdit,
      onLoadMore: value.onLoadMore,
      onRowGroupExpand: value.onRowGroupExpand,
      onSort: value.onSort,
      onTableHeaderDragEnd: value.onTableHeaderDragEnd,
      selectColumns: value.selectColumns,
      clearSelection: value.clearSelection,
      areAllRowsSelected: value.areAllRowsSelected,

      // State setters (stable references)
      setActiveHeaderDropdown: value.setActiveHeaderDropdown,
      setCollapsedHeaders: value.setCollapsedHeaders,
      setHeaders: value.setHeaders,
      setInitialFocusedCell: value.setInitialFocusedCell,
      setIsResizing: value.setIsResizing,
      setIsScrolling: value.setIsScrolling,
      setSelectedCells: value.setSelectedCells,
      setSelectedColumns: value.setSelectedColumns,
      setSelectedRows: value.setSelectedRows,
      setUnexpandedRows: value.setUnexpandedRows,
      setRowStateMap: value.setRowStateMap,

      // Arrays/Objects (should be memoized in parent)
      headers: value.headers,
      rowButtons: value.rowButtons,
      rowGrouping: value.rowGrouping,
      rows: value.rows,

      // Icons (stable)
      expandIcon: value.expandIcon,
      filterIcon: value.filterIcon,
      headerCollapseIcon: value.headerCollapseIcon,
      headerExpandIcon: value.headerExpandIcon,
      nextIcon: value.nextIcon,
      prevIcon: value.prevIcon,
      sortDownIcon: value.sortDownIcon,
      sortUpIcon: value.sortUpIcon,

      // Renderers (stable)
      loadingStateRenderer: value.loadingStateRenderer,
      errorStateRenderer: value.errorStateRenderer,
      emptyStateRenderer: value.emptyStateRenderer,
      tableEmptyStateRenderer: value.tableEmptyStateRenderer,
      headerDropdown: value.headerDropdown,
    }),
    [
      value.allowAnimations,
      value.autoExpandColumns,
      value.canExpandRowGroup,
      value.cellUpdateFlash,
      value.columnBorders,
      value.columnReordering,
      value.columnResizing,
      value.copyHeadersToClipboard,
      value.editColumns,
      value.enableHeaderEditing,
      value.enableRowSelection,
      value.includeHeadersInCSVExport,
      value.rowHeight,
      value.headerHeight,
      value.rowIdAccessor,
      value.scrollbarWidth,
      value.selectableColumns,
      value.shouldPaginate,
      value.theme,
      value.useHoverRowBackground,
      value.useOddColumnBackground,
      value.useOddEvenRowBackground,
      value.capturedPositionsRef,
      value.draggedHeaderRef,
      value.hoveredHeaderRef,
      value.headerContainerRef,
      value.mainBodyRef,
      value.pinnedLeftRef,
      value.pinnedRightRef,
      value.tableBodyContainerRef,
      value.cellRegistry,
      value.headerRegistry,
      value.forceUpdate,
      value.getBorderClass,
      value.handleApplyFilter,
      value.handleClearAllFilters,
      value.handleClearFilter,
      value.handleMouseDown,
      value.handleMouseOver,
      value.handleRowSelect,
      value.handleSelectAll,
      value.handleToggleRow,
      value.isCopyFlashing,
      value.isInitialFocusedCell,
      value.isRowSelected,
      value.isSelected,
      value.isWarningFlashing,
      value.onCellEdit,
      value.onCellClick,
      value.onColumnOrderChange,
      value.onColumnSelect,
      value.onHeaderEdit,
      value.onLoadMore,
      value.onRowGroupExpand,
      value.onSort,
      value.onTableHeaderDragEnd,
      value.selectColumns,
      value.clearSelection,
      value.areAllRowsSelected,
      value.setActiveHeaderDropdown,
      value.setCollapsedHeaders,
      value.setHeaders,
      value.setInitialFocusedCell,
      value.setIsResizing,
      value.setIsScrolling,
      value.setSelectedCells,
      value.setSelectedColumns,
      value.setSelectedRows,
      value.setUnexpandedRows,
      value.setRowStateMap,
      value.headers,
      value.rowButtons,
      value.rowGrouping,
      value.rows,
      value.expandIcon,
      value.filterIcon,
      value.headerCollapseIcon,
      value.headerExpandIcon,
      value.nextIcon,
      value.prevIcon,
      value.sortDownIcon,
      value.sortUpIcon,
      value.loadingStateRenderer,
      value.errorStateRenderer,
      value.emptyStateRenderer,
      value.tableEmptyStateRenderer,
      value.headerDropdown,
    ]
  );

  // Dynamic values change frequently - don't memoize
  const dynamicValue = {
    activeHeaderDropdown: value.activeHeaderDropdown,
    collapsedHeaders: value.collapsedHeaders,
    expandAll: value.expandAll,
    filters: value.filters,
    isAnimating: value.isAnimating,
    isLoading: value.isLoading,
    isResizing: value.isResizing,
    isScrolling: value.isScrolling,
    rowStateMap: value.rowStateMap,
    selectedColumns: value.selectedColumns,
    columnsWithSelectedCells: value.columnsWithSelectedCells,
    rowsWithSelectedCells: value.rowsWithSelectedCells,
    selectedRows: value.selectedRows,
    selectedRowCount: value.selectedRowCount,
    selectedRowsData: value.selectedRowsData,
    tableRows: value.tableRows,
    unexpandedRows: value.unexpandedRows,
  };

  return (
    <TableStaticProvider value={staticValue}>
      <TableDynamicProvider value={dynamicValue}>{children}</TableDynamicProvider>
    </TableStaticProvider>
  );
};
