import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import TableSection from "./TableSection";
import StickyParentsContainer from "./StickyParentsContainer";
import { getTotalRowCount, calculateTotalHeight } from "../../utils/infiniteScrollUtils";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";
import TableBodyProps from "../../types/TableBodyProps";
import { rowIdToString } from "../../utils/rowUtils";
import { useMultiScrollSync } from "../../hooks/useHeaderBodyScrollSync";

const TableBody = ({
  calculatedHeaderHeight,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  rowsToRender,
  setScrollTop,
  setScrollDirection,
  shouldShowEmptyState,
  tableRows,
  stickyParents,
  regularRows,
  partiallyVisibleRows,
  heightMap,
}: TableBodyProps) => {
  // Get stable props from context
  const {
    collapsedHeaders,
    headerContainerRef,
    headers,
    heightOffsets,
    isAnimating,
    mainBodyRef,
    pinnedLeftRef,
    pinnedRightRef,
    onLoadMore,
    rowHeight,
    scrollbarWidth,
    setIsScrolling,
    shouldPaginate,
    tableBodyContainerRef,
    tableEmptyStateRenderer,
    customTheme,
  } = useTableContext();

  // Local state
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localScrollTop, setLocalScrollTop] = useState(0);

  // Track hovered row elements for direct DOM manipulation
  const hoveredRowRefs = useRef<Set<HTMLElement>>(new Set());

  // Direct DOM manipulation for hover - no React re-renders
  const setHoveredIndex = useCallback(
    (position: number | null) => {
      // Clear ALL hovered rows across all tables (including nested ones)
      // This ensures only one table's rows are hovered at a time
      document.querySelectorAll(".st-row.hovered").forEach((el) => {
        el.classList.remove("hovered");
      });
      hoveredRowRefs.current.clear();

      if (position !== null && tableBodyContainerRef.current) {
        // Find all rows with this position within this specific table's body container
        // Only select direct child rows of the body sections (not nested table rows)
        const bodyContainer = tableBodyContainerRef.current;
        const selector = `.st-row[data-index="${position}"]:not(.st-nested-grid-row)`;

        // Query within the specific container, but filter to only direct section children
        const allRows = bodyContainer.querySelectorAll(selector);

        allRows.forEach((row) => {
          const rowElement = row as HTMLElement;
          // Check if this row belongs to this table (not a nested table)
          // by verifying its closest st-body-container is this one
          const closestBodyContainer = rowElement.closest(".st-body-container");
          if (closestBodyContainer === bodyContainer) {
            rowElement.classList.add("hovered");
            hoveredRowRefs.current.add(rowElement);
          }
        });

        // Also find sticky rows with this position (they're in .st-sticky-top, a sibling of body container)
        const stickyContainer = bodyContainer.previousElementSibling;
        if (stickyContainer && stickyContainer.classList.contains("st-sticky-top")) {
          const stickyRows = stickyContainer.querySelectorAll(selector);
          stickyRows.forEach((row) => {
            const rowElement = row as HTMLElement;
            rowElement.classList.add("hovered");
            hoveredRowRefs.current.add(rowElement);
          });
        }
      }
    },
    [tableBodyContainerRef],
  );

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

  // Set up scroll synchronization between body and header sections
  const scrollSyncConfigs = useMemo(
    () => [
      { sourceRef: pinnedLeftRef, targetSelector: ".st-header-pinned-left" },
      { sourceRef: mainBodyRef, targetSelector: ".st-header-main" },
      { sourceRef: pinnedRightRef, targetSelector: ".st-header-pinned-right" },
    ],
    [pinnedLeftRef, mainBodyRef, pinnedRightRef],
  );

  useMultiScrollSync(scrollSyncConfigs);

  // Refs
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  // Derived state
  const totalRowCount = getTotalRowCount(tableRows);
  const totalHeight = useMemo(
    () => calculateTotalHeight(totalRowCount, rowHeight, heightOffsets, customTheme),
    [totalRowCount, rowHeight, heightOffsets, customTheme],
  );

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
    rowsToRender.forEach((tableRow, index) => {
      const rowId = rowIdToString(tableRow.rowId);
      indices[rowId] = index;
    });

    return indices;
  }, [rowsToRender]);

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
    [onLoadMore, shouldPaginate, isLoadingMore],
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
      setLocalScrollTop(newScrollTop);

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
    rowsToRender,
    setHoveredIndex,
    regularRows,
  };

  return (
    <>
      {/* Sticky parents container - positioned absolutely on top */}
      {!shouldShowEmptyState && (
        <StickyParentsContainer
          calculatedHeaderHeight={calculatedHeaderHeight}
          heightMap={heightMap}
          mainTemplateColumns={mainTemplateColumns}
          partiallyVisibleRows={partiallyVisibleRows}
          pinnedLeftColumns={pinnedLeftColumns}
          pinnedLeftTemplateColumns={pinnedLeftTemplateColumns}
          pinnedLeftWidth={pinnedLeftWidth}
          pinnedRightColumns={pinnedRightColumns}
          pinnedRightTemplateColumns={pinnedRightTemplateColumns}
          pinnedRightWidth={pinnedRightWidth}
          rowIndices={rowIndices}
          scrollTop={localScrollTop}
          scrollbarWidth={scrollbarWidth}
          setHoveredIndex={setHoveredIndex}
          stickyParents={stickyParents}
        />
      )}

      {/* Main scrolling body container */}
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
    </>
  );
};

export default TableBody;
