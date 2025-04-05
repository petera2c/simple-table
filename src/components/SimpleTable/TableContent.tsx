import { useMemo, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { getColumnWidth } from "../../utils/columnUtils";
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
  const currentHeaders = headersRef.current.filter((header) => !header.hide && !header.pinned);

  const pinnedLeftColumns = headersRef.current.filter((header) => header.pinned === "left" && header.hide !== true);
  const pinnedRightColumns = headersRef.current.filter((header) => header.pinned === "right" && header.hide !== true);

  const pinnedLeftTemplateColumns = useMemo(() => {
    return `${pinnedLeftColumns.map((header) => getColumnWidth(header)).join(" ")}`;
  }, [pinnedLeftColumns]);
  const mainTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => getColumnWidth(header))
      .join(" ")}`;
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return `${pinnedRightColumns.map((header) => getColumnWidth(header)).join(" ")}`;
  }, [pinnedRightColumns]);

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
