import { Fragment, useMemo, forwardRef, useRef, useImperativeHandle } from "react";
import TableRow from "./TableRow";
import TableRowType from "../../types/TableRow";
import TableRowSeparator from "./TableRowSeparator";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import { canDisplaySection } from "../../utils/generalUtils";
import { rowIdToString } from "../../utils/rowUtils";

interface TableSectionProps {
  columnIndexStart?: number; // This is to know how many columns there were before this section to see if the columns are odd or even
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  rowsToRender: TableRowType[];
  setHoveredIndex: (index: number | null) => void;
  templateColumns: string;
  totalHeight: number;
  width?: number;
  regularRows: TableRowType[];
}

const TableSection = forwardRef<HTMLDivElement, TableSectionProps>(
  (
    {
      columnIndexStart,
      columnIndices,
      headers,
      pinned,
      rowHeight,
      rowIndices,
      setHoveredIndex,
      templateColumns,
      totalHeight,
      rowsToRender,
      width,
      regularRows,
    },
    ref,
  ) => {
    const className = pinned ? `st-body-pinned-${pinned}` : "st-body-main";
    const internalRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

    const canDisplay = useMemo(() => canDisplaySection(headers, pinned), [headers, pinned]);
    if (!canDisplay) return null;

    // Determine scroll sync group based on pinned state
    const scrollSyncGroup = pinned ? `pinned-${pinned}` : "default";

    return (
      <ScrollSyncPane childRef={internalRef} group={scrollSyncGroup}>
        <div
          className={className}
          ref={internalRef}
          style={{
            position: "relative",
            height: `${totalHeight}px`,
            width,
            ...(!pinned && { flexGrow: 1 }),
          }}
        >
          {/* Render regular rows */}
          {regularRows.map((tableRow, index) => {
            const rowId = tableRow.stateIndicator
              ? `state-${tableRow.stateIndicator.parentRowId}-${tableRow.position}`
              : rowIdToString(tableRow.rowId);

            return (
              <Fragment key={rowId}>
                {index !== 0 && (
                  <TableRowSeparator
                    displayStrongBorder={tableRow.isLastGroupRow}
                    position={tableRow.position}
                    rowHeight={rowHeight}
                    templateColumns={templateColumns}
                  />
                )}
                <TableRow
                  columnIndexStart={columnIndexStart}
                  columnIndices={columnIndices}
                  gridTemplateColumns={templateColumns}
                  headers={headers}
                  index={index}
                  pinned={pinned}
                  rowHeight={rowHeight}
                  rowIndices={rowIndices}
                  setHoveredIndex={setHoveredIndex}
                  tableRow={tableRow}
                />
              </Fragment>
            );
          })}
        </div>
      </ScrollSyncPane>
    );
  },
);

TableSection.displayName = "TableSection";

export default TableSection;
