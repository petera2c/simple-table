import { Fragment, useMemo } from "react";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import Animate from "../Animate";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { Pinned } from "../../types/Pinned";

// Type to track column indices for each header
type ColumnIndices = Record<string, number>;

interface RenderCellsProps {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  visibleRow: VisibleRow;
}

const RenderCells = ({
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

  // Calculate column indices up front, similar to gridPositions in TableHeaderSection
  const columnIndices = useMemo(() => {
    const indices: ColumnIndices = {};
    let columnCounter = 1;

    const processHeader = (header: HeaderObject, isFirst: boolean = false): void => {
      // Only increment for non-first siblings
      if (!isFirst) {
        columnCounter++;
      }

      // Store the column index for this header
      indices[header.accessor] = columnCounter;

      // Process children recursively
      if (header.children && header.children.length > 0) {
        header.children
          .filter((child) => displayCell({ hiddenColumns, header: child, pinned }))
          .forEach((child, i) => {
            processHeader(child, i === 0);
          });
      }
    };

    // Process all top-level headers
    filteredHeaders.forEach((header, i) => {
      processHeader(header, i === 0);
    });

    return indices;
  }, [filteredHeaders, hiddenColumns, pinned]);

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
