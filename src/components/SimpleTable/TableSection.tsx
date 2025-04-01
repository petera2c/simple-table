import { RefObject, useEffect, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "./TableRow";
import VisibleRow from "../../types/VisibleRow";

const TableSection = ({
  headerContainerRef,
  onExpandRowClick,
  pinned,
  rowHeight,
  sectionRef,
  templateColumns,
  totalHeight,
  visibleRows,
  width,
  ...props
}: {
  headerContainerRef: RefObject<HTMLDivElement | null>;
  onExpandRowClick: (rowIndex: number) => void;
  pinned?: "left" | "right";
  rowHeight: number;
  sectionRef?: RefObject<HTMLDivElement | null>;
  templateColumns: string;
  totalHeight: number;
  visibleRows: VisibleRow[];
  width?: number;
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
        position: "relative",
        height: `${totalHeight}px`,
        width,
      }}
    >
      {visibleRows.map((visibleRow, index) => {
        return (
          <TableRow
            getNextRowIndex={getNextRowIndex}
            gridTemplateColumns={templateColumns}
            index={index}
            key={index}
            lastGroupRow={Boolean(visibleRow.row.rowMeta?.children?.length)}
            pinned={pinned}
            props={{
              ...props,
              onExpandRowClick,
            }}
            rowHeight={rowHeight}
            visibleRow={visibleRow}
          />
        );
      })}
    </div>
  );
};

export default TableSection;
