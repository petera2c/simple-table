import { Fragment, useMemo } from "react";
import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import TableBodyProps from "../../types/TableBodyProps";
import Animate from "../Animate";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { Pinned } from "../../types/Pinned";

// Type to track column indices for each header
type ColumnIndices = Record<string, number>;

type RenderCellsProps = {
  headers: HeaderObject[];
  hiddenColumns: Record<string, boolean>;
  onExpandRowClick: (rowId: RowId) => void;
  pinned?: Pinned;
  rowIndex: number;
  visibleRow: VisibleRow;
} & Omit<TableBodyProps, "currentRows" | "headerContainerRef">;

const RenderCells = ({
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  hiddenColumns,
  isSelected,
  isInitialFocusedCell,
  onExpandRowClick,
  pinned,
  rowIndex,
  visibleRow,
  ...props
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
    <Animate
      allowAnimations={props.allowAnimations}
      allowHorizontalAnimate={props.shouldPaginate}
      draggedHeaderRef={props.draggedHeaderRef}
      headersRef={props.headersRef}
      isBody
      mainBodyRef={props.mainBodyRef}
      pauseAnimation={props.isWidthDragging}
      rowIndex={rowIndex + 1}
    >
      {filteredHeaders.map((header) => {
        return (
          <RecursiveRenderCells
            columnIndices={columnIndices}
            getBorderClass={getBorderClass}
            handleMouseDown={handleMouseDown}
            handleMouseOver={handleMouseOver}
            header={header}
            headers={headers}
            hiddenColumns={hiddenColumns}
            isInitialFocusedCell={isInitialFocusedCell}
            isSelected={isSelected}
            key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
            onExpandRowClick={onExpandRowClick}
            pinned={pinned}
            rowIndex={rowIndex}
            visibleRow={visibleRow}
            {...props}
          />
        );
      })}
    </Animate>
  );
};

const RecursiveRenderCells = ({
  columnIndices,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  header,
  hiddenColumns,
  isInitialFocusedCell,
  isSelected,
  onExpandRowClick,
  pinned,
  rowIndex,
  visibleRow,
  ...props
}: RenderCellsProps & { header: HeaderObject; columnIndices: ColumnIndices }) => {
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
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              header={child}
              hiddenColumns={hiddenColumns}
              isSelected={isSelected}
              isInitialFocusedCell={isInitialFocusedCell}
              key={getCellId({ accessor: child.accessor, rowIndex: rowIndex + 1 })}
              onExpandRowClick={onExpandRowClick}
              rowIndex={rowIndex}
              visibleRow={visibleRow}
              {...props}
            />
          );
        })}
      </Fragment>
    );
  }

  return (
    <TableCell
      {...props}
      borderClass={getBorderClass({
        rowIndex,
        colIndex,
        rowId: visibleRow.row.rowMeta.rowId,
      })}
      colIndex={colIndex}
      header={header}
      isSelected={isSelected({ rowIndex, colIndex, rowId: visibleRow.row.rowMeta.rowId })}
      isInitialFocusedCell={isInitialFocusedCell({
        rowIndex,
        colIndex,
        rowId: visibleRow.row.rowMeta.rowId,
      })}
      key={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
      onExpandRowClick={onExpandRowClick}
      onMouseDown={() =>
        handleMouseDown({ rowIndex, colIndex, rowId: visibleRow.row.rowMeta.rowId })
      }
      onMouseOver={() =>
        handleMouseOver({ rowIndex, colIndex, rowId: visibleRow.row.rowMeta.rowId })
      }
      rowIndex={rowIndex}
      visibleRow={visibleRow}
    />
  );
};

export default RenderCells;
