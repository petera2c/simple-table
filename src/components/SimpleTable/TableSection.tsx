import { RefObject, useEffect, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "./TableRow";
import VisibleRow from "../../types/VisibleRow";

const TableSection = ({
  headerContainerRef,
  isRowExpanded,
  onExpandRowClick,
  pinned,
  sectionRef,
  templateColumns,
  totalHeight,
  visibleRows,
  ...props
}: {
  headerContainerRef: RefObject<HTMLDivElement | null>;
  isRowExpanded: (rowId: string | number) => boolean;
  onExpandRowClick: (rowIndex: number) => void;
  pinned?: "left" | "right";
  sectionRef?: RefObject<HTMLDivElement | null>;
  templateColumns: string;
  totalHeight: number;
  visibleRows: VisibleRow[];
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
        ...(pinned === "left"
          ? { width: "251px" }
          : pinned === "right"
          ? { width: "201px" }
          : { width: "calc(100% - 453px)" }),
        position: "relative",
        height: `${totalHeight}px`,
      }}
    >
      {visibleRows.map((visibleRow, index) => (
        <TableRow
          getNextRowIndex={getNextRowIndex}
          index={index}
          key={index}
          lastGroupRow={Boolean(visibleRow.row.rowMeta?.children?.length)}
          pinned={pinned}
          props={{
            ...props,
            isRowExpanded,
            onExpandRowClick,
          }}
          visibleRow={visibleRow}
        />
      ))}
    </div>
  );
};

export default TableSection;
