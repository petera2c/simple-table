import {
  useState,
  useRef,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import useSelection from "../../hooks/useSelection";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import { AngleLeftIcon, AngleRightIcon, DescIcon, AscIcon, FilterIcon } from "../../icons";
import TableContent from "./TableContent";
import TableHorizontalScrollbar from "./TableHorizontalScrollbar";
import Row from "../../types/Row";
import useSortableData from "../../hooks/useSortableData";
import TableColumnEditor from "./table-column-editor/TableColumnEditor";
import { TableProvider, CellRegistryEntry, HeaderRegistryEntry } from "../../context/TableContext";
import { ScrollSync } from "../scroll-sync/ScrollSync";
import useFilterableData from "../../hooks/useFilterableData";
import { useContentHeight } from "../../hooks/useContentHeight";
import useHandleOutsideClick from "../../hooks/useHandleOutsideClick";
import useWindowResize from "../../hooks/useWindowResize";
import { FilterCondition,  } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { useAggregatedRows } from "../../hooks/useAggregatedRows";
import { getResponsiveMaxPinnedPercent } from "../../consts/general-consts";
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
import { getRowId, flattenRowsWithGrouping } from "../../utils/rowUtils";
import useExpandedDepths from "../../hooks/useExpandedDepths";
import DefaultEmptyState from "../empty-state/DefaultEmptyState";

import { SimpleTableProps } from "../../types/SimpleTableProps";
import "../../styles/all-themes.css";

const SimpleTable = (props: SimpleTableProps) => {
  const [isClient, setIsClient] = useState(false);
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
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  copyHeadersToClipboard = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  emptyStateRenderer,
  enableHeaderEditing = false,
  enableRowSelection = false,
  errorStateRenderer,
  expandAll = true,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  externalFilterHandling = false,
  externalSortHandling = false,
  filterIcon = <FilterIcon className="st-header-icon" />,
  footerHeight = 49,
  footerRenderer,
  headerCollapseIcon = <AngleRightIcon className="st-header-icon" />,
  headerDropdown,
  headerExpandIcon = <AngleLeftIcon className="st-header-icon" />,
  headerHeight,
  height,
  hideFooter = false,
  hideHeader = false,
  includeHeadersInCSVExport = true,
  initialSortColumn,
  initialSortDirection = "asc",
  isLoading = false,
  loadingStateRenderer,
  maxHeight,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellClick,
  onCellEdit,
  onColumnOrderChange,
  onColumnSelect,
  onColumnVisibilityChange,
  onFilterChange,
  onGridReady,
  onHeaderEdit,
  onLoadMore,
  onNextPage,
  onPageChange,
  onRowGroupExpand,
  onRowSelectionChange,
  onSortChange,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowButtons,
  rowGrouping,
  rowHeight = 32,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  selectionColumnWidth = 42,
  serverSidePagination = false,
  shouldPaginate = false,
  sortDownIcon = <DescIcon className="st-header-icon" />,
  sortUpIcon = <AscIcon className="st-header-icon" />,
  tableEmptyStateRenderer = <DefaultEmptyState />,
  tableRef,
  theme = "light",
  totalRowCount,
  useHoverRowBackground = true,
  useOddColumnBackground = false,
  useOddEvenRowBackground = false,
}: SimpleTableProps) => {
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

  // Create a mapping of rowId -> absolute index for O(1) lookups
  // This maps each row to its position in the original localRows array
  const rowIndexMapRef = useRef<Map<string | number, number>>(new Map());

  // Sync local rows when prop changes and rebuild index map
  useEffect(() => {
    setLocalRows(rows);

    // Rebuild the index map
    const newIndexMap = new Map<string | number, number>();
    rows.forEach((row, index) => {
      const rowId = getRowId([index]);
      newIndexMap.set(rowId, index);
    });
    rowIndexMapRef.current = newIndexMap;
  }, [rows]);

  // Apply aggregation to current rows
  const { scrollbarWidth, setScrollbarWidth } = useScrollbarWidth({ tableBodyContainerRef });

  // Track vertical scrollbar visibility
  const { isMainSectionScrollable } = useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarWidth,
  });
  const effectiveRows = useMemo(() => {
    if (isLoading && localRows.length === 0) {
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
  }, [isLoading, localRows, rowsPerPage, isMainSectionScrollable, shouldPaginate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState(defaultHeaders);
  const [isResizing, setIsResizing] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<HeaderObject | null>(null);

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
    getInitialCollapsedHeaders
  );

  // Update headers when defaultHeaders prop changes
  useEffect(() => {
    setHeaders(defaultHeaders);
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

  // Track the last container width we scaled to and visible column count
  const lastScaledWidthRef = useRef<number>(0);
  const lastVisibleColumnCountRef = useRef<number>(0);

  // Calculate the width of the sections
  const {
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
  } = useMemo(() => {
    // Get responsive max pinned percent based on viewport width for better mobile compatibility
    const maxPinnedWidthPercent = getResponsiveMaxPinnedPercent(window.innerWidth);

    const { mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        maxPinnedWidthPercent,
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

  // Scale columns to fill container width when autoExpandColumns is enabled
  useEffect(() => {
    if (!autoExpandColumns || containerWidth === 0 || isResizing) return;

    // Helper to get all leaf headers (actual columns that render)
    const getLeafHeaders = (headers: HeaderObject[]): HeaderObject[] => {
      const leaves: HeaderObject[] = [];
      headers.forEach((header) => {
        if (header.hide) return;
        if (header.children && header.children.length > 0) {
          leaves.push(...getLeafHeaders(header.children));
        } else {
          leaves.push(header);
        }
      });
      return leaves;
    };

    // Calculate the available viewport width for the main section
    // Use the actual DOM width of the main body section if available
    // Otherwise calculate from container minus pinned sections
    let availableMainSectionWidth: number;
    if (mainBodyRef.current) {
      // Use the actual measured width from the DOM (most accurate)
      availableMainSectionWidth = mainBodyRef.current.clientWidth;
    } else {
      // Fallback calculation: container minus pinned sections
      // Note: pinnedLeftWidth and pinnedRightWidth already include PINNED_BORDER_WIDTH
      availableMainSectionWidth = Math.max(0, containerWidth - pinnedLeftWidth - pinnedRightWidth);
    }

    // If there's no space for the main section, don't scale
    if (availableMainSectionWidth <= 0) return;

    // Count visible columns in main section only (exclude pinned columns)
    const mainSectionHeaders = headers.filter((h) => !h.pinned);
    const visibleColumnCount = getLeafHeaders(mainSectionHeaders).length;
    const visibleColumnCountChanged = visibleColumnCount !== lastVisibleColumnCountRef.current;

    // Only rescale if container width changed significantly OR visible column count changed
    if (
      !visibleColumnCountChanged &&
      Math.abs(availableMainSectionWidth - lastScaledWidthRef.current) < 10
    )
      return;

    setHeaders((currentHeaders) => {
      // Calculate total width based on leaf headers in main section only (not pinned)
      const mainSectionHeaders = currentHeaders.filter((h) => !h.pinned);
      const leafHeaders = getLeafHeaders(mainSectionHeaders);
      const totalCurrentWidth = leafHeaders.reduce((total, header) => {
        const width =
          typeof header.width === "number"
            ? header.width
            : typeof header.width === "string" && header.width.endsWith("px")
            ? parseFloat(header.width)
            : 150;
        return total + width;
      }, 0);

      if (totalCurrentWidth === 0) return currentHeaders;

      // Calculate scale factor to fill available main section width
      const scaleFactor = availableMainSectionWidth / totalCurrentWidth;

      // Only scale if needed (avoid tiny adjustments)
      if (Math.abs(scaleFactor - 1) < 0.01) {
        return currentHeaders;
      }

      lastScaledWidthRef.current = availableMainSectionWidth;
      lastVisibleColumnCountRef.current = leafHeaders.length;

      // Pre-calculate all scaled widths to handle rounding properly
      // We'll track the accumulated width and adjust the last column to match exactly
      const scaledWidths = new Map<string, number>();
      let accumulatedWidth = 0;

      leafHeaders.forEach((header, index) => {
        if (header.pinned) return; // Skip pinned columns

        const currentWidth =
          typeof header.width === "number"
            ? header.width
            : typeof header.width === "string" && header.width.endsWith("px")
            ? parseFloat(header.width)
            : 150;

        let newWidth: number;
        if (index === leafHeaders.length - 1) {
          // Last column gets the remaining width to ensure exact total
          newWidth = availableMainSectionWidth - accumulatedWidth;
        } else {
          // Round intermediate columns
          newWidth = Math.round(currentWidth * scaleFactor);
          accumulatedWidth += newWidth;
        }

        scaledWidths.set(header.accessor as string, newWidth);
      });

      // Recursively scale all headers (including nested children)
      // Only scale headers in the main section (not pinned)
      const scaleHeader = (header: HeaderObject): HeaderObject => {
        if (header.hide) return header;

        const scaledChildren = header.children?.map(scaleHeader);

        // Only scale leaf headers (columns without children) that are not pinned
        if (!header.children || header.children.length === 0) {
          // Don't scale pinned columns
          if (header.pinned) {
            return {
              ...header,
              children: scaledChildren,
            };
          }

          // Use pre-calculated width from the map
          const newWidth = scaledWidths.get(header.accessor as string);
          if (newWidth !== undefined) {
            // In autoExpandColumns mode, we don't enforce minWidth to prevent horizontal overflow
            // The CSS will handle this via the updated getColumnWidth function
            return {
              ...header,
              width: newWidth,
              children: scaledChildren,
            };
          }

          // Fallback (shouldn't happen)
          const currentWidth =
            typeof header.width === "number"
              ? header.width
              : typeof header.width === "string" && header.width.endsWith("px")
              ? parseFloat(header.width)
              : 150;

          return {
            ...header,
            width: Math.round(currentWidth * scaleFactor),
            children: scaledChildren,
          };
        }

        // For parent headers, just update children
        return {
          ...header,
          children: scaledChildren,
        };
      };

      return currentHeaders.map(scaleHeader);
    });
  }, [autoExpandColumns, containerWidth, isResizing, headers, pinnedLeftWidth, pinnedRightWidth]);

  const aggregatedRows = useAggregatedRows({
    rows: effectiveRows,
    headers,
    rowGrouping,
  });

  // Use filter hook
  const {
    filters,
    filteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    computeFilteredRowsPreview,
  } = useFilterableData({
    rows: aggregatedRows,
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
  // Done BEFORE pagination so rowsPerPage correctly counts all visible rows including nested children
  const flattenedRows = useFlattenedRows({
    rows: sortedRows,
    rowGrouping,
    expandedRows,
    collapsedRows,
    expandedDepths,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
    headers: effectiveHeaders,
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
  const originalFlattenedRows = useFlattenedRows({
    rows: aggregatedRows,
    rowGrouping,
    expandedRows,
    collapsedRows,
    expandedDepths,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
    headers: effectiveHeaders,
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
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: filteredPreview,
        rowGrouping,
        expandedRows,
        collapsedRows,
        expandedDepths,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
        headers: effectiveHeaders,
      });
    },
    [
      computeFilteredRowsPreview,
      rowGrouping,
      expandedRows,
      collapsedRows,
      expandedDepths,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
      effectiveHeaders,
    ]
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
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: sortedPreview,
        rowGrouping,
        expandedRows,
        collapsedRows,
        expandedDepths,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
        headers: effectiveHeaders,
      });
    },
    [
      computeSortedRowsPreview,
      rowGrouping,
      expandedRows,
      collapsedRows,
      expandedDepths,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
      effectiveHeaders,
    ]
  );

  // Calculate content height using hook (after flattenedRows is available)
  const contentHeight = useContentHeight({
    height,
    maxHeight,
    rowHeight,
    shouldPaginate,
    rowsPerPage,
    totalRowCount: totalRowCount ?? flattenedRows.length,
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
  } = useTableRowProcessing({
    allowAnimations,
    flattenedRows,
    originalFlattenedRows,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    serverSidePagination,
    contentHeight,
    rowHeight,
    scrollTop,
    scrollDirection,
    computeFilteredRowsPreview: computeFlattenedFilteredRowsPreview,
    computeSortedRowsPreview: computeFlattenedSortedRowsPreview,
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
    headers,
    tableRows: currentTableRows,
    onCellEdit,
    cellRegistry: cellRegistryRef.current,
    collapsedHeaders,
    rowHeight,
    enableRowSelection,
    copyHeadersToClipboard,
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
    [prepareForSortChange, updateSort]
  );

  const onTableHeaderDragEnd = useCallback((newHeaders: HeaderObject[]) => {
    setHeaders(newHeaders);
  }, []);

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
    expandedDepths,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers: effectiveHeaders,
    includeHeadersInCSVExport,
    rowGrouping,
    rowIndexMap: rowIndexMapRef,
    rows: effectiveRows,
    rowsPerPage,
    serverSidePagination,
    setCollapsedRows,
    setCurrentPage,
    setExpandedDepths,
    setExpandedRows,
    setRows: setLocalRows,
    shouldPaginate,
    sort,
    tableRef,
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
    [prepareForFilterChange, updateFilter]
  );

  // Check if we should show the empty state (no rows after filtering and not loading)
  const shouldShowEmptyState = !isLoading && currentTableRows.length === 0;

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
        expandIcon,
        filterIcon,
        filters,
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
        headerCollapseIcon,
        headerContainerRef,
        headerDropdown,
        headerExpandIcon,
        headerHeight: headerHeight ?? rowHeight,
        headerRegistry: headerRegistryRef.current,
        headers: effectiveHeaders,
        hoveredHeaderRef,
        includeHeadersInCSVExport,
        isAnimating,
        isCopyFlashing,
        isInitialFocusedCell,
        isLoading,
        isResizing,
        isRowSelected,
        isScrolling,
        isSelected,
        isWarningFlashing,
        loadingStateRenderer,
        mainBodyRef,
        maxHeaderDepth,
        nextIcon,
        onCellClick,
        onCellEdit,
        onColumnOrderChange,
        onColumnSelect,
        onColumnVisibilityChange,
        onHeaderEdit,
        onLoadMore,
        onRowGroupExpand,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        prevIcon,
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
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        tableEmptyStateRenderer,
        tableRows: currentTableRows,
        theme,
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
                hideHeader={hideHeader}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setScrollTop={setScrollTop}
                setScrollDirection={setScrollDirection}
                shouldShowEmptyState={shouldShowEmptyState}
                sort={sort}
                tableRows={currentTableRows}
                rowsToRender={rowsToRender}
              />
              <TableColumnEditor
                columnEditorText={columnEditorText}
                editColumns={editColumns}
                editColumnsInitOpen={editColumnsInitOpen}
                headers={headers}
                position={columnEditorPosition}
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
                totalPages={Math.ceil((totalRowCount ?? flattenedRows.length) / rowsPerPage)}
                totalRows={totalRowCount ?? flattenedRows.length}
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
