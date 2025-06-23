import { useRef, useMemo, useState } from "react";
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
  headerContainerRef,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  setScrollTop,
  tableRows,
  visibleRows,
}: TableBodyProps) => {
  // Get stable props from context
  const { headers, mainBodyRef, rowHeight, rowIdAccessor, scrollbarWidth, tableBodyContainerRef } =
    useTableContext();

  // Local state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add state for section widths
  useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarWidth,
  });

  // Refs
  const scrollTimeoutRef = useRef<number | null>(null);

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
    visibleRows.forEach((visibleRow, index) => {
      const rowId = String(getRowId(visibleRow.row, index, rowIdAccessor));
      indices[rowId] = index;
    });

    return indices;
  }, [visibleRows, rowIdAccessor]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
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
    setHoveredIndex,
    visibleRows,
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
