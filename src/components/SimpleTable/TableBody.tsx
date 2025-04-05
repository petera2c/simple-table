import { useCallback, useEffect, useRef, useState } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { RowId } from "../../types/RowId";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import { PAGE_SIZE } from "../../consts/general-consts";

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
    rowHeight,
    scrollbarWidth,
    setScrollTop,
    tableBodyContainerRef,
    visibleRows,
  } = props;

  useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
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

  useEffect(() => {
    setRows(currentRows);
  }, [currentRows]);

  // Derived state
  const totalRowCount = getTotalRowCount(rows);
  const totalHeight = totalRowCount * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

  const toggleRow = (rowId: RowId) => {
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

  const loadMoreRows = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newRows = currentRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    setRows((prevRows) => [...prevRows, ...newRows]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
    if (newRows.length < PAGE_SIZE / 3) setHasMore(false);
  }, [currentRows, hasMore, isLoading, page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMoreRows();
      }
    },
    [hasMore, isLoading, loadMoreRows]
  );

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
  }, [handleObserver, rows, tableBodyContainerRef]);

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
