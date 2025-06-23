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
  rowIndices: RowIndices;
  visibleRow: TableRowType;
}

const RenderCells = ({
  columnIndexStart,
  columnIndices,
  headers,
  pinned,
  rowIndex,
  rowIndices,
  visibleRow,
}: RenderCellsProps) => {
  const filteredHeaders = headers.filter((header) => displayCell({ header, pinned }));

  return (
    <>
      {filteredHeaders.map((header, index) => {
        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            header={header}
            headers={headers}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
            nestedIndex={index + (columnIndexStart ?? 0)}
            pinned={pinned}
            rowIndex={rowIndex}
            rowIndices={rowIndices}
            visibleRow={visibleRow}
          />
        );
      })}
    </>
  );
};

const RecursiveRenderCells = ({
  columnIndices,
  header,
  headers,
  nestedIndex,
  pinned,
  rowIndex,
  rowIndices,
  visibleRow,
}: {
  columnIndices: ColumnIndices;
  header: HeaderObject;
  headers: HeaderObject[];
  nestedIndex: number;
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  visibleRow: TableRowType;
}) => {
  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[header.accessor];

  // Get selection state for this cell
  const { getBorderClass, isSelected, isInitialFocusedCell, rowIdAccessor } = useTableContext();

  if (header.children) {
    const filteredChildren = header.children.filter((child) =>
      displayCell({ header: child, pinned })
    );

    return (
      <Fragment>
        {filteredChildren.map((child) => {
          return (
            <RecursiveRenderCells
              columnIndices={columnIndices}
              header={child}
              headers={headers}
              key={getCellId({ accessor: child.accessor, rowIndex: rowIndex + 1 })}
              nestedIndex={nestedIndex}
              pinned={pinned}
              rowIndex={rowIndex}
              rowIndices={rowIndices}
              visibleRow={visibleRow}
            />
          );
        })}
      </Fragment>
    );
  }

  // Calculate selection state for this specific cell
  const rowId = getRowId(visibleRow.row, rowIndex, rowIdAccessor);
  const cellData = { rowIndex, colIndex, rowId };
  const borderClass = getBorderClass(cellData);
  const isHighlighted = isSelected(cellData);
  const isInitialFocused = isInitialFocusedCell(cellData);

  return (
    <TableCell
      borderClass={borderClass}
      colIndex={colIndex}
      header={header}
      isHighlighted={isHighlighted}
      isInitialFocused={isInitialFocused}
      key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
      nestedIndex={nestedIndex}
      rowIndex={rowIndex}
      visibleRow={visibleRow}
    />
  );
};

export default RenderCells;
