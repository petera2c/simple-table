import { createRef, Fragment } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import TableBodyProps from "../../types/TableBodyProps";
import { displayCell } from "../../stories/examples/PinnedColumns/PinnedColumnsUtil";

const TableBody = ({
  allowAnimations,
  currentRows,
  draggedHeaderRef,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  mainTemplateColumns,
  onCellChange,
  onTableHeaderDragEnd,
  pinnedLeftRef,
  pinnedLeftTemplateColumns,
  pinnedRightTemplateColumns,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: TableBodyProps) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        overflow: "auto",
        height: "max-content",
      }}
    >
      <div
        ref={pinnedLeftRef}
        style={{
          display: "grid",
          gridTemplateColumns: pinnedLeftTemplateColumns,
          borderRight: "1px solid #ccc",
          height: "max-content",
        }}
      >
        {currentRows.map((row, rowIndex) => {
          return (
            <Fragment key={row.originalRowIndex}>
              <Animate
                allowAnimations={allowAnimations}
                allowHorizontalAnimate={shouldPaginate}
                draggedHeaderRef={draggedHeaderRef}
                headersRef={headersRef}
                isBody
                pauseAnimation={isWidthDragging}
                rowIndex={rowIndex + 1}
                tableRef={tableRef}
              >
                {headers.map((header, colIndex) => {
                  if (!displayCell({ hiddenColumns, header, pinned: "left" }))
                    return null;

                  let content = row[header.accessor];

                  if (header.cellRenderer) {
                    content = header.cellRenderer(row);
                  }
                  return (
                    <TableCell
                      borderClass={getBorderClass(rowIndex, colIndex)}
                      colIndex={colIndex}
                      content={content}
                      draggedHeaderRef={draggedHeaderRef}
                      header={header}
                      headersRef={headersRef}
                      hoveredHeaderRef={hoveredHeaderRef}
                      isSelected={isSelected(rowIndex, colIndex)}
                      isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                      key={header.accessor}
                      onCellChange={onCellChange}
                      onMouseDown={() =>
                        handleMouseDown({ rowIndex, colIndex })
                      }
                      onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                      onTableHeaderDragEnd={onTableHeaderDragEnd}
                      ref={createRef()}
                      row={row}
                      rowIndex={rowIndex}
                    />
                  );
                })}
                <TableLastColumnCell
                  ref={createRef()}
                  visible={shouldDisplayLastColumnCell}
                />
              </Animate>
              {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
            </Fragment>
          );
        })}
      </div>
      <div
        ref={tableRef}
        style={{
          display: "grid",
          gridTemplateColumns: mainTemplateColumns,
          overflow: "auto",
          scrollbarWidth: "none",
          height: "max-content",
        }}
      >
        {currentRows.map((row, rowIndex) => {
          return (
            <Fragment key={row.originalRowIndex}>
              <Animate
                allowAnimations={allowAnimations}
                allowHorizontalAnimate={shouldPaginate}
                draggedHeaderRef={draggedHeaderRef}
                headersRef={headersRef}
                isBody
                pauseAnimation={isWidthDragging}
                rowIndex={rowIndex + 1}
                tableRef={tableRef}
              >
                {headers.map((header, colIndex) => {
                  if (!displayCell({ hiddenColumns, header })) return null;

                  let content = row[header.accessor];

                  if (header.cellRenderer) {
                    content = header.cellRenderer(row);
                  }
                  return (
                    <TableCell
                      borderClass={getBorderClass(rowIndex, colIndex)}
                      colIndex={colIndex}
                      content={content}
                      draggedHeaderRef={draggedHeaderRef}
                      header={header}
                      headersRef={headersRef}
                      hoveredHeaderRef={hoveredHeaderRef}
                      isSelected={isSelected(rowIndex, colIndex)}
                      isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                      key={header.accessor}
                      onCellChange={onCellChange}
                      onMouseDown={() =>
                        handleMouseDown({ rowIndex, colIndex })
                      }
                      onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                      onTableHeaderDragEnd={onTableHeaderDragEnd}
                      ref={createRef()}
                      row={row}
                      rowIndex={rowIndex}
                    />
                  );
                })}
                <TableLastColumnCell
                  ref={createRef()}
                  visible={shouldDisplayLastColumnCell}
                />
              </Animate>
              {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
            </Fragment>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: pinnedRightTemplateColumns,
        }}
      >
        {currentRows.map((row, rowIndex) => {
          return (
            <Fragment key={row.originalRowIndex}>
              <Animate
                allowAnimations={allowAnimations}
                allowHorizontalAnimate={shouldPaginate}
                draggedHeaderRef={draggedHeaderRef}
                headersRef={headersRef}
                isBody
                pauseAnimation={isWidthDragging}
                rowIndex={rowIndex + 1}
                tableRef={tableRef}
              >
                {headers.map((header, colIndex) => {
                  if (!displayCell({ hiddenColumns, header, pinned: "right" }))
                    return null;

                  let content = row[header.accessor];

                  if (header.cellRenderer) {
                    content = header.cellRenderer(row);
                  }
                  return (
                    <TableCell
                      borderClass={getBorderClass(rowIndex, colIndex)}
                      colIndex={colIndex}
                      content={content}
                      draggedHeaderRef={draggedHeaderRef}
                      header={header}
                      headersRef={headersRef}
                      hoveredHeaderRef={hoveredHeaderRef}
                      isSelected={isSelected(rowIndex, colIndex)}
                      isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                      key={header.accessor}
                      onCellChange={onCellChange}
                      onMouseDown={() =>
                        handleMouseDown({ rowIndex, colIndex })
                      }
                      onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                      onTableHeaderDragEnd={onTableHeaderDragEnd}
                      ref={createRef()}
                      row={row}
                      rowIndex={rowIndex}
                    />
                  );
                })}
                <TableLastColumnCell
                  ref={createRef()}
                  visible={shouldDisplayLastColumnCell}
                />
              </Animate>
              {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TableBody;
