import { useRef, Dispatch, SetStateAction, RefObject, useMemo, useState, useEffect } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { RowId } from "../../types/RowId";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import { useTableContext } from "../../context/TableContext";
import VisibleRow from "../../types/VisibleRow";
import HeaderObject from "../../types/HeaderObject";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";

interface TableBodyLocalProps {
  centerHeaderRef: RefObject<HTMLDivElement | null>;
  flattenedRows: Row[];
  headerContainerRef: RefObject<HTMLDivElement | null>;
  isWidthDragging: boolean;
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedLeftTemplateColumns: string;
  pinnedRightColumns: HeaderObject[];
  pinnedRightHeaderRef: RefObject<HTMLDivElement | null>;
  pinnedRightTemplateColumns: string;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  visibleRows: VisibleRow[];
}

const TableBody = ({
  centerHeaderRef,
  flattenedRows,
  headerContainerRef,
  isWidthDragging,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftHeaderRef,
  pinnedLeftTemplateColumns,
  pinnedRightColumns,
  pinnedRightHeaderRef,
  pinnedRightTemplateColumns,
  setFlattenedRows,
  setScrollTop,
  visibleRows,
}: TableBodyLocalProps) => {
  // Get stable props from context
  const {
    rowHeight,
    scrollbarWidth,
    mainBodyRef,
    pinnedLeftRef,
    pinnedRightRef,
    tableBodyContainerRef,
    hiddenColumns,
    headersRef,
  } = useTableContext();

  // Add state for section widths
  const [leftWidth, setLeftWidth] = useState(0);
  const [centerWidth, setCenterWidth] = useState<number | undefined>(undefined);
  const [rightWidth, setRightWidth] = useState(0);

  // Update widths when references change or on window resize
  useEffect(() => {
    const updateWidths = () => {
      setLeftWidth(
        pinnedLeftHeaderRef.current?.clientWidth ? pinnedLeftHeaderRef.current.clientWidth + 1 : 0
      );
      setCenterWidth(centerHeaderRef.current?.clientWidth);
      setRightWidth(
        pinnedRightHeaderRef.current?.clientWidth ? pinnedRightHeaderRef.current.clientWidth + 1 : 0
      );
    };

    // Initial update
    updateWidths();

    // Listen for resize events
    window.addEventListener("resize", updateWidths);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateWidths);
    };
  }, [pinnedLeftHeaderRef, centerHeaderRef, pinnedRightHeaderRef, isWidthDragging]);

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
      const rowId = String(visibleRow.row.rowMeta.rowId);
      indices[rowId] = index;
    });

    return indices;
  }, [visibleRows]);

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

  // Create all props needed for TableSection
  const commonProps = {
    headerContainerRef,
    headers: headersRef.current,
    hiddenColumns,
    isWidthDragging,
    rowHeight,
    visibleRows,
    columnIndices,
    rowIndices,
  };

  return (
    <div className="st-body-container" ref={tableBodyContainerRef} onScroll={handleScroll}>
      {pinnedLeftColumns.length > 0 && (
        <TableSection
          {...commonProps}
          onExpandRowClick={toggleRow}
          pinned="left"
          sectionRef={pinnedLeftRef}
          templateColumns={pinnedLeftTemplateColumns}
          totalHeight={totalHeight}
          width={leftWidth}
        />
      )}
      <TableSection
        {...commonProps}
        onExpandRowClick={toggleRow}
        sectionRef={mainBodyRef}
        templateColumns={mainTemplateColumns}
        totalHeight={totalHeight}
        width={centerWidth}
      />
      {pinnedRightColumns.length > 0 && (
        <TableSection
          {...commonProps}
          onExpandRowClick={toggleRow}
          pinned="right"
          sectionRef={pinnedRightRef}
          templateColumns={pinnedRightTemplateColumns}
          totalHeight={totalHeight}
          width={rightWidth}
        />
      )}
    </div>
  );
};

export default TableBody;
