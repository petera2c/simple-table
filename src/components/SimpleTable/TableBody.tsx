import { useRef, Dispatch, SetStateAction, RefObject, useMemo } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Row from "../../types/Row";
import TableSection from "./TableSection";
import { getTotalRowCount } from "../../utils/infiniteScrollUtils";
import { RowId } from "../../types/RowId";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import { useTableContext } from "../../context/TableContext";
import VisibleRow from "../../types/VisibleRow";
import HeaderObject from "../../types/HeaderObject";
import { displayCell } from "../../utils/cellUtils";

// Type for column indices mapping
export type ColumnIndices = Record<string, number>;

// Define props for frequently changing values
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
    const indices: ColumnIndices = {};
    let columnCounter = 0;

    const processHeader = (header: HeaderObject, isFirst: boolean = false): void => {
      // Only increment for headers that are displayed
      columnCounter++;

      // Store the column index for this header
      indices[header.accessor] = columnCounter;

      // Process children recursively, if any
      if (header.children && header.children.length > 0) {
        header.children
          .filter((child) => displayCell({ hiddenColumns, header: child }))
          .forEach((child) => {
            processHeader(child);
          });
      }
    };

    // Process all headers in order: first left-pinned, then main, then right-pinned
    // This ensures unique column indices across all sections

    // Process left-pinned headers
    pinnedLeftColumns.forEach((header) => {
      processHeader(header);
    });

    // Process main headers
    headersRef.current
      .filter((header) => !header.pinned && displayCell({ hiddenColumns, header }))
      .forEach((header) => {
        processHeader(header);
      });

    // Process right-pinned headers
    pinnedRightColumns.forEach((header) => {
      processHeader(header);
    });

    return indices;
  }, [headersRef, hiddenColumns, pinnedLeftColumns, pinnedRightColumns]);

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

  // Create all props needed for TableSection
  const commonProps = {
    headerContainerRef,
    headers: headersRef.current,
    hiddenColumns,
    isWidthDragging,
    rowHeight,
    visibleRows,
    columnIndices,
  };

  return (
    <div className="st-table-body-container" ref={tableBodyContainerRef} onScroll={handleScroll}>
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
