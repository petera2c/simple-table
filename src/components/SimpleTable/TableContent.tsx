import { useMemo, useRef, Dispatch, SetStateAction } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import { useTableContext } from "../../context/TableContext";
import Row from "../../types/Row";
import SortConfig from "../../types/SortConfig";
import VisibleRow from "../../types/VisibleRow";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  currentRows: Row[];
  flattenedRows: Row[];
  isWidthDragging: boolean;
  lastSelectedColumnIndex: number | null;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  sort: SortConfig | null;
  visibleRows: VisibleRow[];
}

const TableContent = ({
  currentRows,
  flattenedRows,
  isWidthDragging,
  lastSelectedColumnIndex,
  setFlattenedRows,
  setScrollTop,
  setSelectedColumns,
  sort,
  visibleRows,
}: TableContentLocalProps) => {
  // Get stable props from context
  const {
    allowAnimations,
    columnReordering,
    columnResizing,
    draggedHeaderRef,
    editColumns,
    forceUpdate,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    mainBodyRef,
    onColumnOrderChange,
    onSort,
    onTableHeaderDragEnd,
    rowHeight,
    selectableColumns,
    selectColumns,
    setIsWidthDragging,
    sortDownIcon,
    sortUpIcon,
  } = useTableContext();

  // Refs
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const pinnedLeftHeaderRef = useRef<HTMLDivElement>(null);
  const centerHeaderRef = useRef<HTMLDivElement>(null);
  const pinnedRightHeaderRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentHeaders = headersRef.current.filter((header) => !header.pinned);

  const pinnedLeftColumns = headersRef.current.filter((header) => header.pinned === "left");
  const pinnedRightColumns = headersRef.current.filter((header) => header.pinned === "right");

  const pinnedLeftTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedLeftColumns, hiddenColumns });
  }, [pinnedLeftColumns, hiddenColumns]);
  const mainTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: currentHeaders, hiddenColumns });
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedRightColumns, hiddenColumns });
  }, [pinnedRightColumns, hiddenColumns]);

  const tableHeaderProps: TableHeaderProps = {
    allowAnimations: allowAnimations || false,
    centerHeaderRef,
    columnResizing,
    currentRows,
    columnReordering,
    draggedHeaderRef,
    forceUpdate,
    headerContainerRef,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isWidthDragging,
    lastSelectedColumnIndex,
    mainBodyRef,
    mainTemplateColumns,
    onColumnOrderChange,
    onSort,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftHeaderRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightTemplateColumns,
    rowHeight,
    selectableColumns,
    selectColumns,
    setIsWidthDragging,
    setSelectedColumns,
    sort,
    sortDownIcon,
    sortUpIcon,
  };

  const tableBodyProps = {
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
  };

  return (
    <div
      className="st-table-content"
      style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}
    >
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
