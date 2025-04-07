import { Fragment } from "react";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import Animate from "../Animate";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { Pinned } from "../../types/Pinned";
import { ColumnIndices } from "./TableBody";

interface RenderCellsProps {
  columnIndices: ColumnIndices;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  visibleRow: VisibleRow;
}

const RenderCells = ({
  columnIndices,
  headers,
  hiddenColumns,
  isWidthDragging,
  onExpandRowClick,
  pinned,
  rowIndex,
  visibleRow,
}: RenderCellsProps) => {
  const filteredHeaders = headers.filter((header) =>
    displayCell({ hiddenColumns, header, pinned })
  );

  return (
    <Animate isBody pauseAnimation={isWidthDragging} rowIndex={rowIndex + 1}>
      {filteredHeaders.map((header) => {
        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            header={header}
            headers={headers}
            hiddenColumns={hiddenColumns}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
            onExpandRowClick={onExpandRowClick}
            pinned={pinned}
            rowIndex={rowIndex}
            visibleRow={visibleRow}
          />
        );
      })}
    </Animate>
  );
};

const RecursiveRenderCells = ({
  columnIndices,
  header,
  headers,
  hiddenColumns,
  onExpandRowClick,
  pinned,
  rowIndex,
  visibleRow,
}: {
  columnIndices: ColumnIndices;
  header: HeaderObject;
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  visibleRow: VisibleRow;
}) => {
  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[header.accessor];

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
              onExpandRowClick={onExpandRowClick}
              pinned={pinned}
              rowIndex={rowIndex}
              visibleRow={visibleRow}
            />
          );
        })}
      </Fragment>
    );
  }

  return (
    <TableCell
      colIndex={colIndex}
      header={header}
      key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
      onExpandRowClick={onExpandRowClick}
      rowIndex={rowIndex}
      visibleRow={visibleRow}
    />
  );
};

export default RenderCells;
