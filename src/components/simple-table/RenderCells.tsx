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

interface RenderCellsProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  pinned?: Pinned;
  rowIndex: number;
  displayRowNumber: number;
  rowIndices: RowIndices;
  tableRow: TableRowType;
}

const RenderCells = ({
  columnIndexStart,
  columnIndices,
  headers,
  pinned,
  rowIndex,
  displayRowNumber,
  rowIndices,
  tableRow,
}: RenderCellsProps) => {
  const { rowIdAccessor, collapsedHeaders } = useTableContext();
  const filteredHeaders = headers.filter((header) =>
    displayCell({ header, pinned, headers, collapsedHeaders })
  );

  return (
    <>
      {filteredHeaders.map((header, index) => {
        const rowId = getRowId({ row: tableRow.row, rowIdAccessor });
        const cellKey = getCellId({ accessor: header.accessor, rowId });

        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            displayRowNumber={displayRowNumber}
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

const RecursiveRenderCells = ({
  columnIndices,
  displayRowNumber,
  header,
  headers,
  nestedIndex,
  pinned,
  rowIndex,
  rowIndices,
  tableRow,
}: {
  columnIndices: ColumnIndices;
  displayRowNumber: number;
  header: HeaderObject;
  headers: HeaderObject[];
  nestedIndex: number;
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  tableRow: TableRowType;
}) => {
  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[header.accessor];

  // Get selection state for this cell
  const { getBorderClass, isSelected, isInitialFocusedCell, rowIdAccessor, collapsedHeaders } =
    useTableContext();

  // Calculate rowId once at the beginning
  const rowId = getRowId({ row: tableRow.row, rowIdAccessor });

  if (header.children && header.children.length > 0) {
    const filteredChildren = header.children.filter((child) =>
      displayCell({ header: child, pinned, headers, collapsedHeaders })
    );

    return (
      <Fragment>
        {filteredChildren.map((child) => {
          const childCellKey = getCellId({ accessor: child.accessor, rowId });
          return (
            <RecursiveRenderCells
              columnIndices={columnIndices}
              displayRowNumber={displayRowNumber}
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
      displayRowNumber={displayRowNumber}
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
