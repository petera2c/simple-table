import RenderCells from "./RenderCells";
import Row from "../../types/Row";
import { RefObject } from "react";
import TableBodyProps from "../../types/TableBodyProps";

const RenderRow = ({
  row,
  index,
  rowIndex,
  pinned,
  props,
}: {
  row: Row;
  index: number;
  rowIndex: number;
  props: Omit<TableBodyProps, "currentRows"> & {
    isRowExpanded: (rowId: string | number) => boolean;
    onExpandRowClick: (rowIndex: number) => void;
  };
  pinned?: "left" | "right";
}) => {
  const isGroup = (row.rowMeta?.children?.length || 0) > 0;

  return (
    <>
      <RenderCells
        {...props}
        headers={props.headers}
        hiddenColumns={props.hiddenColumns}
        isRowExpanded={props.isRowExpanded}
        onExpandRowClick={props.onExpandRowClick}
        pinned={pinned}
        row={row}
        key={index}
        rowIndex={rowIndex}
      />
      {isGroup &&
        row.rowMeta?.isExpanded &&
        row.rowMeta.children?.map((child, childIndex) => (
          <RenderRow
            key={childIndex}
            row={child}
            index={childIndex}
            rowIndex={rowIndex + childIndex + 1}
            props={props}
            pinned={pinned}
          />
        ))}
    </>
  );
};

const TableSection = ({
  rows,
  templateColumns,
  pinned,
  sectionRef,
  isRowExpanded,
  onExpandRowClick,
  ...props
}: {
  rows: Row[];
  templateColumns: string;
  pinned?: "left" | "right";
  sectionRef?: RefObject<HTMLDivElement | null>;
  isRowExpanded: (rowId: string | number) => boolean;
  onExpandRowClick: (rowIndex: number) => void;
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
      {rows.map((row, index) => (
        <RenderRow
          key={index}
          row={row}
          index={index}
          rowIndex={index}
          props={{
            ...props,
            isRowExpanded,
            onExpandRowClick,
          }}
          pinned={pinned}
        />
      ))}
    </div>
  );
};

export default TableSection;
