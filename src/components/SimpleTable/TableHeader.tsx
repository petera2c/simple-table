import { createRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import TableLastColumnCell from "./TableLastColumnCell";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../stories/examples/PinnedColumns/PinnedColumnsUtil";

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
  mainTemplateColumns,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftTemplateColumns,
  pinnedRightTemplateColumns,
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
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: pinnedLeftTemplateColumns,
          borderRight: "1px solid #ccc",
        }}
      >
        <Animate
          allowAnimations={allowAnimations}
          draggedHeaderRef={draggedHeaderRef}
          headersRef={headersRef}
          pauseAnimation={isWidthDragging}
          rowIndex={0}
          tableRef={tableRef}
        >
          {headersRef.current?.map((header, index) => {
            if (!displayCell({ hiddenColumns, header, pinned: "left" }))
              return null;

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
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: mainTemplateColumns,
          // overflow: "auto",
          // scrollbarWidth: "none",
        }}
      >
        <Animate
          allowAnimations={allowAnimations}
          draggedHeaderRef={draggedHeaderRef}
          headersRef={headersRef}
          pauseAnimation={isWidthDragging}
          rowIndex={0}
          tableRef={tableRef}
        >
          {headersRef.current?.map((header, index) => {
            if (!displayCell({ hiddenColumns, header })) return null;

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
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: pinnedRightTemplateColumns,
        }}
      >
        <Animate
          allowAnimations={allowAnimations}
          draggedHeaderRef={draggedHeaderRef}
          headersRef={headersRef}
          pauseAnimation={isWidthDragging}
          rowIndex={0}
          tableRef={tableRef}
        >
          {headersRef.current?.map((header, index) => {
            if (!displayCell({ hiddenColumns, header, pinned: "right" }))
              return null;

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
      </div>
    </div>
  );
};

export default TableHeader;
