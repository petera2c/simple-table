import { createRef, UIEvent } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import useScrollSync from "../../hooks/useScrollSync";

const TableHeader = ({
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
}: TableHeaderProps) => {
  // Keep up to date the scroll position of the visible scroll
  useScrollSync(mainBodyRef, centerHeaderRef);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollLeft = centerHeaderRef.current?.scrollLeft;
    if (scrollLeft !== undefined) {
      mainBodyRef.current?.scrollTo(scrollLeft, 0);
    }
  };

  return (
    <div className="st-header-container" ref={headerContainerRef}>
      {pinnedLeftColumns.length > 0 && (
        <div
          className="st-header-pinned-left"
          ref={pinnedLeftHeaderRef}
          style={{
            gridTemplateColumns: pinnedLeftTemplateColumns,
          }}
        >
          <Animate
            allowAnimations={allowAnimations}
            draggedHeaderRef={draggedHeaderRef}
            headersRef={headersRef}
            mainBodyRef={mainBodyRef}
            pauseAnimation={isWidthDragging}
            rowIndex={0}
          >
            {headersRef.current?.map((header, index) => {
              if (!displayCell({ hiddenColumns, header, pinned: "left" })) return null;

              return (
                <TableHeaderCell
                  columnResizing={columnResizing}
                  currentRows={currentRows}
                  columnReordering={columnReordering}
                  draggedHeaderRef={draggedHeaderRef}
                  forceUpdate={forceUpdate}
                  headersRef={headersRef}
                  hoveredHeaderRef={hoveredHeaderRef}
                  index={index}
                  key={header.accessor}
                  onColumnOrderChange={onColumnOrderChange}
                  onSort={onSort}
                  onTableHeaderDragEnd={onTableHeaderDragEnd}
                  ref={createRef()}
                  rowHeight={rowHeight}
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
      )}
      <div
        className="st-header-main"
        onScroll={handleScroll}
        ref={centerHeaderRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
        }}
      >
        <Animate
          allowAnimations={allowAnimations}
          draggedHeaderRef={draggedHeaderRef}
          headersRef={headersRef}
          mainBodyRef={mainBodyRef}
          pauseAnimation={isWidthDragging}
          rowIndex={0}
        >
          {headersRef.current?.map((header, index) => {
            if (!displayCell({ hiddenColumns, header })) return null;

            return (
              <TableHeaderCell
                columnResizing={columnResizing}
                currentRows={currentRows}
                columnReordering={columnReordering}
                draggedHeaderRef={draggedHeaderRef}
                forceUpdate={forceUpdate}
                headersRef={headersRef}
                hoveredHeaderRef={hoveredHeaderRef}
                index={index}
                key={header.accessor}
                onColumnOrderChange={onColumnOrderChange}
                onSort={onSort}
                onTableHeaderDragEnd={onTableHeaderDragEnd}
                ref={createRef()}
                rowHeight={rowHeight}
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
      {pinnedRightColumns.length > 0 && (
        <div
          className="st-header-pinned-right"
          ref={pinnedRightHeaderRef}
          style={{
            gridTemplateColumns: pinnedRightTemplateColumns,
          }}
        >
          <Animate
            allowAnimations={allowAnimations}
            draggedHeaderRef={draggedHeaderRef}
            headersRef={headersRef}
            mainBodyRef={mainBodyRef}
            pauseAnimation={isWidthDragging}
            rowIndex={0}
          >
            {headersRef.current?.map((header, index) => {
              if (!displayCell({ hiddenColumns, header, pinned: "right" })) return null;

              return (
                <TableHeaderCell
                  columnResizing={columnResizing}
                  currentRows={currentRows}
                  columnReordering={columnReordering}
                  draggedHeaderRef={draggedHeaderRef}
                  forceUpdate={forceUpdate}
                  headersRef={headersRef}
                  hoveredHeaderRef={hoveredHeaderRef}
                  index={index}
                  key={header.accessor}
                  onColumnOrderChange={onColumnOrderChange}
                  onSort={onSort}
                  onTableHeaderDragEnd={onTableHeaderDragEnd}
                  reverse
                  ref={createRef()}
                  rowHeight={rowHeight}
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
      )}
    </div>
  );
};

export default TableHeader;
