import Row from "../../types/Row";
import { RefObject, useEffect, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "./TableRow";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";

const TableSection = ({
  headerContainerRef,
  isRowExpanded,
  onExpandRowClick,
  pinned,
  rows,
  sectionRef,
  templateColumns,
  ...props
}: {
  headerContainerRef: RefObject<HTMLDivElement | null>;
  isRowExpanded: (rowId: string | number) => boolean;
  onExpandRowClick: (rowIndex: number) => void;
  pinned?: "left" | "right";
  rows: Row[];
  sectionRef?: RefObject<HTMLDivElement | null>;
  templateColumns: string;
} & Omit<TableBodyProps, "currentRows">) => {
  const className = pinned ? `st-table-body-pinned-${pinned}` : "st-table-body-main";

  const indexCounter = useRef(0); // Persistent counter across renders

  useScrollbarVisibility({ headerContainerRef, mainSectionRef: sectionRef, pinned });
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
