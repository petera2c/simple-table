import { Fragment } from "react";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { Pinned } from "../../types/Pinned";
import { useTableContext } from "../../context/TableContext";
import RowIndices from "../../types/RowIndices";
import ColumnIndices from "../../types/ColumnIndices";
import { getRowId } from "../../utils/rowUtils";

interface RenderCellsProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  visibleRow: VisibleRow;
}

const RenderCells = ({
  columnIndexStart,
  columnIndices,
  headers,
  hiddenColumns,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowIndex,
  rowIndices,
  visibleRow,
}: RenderCellsProps) => {
  const filteredHeaders = headers.filter((header) =>
    displayCell({ hiddenColumns, header, pinned })
  );

  return (
    <>
      {filteredHeaders.map((header, index) => {
        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            header={header}
            headers={headers}
            hiddenColumns={hiddenColumns}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
            nestedIndex={index + (columnIndexStart ?? 0)}
            onExpandRowClick={onExpandRowClick}
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
  hiddenColumns,
  nestedIndex,
  onExpandRowClick,
  pinned,
  rowIndex,
  rowIndices,
  visibleRow,
}: {
  columnIndices: ColumnIndices;
  header: HeaderObject;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  nestedIndex: number;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  visibleRow: VisibleRow;
}) => {
  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[header.accessor];

  // Get selection state for this cell
  const { getBorderClass, isSelected, isInitialFocusedCell, rowIdAccessor } = useTableContext();

  if (header.children) {
    const filteredChildren = header.children.filter((child) =>
      displayCell({ hiddenColumns, header: child, pinned })
    );

    return (
      <Fragment>
        {filteredChildren.map((child) => {
          return (
            <RecursiveRenderCells
              columnIndices={columnIndices}
              header={child}
              headers={headers}
              hiddenColumns={hiddenColumns}
              key={getCellId({ accessor: child.accessor, rowIndex: rowIndex + 1 })}
              nestedIndex={nestedIndex}
              onExpandRowClick={onExpandRowClick}
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
      onExpandRowClick={onExpandRowClick}
      rowIndex={rowIndex}
      visibleRow={visibleRow}
    />
  );
};

export default RenderCells;
