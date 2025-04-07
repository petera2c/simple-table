import { Fragment, RefObject, useEffect, useRef } from "react";
import TableRow from "./TableRow";
import VisibleRow from "../../types/VisibleRow";
import { RowId } from "../../types/RowId";
import TableRowSeparator from "./TableRowSeparator";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";

interface TableSectionProps {
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowHeight: number;
  sectionRef?: RefObject<HTMLDivElement | null>;
  templateColumns: string;
  totalHeight: number;
  visibleRows: VisibleRow[];
  width?: number;
}

const TableSection = ({
  headerContainerRef,
  headers,
  hiddenColumns,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowHeight,
  sectionRef,
  templateColumns,
  totalHeight,
  visibleRows,
  width,
}: TableSectionProps) => {
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
        const lastGroupRow = Boolean(visibleRow.row.rowMeta?.children?.length);
        return (
          <Fragment key={index}>
            <TableRow
              getNextRowIndex={getNextRowIndex}
              gridTemplateColumns={templateColumns}
              headers={headers}
              hiddenColumns={hiddenColumns}
              index={index}
              isWidthDragging={isWidthDragging}
              onExpandRowClick={onExpandRowClick}
              pinned={pinned}
              rowHeight={rowHeight}
              visibleRow={visibleRow}
            />
            {index !== 0 && (
              <TableRowSeparator
                lastGroupRow={lastGroupRow}
                position={visibleRow.position}
                rowHeight={rowHeight}
                templateColumns={templateColumns}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default TableSection;
