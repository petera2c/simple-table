import { createRef, RefObject } from "react";

import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { displayCell } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import { ReactNode } from "react";
import TableLastColumnCell from "./TableLastColumnCell";
import TableBodyProps from "../../types/TableBodyProps";
import TableRowSeparator from "./TableRowSeparator";
import Animate from "../Animate";

const RenderCells = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  hiddenColumns,
  isRowExpanded,
  isSelected,
  isTopLeftCell,
  lastGroupRow,
  onExpandRowClick,
  pinned,
  row,
  rowIndex,
  shouldDisplayLastColumnCell,
  ...props
}: {
  depth: number;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isRowExpanded: (rowId: string | number) => boolean;
  lastGroupRow?: boolean;
  onExpandRowClick: (rowIndex: number) => void;
  pinned?: "left" | "right";
  row: Row;
  rowIndex: number;
  shouldDisplayLastColumnCell: boolean;
} & Omit<TableBodyProps, "currentRows">) => {
  // Derived state
  const children = row.rowMeta?.children;

  return (
    <Animate
      allowAnimations={props.allowAnimations}
      allowHorizontalAnimate={props.shouldPaginate}
      draggedHeaderRef={props.draggedHeaderRef}
      headersRef={props.headersRef}
      isBody
      pauseAnimation={props.isWidthDragging}
      rowIndex={rowIndex + 1}
      tableRef={props.tableRef}
    >
      {rowIndex !== 0 && <TableRowSeparator lastGroupRow={lastGroupRow} />}
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
            cellHasChildren={(children?.length || 0) > 0}
            colIndex={colIndex}
            content={content}
            header={header}
            isRowExpanded={isRowExpanded}
            isSelected={isSelected(rowIndex, colIndex)}
            isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
            key={colIndex}
            onExpandRowClick={onExpandRowClick}
            onMouseDown={() => handleMouseDown({ rowIndex: rowIndex, colIndex })}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
            row={row}
            rowIndex={rowIndex}
          />
        );
      })}
      <TableLastColumnCell ref={createRef()} visible={shouldDisplayLastColumnCell} />
    </Animate>
  );
};

export default RenderCells;
