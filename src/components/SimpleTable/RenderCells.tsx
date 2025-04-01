import { createRef } from "react";

import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
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
  lastGroupRow?: boolean;
  onExpandRowClick: (rowIndex: number) => void;
  pinned?: "left" | "right";
  row: Row;
  rowIndex: number;
  shouldDisplayLastColumnCell: boolean;
} & Omit<TableBodyProps, "currentRows" | "headerContainerRef">) => {
  // Derived state
  const children = row.rowMeta?.children;

  return (
    <Animate
      allowAnimations={props.allowAnimations}
      allowHorizontalAnimate={props.shouldPaginate}
      draggedHeaderRef={props.draggedHeaderRef}
      headersRef={props.headersRef}
      isBody
      mainBodyRef={props.mainBodyRef}
      pauseAnimation={props.isWidthDragging}
      rowIndex={rowIndex + 1}
    >
      {rowIndex !== 0 && <TableRowSeparator lastGroupRow={lastGroupRow} />}
      {headers.map((header, colIndex) => {
        if (!displayCell({ hiddenColumns, header, pinned })) return null;

        return (
          <TableCell
            {...props}
            borderClass={getBorderClass(rowIndex, colIndex)}
            cellHasChildren={(children?.length || 0) > 0}
            colIndex={colIndex}
            header={header}
            isSelected={isSelected(rowIndex, colIndex)}
            isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
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
