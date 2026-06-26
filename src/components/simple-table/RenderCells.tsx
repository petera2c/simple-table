import React, { Fragment } from "react";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import type TableRowType from "../../types/TableRow";
import { Pinned } from "../../types/Pinned";
import { useTableContext } from "../../context/TableContext";
import RowIndices from "../../types/RowIndices";
import ColumnIndices from "../../types/ColumnIndices";
import { ColumnWindow } from "../../utils/columnVirtualizationUtils";
import { rowIdToString } from "../../utils/rowUtils";

const hasChildren = (header: HeaderObject): boolean =>
  Boolean(header.children && header.children.length > 0);

/** Whether a leaf column should render given the current column window (null = render all). */
const isLeafVisible = (
  columnWindow: ColumnWindow | null | undefined,
  accessor: Accessor,
): boolean => !columnWindow || columnWindow.visibleAccessors.has(accessor);

/** 1-based grid track for a column when virtualization is active, else undefined. */
const getGridColumnStart = (
  columnWindow: ColumnWindow | null | undefined,
  accessor: Accessor,
): number | undefined => {
  if (!columnWindow) return undefined;
  const trackIndex = columnWindow.trackIndexByAccessor.get(accessor);
  return trackIndex === undefined ? undefined : trackIndex + 1;
};

interface RenderCellsProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  columnWindow?: ColumnWindow | null;
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
  columnWindow,
  headers,
  pinned,
  rowIndex,
  displayRowNumber,
  rowIndices,
  tableRow,
}: RenderCellsProps) => {
  const { collapsedHeaders } = useTableContext();

  const filteredHeaders = headers.filter((header) =>
    displayCell({
      header,
      pinned,
      headers,
      collapsedHeaders,
      rootPinned: header.pinned,
    }),
  );

  return (
    <>
      {filteredHeaders.map((header, index) => {
        // nestedIndex stays based on the FULL displayed-column index so odd/even column
        // shading and cell memoization remain stable regardless of which columns are
        // currently windowed out.
        const nestedIndex = index + (columnIndexStart ?? 0);

        // Fast path for flat leaf columns: skip mounting cells outside the window.
        // Parent headers always recurse so their visible descendants can render.
        if (
          columnWindow &&
          !hasChildren(header) &&
          !isLeafVisible(columnWindow, header.accessor)
        ) {
          return null;
        }

        const rowId = rowIdToString(tableRow.rowId);
        const cellKey = getCellId({ accessor: header.accessor, rowId });

        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            columnWindow={columnWindow}
            displayRowNumber={displayRowNumber}
            rootPinned={header.pinned}
            header={header}
            headers={headers}
            key={cellKey}
            nestedIndex={nestedIndex}
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
  columnWindow,
  displayRowNumber,
  header,
  headers,
  nestedIndex,
  parentHeader,
  pinned,
  rootPinned,
  rowIndex,
  rowIndices,
  tableRow,
}: {
  columnIndices: ColumnIndices;
  columnWindow?: ColumnWindow | null;
  displayRowNumber: number;
  header: HeaderObject;
  headers: HeaderObject[];
  nestedIndex: number;
  parentHeader?: HeaderObject;
  pinned?: Pinned;
  rootPinned?: Pinned;
  rowIndex: number;
  rowIndices: RowIndices;
  tableRow: TableRowType;
}) => {
  // Get the column index for this header from our pre-calculated mapping
  const colIndex = columnIndices[header.accessor];

  // Get selection state for this cell
  const { getBorderClass, isSelected, isInitialFocusedCell, collapsedHeaders } =
    useTableContext();

  // Calculate rowId once at the beginning (includes path for nested rows)
  const rowId = rowIdToString(tableRow.rowId);

  if (header.children && header.children.length > 0) {
    const filteredChildren = header.children.filter((child) =>
      displayCell({
        header: child,
        pinned,
        headers,
        collapsedHeaders,
        rootPinned,
      }),
    );

    // With singleRowChildren, we render both parent and children as siblings
    if (header.singleRowChildren) {
      // The parent occupies its own grid track; honor the column window for it too.
      const parentVisible = isLeafVisible(columnWindow, header.accessor);
      const parentCellData = { rowIndex, colIndex, rowId };
      const parentBorderClass = getBorderClass(parentCellData);
      const parentIsHighlighted = isSelected(parentCellData);
      const parentIsInitialFocused = isInitialFocusedCell(parentCellData);
      const parentCellKey = getCellId({ accessor: header.accessor, rowId });

      return (
        <Fragment>
          {parentVisible && (
            <TableCell
              borderClass={parentBorderClass}
              colIndex={colIndex}
              displayRowNumber={displayRowNumber}
              gridColumnStart={getGridColumnStart(
                columnWindow,
                header.accessor,
              )}
              header={header}
              isHighlighted={parentIsHighlighted}
              isInitialFocused={parentIsInitialFocused}
              key={parentCellKey}
              nestedIndex={nestedIndex}
              parentHeader={parentHeader}
              rowIndex={rowIndex}
              tableRow={tableRow}
            />
          )}
          {filteredChildren.map((child) => {
            const childCellKey = getCellId({ accessor: child.accessor, rowId });
            return (
              <RecursiveRenderCells
                columnIndices={columnIndices}
                columnWindow={columnWindow}
                displayRowNumber={displayRowNumber}
                rootPinned={rootPinned}
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
              columnWindow={columnWindow}
              displayRowNumber={displayRowNumber}
              rootPinned={rootPinned}
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

  // Leaf column: skip entirely when outside the current column window.
  if (!isLeafVisible(columnWindow, header.accessor)) {
    return null;
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
      gridColumnStart={getGridColumnStart(columnWindow, header.accessor)}
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
const arePropsEqual = (
  prevProps: RenderCellsProps,
  nextProps: RenderCellsProps,
): boolean => {
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

  // Check if column indices changed (by reference)
  if (prevProps.columnIndices !== nextProps.columnIndices) {
    return false;
  }

  // Check if the visible-column window changed (by reference). Memoized in TableBody,
  // so it stays equal during vertical scroll and only changes on horizontal scroll /
  // column changes, when the rendered set of cells genuinely needs to update.
  if (prevProps.columnWindow !== nextProps.columnWindow) {
    return false;
  }

  // NOTE: `rowIndices` is intentionally NOT compared. It is recreated every scroll
  // frame but is only forwarded to children and never consumed, so comparing it by
  // reference forced needless re-renders of every cell group on each scroll shift.

  // All checks passed
  return true;
};

// Export memoized RenderCells component with custom comparison
// Optimizes rendering performance for cell groups
export default React.memo(RenderCells, arePropsEqual);
