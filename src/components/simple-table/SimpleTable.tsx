import { useState, useRef, useEffect, useReducer, useMemo, useCallback } from "react";
import useSelection from "../../hooks/useSelection";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import {
  AngleLeftIcon,
  AngleRightIcon,
  DescIcon,
  AscIcon,
  FilterIcon,
  DragIcon,
} from "../../icons";
import TableContent from "./TableContent";
import TableHorizontalScrollbar from "./TableHorizontalScrollbar";
import Row from "../../types/Row";
import useSortableData from "../../hooks/useSortableData";
import TableColumnEditor from "./table-column-editor/TableColumnEditor";
import { TableProvider, CellRegistryEntry, HeaderRegistryEntry } from "../../context/TableContext";
import { ScrollSync } from "../scroll-sync/ScrollSync";
import useFilterableData from "../../hooks/useFilterableData";
import useQuickFilter from "../../hooks/useQuickFilter";
import { useContentHeight } from "../../hooks/useContentHeight";
import useHandleOutsideClick from "../../hooks/useHandleOutsideClick";
import useWindowResize from "../../hooks/useWindowResize";
import { FilterCondition } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { useAggregatedRows } from "../../hooks/useAggregatedRows";
import { useTableDimensions } from "../../hooks/useTableDimensions";
import useExternalFilters from "../../hooks/useExternalFilters";
import useExternalSort from "../../hooks/useExternalSort";
import useScrollbarWidth from "../../hooks/useScrollbarWidth";
import useOnGridReady from "../../hooks/useOnGridReady";
import useTableAPI from "../../hooks/useTableAPI";
import useTableRowProcessing from "../../hooks/useTableRowProcessing";
import useFlattenedRows from "../../hooks/useFlattenedRows";
import { useRowSelection } from "../../hooks/useRowSelection";
import useAriaAnnouncements from "../../hooks/useAriaAnnouncements";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import RowState from "../../types/RowState";
import { generateRowId, rowIdToString, flattenRowsWithGrouping } from "../../utils/rowUtils";
import useExpandedDepths from "../../hooks/useExpandedDepths";
import DefaultEmptyState from "../empty-state/DefaultEmptyState";
import { DEFAULT_CUSTOM_THEME, CustomTheme } from "../../types/CustomTheme";
import { DEFAULT_COLUMN_EDITOR_CONFIG } from "../../types/ColumnEditorConfig";
import { checkDeprecatedProps } from "../../utils/deprecatedPropsWarnings";
import { useAutoScaleMainSection } from "../../hooks/useAutoScaleMainSection";

import { SimpleTableProps } from "../../types/SimpleTableProps";
import "../../styles/all-themes.css";

const SimpleTable = (props: SimpleTableProps) => {
  const [isClient, setIsClient] = useState(false);

  // Check for deprecated props before defaults are applied
  useEffect(() => {
    checkDeprecatedProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;
  return <SimpleTableComp {...props} />;
};

const SimpleTableComp = ({
  allowAnimations = false,
  autoExpandColumns = false,
  canExpandRowGroup,
  cellUpdateFlash = false,
  className,
  columnBorders = false,
  columnEditorConfig = DEFAULT_COLUMN_EDITOR_CONFIG,
  columnEditorText,
  columnReordering = false,
  columnResizing = false,
  copyHeadersToClipboard = false,
  customTheme: customThemeProp,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  emptyStateRenderer,
  enableHeaderEditing = false,
  enableRowSelection = false,
  enableStickyParents = false,
  errorStateRenderer,
  expandAll = true,
  expandIcon: expandIconDeprecated,
  externalFilterHandling = false,
  externalSortHandling = false,
  filterIcon: filterIconDeprecated,
  footerRenderer,
  headerCollapseIcon: headerCollapseIconDeprecated,
  headerDropdown,
  headerExpandIcon: headerExpandIconDeprecated,
  height,
  hideFooter = false,
  hideHeader = false,
  icons,
  includeHeadersInCSVExport = true,
  initialSortColumn,
  initialSortDirection = "asc",
  isLoading = false,
  loadingStateRenderer,
  maxHeight,
  nextIcon: nextIconDeprecated,
  onCellClick,
  onCellEdit,
  onColumnOrderChange,
  onColumnSelect,
  onColumnVisibilityChange,
  onColumnWidthChange,
  onFilterChange,
  onGridReady,
  onHeaderEdit,
  onLoadMore,
  onNextPage,
  onPageChange,
  onRowGroupExpand,
  onRowSelectionChange,
  onSortChange,
  prevIcon: prevIconDeprecated,
  quickFilter,
  rowButtons,
  rowGrouping,
  getRowId,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  serverSidePagination = false,
  shouldPaginate = false,
  sortDownIcon: sortDownIconDeprecated,
  sortUpIcon: sortUpIconDeprecated,
  tableEmptyStateRenderer = <DefaultEmptyState />,
  tableRef,
  theme = "modern-light",
  totalRowCount,
  useHoverRowBackground = true,
  useOddColumnBackground = false,
  useOddEvenRowBackground = false,
}: SimpleTableProps) => {
  // Merge icons config with backward compatibility for deprecated props
  const resolvedIcons = useMemo(() => {
    const defaultIcons = {
      drag: <DragIcon className="st-drag-icon" />,
      expand: <AngleRightIcon className="st-expand-icon" />,
      filter: <FilterIcon className="st-header-icon" />,
      headerCollapse: <AngleRightIcon className="st-header-icon" />,
      headerExpand: <AngleLeftIcon className="st-header-icon" />,
      next: <AngleRightIcon className="st-next-prev-icon" />,
      prev: <AngleLeftIcon className="st-next-prev-icon" />,
      sortDown: <DescIcon className="st-header-icon" />,
      sortUp: <AscIcon className="st-header-icon" />,
    };

    return {
      drag: icons?.drag ?? defaultIcons.drag,
      expand: icons?.expand ?? expandIconDeprecated ?? defaultIcons.expand,
      filter: icons?.filter ?? filterIconDeprecated ?? defaultIcons.filter,
      headerCollapse:
        icons?.headerCollapse ?? headerCollapseIconDeprecated ?? defaultIcons.headerCollapse,
      headerExpand: icons?.headerExpand ?? headerExpandIconDeprecated ?? defaultIcons.headerExpand,
      next: icons?.next ?? nextIconDeprecated ?? defaultIcons.next,
      prev: icons?.prev ?? prevIconDeprecated ?? defaultIcons.prev,
      sortDown: icons?.sortDown ?? sortDownIconDeprecated ?? defaultIcons.sortDown,
      sortUp: icons?.sortUp ?? sortUpIconDeprecated ?? defaultIcons.sortUp,
    };
  }, [
    icons,
    expandIconDeprecated,
    filterIconDeprecated,
    headerCollapseIconDeprecated,
    headerExpandIconDeprecated,
    nextIconDeprecated,
    prevIconDeprecated,
    sortDownIconDeprecated,
    sortUpIconDeprecated,
  ]);
  // Merge customTheme with defaults - all properties will be defined after merge
  const customTheme = useMemo(
    () =>
      ({
        ...DEFAULT_CUSTOM_THEME,
        ...customThemeProp,
      }) as CustomTheme,
    [customThemeProp],
  );

  // Merge columnEditorConfig with defaults and legacy props
  // Priority: columnEditorConfig > legacy props > defaults
  const mergedColumnEditorConfig = useMemo(
    () => ({
      text: columnEditorConfig?.text ?? columnEditorText ?? DEFAULT_COLUMN_EDITOR_CONFIG.text,
      searchEnabled:
        columnEditorConfig?.searchEnabled ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchEnabled,
      searchPlaceholder:
        columnEditorConfig?.searchPlaceholder ?? DEFAULT_COLUMN_EDITOR_CONFIG.searchPlaceholder,
      searchFunction: columnEditorConfig?.searchFunction,
    }),
    [columnEditorConfig, columnEditorText],
  );

  const { rowHeight, headerHeight, footerHeight, selectionColumnWidth } = customTheme;
  if (useOddColumnBackground) useOddEvenRowBackground = false;
  // Disable hover row background when column borders are enabled to prevent visual conflicts
  if (columnBorders) useHoverRowBackground = false;

  // Refs
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  const mainBodyRef = useRef<HTMLDivElement>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  // Force update function - needed early for header updates
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Row state map for managing loading/error/empty states
  const [rowStateMap, setRowStateMap] = useState<Map<string | number, RowState>>(new Map());

  // Local state
  // Manage rows internally to allow imperative API mutations to trigger re-renders
  const [localRows, setLocalRows] = useState<Row[]>(rows);

  // Internal loading state that can be deferred
  const [internalIsLoading, setInternalIsLoading] = useState(isLoading);
  const previousIsLoadingRef = useRef(isLoading);

  // Create a mapping of rowId -> absolute index for O(1) lookups
  // This maps each row to its position in the original localRows array
  const rowIndexMapRef = useRef<Map<string | number, number>>(new Map());

  // Sync local rows when prop changes and rebuild index map
  useEffect(() => {
    setLocalRows(rows);

    // Rebuild the index map
    const newIndexMap = new Map<string | number, number>();
    rows.forEach((row, index) => {
      const rowIdArray = generateRowId({
        row,
        getRowId,
        depth: 0,
        index,
        rowPath: [index],
        rowIndexPath: [index],
      });
      const rowIdKey = rowIdToString(rowIdArray);
      newIndexMap.set(rowIdKey, index);
    });
    rowIndexMapRef.current = newIndexMap;
  }, [rows, getRowId]);

  // Handle isLoading prop changes with deferred clearing
  useEffect(() => {
    const wasLoading = previousIsLoadingRef.current;
    const isNowLoading = isLoading;

    if (isNowLoading && !wasLoading) {
      // Loading started - apply immediately
      setInternalIsLoading(true);
    } else if (!isNowLoading && wasLoading) {
      // Loading finished - defer to next tick to ensure data is rendered first
      setTimeout(() => {
        setInternalIsLoading(false);
      }, 0);
    }

    previousIsLoadingRef.current = isLoading;
  }, [isLoading]);

  // Apply aggregation to current rows
  const { scrollbarWidth, setScrollbarWidth } = useScrollbarWidth({ tableBodyContainerRef });

  // Track vertical scrollbar visibility
  const { isMainSectionScrollable } = useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarWidth,
  });
  const effectiveRows = useMemo(() => {
    if (internalIsLoading && localRows.length === 0) {
      // Calculate how many rows can fit in the visible area
      let rowsToShow = shouldPaginate ? rowsPerPage : 10; // Default to 10 rows for loading state
      if (isMainSectionScrollable) {
        rowsToShow += 1;
      }

      // Create dummy rows with empty data
      const dummyRows = Array.from({ length: rowsToShow }, (_, index) => {
        const dummyRow: Record<string, any> = {};
        return dummyRow;
      });
      return dummyRows;
    }
    return localRows;
  }, [internalIsLoading, localRows, rowsPerPage, isMainSectionScrollable, shouldPaginate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeadersInternal] = useState(defaultHeaders);
  const [isResizing, setIsResizing] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<HeaderObject | null>(null);
  const [columnEditorOpen, setColumnEditorOpen] = useState(editColumnsInitOpen);

  // Initialize collapsed headers with columns that have collapsedByDefault set
  const getInitialCollapsedHeaders = useCallback(() => {
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
    processHeaders(defaultHeaders);
    return collapsed;
  }, [defaultHeaders]);

  const [collapsedHeaders, setCollapsedHeaders] = useState<Set<Accessor>>(
    getInitialCollapsedHeaders,
  );

  // Update headers when defaultHeaders prop changes
  useEffect(() => {
    setHeadersInternal(defaultHeaders);
  }, [defaultHeaders]);

  // Row selection hook - placeholder, will be defined after flattenedRows
  let selectedRows: Set<string> | undefined;
  let setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>> | undefined;
  let isRowSelected: ((rowId: string) => boolean) | undefined;
  let areAllRowsSelected: (() => boolean) | undefined;
  let selectedRowCount: number | undefined;
  let selectedRowsData: any[] | undefined;
  let handleRowSelect: ((rowId: string, isSelected: boolean) => void) | undefined;
  let handleSelectAll: ((isSelected: boolean) => void) | undefined;
  let handleToggleRow: ((rowId: string) => void) | undefined;
  let clearSelection: (() => void) | undefined;

  // Create headers with selection column if enabled
  const effectiveHeaders = useMemo(() => {
    let processedHeaders = [...headers];

    // Add selection column if enabled and not already present
    if (enableRowSelection && !headers?.[0]?.isSelectionColumn) {
      const selectionHeader = createSelectionHeader(selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    return processedHeaders;
  }, [enableRowSelection, headers, selectionColumnWidth]);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");

  // Manage expandedDepths state with automatic cleanup on rowGrouping changes
  const { expandedDepths, setExpandedDepths } = useExpandedDepths(expandAll, rowGrouping);

  // Track user's manual row expansion/collapse preferences
  const [expandedRows, setExpandedRows] = useState<Map<string, number>>(new Map());
  const [collapsedRows, setCollapsedRows] = useState<Map<string, number>>(new Map());

  // Aria-live announcements for screen readers
  const { announcement, announce } = useAriaAnnouncements();

  // Calculate table dimensions (container width, header height, and max header depth)
  const { containerWidth, calculatedHeaderHeight, maxHeaderDepth } = useTableDimensions({
    effectiveHeaders,
    headerHeight,
    rowHeight,
    tableBodyContainerRef,
  });

  // Calculate the width of the sections
  const {
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
  } = useMemo(() => {
    const { mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        collapsedHeaders,
      });
    return {
      mainBodyWidth: mainWidth,
      pinnedLeftWidth: leftWidth,
      pinnedRightWidth: rightWidth,
      pinnedLeftContentWidth: leftContentWidth,
      pinnedRightContentWidth: rightContentWidth,
    };
  }, [effectiveHeaders, containerWidth, collapsedHeaders]);

  // Get the wrapped setHeaders that applies auto-scaling
  const setHeaders = useAutoScaleMainSection({
    autoExpandColumns,
    containerWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    mainBodyRef,
    isResizing,
    setHeaders: setHeadersInternal,
  });

  const aggregatedRows = useAggregatedRows({
    rows: effectiveRows,
    headers,
    rowGrouping,
  });

  // Apply quick filter first (global search across columns)
  const quickFilteredRows = useQuickFilter({
    rows: aggregatedRows,
    headers: effectiveHeaders,
    quickFilter,
  });

  // Use filter hook (column-specific filters)
  const {
    filters,
    filteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    computeFilteredRowsPreview,
  } = useFilterableData({
    rows: quickFilteredRows,
    headers: effectiveHeaders,
    externalFilterHandling,
    onFilterChange,
    announce,
  });

  // Use custom hook for sorting (now operates on filtered rows)
  const { sort, sortedRows, updateSort, computeSortedRowsPreview } = useSortableData({
    headers,
    tableRows: filteredRows,
    externalSortHandling,
    onSortChange,
    rowGrouping,
    initialSortColumn,
    initialSortDirection,
    announce,
  });

  // Flatten sorted rows - this converts nested Row[] to flat TableRow[]
  // Done BEFORE pagination so rowsPerPage correctly counts data rows (excluding nested grids)
  const { flattenedRows, heightOffsets, paginatableRows, parentEndPositions } = useFlattenedRows({
    rows: sortedRows,
    rowGrouping,
    getRowId,
    expandedRows,
    collapsedRows,
    expandedDepths,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
    headers: effectiveHeaders,
    rowHeight,
    headerHeight,
    customTheme,
  });

  // Row selection hook - now that flattenedRows is defined
  const rowSelectionHook = useRowSelection({
    tableRows: flattenedRows,
    onRowSelectionChange,
    enableRowSelection,
  });
  selectedRows = rowSelectionHook.selectedRows;
  setSelectedRows = rowSelectionHook.setSelectedRows;
  isRowSelected = rowSelectionHook.isRowSelected;
  areAllRowsSelected = rowSelectionHook.areAllRowsSelected;
  selectedRowCount = rowSelectionHook.selectedRowCount;
  selectedRowsData = rowSelectionHook.selectedRowsData;
  handleRowSelect = rowSelectionHook.handleRowSelect;
  handleSelectAll = rowSelectionHook.handleSelectAll;
  handleToggleRow = rowSelectionHook.handleToggleRow;
  clearSelection = rowSelectionHook.clearSelection;

  // Also flatten the original aggregated rows for animation baseline positions
  const { flattenedRows: originalFlattenedRows } = useFlattenedRows({
    rows: aggregatedRows,
    rowGrouping,
    getRowId,
    expandedRows,
    collapsedRows,
    expandedDepths,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
    headers: effectiveHeaders,
    rowHeight,
    headerHeight,
    customTheme,
  });

  // Create flattened preview functions for animations
  const computeFlattenedFilteredRowsPreview = useCallback(
    (filter: FilterCondition) => {
      const filteredPreview = computeFilteredRowsPreview(filter);
      // Flatten the preview using the same logic as useFlattenedRows
      if (!rowGrouping || rowGrouping.length === 0) {
        return filteredPreview.map((row, index) => ({
          row,
          depth: 0,
          displayPosition: index,
          groupingKey: undefined,
          position: index,
          isLastGroupRow: false,
          rowId: [index],
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: filteredPreview,
        rowGrouping,
        getRowId,
        expandedRows,
        collapsedRows,
        expandedDepths,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
        headers: effectiveHeaders,
        rowHeight,
        headerHeight,
        customTheme,
      });
    },
    [
      computeFilteredRowsPreview,
      rowGrouping,
      getRowId,
      expandedRows,
      collapsedRows,
      expandedDepths,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
      effectiveHeaders,
      rowHeight,
      headerHeight,
      customTheme,
    ],
  );

  const computeFlattenedSortedRowsPreview = useCallback(
    (accessor: Accessor) => {
      const sortedPreview = computeSortedRowsPreview(accessor);
      // Flatten the preview using the same logic as useFlattenedRows
      if (!rowGrouping || rowGrouping.length === 0) {
        return sortedPreview.map((row, index) => ({
          row,
          depth: 0,
          displayPosition: index,
          groupingKey: undefined,
          position: index,
          isLastGroupRow: false,
          rowId: [index],
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: sortedPreview,
        rowGrouping,
        getRowId,
        expandedRows,
        collapsedRows,
        expandedDepths,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
        headers: effectiveHeaders,
        rowHeight,
        headerHeight,
        customTheme,
      });
    },
    [
      computeSortedRowsPreview,
      rowGrouping,
      getRowId,
      expandedRows,
      collapsedRows,
      expandedDepths,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
      effectiveHeaders,
      rowHeight,
      headerHeight,
      customTheme,
    ],
  );

  // Calculate content height using hook (after flattenedRows is available)
  const contentHeight = useContentHeight({
    height,
    maxHeight,
    rowHeight,
    shouldPaginate,
    rowsPerPage,
    totalRowCount: totalRowCount ?? paginatableRows.length,
    headerHeight: calculatedHeaderHeight,
    footerHeight: shouldPaginate && !hideFooter ? footerHeight : undefined,
  });

  // Process rows through pagination and virtualization (now operates on flattened rows)
  const {
    currentTableRows,
    rowsToRender,
    prepareForFilterChange,
    prepareForSortChange,
    isAnimating,
    stickyParents,
    regularRows,
    partiallyVisibleRows,
    paginatedHeightOffsets,
    heightMap,
  } = useTableRowProcessing({
    allowAnimations,
    computeFilteredRowsPreview: computeFlattenedFilteredRowsPreview,
    computeSortedRowsPreview: computeFlattenedSortedRowsPreview,
    contentHeight,
    currentPage,
    customTheme,
    enableStickyParents,
    flattenedRows,
    heightOffsets,
    originalFlattenedRows,
    paginatableRows,
    parentEndPositions,
    rowGrouping,
    rowHeight,
    rowsPerPage,
    scrollDirection,
    scrollTop,
    serverSidePagination,
    shouldPaginate,
  });

  // Create a registry for cells to enable direct updates
  const cellRegistryRef = useRef<Map<string, CellRegistryEntry>>(new Map());

  // Create a registry for header cells to enable direct updates (like editing)
  const headerRegistryRef = useRef<Map<string, HeaderRegistryEntry>>(new Map());
  const {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    isCopyFlashing,
    isInitialFocusedCell,
    isSelected,
    isWarningFlashing,
    selectColumns,
    selectedCells,
    selectedColumns,
    setInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
    columnsWithSelectedCells,
    rowsWithSelectedCells,
    startCell,
  } = useSelection({
    selectableCells,
    headers: effectiveHeaders,
    tableRows: currentTableRows,
    onCellEdit,
    cellRegistry: cellRegistryRef.current,
    collapsedHeaders,
    rowHeight,
    enableRowSelection,
    copyHeadersToClipboard,
    customTheme,
  });

  // Memoize handlers
  const onSort = useCallback(
    (accessor: Accessor) => {
      // STAGE 1: Prepare animation by adding entering rows before applying sort
      prepareForSortChange(accessor);

      // STAGE 2: Apply sort after Stage 1 is rendered (next frame)
      setTimeout(() => {
        updateSort({ accessor });
      }, 0);
    },
    [prepareForSortChange, updateSort],
  );

  const onTableHeaderDragEnd = useCallback(
    (newHeaders: HeaderObject[]) => {
      setHeaders(newHeaders);
    },
    [setHeaders],
  );

  // Handle outside click
  useHandleOutsideClick({
    selectableColumns,
    selectedCells,
    selectedColumns,
    setSelectedCells,
    setSelectedColumns,
    activeHeaderDropdown,
    setActiveHeaderDropdown,
    startCell,
  });
  useWindowResize({
    forceUpdate,
    tableBodyContainerRef,
    setScrollbarWidth,
  });
  useOnGridReady({ onGridReady });
  useTableAPI({
    cellRegistryRef,
    clearAllFilters,
    clearFilter,
    currentPage,
    editColumns,
    expandedDepths,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers: effectiveHeaders,
    includeHeadersInCSVExport,
    onColumnVisibilityChange,
    onPageChange,
    paginatableRows,
    quickFilter,
    rowGrouping,
    rowIndexMap: rowIndexMapRef,
    rows: effectiveRows,
    rowsPerPage,
    serverSidePagination,
    setCollapsedRows,
    setColumnEditorOpen,
    setCurrentPage,
    setExpandedDepths,
    setExpandedRows,
    setHeaders,
    setRows: setLocalRows,
    shouldPaginate,
    sort,
    tableRef,
    totalRowCount,
    updateFilter,
    updateSort,
    visibleRows: rowsToRender,
  });
  useExternalFilters({ filters, onFilterChange });
  useExternalSort({ sort, onSortChange });

  // Custom filter handler that respects external filter handling flag
  const handleApplyFilter = useCallback(
    (filter: FilterCondition) => {
      // STAGE 1: Prepare animation by adding entering rows before applying filter
      prepareForFilterChange(filter);

      // STAGE 2: Apply filter after Stage 1 is rendered (next frame)
      setTimeout(() => {
        // Update internal state and call external handler if provided
        updateFilter(filter);
      }, 0);
    },
    [prepareForFilterChange, updateFilter],
  );

  // Check if we should show the empty state (no rows after filtering and not loading)
  const shouldShowEmptyState = !internalIsLoading && currentTableRows.length === 0;

  return (
    <TableProvider
      value={{
        activeHeaderDropdown,
        allowAnimations,
        areAllRowsSelected,
        autoExpandColumns,
        canExpandRowGroup,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        clearSelection,
        collapsedHeaders,
        columnBorders,
        columnReordering,
        columnResizing,
        columnsWithSelectedCells,
        copyHeadersToClipboard,
        draggedHeaderRef,
        editColumns,
        emptyStateRenderer,
        enableHeaderEditing,
        enableRowSelection,
        errorStateRenderer,
        expandedDepths,
        filters,
        icons: resolvedIcons,
        forceUpdate,
        getBorderClass,
        handleApplyFilter,
        handleClearAllFilters: clearAllFilters,
        handleClearFilter: clearFilter,
        handleMouseDown,
        handleMouseOver,
        handleRowSelect,
        handleSelectAll,
        handleToggleRow,
        headerContainerRef,
        headerDropdown,
        headerHeight,
        headerRegistry: headerRegistryRef.current,
        headers: effectiveHeaders,
        heightOffsets: paginatedHeightOffsets,
        hoveredHeaderRef,
        includeHeadersInCSVExport,
        isAnimating,
        isCopyFlashing,
        isInitialFocusedCell,
        isLoading: internalIsLoading,
        isResizing,
        isRowSelected,
        isScrolling,
        isSelected,
        isWarningFlashing,
        loadingStateRenderer,
        mainBodyRef,
        maxHeaderDepth,
        onCellClick,
        onCellEdit,
        onColumnOrderChange,
        onColumnSelect,
        onColumnVisibilityChange,
        onColumnWidthChange,
        onHeaderEdit,
        onLoadMore,
        onRowGroupExpand,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        rowButtons,
        rowGrouping,
        rowHeight,
        rowStateMap,
        rows: localRows,
        rowsWithSelectedCells,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        selectedColumns,
        selectedRowCount,
        selectedRows,
        selectedRowsData,
        setActiveHeaderDropdown,
        setCollapsedHeaders,
        setHeaders,
        setInitialFocusedCell,
        setIsResizing,
        setIsScrolling,
        setRowStateMap,
        setSelectedCells,
        setSelectedColumns,
        setSelectedRows,
        setExpandedDepths,
        setExpandedRows,
        setCollapsedRows,
        shouldPaginate,
        tableBodyContainerRef,
        tableEmptyStateRenderer,
        tableRows: currentTableRows,
        theme,
        customTheme,
        expandedRows,
        collapsedRows,
        useHoverRowBackground,
        useOddColumnBackground,
        useOddEvenRowBackground,
      }}
    >
      <div
        className={`simple-table-root st-wrapper theme-${theme} ${className ?? ""} ${
          columnBorders ? "st-column-borders" : ""
        }`}
        role="grid"
        style={
          maxHeight
            ? { maxHeight, height: contentHeight === undefined ? "auto" : maxHeight }
            : height
              ? { height }
              : {}
        }
      >
        <ScrollSync>
          <div className="st-wrapper-container">
            <div className="st-content-wrapper">
              <TableContent
                calculatedHeaderHeight={calculatedHeaderHeight}
                hideHeader={hideHeader}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setScrollTop={setScrollTop}
                setScrollDirection={setScrollDirection}
                shouldShowEmptyState={shouldShowEmptyState}
                sort={sort}
                tableRows={currentTableRows}
                rowsToRender={rowsToRender}
                stickyParents={stickyParents}
                regularRows={regularRows}
                partiallyVisibleRows={partiallyVisibleRows}
                heightMap={heightMap}
              />
              <TableColumnEditor
                columnEditorText={mergedColumnEditorConfig.text}
                editColumns={editColumns}
                headers={headers}
                open={columnEditorOpen}
                searchEnabled={mergedColumnEditorConfig.searchEnabled}
                searchPlaceholder={mergedColumnEditorConfig.searchPlaceholder}
                searchFunction={mergedColumnEditorConfig.searchFunction}
                setOpen={setColumnEditorOpen}
              />
            </div>
            {!shouldShowEmptyState && (
              <TableHorizontalScrollbar
                mainBodyRef={mainBodyRef}
                mainBodyWidth={mainBodyWidth}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                pinnedLeftContentWidth={pinnedLeftContentWidth}
                pinnedRightContentWidth={pinnedRightContentWidth}
                tableBodyContainerRef={tableBodyContainerRef}
              />
            )}
            {!shouldShowEmptyState && (
              <TableFooter
                currentPage={currentPage}
                footerRenderer={footerRenderer}
                hideFooter={hideFooter}
                onPageChange={setCurrentPage}
                onNextPage={onNextPage}
                onUserPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                shouldPaginate={shouldPaginate}
                totalPages={Math.ceil((totalRowCount ?? paginatableRows.length) / rowsPerPage)}
                totalRows={totalRowCount ?? paginatableRows.length}
              />
            )}
          </div>
        </ScrollSync>

        {/* Aria-live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="st-sr-only">
          {announcement}
        </div>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
