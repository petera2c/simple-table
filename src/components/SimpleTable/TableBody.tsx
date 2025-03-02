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
  onCellChange,
  onTableHeaderDragEnd,
  pinned,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: TableBodyProps) => {
  console.log(
    headers?.filter((header) => displayCell({ hiddenColumns, header, pinned }))
      .length
  );
  console.log(pinned);
  return (
    <>
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
                if (!displayCell({ hiddenColumns, header, pinned }))
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
                    onMouseDown={() => handleMouseDown({ rowIndex, colIndex })}
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
    </>
  );
};

export default TableBody;
