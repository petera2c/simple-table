import { RefObject, useMemo } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

interface TableContentProps
  extends Omit<TableHeaderProps, "shouldDisplayLastColumnCell">,
    Omit<TableBodyProps, "shouldDisplayLastColumnCell"> {
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
  const pinnedRightTemplateColumns = useMemo(() => {
    return `${pinnedRightColumns
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [pinnedRightColumns]);

  const mainTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);

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
    onSort,
    onTableHeaderDragEnd,
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
    onCellChange,
    onTableHeaderDragEnd,
    shouldDisplayLastColumnCell,
    shouldPaginate,
    tableRef,
  };

  const tableHeaderPropsLeft: TableHeaderProps = {
    ...tableHeaderProps,
    pinned: "left",
  };
  const tableBodyPropsLeft: TableBodyProps = {
    ...tableBodyProps,
    headers: pinnedLeftColumns,
    pinned: "left",
  };

  const tableHeaderPropsRight: TableHeaderProps = {
    ...tableHeaderProps,
    pinned: "right",
  };
  const tableBodyPropsRight: TableBodyProps = {
    ...tableBodyProps,
    headers: pinnedRightColumns,
    pinned: "right",
  };

  return (
    <>
      {pinnedLeftColumns.length > 0 && (
        <div
          className="st-table pinned-left"
          ref={pinnedLeftRef}
          style={{
            gridTemplateColumns: pinnedLeftTemplateColumns,
          }}
        >
          <TableHeader {...tableHeaderPropsLeft} />
          <TableBody {...tableBodyPropsLeft} />
        </div>
      )}
      <div
        className="st-table"
        ref={tableRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
        }}
      >
        <TableHeader {...tableHeaderProps} />
        <TableBody {...tableBodyProps} />
      </div>
      {pinnedRightColumns.length > 0 && (
        <div
          className="st-table pinned-right"
          ref={pinnedRightRef}
          style={{
            gridTemplateColumns: pinnedRightTemplateColumns,
          }}
        >
          <TableHeader {...tableHeaderPropsRight} />
          <TableBody {...tableBodyPropsRight} />
        </div>
      )}
    </>
  );
};

export default TableContent;
