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
  pinnedLeftColumns,
  pinnedLeftRef,
  pinnedLeftTemplateColumns,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: TableBodyProps) => {
  return (
    <div className="st-table-body-container">
      {pinnedLeftColumns.length > 0 && (
        <div
          className="st-table-body-pinned-left"
          ref={pinnedLeftRef}
          style={{
            gridTemplateColumns: pinnedLeftTemplateColumns,
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
      )}
      <div
        className="st-table-body-main"
        ref={tableRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
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
      {pinnedRightColumns.length > 0 && (
        <div
          className="st-table-body-pinned-right"
          style={{
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
                    if (
                      !displayCell({ hiddenColumns, header, pinned: "right" })
                    )
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
      )}
    </div>
  );
};

export default TableBody;
