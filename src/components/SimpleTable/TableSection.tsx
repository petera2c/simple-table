import Row from "../../types/Row";
import { RefObject, useEffect, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "./TableRow";

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
  const className = pinned ? `st-table-body-pinned-${pinned}` : "st-table-body-main";

  const indexCounter = useRef(0); // Persistent counter across renders

  // Reset the counter on each render
  useEffect(() => {
    indexCounter.current = 0; // Reset to 0 when Table re-renders
  }); // No dependencies, runs on every render

  const getNextRowIndex = (): number => {
    return indexCounter.current++; // Increment and return the current index
  };

  return (
    <div
      className={className}
      ref={sectionRef}
      style={{
        gridTemplateColumns: templateColumns,
      }}
    >
      {rows.map((row, index) => (
        <TableRow
          getNextRowIndex={getNextRowIndex}
          index={index}
          key={index}
          lastGroupRow={Boolean(row.rowMeta?.children?.length)}
          pinned={pinned}
          props={{
            ...props,
            isRowExpanded,
            onExpandRowClick,
          }}
          row={row}
        />
      ))}
    </div>
  );
};

export default TableSection;
