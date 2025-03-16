import { Fragment } from "react/jsx-runtime";
import TableRowSeparator from "./TableRowSeparator";
import Animate from "../Animate";
import RenderCells from "./RenderCells";
import Row from "../../types/Row";
import { RefObject } from "react";
import TableBodyProps from "../../types/TableBodyProps";

const TableSection = ({
  rows,
  templateColumns,
  pinned,
  sectionRef,
  ...props
}: {
  rows: Row[];
  templateColumns: string;
  pinned?: "left" | "right";
  sectionRef?: RefObject<HTMLDivElement | null>;
} & Omit<TableBodyProps, "currentRows">) => {
  const className = pinned
    ? `st-table-body-pinned-${pinned}`
    : "st-table-body-main";

  return (
    <div
      className={className}
      ref={sectionRef}
      style={{
        gridTemplateColumns: templateColumns,
      }}
    >
      {rows.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
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
            <RenderCells
              {...props}
              borderClass={props.getBorderClass(
                rowIndex,
                props.headers.length - 1
              )}
              headers={props.headers}
              hiddenColumns={props.hiddenColumns}
              onMouseDown={() =>
                props.handleMouseDown({
                  rowIndex,
                  colIndex: props.headers.length - 1,
                })
              }
              onMouseOver={() =>
                props.handleMouseOver(rowIndex, props.headers.length - 1)
              }
              pinned={pinned}
              row={row}
              rowIndex={rowIndex}
            />
          </Animate>
          {rowIndex !== rows.length - 1 && <TableRowSeparator />}
        </Fragment>
      ))}
    </div>
  );
};

export default TableSection;
