import { createRef, Fragment } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import CellChangeProps from "../../types/CellChangeProps";

interface TableBodyProps {
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (rowIndex: number, columnIndex: number) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  isWidthDragging: boolean;
  shouldDisplayLastColumnCell: boolean;
  shouldPaginate: boolean;
  sortedRows: { [key: string]: any }[];
  onCellChange?: (props: CellChangeProps) => void;
}

const TableBody = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  onCellChange,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  sortedRows,
}: TableBodyProps & { shouldDisplayLastColumnCell: boolean }) => {
  return (
    <>
      {sortedRows.map((row, rowIndex) => {
        return (
          <Fragment key={row.originalRowIndex}>
            <Animate
              allowHorizontalAnimate={shouldPaginate}
              pauseAnimation={isWidthDragging}
            >
              {headers.map((header, columnIndex) => {
                let content = row[header.accessor];

                if (header.cellRenderer) {
                  content = header.cellRenderer(row);
                }
                return (
                  <TableCell
                    borderClass={getBorderClass(rowIndex, columnIndex)}
                    colIndex={columnIndex}
                    content={content}
                    header={header}
                    isSelected={isSelected(rowIndex, columnIndex)}
                    isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
                    key={header.accessor}
                    onCellChange={onCellChange}
                    onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
                    onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
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
            {rowIndex !== sortedRows.length - 1 && <TableRowSeparator />}
          </Fragment>
        );
      })}
    </>
  );
};

export default TableBody;
