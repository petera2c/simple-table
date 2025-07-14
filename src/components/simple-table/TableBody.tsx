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
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  rowsToRender,
  setScrollTop,
  tableRows,
}: TableBodyProps) => {
  // Get stable props from context
  const {
    headerContainerRef,
    headers,
    mainBodyRef,
    onLoadMore,
    rowHeight,
    rowIdAccessor,
    scrollbarWidth,
    setIsScrolling,
    shouldPaginate,
    tableBodyContainerRef,
  } = useTableContext();

  // Local state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns]);

  // Calculate row indices for all visible rows
  const rowIndices = useMemo(() => {
    const indices: RowIndices = {};

    // Map each row's ID to its index in the visible rows array
    rowsToRender.forEach((rowsToRender, index) => {
      const rowId = String(getRowId({ row: rowsToRender.row, rowIdAccessor }));
      indices[rowId] = index;
    });

    return indices;
  }, [rowsToRender, rowIdAccessor]);

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
      setScrollTop(newScrollTop);

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
    hoveredIndex,
    rowHeight,
    rowIndices,
    rowsToRender,
    setHoveredIndex,
  };

  return (
    <div
      className="st-body-container"
      onMouseLeave={() => setHoveredIndex(null)}
      onScroll={handleScroll}
      ref={tableBodyContainerRef}
    >
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
    </div>
  );
};

export default TableBody;
