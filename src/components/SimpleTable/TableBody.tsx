import { createRef, Fragment, MutableRefObject, RefObject } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import CellChangeProps from "../../types/CellChangeProps";
import { MouseDownProps } from "../../hooks/useSelection";

interface TableBodyProps {
  currentRows: { [key: string]: any }[];
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: MouseDownProps) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  isWidthDragging: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  shouldDisplayLastColumnCell: boolean;
  shouldPaginate: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const TableBody = ({
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
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: TableBodyProps & { shouldDisplayLastColumnCell: boolean }) => {
  return (
    <>
      {currentRows.map((row, rowIndex) => {
        return (
          <Fragment key={row.originalRowIndex}>
            <Animate
              allowHorizontalAnimate={shouldPaginate}
              draggedHeaderRef={draggedHeaderRef}
              headersRef={headersRef}
              isBody
              pauseAnimation={isWidthDragging}
              rowIndex={rowIndex + 1}
              tableRef={tableRef}
            >
              {headers.map((header, colIndex) => {
                if (hiddenColumns[header.accessor]) return null;

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
