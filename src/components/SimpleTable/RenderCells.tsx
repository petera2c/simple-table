import { createRef } from "react";

import TableCellProps from "../../types/TableCellProps";
import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { displayCell } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import { ReactNode } from "react";
import TableLastColumnCell from "./TableLastColumnCell";
import TableBodyProps from "../../types/TableBodyProps";

const RenderCells = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  hiddenColumns,
  isSelected,
  isTopLeftCell,
  pinned,
  row,
  rowIndex,
  ...props
}: {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  pinned?: "left" | "right";
  row: Row;
  rowIndex: number;
  shouldDisplayLastColumnCell: boolean;
} & Omit<TableBodyProps, "currentRows">) => {
  return (
    <>
      {headers.map((header, colIndex) => {
        if (!displayCell({ hiddenColumns, header, pinned })) return null;

        let content: CellValue | ReactNode = row.rowData[header.accessor];

        if (header.cellRenderer) {
          content = header.cellRenderer(row);
        }
        return (
          <TableCell
            {...props}
            borderClass={getBorderClass(rowIndex, colIndex)}
            colIndex={colIndex}
            content={content}
            header={header}
            isSelected={isSelected(rowIndex, colIndex)}
            isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
            key={colIndex}
            onMouseDown={() => handleMouseDown({ rowIndex, colIndex })}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
            row={row}
            rowIndex={rowIndex}
          />
        );
      })}
      <TableLastColumnCell
        ref={createRef()}
        visible={props.shouldDisplayLastColumnCell}
      />
    </>
  );
};

export default RenderCells;
