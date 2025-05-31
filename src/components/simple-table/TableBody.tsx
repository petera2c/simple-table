import { useRef, useMemo, useState } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { RowId } from "../../types/RowId";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";
import TableBodyProps from "../../types/TableBodyProps";
import { getRowId } from "../../utils/rowUtils";

const TableBody = ({
  flattenedRowsData,
  headerContainerRef,
  isWidthDragging,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  setScrollTop,
  visibleRows,
}: TableBodyProps) => {
  // Get stable props from context
  const {
    headersRef,
    hiddenColumns,
    mainBodyRef,
    rowHeight,
    rowIdAccessor,
    scrollbarWidth,
    tableBodyContainerRef,
  } = useTableContext();

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
  const totalRowCount = getTotalRowCount(flattenedRowsData);
  const totalHeight = totalRowCount * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

  // Calculate column indices for all headers (including pinned) in one place
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headersRef,
      hiddenColumns,
      pinnedLeftColumns,
      pinnedRightColumns,
    });
  }, [headersRef, hiddenColumns, pinnedLeftColumns, pinnedRightColumns]);

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

  // For now, row expansion is not supported with the new flat structure
  // Row grouping will be handled differently using the rowGrouping prop
  const toggleRow = (rowId: RowId) => {
    // This will be implemented later when we add row grouping support
    console.log("Row expansion not yet implemented for new structure:", rowId);
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

  // Create all props needed for TableSection
  const commonProps = {
    columnIndices,
    headerContainerRef,
    headers: headersRef.current,
    hiddenColumns,
    hoveredIndex,
    isWidthDragging,
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
      {pinnedLeftColumns.length > 0 && (
        <TableSection
          {...commonProps}
          onExpandRowClick={toggleRow}
          pinned="left"
          templateColumns={pinnedLeftTemplateColumns}
          totalHeight={totalHeight}
          width={pinnedLeftWidth}
        />
      )}
      <TableSection
        {...commonProps}
        columnIndexStart={pinnedLeftColumns.length}
        onExpandRowClick={toggleRow}
        ref={mainBodyRef}
        templateColumns={mainTemplateColumns}
        totalHeight={totalHeight}
      />
      {pinnedRightColumns.length > 0 && (
        <TableSection
          {...commonProps}
          columnIndexStart={pinnedLeftColumns.length + mainTemplateColumns.length}
          onExpandRowClick={toggleRow}
          pinned="right"
          templateColumns={pinnedRightTemplateColumns}
          totalHeight={totalHeight}
          width={pinnedRightWidth}
        />
      )}
    </div>
  );
};

export default TableBody;
