import { createRef, Fragment } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";

interface TableBodyProps {
  headers: HeaderObject[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (rowIndex: number, columnIndex: number) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  sortedRows: { [key: string]: any }[];
  isWidthDragging: boolean;
}

const TableBody = ({
  headers,
  isSelected,
  isTopLeftCell,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  sortedRows,
  isWidthDragging,
}: TableBodyProps) => {
  return (
    <>
      {sortedRows.map((row, rowIndex) => (
        <Fragment key={row.id}>
          <Animate key={row.id} pause={isWidthDragging}>
            {headers.map((header, columnIndex) => (
              <TableCell
                borderClass={getBorderClass(rowIndex, columnIndex)}
                colIndex={columnIndex}
                content={row[header.accessor]}
                isSelected={isSelected(rowIndex, columnIndex)}
                isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
                key={header.accessor}
                onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
                onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
                ref={createRef()}
                rowIndex={rowIndex}
                isLastRow={rowIndex === sortedRows.length - 1}
              />
            ))}
            <TableLastColumnCell
              isLastRow={rowIndex === sortedRows.length - 1}
              ref={createRef()}
            />
          </Animate>
          {rowIndex !== sortedRows.length - 1 && <TableRowSeparator />}
        </Fragment>
      ))}
    </>
  );
};

export default TableBody;
