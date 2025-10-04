import {
  Fragment,
  MutableRefObject,
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
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
  rowHeight: number;
  rowIndices: RowIndices;
  rowsToRender: TableRowType[];
  alreadyRenderedRows: TableRowType[];
  enteringDomRows: TableRowType[];
  setHoveredIndex: (index: number | null) => void;
  templateColumns: string;
  totalHeight: number;
  width?: number;
}

const TableSection = forwardRef<HTMLDivElement, TableSectionProps>(
  (
    {
      columnIndexStart,
      columnIndices,
      headers,
      hoveredIndex,
      pinned,
      rowHeight,
      rowIndices,
      setHoveredIndex,
      templateColumns,
      totalHeight,
      rowsToRender,
      alreadyRenderedRows,
      enteringDomRows,
      width,
    },
    ref
  ) => {
    const className = pinned ? `st-body-pinned-${pinned}` : "st-body-main";
    const { rowIdAccessor } = useTableContext();
    const internalRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => internalRef.current!, []);

    const canDisplay = useMemo(() => canDisplaySection(headers, pinned), [headers, pinned]);
    if (!canDisplay) return null;

    return (
      <ConditionalWrapper
        condition={!pinned}
        wrapper={(children) => (
          <ScrollSyncPane childRef={internalRef as MutableRefObject<HTMLElement | null>}>
            {children}
          </ScrollSyncPane>
        )}
      >
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
          {/* Render already rendered rows first - keeps array indices stable */}
          {alreadyRenderedRows.map((tableRow, index) => {
            const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
            return (
              <Fragment key={rowId}>
                {index !== 0 && (
                  <TableRowSeparator
                    // Is last row group and it is open
                    displayStrongBorder={tableRow.isLastGroupRow}
                    position={tableRow.position}
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
                  tableRow={tableRow}
                />
              </Fragment>
            );
          })}
          {/* Render entering rows after - appends at end without affecting existing indices */}
          {enteringDomRows.map((tableRow, index) => {
            const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
            const actualIndex = alreadyRenderedRows.length + index;
            return (
              <Fragment key={rowId}>
                {actualIndex !== 0 && (
                  <TableRowSeparator
                    // Is last row group and it is open
                    displayStrongBorder={tableRow.isLastGroupRow}
                    position={tableRow.position}
                    rowHeight={rowHeight}
                    templateColumns={templateColumns}
                    rowIndex={actualIndex - 1}
                  />
                )}
                <TableRow
                  columnIndexStart={columnIndexStart}
                  columnIndices={columnIndices}
                  gridTemplateColumns={templateColumns}
                  headers={headers}
                  hoveredIndex={hoveredIndex}
                  index={actualIndex}
                  key={rowId}
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
      </ConditionalWrapper>
    );
  }
);

TableSection.displayName = "TableSection";

export default TableSection;
