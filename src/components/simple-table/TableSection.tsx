import { Fragment, RefObject, useMemo } from "react";
import TableRow from "./TableRow";
import TableRowType from "../../types/TableRow";
import TableRowSeparator from "./TableRowSeparator";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { ScrollSyncPane } from "../scroll-sync/ScrollSyncPane";
import ConditionalWrapper from "../ConditionalWrapper";
import { canDisplaySection } from "../../utils/generalUtils";
import { getRowId } from "../../utils/rowUtils";
import { useTableContext } from "../../context/TableContext";

interface TableSectionProps {
  columnIndexStart?: number; // This is to know how many columns there were before this section to see if the columns are odd or even
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  hoveredIndex: number | null;
  pinned?: Pinned;
  ref?: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  templateColumns: string;
  totalHeight: number;
  visibleRows: TableRowType[];
  width?: number;
}

const TableSection = ({
  columnIndexStart,
  columnIndices,
  headers,
  hoveredIndex,
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
  const { rowIdAccessor } = useTableContext();

  const canDisplay = useMemo(() => canDisplaySection(headers, pinned), [headers, pinned]);
  if (!canDisplay) return null;

  return (
    <ConditionalWrapper
      condition={!pinned}
      wrapper={(children) => <ScrollSyncPane childRef={ref!}>{children}</ScrollSyncPane>}
    >
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
          const rowId = getRowId(visibleRow.row, visibleRow.position, rowIdAccessor);
          return (
            <Fragment key={rowId}>
              {index !== 0 && (
                <TableRowSeparator
                  // Is last row group and it is open
                  displayStrongBorder={visibleRow.isLastGroupRow}
                  position={visibleRow.position}
                  rowHeight={rowHeight}
                  templateColumns={templateColumns}
                  rowIndex={index - 1}
                />
              )}
              <TableRow
                columnIndexStart={columnIndexStart}
                columnIndices={columnIndices}
                gridTemplateColumns={templateColumns}
                headers={headers}
                hoveredIndex={hoveredIndex}
                index={index}
                key={rowId}
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
    </ConditionalWrapper>
  );
};

export default TableSection;
