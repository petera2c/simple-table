import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";
import TableBodyProps from "../../types/TableBodyProps";
import { getRowId } from "../../utils/rowUtils";

const TableBody = ({
  currentVisibleRows,
  rowsEnteringTheDom,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  setScrollTop,
  setScrollDirection,
  shouldShowEmptyState,
  tableRows,
}: TableBodyProps) => {
  // Get stable props from context
  const {
    collapsedHeaders,
    headerContainerRef,
    headers,
    isAnimating,
    mainBodyRef,
    onLoadMore,
    rowHeight,
    rowIdAccessor,
    scrollbarWidth,
    setIsScrolling,
    shouldPaginate,
    tableBodyContainerRef,
    tableEmptyStateRenderer,
  } = useTableContext();

  // Local state
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track hovered row elements for direct DOM manipulation
  const hoveredRowRefs = useRef<Set<HTMLElement>>(new Set());

  // Direct DOM manipulation for hover - no React re-renders
  const setHoveredIndex = useCallback((index: number | null) => {
    // Clear previous hover
    hoveredRowRefs.current.forEach((el) => el.classList.remove("hovered"));
    hoveredRowRefs.current.clear();

    if (index !== null) {
      // Find all rows with this index and add class directly
      const rows = document.querySelectorAll(`.st-body-container .st-row[data-index="${index}"]`);
      rows.forEach((row) => {
        (row as HTMLElement).classList.add("hovered");
        hoveredRowRefs.current.add(row as HTMLElement);
      });
    }
  }, []);

  // Clear hover state when animations start
  useEffect(() => {
    if (isAnimating) {
      setHoveredIndex(null);
    }
  }, [isAnimating, setHoveredIndex]);

  // Add state for section widths
  useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarWidth,
  });

  // Clean up scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  // Refs
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  // Derived state
  const totalRowCount = getTotalRowCount(tableRows);
  const totalHeight = totalRowCount * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

  // Calculate column indices for all headers (including pinned) in one place
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
      collapsedHeaders,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  // Calculate row indices for all visible rows
  const rowIndices = useMemo(() => {
    const indices: RowIndices = {};

    // Map each row's ID to its index in the visible rows array
    currentVisibleRows.forEach((tableRow, index) => {
      const rowId = String(
        getRowId({
          row: tableRow.row,
          rowIdAccessor,
          rowPath: tableRow.rowPath,
        })
      );
      indices[rowId] = index;
    });

    return indices;
  }, [currentVisibleRows, rowIdAccessor]);

  // Check if we should load more data
  const checkForLoadMore = useCallback(
    (element: HTMLDivElement, scrollTop: number) => {
      // Only check if we have onLoadMore callback, not paginated, and not already loading
      if (!onLoadMore || shouldPaginate || isLoadingMore) return;

      const { scrollHeight, clientHeight } = element;
      const scrollThreshold = 200; // Load more when within 200px of bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Only trigger if scrolling down and near the bottom
      if (distanceFromBottom <= scrollThreshold && scrollTop > lastScrollTopRef.current) {
        setIsLoadingMore(true);
        onLoadMore();

        // Reset loading state after a short delay to prevent immediate re-triggering
        setTimeout(() => {
          setIsLoadingMore(false);
        }, 1000);
      }
    },
    [onLoadMore, shouldPaginate, isLoadingMore]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const newScrollTop = element.scrollTop;

    // Set scrolling state to true when scrolling starts
    setIsScrolling(true);

    // Clear the previous scroll end timeout
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }

    // Set up timeout to detect when scrolling ends
    scrollEndTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = requestAnimationFrame(() => {
      // Detect scroll direction
      const previousScrollTop = lastScrollTopRef.current;
      const direction: "up" | "down" | "none" =
        newScrollTop > previousScrollTop
          ? "down"
          : newScrollTop < previousScrollTop
          ? "up"
          : "none";

      // Update scroll position and direction for asymmetric buffering
      setScrollTop(newScrollTop);
      setScrollDirection(direction);

      // Check if we should load more data
      checkForLoadMore(element, newScrollTop);

      // Update last scroll position for direction detection
      lastScrollTopRef.current = newScrollTop;
    });
  };

  // Create all props needed for TableSection
  const commonProps = {
    columnIndices,
    headerContainerRef,
    headers,
    rowHeight,
    rowIndices,
    currentVisibleRows,
    rowsEnteringTheDom,
    setHoveredIndex,
  };

  return (
    <div
      className="st-body-container"
      onMouseLeave={() => setHoveredIndex(null)}
      onScroll={handleScroll}
      ref={tableBodyContainerRef}
    >
      {shouldShowEmptyState ? (
        <div className="st-empty-state-wrapper">{tableEmptyStateRenderer}</div>
      ) : (
        <>
          <TableSection
            {...commonProps}
            pinned="left"
            templateColumns={pinnedLeftTemplateColumns}
            totalHeight={totalHeight}
            width={pinnedLeftWidth}
          />
          <TableSection
            {...commonProps}
            columnIndexStart={pinnedLeftColumns.length}
            ref={mainBodyRef}
            templateColumns={mainTemplateColumns}
            totalHeight={totalHeight}
          />
          <TableSection
            {...commonProps}
            columnIndexStart={pinnedLeftColumns.length + mainTemplateColumns.length}
            pinned="right"
            templateColumns={pinnedRightTemplateColumns}
            totalHeight={totalHeight}
            width={pinnedRightWidth}
          />
        </>
      )}
    </div>
  );
};

export default TableBody;
