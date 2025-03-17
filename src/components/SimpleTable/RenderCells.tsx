import { createRef } from "react";

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
  onExpandRowClick,
  pinned,
  row,
  rowIndex,
  ...props
}: {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isRowExpanded: (rowId: string | number) => boolean;
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
      {rowIndex !== 0 && <TableRowSeparator />}
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
      {isRowExpanded(row.rowMeta.rowId) &&
        children?.map((child, childIndex) => {
          return (
            <RenderCells
              {...props}
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              headers={headers}
              hiddenColumns={hiddenColumns}
              isSelected={isSelected}
              isTopLeftCell={isTopLeftCell}
              key={childIndex}
              pinned={pinned}
              row={child}
              rowIndex={rowIndex}
              isRowExpanded={isRowExpanded}
              onExpandRowClick={onExpandRowClick}
            />
          );
        })}
    </Animate>
  );
};

export default RenderCells;
