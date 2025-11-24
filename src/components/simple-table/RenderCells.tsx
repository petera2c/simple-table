import React, { Fragment } from "react";
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
  parentHeader,
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
  parentHeader?: HeaderObject;
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

    // With singleRowChildren, we render both parent and children as siblings
    if (header.singleRowChildren) {
      // Render parent cell first
      const parentCellData = { rowIndex, colIndex, rowId };
      const parentBorderClass = getBorderClass(parentCellData);
      const parentIsHighlighted = isSelected(parentCellData);
      const parentIsInitialFocused = isInitialFocusedCell(parentCellData);
      const parentCellKey = getCellId({ accessor: header.accessor, rowId });

      return (
        <Fragment>
          <TableCell
            borderClass={parentBorderClass}
            colIndex={colIndex}
            displayRowNumber={displayRowNumber}
            header={header}
            isHighlighted={parentIsHighlighted}
            isInitialFocused={parentIsInitialFocused}
            key={parentCellKey}
            nestedIndex={nestedIndex}
            parentHeader={parentHeader}
            rowIndex={rowIndex}
            tableRow={tableRow}
          />
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
                parentHeader={header}
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

    // Normal tree mode: only render children, not parent
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
              parentHeader={header}
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
      parentHeader={parentHeader}
      rowIndex={rowIndex}
      tableRow={tableRow}
    />
  );
};

/**
 * Custom comparison function for RenderCells memoization
 * Checks if row/column data or indices have changed
 * Prevents re-rendering cells when their underlying data hasn't changed
 */
const arePropsEqual = (prevProps: RenderCellsProps, nextProps: RenderCellsProps): boolean => {
  // Check row and column indices
  if (
    prevProps.rowIndex !== nextProps.rowIndex ||
    prevProps.displayRowNumber !== nextProps.displayRowNumber ||
    prevProps.columnIndexStart !== nextProps.columnIndexStart
  ) {
    return false;
  }

  // Check if the actual row data changed
  if (prevProps.tableRow !== nextProps.tableRow) {
    if (prevProps.tableRow.row !== nextProps.tableRow.row) {
      return false;
    }
  }

  // Check pinned state
  if (prevProps.pinned !== nextProps.pinned) {
    return false;
  }

  // Check if headers array changed (by reference)
  if (prevProps.headers !== nextProps.headers) {
    return false;
  }

  // Check if column/row indices changed (by reference)
  if (prevProps.columnIndices !== nextProps.columnIndices) {
    return false;
  }

  if (prevProps.rowIndices !== nextProps.rowIndices) {
    return false;
  }

  // All checks passed
  return true;
};

// Export memoized RenderCells component with custom comparison
// Optimizes rendering performance for cell groups
export default React.memo(RenderCells, arePropsEqual);
