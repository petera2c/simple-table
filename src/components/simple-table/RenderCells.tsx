import { Fragment } from "react";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import type TableRowType from "../../types/TableRow";
import { Pinned } from "../../types/Pinned";
import { useTableContext } from "../../context/TableContext";
import RowIndices from "../../types/RowIndices";
import ColumnIndices from "../../types/ColumnIndices";
import { getRowId } from "../../utils/rowUtils";

interface RenderCellsProps<T> {
  columnIndexStart?: number;
  columnIndices: ColumnIndices<T>;
  headers: HeaderObject<T>[];
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  tableRow: TableRowType<T>;
}

const RenderCells = <T,>({
  columnIndexStart,
  columnIndices,
  headers,
  pinned,
  rowIndex,
  rowIndices,
  tableRow,
}: RenderCellsProps<T>) => {
  const { rowIdAccessor } = useTableContext();
  const filteredHeaders = headers.filter((header) => displayCell({ header, pinned }));

  return (
    <>
      {filteredHeaders.map((header, index) => {
        const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
        const cellKey = getCellId({ accessor: header.accessor, rowId });

        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            header={header}
            headers={headers}
            key={cellKey}
            nestedIndex={index + (columnIndexStart ?? 0)}
            pinned={pinned}
            rowIndex={rowIndex}
            rowIndices={rowIndices}
            tableRow={tableRow}
          />
        );
      })}
    </>
  );
};

const RecursiveRenderCells = <T,>({
  columnIndices,
  header,
  headers,
  nestedIndex,
  pinned,
  rowIndex,
  rowIndices,
  tableRow,
}: {
  columnIndices: ColumnIndices<T>;
  header: HeaderObject<T>;
  headers: HeaderObject<T>[];
  nestedIndex: number;
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  tableRow: TableRowType<T>;
}) => {
  // Get selection state for this cell
  const { getBorderClass, isSelected, isInitialFocusedCell, rowIdAccessor } = useTableContext();

  // Calculate rowId once at the beginning
  const rowId = getRowId({ row: tableRow.row, rowIdAccessor });

  if (header.children) {
    const filteredChildren = header.children.filter((child) =>
      displayCell({ header: child, pinned })
    );

    return (
      <Fragment>
        {filteredChildren.map((child) => {
          const childCellKey = getCellId({ accessor: child.accessor, rowId });
          return (
            <RecursiveRenderCells
              columnIndices={columnIndices}
              header={child}
              headers={headers}
              key={childCellKey}
              nestedIndex={nestedIndex}
              pinned={pinned}
              rowIndex={rowIndex}
              rowIndices={rowIndices}
              tableRow={tableRow}
            />
          );
        })}
      </Fragment>
    );
  }
  const accessor = header.accessor;
  if (!accessor) return null;

  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[accessor];
  // Calculate selection state for this specific cell
  const cellData = { rowIndex, colIndex, rowId };
  const borderClass = getBorderClass(cellData);
  const isHighlighted = isSelected(cellData);
  const isInitialFocused = isInitialFocusedCell(cellData);

  const tableCellKey = getCellId({ accessor: header.accessor, rowId });

  return (
    <TableCell
      borderClass={borderClass}
      colIndex={colIndex}
      header={header}
      isHighlighted={isHighlighted}
      isInitialFocused={isInitialFocused}
      key={tableCellKey}
      nestedIndex={nestedIndex}
      rowIndex={rowIndex}
      tableRow={tableRow}
    />
  );
};

export default RenderCells;
