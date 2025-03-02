import { createRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import TableLastColumnCell from "./TableLastColumnCell";
import TableHeaderProps from "../../types/TableHeaderProps";

const TableHeader = ({
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
}: TableHeaderProps) => {
  return (
    <>
      <Animate
        allowAnimations={allowAnimations}
        draggedHeaderRef={draggedHeaderRef}
        headersRef={headersRef}
        pauseAnimation={isWidthDragging}
        rowIndex={0}
        tableRef={tableRef}
      >
        {headersRef.current?.map((header, index) => {
          if (hiddenColumns[header.accessor]) return null;
          if (header.pinned) return null;

          return (
            <TableHeaderCell
              columnResizing={columnResizing}
              currentRows={currentRows}
              draggable={draggable}
              draggedHeaderRef={draggedHeaderRef}
              forceUpdate={forceUpdate}
              headersRef={headersRef}
              hoveredHeaderRef={hoveredHeaderRef}
              index={index}
              key={header.accessor}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              ref={createRef()}
              selectableColumns={selectableColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedCells={setSelectedCells}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
            />
          );
        })}
        <TableLastColumnCell
          ref={createRef()}
          visible={shouldDisplayLastColumnCell}
        />
      </Animate>
    </>
  );
};

export default TableHeader;
