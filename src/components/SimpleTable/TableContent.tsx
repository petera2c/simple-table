import { useMemo } from "react";
import SharedTableProps from "../../types/SharedTableProps";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import PinnedLeftColumns from "./PinnedLeftColumns";
import PinnedRightColumns from "./PinnedRightColumns";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

interface TableContentProps
  extends Omit<TableHeaderProps, "shouldDisplayLastColumnCell">,
    Omit<TableBodyProps, "shouldDisplayLastColumnCell"> {}

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
  }, [currentHeaders]);

  const pinnedLeftColumns = headersRef.current.filter(
    (header) => header.pinned && header.hide !== true
  );
  const pinnedRightColumns = headersRef.current.filter(
    (header) => header.pinned && header.hide !== true
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
      .filter(
        (header) => hiddenColumns[header.accessor] !== true && !header.pinned
      )
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);

  return (
    <>
      {/* <div
        className="st-table"
        style={{
          gridTemplateColumns: pinnedLeftTemplateColumns,
        }}
      >
        <PinnedLeftColumns />
      </div> */}
      <div
        className="st-table"
        ref={tableRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
        }}
      >
        <TableHeader
          allowAnimations={allowAnimations}
          columnResizing={columnResizing}
          currentRows={currentRows}
          draggable={draggable}
          draggedHeaderRef={draggedHeaderRef}
          forceUpdate={forceUpdate}
          headersRef={headersRef}
          hiddenColumns={hiddenColumns}
          hoveredHeaderRef={hoveredHeaderRef}
          isWidthDragging={isWidthDragging}
          onSort={onSort}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          selectableColumns={selectableColumns}
          setIsWidthDragging={setIsWidthDragging}
          setSelectedCells={setSelectedCells}
          shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
          sort={sort}
          sortDownIcon={sortDownIcon}
          sortUpIcon={sortUpIcon}
          tableRef={tableRef}
        />

        <TableBody
          allowAnimations={allowAnimations}
          currentRows={currentRows}
          draggedHeaderRef={draggedHeaderRef}
          getBorderClass={getBorderClass}
          handleMouseDown={handleMouseDown}
          handleMouseOver={handleMouseOver}
          headers={headersRef.current}
          headersRef={headersRef}
          hiddenColumns={hiddenColumns}
          hoveredHeaderRef={hoveredHeaderRef}
          isSelected={isSelected}
          isTopLeftCell={isTopLeftCell}
          isWidthDragging={isWidthDragging}
          onCellChange={onCellChange}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
          shouldPaginate={shouldPaginate}
          tableRef={tableRef}
        />
      </div>
      {/* <div
        className="st-table"
        style={{
          gridTemplateColumns: pinnedRightTemplateColumns,
        }}
      >
        <PinnedRightColumns />
      </div> */}
    </>
  );
};

export default TableContent;
