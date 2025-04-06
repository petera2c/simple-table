import { useMemo, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableContentProps from "../../types/TableContentProps";

const TableContent = ({
  allowAnimations,
  columnReordering,
  columnResizing,
  currentRows,
  draggedHeaderRef,
  editColumns,
  flattenedRows,
  forceUpdate,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isSelected,
  isInitialFocusedCell,
  isWidthDragging,
  mainBodyRef,
  onCellEdit,
  onColumnOrderChange,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftRef,
  pinnedRightRef,
  rowHeight,
  scrollbarWidth,
  selectableColumns,
  setIsWidthDragging,
  setFlattenedRows,
  setScrollTop,
  setSelectedCells,
  shouldPaginate,
  sort,
  sortDownIcon,
  sortUpIcon,
  tableBodyContainerRef,
  visibleRows,
}: TableContentProps) => {
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
    allowAnimations,
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
    setIsWidthDragging,
    setSelectedCells,
    sort,
    sortDownIcon,
    sortUpIcon,
    tableBodyContainerRef,
  };

  const tableBodyProps: TableBodyProps = {
    allowAnimations,
    centerHeaderRef,
    draggedHeaderRef,
    flattenedRows,
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    headerContainerRef,
    headers: headersRef.current,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isSelected,
    isInitialFocusedCell,
    isWidthDragging,
    mainBodyRef,
    mainTemplateColumns,
    onCellEdit,
    onTableHeaderDragEnd,
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
    shouldPaginate,
    setScrollTop,
    tableBodyContainerRef,
    visibleRows,
  };

  return (
    <div className="st-table-content" style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}>
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
