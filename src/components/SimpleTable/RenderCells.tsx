import HeaderObject from "../../types/HeaderObject";
import { displayCell, getCellId } from "../../utils/cellUtils";
import TableCell from "./TableCell";
import TableBodyProps from "../../types/TableBodyProps";
import Animate from "../Animate";
import { RowId } from "../../types/RowId";
import VisibleRow from "../../types/VisibleRow";
import { Pinned } from "../../types/Pinned";
import { Fragment } from "react/jsx-runtime";

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
      {headers.map((header, colIndex) => {
        if (!displayCell({ hiddenColumns, header, pinned })) return null;

        return (
          <RecursiveRenderCells
            colIndex={colIndex}
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
  colIndex,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  header,
  isInitialFocusedCell,
  isSelected,
  onExpandRowClick,
  rowIndex,
  visibleRow,
  ...props
}: RenderCellsProps & { header: HeaderObject; colIndex: number }) => {
  if (header.children) {
    return (
      <Fragment>
        {header.children.map((child, index) => {
          return (
            <RecursiveRenderCells
              colIndex={colIndex + index}
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              header={child}
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
