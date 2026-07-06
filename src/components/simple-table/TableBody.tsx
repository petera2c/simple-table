import {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import TableSection from "./TableSection";
import StickyParentsContainer from "./StickyParentsContainer";
import {
  getTotalRowCount,
  calculateTotalHeight,
} from "../../utils/infiniteScrollUtils";
import { useTableContext, useScrollState } from "../../context/TableContext";
import { canDisplaySection } from "../../utils/generalUtils";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import { buildColumnWindow } from "../../utils/columnVirtualizationUtils";
import RowIndices from "../../types/RowIndices";
import TableBodyProps from "../../types/TableBodyProps";
import { rowIdToString } from "../../utils/rowUtils";
import { CONTAINER_RESIZE_SETTLE_MS } from "../../hooks/resizeCoalescing";

// Number of extra columns to render on each side of the horizontal viewport so that
// fast horizontal scrolling doesn't reveal blank columns before the next frame.
const COLUMN_OVERSCAN_COUNT = 3;

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
    onLoadMore,
    rowHeight,
    scrollbarWidth,
    shouldPaginate,
    tableBodyContainerRef,
    tableEmptyStateRenderer,
    customTheme,
  } = useTableContext();
  const { setIsScrolling } = useScrollState();

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
        if (
          stickyContainer &&
          stickyContainer.classList.contains("st-sticky-top")
        ) {
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

  // Refs
  const scrollTimeoutRef = useRef<number | null>(null);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  // Derived state
  const totalRowCount = getTotalRowCount(tableRows);
  const totalHeight = useMemo(
    () =>
      calculateTotalHeight(
        totalRowCount,
        rowHeight,
        heightOffsets,
        customTheme,
      ),
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

  // When no section (left, main, or right) has visible columns, no body section is rendered and the container collapses.
  // Apply minHeight so the table keeps its height and the column editor/reset remains accessible.
  const hasAnyVisibleSection = useMemo(
    () =>
      canDisplaySection(headers, "left") ||
      canDisplaySection(headers, undefined) ||
      canDisplaySection(headers, "right"),
    [headers],
  );
  const bodyContainerStyle = useMemo(
    () => (!hasAnyVisibleSection ? { minHeight: totalHeight } : undefined),
    [hasAnyVisibleSection, totalHeight],
  );

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

  // --- Column virtualization (main section only) ---
  // Headers that live in the horizontally scrollable main section (pinned excluded).
  const mainHeaders = useMemo(
    () => headers.filter((header) => !header.pinned),
    [headers],
  );

  // Track the main section's horizontal scroll position + width. This drives which
  // columns are rendered. Crucially it is independent of vertical scroll, so the
  // window's identity stays stable while scrolling vertically (rows keep their memo).
  const [columnViewport, setColumnViewport] = useState<{
    scrollLeft: number;
    width: number;
    direction: "left" | "right" | "none";
  }>({ scrollLeft: 0, width: 0, direction: "none" });
  const hScrollRafRef = useRef<number | null>(null);
  const columnWidthSettleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollLeftRef = useRef(0);

  // useLayoutEffect so the initial measurement (and therefore the first windowed
  // render) happens before paint, avoiding a flash of all columns on mount.
  useLayoutEffect(() => {
    const element = mainBodyRef.current;
    if (!element) return;

    const measure = (includeWidth: boolean) => {
      const scrollLeft = element.scrollLeft;
      const width = element.clientWidth;
      const previous = lastScrollLeftRef.current;
      const direction: "left" | "right" | "none" =
        scrollLeft > previous
          ? "right"
          : scrollLeft < previous
            ? "left"
            : "none";
      lastScrollLeftRef.current = scrollLeft;
      setColumnViewport((current) => {
        const nextWidth = includeWidth ? width : current.width;
        if (
          current.scrollLeft === scrollLeft &&
          current.width === nextWidth &&
          current.direction === direction
        ) {
          return current;
        }
        return { scrollLeft, width: nextWidth, direction };
      });
    };

    const scheduleWidthSettle = () => {
      if (columnWidthSettleRef.current !== null) {
        clearTimeout(columnWidthSettleRef.current);
      }
      columnWidthSettleRef.current = setTimeout(() => {
        columnWidthSettleRef.current = null;
        measure(true);
      }, CONTAINER_RESIZE_SETTLE_MS);
    };

    // Measure synchronously so the first paint already has the correct window.
    measure(true);

    const handleHorizontalScroll = () => {
      if (hScrollRafRef.current !== null) return;
      hScrollRafRef.current = requestAnimationFrame(() => {
        hScrollRafRef.current = null;
        measure(true);
      });
    };

    element.addEventListener("scroll", handleHorizontalScroll, {
      passive: true,
    });
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (hScrollRafRef.current !== null) return;
            hScrollRafRef.current = requestAnimationFrame(() => {
              hScrollRafRef.current = null;
              // Track scroll position immediately; defer width so column
              // virtualization does not recompute every nav-animation frame.
              measure(false);
              scheduleWidthSettle();
            });
          })
        : null;
    resizeObserver?.observe(element);

    return () => {
      element.removeEventListener("scroll", handleHorizontalScroll);
      resizeObserver?.disconnect();
      if (hScrollRafRef.current !== null) {
        cancelAnimationFrame(hScrollRafRef.current);
        hScrollRafRef.current = null;
      }
      if (columnWidthSettleRef.current !== null) {
        clearTimeout(columnWidthSettleRef.current);
        columnWidthSettleRef.current = null;
      }
    };
    // Re-attach when the main section mounts/unmounts (e.g. empty <-> populated).
  }, [mainBodyRef, shouldShowEmptyState]);

  // Compute the visible-column window for the main section. Stable during vertical
  // scroll (columnViewport unchanged) so memoized rows are untouched; only horizontal
  // scroll / column changes recompute it.
  const mainColumnWindow = useMemo(
    () =>
      buildColumnWindow({
        headers: mainHeaders,
        collapsedHeaders,
        scrollLeft: columnViewport.scrollLeft,
        viewportWidth: columnViewport.width,
        bufferColumnCount: COLUMN_OVERSCAN_COUNT,
        scrollDirection: columnViewport.direction,
        pinned: undefined,
      }),
    [mainHeaders, collapsedHeaders, columnViewport],
  );

  // Check if we should load more data
  const checkForLoadMore = useCallback(
    (element: HTMLDivElement, scrollTop: number) => {
      // Only check if we have onLoadMore callback, not paginated, and not already loading
      if (!onLoadMore || shouldPaginate || isLoadingMore) return;

      const { scrollHeight, clientHeight } = element;
      const scrollThreshold = 200; // Load more when within 200px of bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Only trigger if scrolling down and near the bottom
      if (
        distanceFromBottom <= scrollThreshold &&
        scrollTop > lastScrollTopRef.current
      ) {
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
        style={bodyContainerStyle}
      >
        {shouldShowEmptyState ? (
          <div className="st-empty-state-wrapper">
            {tableEmptyStateRenderer}
          </div>
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
              columnWindow={mainColumnWindow}
              ref={mainBodyRef}
              templateColumns={mainTemplateColumns}
              totalHeight={totalHeight}
            />
            <TableSection
              {...commonProps}
              columnIndexStart={
                pinnedLeftColumns.length + mainTemplateColumns.length
              }
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
