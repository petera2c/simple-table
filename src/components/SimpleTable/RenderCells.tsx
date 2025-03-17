import { createRef, RefObject, useEffect, useState } from "react";

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
  rowIndex: RefObject<number>;
  shouldDisplayLastColumnCell: boolean;
} & Omit<TableBodyProps, "currentRows">) => {
  // Local state
  const [isExpanded, setIsExpanded] = useState(row.rowMeta?.isExpanded);

  // Derived state
  const children = row.rowMeta?.children;

  useEffect(() => {
    rowIndex.current = rowIndex.current + 1;
  }, [rowIndex]);

  return (
    <Animate
      allowAnimations={props.allowAnimations}
      allowHorizontalAnimate={props.shouldPaginate}
      draggedHeaderRef={props.draggedHeaderRef}
      headersRef={props.headersRef}
      isBody
      pauseAnimation={props.isWidthDragging}
      rowIndex={rowIndex.current + 1}
      tableRef={props.tableRef}
    >
      {rowIndex.current !== 0 && <TableRowSeparator />}
      {headers.map((header, colIndex) => {
        if (!displayCell({ hiddenColumns, header, pinned })) return null;

        let content: CellValue | ReactNode = row.rowData[header.accessor];

        if (header.cellRenderer) {
          content = header.cellRenderer(row);
        }
        return (
          <TableCell
            {...props}
            borderClass={getBorderClass(rowIndex.current, colIndex)}
            cellHasChildren={(children?.length || 0) > 0}
            colIndex={colIndex}
            content={content}
            header={header}
            isExpanded={isExpanded}
            isSelected={isSelected(rowIndex.current, colIndex)}
            isTopLeftCell={isTopLeftCell(rowIndex.current, colIndex)}
            key={colIndex}
            onExpandRow={() => setIsExpanded(!isExpanded)}
            onMouseDown={() =>
              handleMouseDown({ rowIndex: rowIndex.current, colIndex })
            }
            onMouseOver={() => handleMouseOver(rowIndex.current, colIndex)}
            row={row}
            rowIndex={rowIndex.current}
          />
        );
      })}
      <TableLastColumnCell
        ref={createRef()}
        visible={props.shouldDisplayLastColumnCell}
      />
      {isExpanded &&
        children?.map((child, childIndex) => {
          return (
            <>
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
              />
            </>
          );
        })}
    </Animate>
  );
};

export default RenderCells;
