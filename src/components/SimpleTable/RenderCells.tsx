import { createRef } from "react";

import TableCellProps from "../../types/TableCellProps";
import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { displayCell } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import { ReactNode } from "react";
import TableLastColumnCell from "./TableLastColumnCell";

const RenderCells = ({
  row,
  rowIndex,
  headers,
  hiddenColumns,
  pinned,
  ...props
}: {
  row: Row;
  rowIndex: number;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  pinned?: "left" | "right";
  shouldDisplayLastColumnCell: boolean;
} & Omit<
  TableCellProps,
  "row" | "rowIndex" | "header" | "content" | "colIndex"
>) => {
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
            colIndex={colIndex}
            content={content}
            header={header}
            key={colIndex}
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
