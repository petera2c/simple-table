import { useEffect, useMemo, useRef, useState } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";
import VisibleRow from "../../types/VisibleRow";

const containerHeight = 600;
const rowHeight = 40;
const pageSize = 15;
const bufferRowCount = 15;

// Calculate total row count recursively
const getTotalRowCount = (rows: Row[]): number => {
  let count = 0;
  const countRows = (rowList: Row[]) => {
    rowList.forEach((row) => {
      count += 1;
      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        countRows(row.rowMeta.children);
      }
    });
  };
  countRows(rows);
  return count;
};

// Get visible rows with their absolute positions
const getVisibleRows = (rows: Row[], scrollTop: number, containerHeight: number, rowHeight: number): VisibleRow[] => {
  const visibleRows: VisibleRow[] = [];
  let currentPosition = 0;
  const startOffset = Math.max(0, scrollTop - rowHeight * bufferRowCount);
  const endOffset = scrollTop + containerHeight + rowHeight * bufferRowCount;

  const traverseRows = (rowList: Row[], depth: number) => {
    for (const row of rowList) {
      const rowTop = currentPosition * rowHeight;
      if (rowTop >= endOffset) break;

      if (rowTop + rowHeight > startOffset) {
        visibleRows.push({
          row,
          depth,
          position: currentPosition,
          isLastGroupRow: Boolean(row.rowMeta.children?.length) && depth > 1,
        });
      }

      currentPosition += 1;

      if (row.rowMeta.isExpanded && row.rowMeta.children) {
        traverseRows(row.rowMeta.children, depth + 1);
      }
    }
  };

  traverseRows(rows, 0);
  return visibleRows;
};

const TableBody = (props: TableBodyProps) => {
  const {
    centerHeaderRef,
    currentRows,
    headerContainerRef,
    mainBodyRef,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftHeaderRef,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    scrollbarHorizontalRef,
    scrollbarWidth,
    tableBodyContainerRef,
  } = props;

  useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarHorizontalRef,
    scrollbarWidth,
  });

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Local state
  const [rows, setRows] = useState<Row[]>(currentRows);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [scrollTop, setScrollTop] = useState<number>(0);

  // Derived state
  const totalRowCount = getTotalRowCount(rows);
  const totalHeight = totalRowCount * rowHeight;

  const toggleRow = (rowId: number) => {
    const updateRow = (row: Row): Row => {
      if (row.rowMeta.rowId === rowId && row.rowMeta.children) {
        return { ...row, rowMeta: { ...row.rowMeta, isExpanded: !row.rowMeta.isExpanded } };
      }
      if (row.rowMeta.children) {
        return { ...row, rowMeta: { ...row.rowMeta, children: row.rowMeta.children.map(updateRow) } };
      }
      return row;
    };
    setRows((prevRows) => prevRows.map(updateRow));
  };

  const visibleRows = useMemo(
    () => getVisibleRows(rows, scrollTop, containerHeight, rowHeight),
    [rows, scrollTop, containerHeight, rowHeight]
  );

  const loadMoreRows = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newRows = currentRows.slice(page * pageSize, (page + 1) * pageSize);
    setRows((prevRows) => [...prevRows, ...newRows]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
    if (newRows.length < pageSize / 3) setHasMore(false);
  };

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      loadMoreRows();
    }
  };

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);
    if (tableBodyContainerRef.current) {
      observerRef.current.observe(tableBodyContainerRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [rows]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
    });
  };

  const leftWidth = pinnedLeftHeaderRef.current?.clientWidth ? pinnedLeftHeaderRef.current?.clientWidth + 1 : 0;
  const centerWidth = centerHeaderRef.current?.clientWidth;
  const rightWidth = pinnedRightHeaderRef.current?.clientWidth ? pinnedRightHeaderRef.current?.clientWidth + 1 : 0;

  return (
    <div className="st-table-body-container" ref={tableBodyContainerRef} onScroll={handleScroll}>
      {pinnedLeftColumns.length > 0 && (
        <TableSection
          {...props}
          onExpandRowClick={toggleRow}
          pinned="left"
          rowHeight={rowHeight}
          sectionRef={pinnedLeftRef}
          templateColumns={pinnedLeftTemplateColumns}
          totalHeight={totalHeight}
          visibleRows={visibleRows}
          width={leftWidth}
        />
      )}
      <TableSection
        {...props}
        onExpandRowClick={toggleRow}
        rowHeight={rowHeight}
        sectionRef={mainBodyRef}
        templateColumns={mainTemplateColumns}
        totalHeight={totalHeight}
        visibleRows={visibleRows}
        width={centerWidth}
      />
      {pinnedRightColumns.length > 0 && (
        <TableSection
          {...props}
          onExpandRowClick={toggleRow}
          pinned="right"
          rowHeight={rowHeight}
          sectionRef={pinnedRightRef}
          templateColumns={pinnedRightTemplateColumns}
          totalHeight={totalHeight}
          visibleRows={visibleRows}
          width={rightWidth}
        />
      )}
    </div>
  );
};

export default TableBody;
