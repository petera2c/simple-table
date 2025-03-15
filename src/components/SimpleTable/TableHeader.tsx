import { createRef, UIEvent, useEffect, useRef } from "react";
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
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep up to date the scroll position of the visible scroll
  useEffect(() => {
    if (!tableRef.current) return;

    const tableRefDiv = tableRef.current;

    const handleScroll = () => {
      const scrollLeft = tableRefDiv?.scrollLeft;
      // Set the scrollLeft to the tableRef.current?.scrollLeft
      if (scrollLeft !== undefined) {
        scrollRef.current?.scrollTo(scrollLeft, 0);
      }
    };

    tableRefDiv.addEventListener("scroll", handleScroll);

    return () => {
      tableRefDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [tableRef]);
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollLeft = scrollRef.current?.scrollLeft;
    if (scrollLeft !== undefined) {
      tableRef.current?.scrollTo(scrollLeft, 0);
    }
  };

  return (
    <div className="st-table-header-container">
      <div
        className="st-header-pinned-left"
        style={{
          gridTemplateColumns: pinnedLeftTemplateColumns,
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
        </Animate>
      </div>
      <div
        className="st-header-main"
        onScroll={handleScroll}
        ref={scrollRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
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
        className="st-header-pinned-right"
        style={{
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
                reverse
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
