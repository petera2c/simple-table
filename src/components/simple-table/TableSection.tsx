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
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  hoveredIndex: number | null;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  ref?: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  templateColumns: string;
  totalHeight: number;
  visibleRows: VisibleRow[];
  width?: number;
}

const TableSection = ({
  columnIndices,
  headers,
  hiddenColumns,
  hoveredIndex,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  ref,
  rowHeight,
  rowIndices,
  setHoveredIndex,
  templateColumns,
  totalHeight,
  visibleRows,
  width,
}: TableSectionProps) => {
  const className = pinned ? `st-body-pinned-${pinned}` : "st-body-main";

  return (
    <div
      className={className}
      ref={ref}
      style={{
        position: "relative",
        height: `${totalHeight}px`,
        width,
        ...(!pinned && { flexGrow: 1 }),
      }}
    >
      {visibleRows.map((visibleRow, index) => {
        const lastRow = visibleRows[index - 1];
        const isRowExpanded = Boolean(
          lastRow?.depth !== visibleRow?.depth &&
            visibleRow?.row.rowMeta?.children?.length &&
            visibleRow.depth === 0
        );

        return (
          <Fragment key={visibleRow.position}>
            {index !== 0 && (
              <TableRowSeparator
                // Is last row group and it is open
                displayStrongBorder={isRowExpanded}
                position={visibleRow.position}
                rowHeight={rowHeight}
                templateColumns={templateColumns}
              />
            )}
            <TableRow
              columnIndices={columnIndices}
              gridTemplateColumns={templateColumns}
              headers={headers}
              hiddenColumns={hiddenColumns}
              hoveredIndex={hoveredIndex}
              index={index}
              isWidthDragging={isWidthDragging}
              onExpandRowClick={onExpandRowClick}
              pinned={pinned}
              rowHeight={rowHeight}
              rowIndices={rowIndices}
              setHoveredIndex={setHoveredIndex}
              visibleRow={visibleRow}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default TableSection;
