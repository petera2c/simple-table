import { RefObject, useMemo, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

interface TableContentProps
  extends Omit<
      TableHeaderProps,
      | "shouldDisplayLastColumnCell"
      | "pinnedLeftColumns"
      | "pinnedRightColumns"
      | "mainTemplateColumns"
      | "pinnedLeftTemplateColumns"
      | "pinnedRightTemplateColumns"
    >,
    Omit<
      TableBodyProps,
      | "shouldDisplayLastColumnCell"
      | "pinnedLeftColumns"
      | "pinnedRightColumns"
      | "mainTemplateColumns"
      | "pinnedLeftTemplateColumns"
      | "pinnedRightTemplateColumns"
    > {
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
}

const TableContent = ({
  allowAnimations,
  columnResizing,
  currentRows,
  draggable,
  draggedHeaderRef,
  forceUpdate,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  onCellChange,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftRef,
  pinnedRightRef,
  selectableColumns,
  shouldPaginate,
  setIsWidthDragging,
  setSelectedCells,
  sort,
  sortDownIcon,
  sortUpIcon,
  tableRef,
}: TableContentProps) => {
  const currentHeaders = headersRef.current.filter(
    (header) => !header.hide && !header.pinned
  );
  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!tableRef.current) return false;
    const totalColumnWidth = currentHeaders.reduce(
      (acc, header) => acc + header.width,
      0
    );
    return totalColumnWidth < tableRef.current.clientWidth;
  }, [currentHeaders, tableRef]);

  const pinnedLeftColumns = headersRef.current.filter(
    (header) => header.pinned === "left" && header.hide !== true
  );
  const pinnedRightColumns = headersRef.current.filter(
    (header) => header.pinned === "right" && header.hide !== true
  );

  const pinnedLeftTemplateColumns = useMemo(() => {
    return `${pinnedLeftColumns
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [pinnedLeftColumns]);
  const mainTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return `${pinnedRightColumns
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [pinnedRightColumns]);

  const tableHeaderProps: TableHeaderProps = {
    allowAnimations,
    columnResizing,
    currentRows,
    draggable,
    draggedHeaderRef,
    forceUpdate,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isWidthDragging,
    mainTemplateColumns,
    onSort,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    selectableColumns,
    setIsWidthDragging,
    setSelectedCells,
    shouldDisplayLastColumnCell,
    sort,
    sortDownIcon,
    sortUpIcon,
    tableRef,
  };

  const tableBodyProps: TableBodyProps = {
    allowAnimations,
    currentRows,
    draggedHeaderRef,
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    headers: headersRef.current,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isSelected,
    isTopLeftCell,
    isWidthDragging,
    mainTemplateColumns,
    onCellChange,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    shouldDisplayLastColumnCell,
    shouldPaginate,
    tableRef,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
