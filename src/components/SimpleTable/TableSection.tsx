import { Fragment } from "react/jsx-runtime";
import TableRowSeparator from "./TableRowSeparator";
import Animate from "../Animate";
import RenderCells from "./RenderCells";
import Row from "../../types/Row";
import { RefObject, useEffect, useRef } from "react";
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
  const rowIndex = useRef(0);

  useEffect(() => {
    rowIndex.current = 0;
  }, []);

  return (
    <div
      className={className}
      ref={sectionRef}
      style={{
        gridTemplateColumns: templateColumns,
      }}
    >
      {rows.map((row, index) => (
        <RenderCells
          {...props}
          headers={props.headers}
          hiddenColumns={props.hiddenColumns}
          pinned={pinned}
          row={row}
          key={index}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  );
};

export default TableSection;
