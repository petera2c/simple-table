import { createRef, Fragment, RefObject } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import CellChangeProps from "../../types/CellChangeProps";
import { MouseDownProps } from "../../hooks/useSelection";

interface TableBodyProps {
  currentRows: { [key: string]: any }[];
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: MouseDownProps) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  isWidthDragging: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  shouldDisplayLastColumnCell: boolean;
  shouldPaginate: boolean;
  tableRef: RefObject<HTMLDivElement>;
}

const TableBody = ({
  currentRows,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  hiddenColumns,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  onCellChange,
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
              pauseAnimation={isWidthDragging}
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
                    header={header}
                    isSelected={isSelected(rowIndex, colIndex)}
                    isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                    key={header.accessor}
                    onCellChange={onCellChange}
                    onMouseDown={() => handleMouseDown({ rowIndex, colIndex })}
                    onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
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
