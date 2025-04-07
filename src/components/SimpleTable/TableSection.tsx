import { Fragment, RefObject } from "react";
import TableRow from "./TableRow";
import VisibleRow from "../../types/VisibleRow";
import { RowId } from "../../types/RowId";
import TableRowSeparator from "./TableRowSeparator";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";

interface TableSectionProps {
  columnIndices: ColumnIndices;
  headerContainerRef: RefObject<HTMLDivElement | null>;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  sectionRef?: RefObject<HTMLDivElement | null>;
  templateColumns: string;
  totalHeight: number;
  visibleRows: VisibleRow[];
  width?: number;
}

const TableSection = ({
  columnIndices,
  headerContainerRef,
  headers,
  hiddenColumns,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowHeight,
  rowIndices,
  sectionRef,
  templateColumns,
  totalHeight,
  visibleRows,
  width,
}: TableSectionProps) => {
  const className = pinned ? `st-table-body-pinned-${pinned}` : "st-table-body-main";

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
        const previousRowIsExpanded = visibleRows[index - 1]?.row.rowMeta?.isExpanded;
        return (
          <Fragment key={index}>
            <TableRow
              columnIndices={columnIndices}
              gridTemplateColumns={templateColumns}
              headers={headers}
              hiddenColumns={hiddenColumns}
              index={index}
              isWidthDragging={isWidthDragging}
              onExpandRowClick={onExpandRowClick}
              pinned={pinned}
              rowHeight={rowHeight}
              rowIndices={rowIndices}
              visibleRow={visibleRow}
            />
            {index !== 0 && (
              <TableRowSeparator
                // Is last row group and it is open
                displayStrongBorder={lastGroupRow && previousRowIsExpanded}
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
