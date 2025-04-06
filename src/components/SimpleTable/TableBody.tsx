import { useRef } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { RowId } from "../../types/RowId";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";

const TableBody = (props: TableBodyProps) => {
  const {
    centerHeaderRef,
    flattenedRows,
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
    setFlattenedRows,
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
  const scrollTimeoutRef = useRef<number | null>(null);

  // Derived state
  const totalRowCount = getTotalRowCount(flattenedRows);
  const totalHeight = totalRowCount * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

  const toggleRow = (rowId: RowId) => {
    const updateRow = (row: Row): Row => {
      if (row.rowMeta.rowId === rowId && row.rowMeta.children) {
        return { ...row, rowMeta: { ...row.rowMeta, isExpanded: !row.rowMeta.isExpanded } };
      }
      if (row.rowMeta.children) {
        return {
          ...row,
          rowMeta: { ...row.rowMeta, children: row.rowMeta.children.map(updateRow) },
        };
      }
      return row;
    };
    setFlattenedRows((prevRows) => prevRows.map(updateRow));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
    });
  };

  const leftWidth = pinnedLeftHeaderRef.current?.clientWidth
    ? pinnedLeftHeaderRef.current?.clientWidth + 1
    : 0;
  const centerWidth = centerHeaderRef.current?.clientWidth;
  const rightWidth = pinnedRightHeaderRef.current?.clientWidth
    ? pinnedRightHeaderRef.current?.clientWidth + 1
    : 0;

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
