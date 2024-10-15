import { createRef, Fragment } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";

interface TableBodyProps {
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (rowIndex: number, columnIndex: number) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  isWidthDragging: boolean;
  sortedRows: { [key: string]: any }[];
}

const TableBody = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  sortedRows,
}: TableBodyProps) => {
  return (
    <>
      {sortedRows.map((row, rowIndex) => {
        return (
          <Fragment key={row.id}>
            <Animate pause={isWidthDragging}>
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
                    isSelected={isSelected(rowIndex, columnIndex)}
                    isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
                    key={header.accessor}
                    onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
                    onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
                    ref={createRef()}
                    rowIndex={rowIndex}
                    isLastRow={rowIndex === sortedRows.length - 1}
                  />
                );
              })}
              <TableLastColumnCell
                isLastRow={rowIndex === sortedRows.length - 1}
                ref={createRef()}
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
