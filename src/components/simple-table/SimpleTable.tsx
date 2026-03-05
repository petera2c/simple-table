import {
  useState,
  useRef,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { SelectionManager } from "../../managers/SelectionManager";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { createTableFooter } from "../../utils/footer/createTableFooter";
import {
  AngleLeftIcon,
  AngleRightIcon,
  DescIcon,
  AscIcon,
  FilterIcon,
  DragIcon,
} from "../../icons";
import TableContent from "./TableContent";
import {
  createHorizontalScrollbar,
  cleanupHorizontalScrollbar,
} from "../../utils/horizontalScrollbarRenderer";
import Row from "../../types/Row";
import useSortableData from "../../hooks/useSortableData";
import { createColumnEditor } from "../../utils/columnEditor/createColumnEditor";
import { TableProvider, CellRegistryEntry, HeaderRegistryEntry } from "../../context/TableContext";
import { scrollSyncManager } from "../../utils/scrollSyncManager";
import useFilterableData from "../../hooks/useFilterableData";
import { filterRowsWithQuickFilter } from "../../hooks/useQuickFilter";
import { calculateContentHeight } from "../../hooks/contentHeight";
import HandleOutsideClickManager from "../../hooks/handleOutsideClick";
import WindowResizeManager from "../../hooks/windowResize";
import { FilterCondition } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { calculateAggregatedRows } from "../../hooks/useAggregatedRows";
import { useTableDimensions } from "../../hooks/useTableDimensions";
import callOnSortChange from "../../hooks/useExternalSort";
import usePrevious from "../../hooks/usePrevious";
import { calculateScrollbarWidth } from "../../hooks/scrollbarWidth";
import callOnGridReady from "../../hooks/onGridReady";
import callOnFilterChange from "../../hooks/externalFilters";
import useTableAPI from "../../hooks/useTableAPI";
import useTableRowProcessing from "../../hooks/useTableRowProcessing";
import useFlattenedRows from "../../hooks/useFlattenedRows";
import { useRowSelection } from "../../hooks/useRowSelection";
import AriaAnnouncementManager from "../../hooks/ariaAnnouncements";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import ScrollbarVisibilityManager from "../../hooks/scrollbarVisibility";
import RowState from "../../types/RowState";
import { generateRowId, rowIdToString, flattenRowsWithGrouping } from "../../utils/rowUtils";
import ExpandedDepthsManager, { initializeExpandedDepths } from "../../hooks/expandedDepths";
import DefaultEmptyState from "../empty-state/DefaultEmptyState";
import { DEFAULT_CUSTOM_THEME, CustomTheme } from "../../types/CustomTheme";
import { DEFAULT_COLUMN_EDITOR_CONFIG } from "../../types/ColumnEditorConfig";
import { checkDeprecatedProps } from "../../utils/deprecatedPropsWarnings";
import { useAutoScaleMainSection } from "../../hooks/useAutoScaleMainSection";
import { COLUMN_EDIT_WIDTH } from "../../consts/general-consts";

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
      rowRenderer: columnEditorConfig?.rowRenderer,
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
  const horizontalScrollbarRef = useRef<HTMLElement | null>(null);

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
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Calculate scrollbar width
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;
    const width = calculateScrollbarWidth(tableBodyContainerRef.current);
    setScrollbarWidth(width);
  }, [tableBodyContainerRef]);

  // Track vertical scrollbar visibility
  const [isMainSectionScrollable, setIsMainSectionScrollable] = useState(false);
  const scrollbarVisibilityManagerRef = useRef<ScrollbarVisibilityManager | null>(null);

  useEffect(() => {
    if (
      !scrollbarVisibilityManagerRef.current &&
      headerContainerRef.current &&
      tableBodyContainerRef.current
    ) {
      scrollbarVisibilityManagerRef.current = new ScrollbarVisibilityManager({
        headerContainer: headerContainerRef.current,
        mainSection: tableBodyContainerRef.current,
        scrollbarWidth,
      });

      scrollbarVisibilityManagerRef.current.subscribe((isScrollable) => {
        setIsMainSectionScrollable(isScrollable);
      });

      setIsMainSectionScrollable(
        scrollbarVisibilityManagerRef.current.getIsMainSectionScrollable(),
      );
    }

    return () => {
      scrollbarVisibilityManagerRef.current?.destroy();
      scrollbarVisibilityManagerRef.current = null;
    };
  }, []);

  // Update scrollbar width when it changes
  useEffect(() => {
    scrollbarVisibilityManagerRef.current?.setScrollbarWidth(scrollbarWidth);
  }, [scrollbarWidth]);
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
  const scrollLeftPinnedLeft = 0;
  const scrollLeftMain = 0;
  const scrollLeftPinnedRight = 0;
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");

  // Manage expandedDepths state with automatic cleanup on rowGrouping changes
  const [expandedDepths, setExpandedDepths] = useState<Set<number>>(() =>
    initializeExpandedDepths(expandAll, rowGrouping),
  );
  const expandedDepthsManagerRef = useRef<ExpandedDepthsManager | null>(null);

  useEffect(() => {
    if (!expandedDepthsManagerRef.current) {
      expandedDepthsManagerRef.current = new ExpandedDepthsManager(expandAll, rowGrouping);
      expandedDepthsManagerRef.current.subscribe((depths) => {
        setExpandedDepths(depths);
      });
    }

    return () => {
      expandedDepthsManagerRef.current?.destroy();
      expandedDepthsManagerRef.current = null;
    };
  }, []);

  // Update when rowGrouping changes
  useEffect(() => {
    expandedDepthsManagerRef.current?.updateRowGrouping(rowGrouping);
  }, [rowGrouping]);

  // Track user's manual row expansion/collapse preferences
  const [expandedRows, setExpandedRows] = useState<Map<string, number>>(new Map());
  const [collapsedRows, setCollapsedRows] = useState<Map<string, number>>(new Map());

  // Aria-live announcements for screen readers
  const [announcement, setAnnouncement] = useState<string>("");
  const ariaAnnouncementManagerRef = useRef<AriaAnnouncementManager | null>(null);

  useEffect(() => {
    if (!ariaAnnouncementManagerRef.current) {
      ariaAnnouncementManagerRef.current = new AriaAnnouncementManager();
      ariaAnnouncementManagerRef.current.subscribe((message) => {
        setAnnouncement(message);
      });
    }

    return () => {
      ariaAnnouncementManagerRef.current?.destroy();
      ariaAnnouncementManagerRef.current = null;
    };
  }, []);

  const announce = useCallback((message: string) => {
    ariaAnnouncementManagerRef.current?.announce(message);
  }, []);

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

  // Calculate the main section container width (not content width)
  const mainSectionContainerWidth = containerWidth - pinnedLeftWidth - pinnedRightWidth;

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

  const aggregatedRows = useMemo(
    () =>
      calculateAggregatedRows({
        rows: effectiveRows,
        headers,
        rowGrouping,
      }),
    [effectiveRows, headers, rowGrouping],
  );

  // Apply quick filter first (global search across columns)
  const quickFilteredRows = useMemo(
    () =>
      filterRowsWithQuickFilter({
        rows: aggregatedRows,
        headers: effectiveHeaders,
        quickFilter,
      }),
    [aggregatedRows, effectiveHeaders, quickFilter],
  );

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


  // Calculate content height (after flattenedRows is available)
  const contentHeight = useMemo(
    () =>
      calculateContentHeight({
        height,
        maxHeight,
        rowHeight,
        shouldPaginate,
        rowsPerPage,
        totalRowCount: totalRowCount ?? paginatableRows.length,
        headerHeight: calculatedHeaderHeight,
        footerHeight: shouldPaginate && !hideFooter ? footerHeight : undefined,
      }),
    [
      height,
      maxHeight,
      rowHeight,
      shouldPaginate,
      rowsPerPage,
      totalRowCount,
      paginatableRows.length,
      calculatedHeaderHeight,
      hideFooter,
      footerHeight,
    ],
  );

  // Process rows through pagination and virtualization (now operates on flattened rows)
  const {
    currentTableRows,
    rowsToRender,
    stickyParents,
    regularRows,
    partiallyVisibleRows,
    paginatedHeightOffsets,
    heightMap,
  } = useTableRowProcessing({
    contentHeight,
    currentPage,
    customTheme,
    enableStickyParents,
    flattenedRows,
    heightOffsets,
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
  // Initialize SelectionManager
  const selectionManagerRef = useRef<SelectionManager | null>(null);

  // Initialize manager once
  if (!selectionManagerRef.current) {
    selectionManagerRef.current = new SelectionManager({
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
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      selectionManagerRef.current?.destroy();
      scrollSyncManager.cleanup();
    };
  }, []);

  // Update manager when props change
  useEffect(() => {
    selectionManagerRef.current?.updateConfig({
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
  }, [
    selectableCells,
    effectiveHeaders,
    currentTableRows,
    onCellEdit,
    collapsedHeaders,
    rowHeight,
    enableRowSelection,
    copyHeadersToClipboard,
    customTheme,
  ]);

  // Create stable references to manager methods
  const getBorderClass = useCallback((cell: any) => {
    return selectionManagerRef.current?.getBorderClass(cell) || "";
  }, []);

  const handleMouseDown = useCallback((cell: any) => {
    selectionManagerRef.current?.handleMouseDown(cell);
  }, []);

  const handleMouseOver = useCallback((cell: any) => {
    selectionManagerRef.current?.handleMouseOver(cell);
  }, []);

  const isCopyFlashing = useCallback((cell: any) => {
    return selectionManagerRef.current?.isCopyFlashing(cell) || false;
  }, []);

  const isInitialFocusedCell = useCallback((cell: any) => {
    return selectionManagerRef.current?.isInitialFocusedCell(cell) || false;
  }, []);

  const isSelected = useCallback((cell: any) => {
    return selectionManagerRef.current?.isSelected(cell) || false;
  }, []);

  const isWarningFlashing = useCallback((cell: any) => {
    return selectionManagerRef.current?.isWarningFlashing(cell) || false;
  }, []);

  const selectColumns = useCallback((columnIndices: number[], isShiftKey = false) => {
    selectionManagerRef.current?.selectColumns(columnIndices, isShiftKey);
  }, []);

  // Expose manager state as getters (these don't trigger re-renders, which is fine since DOM is updated directly)
  const selectedCells = selectionManagerRef.current?.getSelectedCells() || new Set();
  const selectedColumns = selectionManagerRef.current?.getSelectedColumns() || new Set();
  const columnsWithSelectedCells =
    selectionManagerRef.current?.getColumnsWithSelectedCells() || new Set();
  const rowsWithSelectedCells =
    selectionManagerRef.current?.getRowsWithSelectedCells() || new Set();
  const startCell = { current: selectionManagerRef.current?.getStartCell() || null };

  // Create setters for backward compatibility
  const setInitialFocusedCell = useCallback((cell: any) => {
    // This is handled internally by the manager
  }, []);

  const setSelectedCells = useCallback((value: React.SetStateAction<Set<string>>) => {
    const cells =
      typeof value === "function"
        ? value(selectionManagerRef.current?.getSelectedCells() || new Set())
        : value;
    selectionManagerRef.current?.setSelectedCells(cells);
  }, []);

  const setSelectedColumns = useCallback((value: React.SetStateAction<Set<number>>) => {
    const columns =
      typeof value === "function"
        ? value(selectionManagerRef.current?.getSelectedColumns() || new Set())
        : value;
    selectionManagerRef.current?.setSelectedColumns(columns);
  }, []);

  // Memoize handlers
  const onSort = useCallback(
    (accessor: Accessor) => {
      updateSort({ accessor });
    },
    [updateSort],
  );

  const onTableHeaderDragEnd = useCallback(
    (newHeaders: HeaderObject[]) => {
      setHeaders(newHeaders);
    },
    [setHeaders],
  );

  // Handle outside click
  const handleOutsideClickManagerRef = useRef<HandleOutsideClickManager | null>(null);

  useEffect(() => {
    if (!handleOutsideClickManagerRef.current) {
      handleOutsideClickManagerRef.current = new HandleOutsideClickManager({
        selectableColumns,
        selectedCells,
        selectedColumns,
        setSelectedCells,
        setSelectedColumns,
        activeHeaderDropdown,
        setActiveHeaderDropdown,
        startCell,
      });
      handleOutsideClickManagerRef.current.startListening();
    }

    return () => {
      handleOutsideClickManagerRef.current?.destroy();
      handleOutsideClickManagerRef.current = null;
    };
  }, []);

  // Update config when dependencies change
  useEffect(() => {
    handleOutsideClickManagerRef.current?.updateConfig({
      selectableColumns,
      selectedCells,
      selectedColumns,
      setSelectedCells,
      setSelectedColumns,
      activeHeaderDropdown,
      setActiveHeaderDropdown,
      startCell,
    });
  }, [
    selectableColumns,
    selectedCells,
    selectedColumns,
    setSelectedCells,
    setSelectedColumns,
    activeHeaderDropdown,
    setActiveHeaderDropdown,
    startCell,
  ]);
  // Window resize handler
  const windowResizeManagerRef = useRef<WindowResizeManager | null>(null);

  useLayoutEffect(() => {
    if (!windowResizeManagerRef.current) {
      windowResizeManagerRef.current = new WindowResizeManager();

      windowResizeManagerRef.current.addCallback(() => {
        // Force a re-render of the table
        forceUpdate();
        // Re-calculate the width of the scrollbar and table content
        if (!tableBodyContainerRef.current) return;

        const newScrollbarWidth =
          tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;

        setScrollbarWidth(newScrollbarWidth);
      });
    }

    return () => {
      windowResizeManagerRef.current?.destroy();
      windowResizeManagerRef.current = null;
    };
  }, [forceUpdate, tableBodyContainerRef, setScrollbarWidth]);
  // Call onGridReady callback when component mounts
  useEffect(() => {
    callOnGridReady(onGridReady);
  }, [onGridReady]);
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
  // Call onFilterChange callback when filters change
  useEffect(() => {
    callOnFilterChange(filters, onFilterChange);
  }, [filters, onFilterChange]);

  // Call onSortChange callback when sort changes
  const previousSort = usePrevious(sort);
  useEffect(() => {
    callOnSortChange(sort, previousSort, onSortChange);
  }, [sort, previousSort, onSortChange]);

  // Custom filter handler that respects external filter handling flag
  const handleApplyFilter = useCallback(
    (filter: FilterCondition) => {
      // Update internal state and call external handler if provided
      updateFilter(filter);
    },
    [updateFilter],
  );

  // Check if we should show the empty state (no rows after filtering and not loading)
  const shouldShowEmptyState = !internalIsLoading && currentTableRows.length === 0;

  // Render horizontal scrollbar using vanilla JS
  useEffect(() => {
    // Find parent container (wrapper container)
    const wrapperContainer = document.querySelector(".st-wrapper-container");
    if (!wrapperContainer || shouldShowEmptyState) {
      // Cleanup existing scrollbar if any
      if (horizontalScrollbarRef.current) {
        cleanupHorizontalScrollbar(horizontalScrollbarRef.current);
        horizontalScrollbarRef.current = null;
      }
      return;
    }

    // Cleanup existing scrollbar
    if (horizontalScrollbarRef.current) {
      cleanupHorizontalScrollbar(horizontalScrollbarRef.current);
      horizontalScrollbarRef.current = null;
    }

    // Wait for layout to settle (similar to setTimeout in original)
    setTimeout(() => {
      if (
        !mainBodyRef.current ||
        !tableBodyContainerRef.current ||
        shouldShowEmptyState
      ) {
        return;
      }

      const scrollbar = createHorizontalScrollbar({
        mainBodyRef: mainBodyRef.current,
        mainBodyWidth,
        pinnedLeftWidth,
        pinnedRightWidth,
        pinnedLeftContentWidth,
        pinnedRightContentWidth,
        tableBodyContainerRef: tableBodyContainerRef.current,
        editColumns,
      });

      if (scrollbar) {
        // Insert after content-wrapper
        const contentWrapper = wrapperContainer.querySelector(".st-content-wrapper");
        if (contentWrapper && contentWrapper.nextSibling) {
          wrapperContainer.insertBefore(scrollbar, contentWrapper.nextSibling);
        } else {
          wrapperContainer.appendChild(scrollbar);
        }
        horizontalScrollbarRef.current = scrollbar;
      }
    }, 1);

    return () => {
      if (horizontalScrollbarRef.current) {
        cleanupHorizontalScrollbar(horizontalScrollbarRef.current);
        horizontalScrollbarRef.current = null;
      }
    };
  }, [
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
    editColumns,
    shouldShowEmptyState,
  ]);

  // Create and manage vanilla JS column editor
  const columnEditorRef = useRef<ReturnType<typeof createColumnEditor> | null>(null);

  useEffect(() => {
    const container = document.getElementById("st-column-editor-container");
    if (!container) return;

    const columnEditor = createColumnEditor({
      columnEditorText: mergedColumnEditorConfig.text,
      editColumns,
      headers,
      open: columnEditorOpen,
      searchEnabled: mergedColumnEditorConfig.searchEnabled,
      searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
      searchFunction: mergedColumnEditorConfig.searchFunction,
      columnEditorConfig: mergedColumnEditorConfig,
      contextHeaders: headers,
      setHeaders,
      onColumnVisibilityChange,
      onColumnOrderChange,
      setOpen: setColumnEditorOpen,
    });

    columnEditorRef.current = columnEditor;
    container.appendChild(columnEditor.element);

    return () => {
      columnEditor.destroy();
      columnEditorRef.current = null;
    };
  }, []);

  // Update column editor when props change
  useEffect(() => {
    if (columnEditorRef.current) {
      columnEditorRef.current.update({
        columnEditorText: mergedColumnEditorConfig.text,
        editColumns,
        headers,
        open: columnEditorOpen,
        searchEnabled: mergedColumnEditorConfig.searchEnabled,
        searchPlaceholder: mergedColumnEditorConfig.searchPlaceholder,
        searchFunction: mergedColumnEditorConfig.searchFunction,
        columnEditorConfig: mergedColumnEditorConfig,
        contextHeaders: headers,
        setHeaders,
        onColumnVisibilityChange,
        onColumnOrderChange,
        setOpen: setColumnEditorOpen,
      });
    }
  }, [
    headers,
    columnEditorOpen,
    mergedColumnEditorConfig,
    editColumns,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
  ]);

  // Create and manage vanilla JS footer
  const footerRef = useRef<ReturnType<typeof createTableFooter> | null>(null);

  useEffect(() => {
    const container = document.getElementById("st-footer-container");
    if (!container) return;

    const footer = createTableFooter({
      currentPage,
      hideFooter,
      onPageChange: setCurrentPage,
      onNextPage,
      onUserPageChange: onPageChange,
      rowsPerPage,
      shouldPaginate,
      totalPages: Math.ceil((totalRowCount ?? paginatableRows.length) / rowsPerPage),
      totalRows: totalRowCount ?? paginatableRows.length,
    });

    footerRef.current = footer;
    container.appendChild(footer.element);

    return () => {
      footer.destroy();
      footerRef.current = null;
    };
  }, []);

  // Update footer when props change
  useEffect(() => {
    if (footerRef.current) {
      footerRef.current.update({
        currentPage,
        hideFooter,
        onPageChange: setCurrentPage,
        onNextPage,
        onUserPageChange: onPageChange,
        rowsPerPage,
        shouldPaginate: shouldPaginate && !shouldShowEmptyState,
        totalPages: Math.ceil((totalRowCount ?? paginatableRows.length) / rowsPerPage),
        totalRows: totalRowCount ?? paginatableRows.length,
      });
    }
  }, [
    currentPage,
    hideFooter,
    onNextPage,
    onPageChange,
    rowsPerPage,
    shouldPaginate,
    shouldShowEmptyState,
    totalRowCount,
    paginatableRows.length,
  ]);

  return (
    <TableProvider
      value={{
        activeHeaderDropdown,
        areAllRowsSelected,
        autoExpandColumns,
        canExpandRowGroup,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        clearSelection,
        collapsedHeaders,
        columnBorders,
        columnEditorConfig: mergedColumnEditorConfig,
        columnReordering,
        columnResizing,
        containerWidth,
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
          {
            ...(maxHeight
              ? { maxHeight, height: contentHeight === undefined ? "auto" : maxHeight }
              : height
                ? { height }
                : {}),
            ...({
              "--st-main-section-width": `${mainSectionContainerWidth}px`,
              "--st-scrollbar-width": `${scrollbarWidth}px`,
              "--st-editor-width": editColumns ? `${COLUMN_EDIT_WIDTH}px` : "0px",
            } as Record<string, string>),
          } as React.CSSProperties
        }
      >
        <div className="st-wrapper-container">
          <div className="st-content-wrapper">
            <TableContent
              calculatedHeaderHeight={calculatedHeaderHeight}
              hideHeader={hideHeader}
              mainBodyWidth={mainBodyWidth}
              pinnedLeftWidth={pinnedLeftWidth}
              pinnedRightWidth={pinnedRightWidth}
              scrollLeftPinnedLeft={scrollLeftPinnedLeft}
              scrollLeftMain={scrollLeftMain}
              scrollLeftPinnedRight={scrollLeftPinnedRight}
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
            <div id="st-column-editor-container" />
          </div>
          <div id="st-footer-container" />
        </div>

        {/* Aria-live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="st-sr-only">
          {announcement}
        </div>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
